const Sequelize = require('sequelize');
const expressWinston = require('express-winston');
const winston = require('winston');
const routes = require('./controller');
const { Umzug, SequelizeStorage } = require('umzug');
const BalanceWriteManager  = require('@component/balance/write/write.manager')
const UserGateway  = require('@data/user/user.gateway')
class Factory {
    orm = null;

    constructor(app, database, username, password, migration = false, host = "localhost") {
        this.app = app;
        this.host = host
        this.database = database;
        this.username = username;
        this.password = password;
        this.migration = migration;
    }
    _winstonLoggerMiddleware(){
        expressWinston.responseWhitelist.push('body');
        const levels = {
            ...winston.config.syslog.levels,
            critical: 9,
        };

        return expressWinston.logger({
            transports: [
                new winston.transports.File({
                    filename: 'logs/http.log',
                }),
                new winston.transports.Console({
                    format: winston.format.json({
                        space: 2,
                    }),
                })
            ],
            level(req, res) {
                let level = '';
                if (res.statusCode >= 100) {
                    level = 'info';
                }
                if (res.statusCode >= 400) {
                    level = 'warning';
                }
                if (res.statusCode >= 500) {
                    level = 'error';
                }
                // Инфо о попытке взлома
                if (res.statusCode === 401 || res.statusCode === 403) {
                    level = 'critical';
                }
                // Никто не должен использовать старый путь
                if (req.path === '/v1' && level === 'info') {
                    level = 'warning';
                }
                return level;
            },

            format: winston.format.combine(
                winston.format.json(),
                winston.format.splat(),
                winston.format.timestamp(),
                winston.format.colorize()
            ),
            meta: true,
            msg: 'HTTP {{res.StatusCode}} {{req.method}} {{res.ResponseTime}}ms {{req.url}}',
            requestWhitelist: ['headers', 'body', 'query', 'params', 'method'],
            statusLevels: {
                debug: 'debug',
                warning: 'warning',
                error: 'error',
                critical: 'critical',
                info: 'info',
            },
            responseWhitelist: ['headers', 'body', 'query', 'params'],
            expressFormat: false,
            dynamicMeta(req) {
                const service = String(req.baseUrl).match(/^\/api\/([^/]+)/i) ? String(req.baseUrl).match(/^\/api\/([^/]+)/i)[1] : 'base';
                return {
                    service,
                };
            },
        });
    }
    async _ORMInit(){
        const sequelize = new Sequelize(this.database, this.username, this.password, {
            host: this.host,
            dialect: 'postgres'
        });

        await sequelize.authenticate()
            .then(() => {
                console.log('Connection has been established successfully.');
            })
            .catch(err => {
                throw new Error(`Unable to connect to the database: ${err}`)
            });

        return sequelize;
    }
    _migration(){
        return new Umzug({
            migrations: { glob: 'migrations/*.js' },
            context: this.orm.getQueryInterface(),
            storage: new SequelizeStorage({ sequelize: this.orm }),
            logger: console,
        });
    }

    async start() {
        this.app.use(this._winstonLoggerMiddleware());

        for(let route of Object.keys(routes)){
           this.app.use(routes[route]);
        }

        this.orm = await this._ORMInit();
        this.app.set("orm",this.orm)

        //Реализаци так себе, но она работает )
        this.app.set("BalanceWriteManager",new BalanceWriteManager(new UserGateway(this.orm)))

        if(this.migration){
            await this._migration().up()
        }

        this.app.use((err, req, res, next) => {
            if (!err) {
                return next();
            }
            res.status(500);
            res.send({error: err.message});
        });

        this.app.listen(this.app.get('port'));



    }

}

module.exports = Factory;
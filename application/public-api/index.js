require('dotenv').config()
require('module-alias/register');

const express = require('express');

const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');

const Factory = require('./factory')

// Можно было разместить логику в "Factory" но это как один из вариантов реализации;
const app = express();

app.set('port', process.env.PORT || 3000);


// Для парсинга JSON
app.use(
    bodyParser.json({
        limit: '20mb',
    }),
);

// Для парсинга application/x-www-form-urlencoded
app.use(
    bodyParser.urlencoded({
        limit: '20mb',
        extended: true,
    }),
);
// Настраиваем корсы
app.use(cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,LINK,UNLINK',
    preflightContinue: false,
    optionsSuccessStatus: 204,
}));

app.use(helmet({ crossOriginEmbedderPolicy: true }));

app.use(compression());

const factory = new Factory(app,process.env.PG_DATABASE, process.env.PG_USERNAME, process.env.PG_PASSWORD,true);

factory.start();

const Model = require('./user.model');
const { modelToUser } = require('./mapper')
class UserGateway {
    constructor(datasource) {
        this.datasource = datasource;
        this.UserModel = datasource.define('User', Model);

    }
    async getById(id) {
        const user = await this.UserModel.findByPk(id);
        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
    async save(userModel) {
        await userModel.save();
        return modelToUser(userModel);
    }

}

module.exports = UserGateway;
const UserEntity = require('./user.entity');
const modelToUser = (model) => {
    const user = new UserEntity();
    user.id = model.id;
    user.balance = model.balance;

    return user;
}
module.exports = {modelToUser}
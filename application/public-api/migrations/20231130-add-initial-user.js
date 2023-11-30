async function up({ context: queryInterface }) {
    await queryInterface.bulkInsert('Users', [{
        balance: 10000,
        createdAt: new Date(),
        updatedAt: new Date()
    }], {});
}

async function down({ context: queryInterface }) {
    await queryInterface.bulkDelete('Users', null, {});
}

module.exports = { up, down };
class WriteManager {
    constructor(UserRepository){
        this.userRepository = UserRepository;
    }

    async addBalance(command) {
        const User = await this.userRepository.getById(command.id);

        User.balance += command.amount;

        return await this.userRepository.save(User);
    }
    async seqBalance(command) {
        const User = await this.userRepository.getById(command.id);

        User.balance -= command.amount;

        return await this.userRepository.save(User);
    }
}

module.exports = WriteManager
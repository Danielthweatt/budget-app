const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { testAccount } = require('../../utils');
const { User } = require('../../../models');

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_user_tests';

describe('User Model', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('Save a new User', () => {
        it('should hash a new user\'s plain text password when saving the new user to the db ', async () => {
            const { username, email, password } = testAccount;
            let user = await (new User({ username, email, password })).save();
            const hashedPasswordMatchesPassword = await bcrypt.compare(password, user.password);

            expect(hashedPasswordMatchesPassword).toBeTruthy();

            user = await User.findOne({ username });
            const hashedPasswordInDBMatchesPassword = await bcrypt.compare(password, user.password);

            expect(hashedPasswordInDBMatchesPassword).toBeTruthy();
        });
    });

    describe('user.checkPassword', () => {
        it('should return true if the plain text password argument matches the user\'s saved, hashed password ', async () => {
            const { username, email, password } = testAccount;

            await (new User({ username, email, password })).save();

            const user = await User.findOne({ username });
            const result = await user.checkPassword(password);

            expect(result).toBeTruthy();
        });
    });
});
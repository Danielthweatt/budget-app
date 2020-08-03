const bcrypt = require('bcrypt');
const { testAccount } = require('../../utils');
const { User } = require('../../../models');

describe('User Model', () => {
    beforeEach(() => {
        require('../../../boot/db')();
    });

    afterEach(async () => {
        await User.remove({});
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
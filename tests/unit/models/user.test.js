const bcrypt = require('bcrypt');
const { testAccount } = require('../../utils');
const { User } = require('../../../models');

describe('User Model', () => {
    describe('User.hashPassword', () => {
        it('should hash a password', async () => {
            const { password } = testAccount;
            const hashedPassword = await User.hashPassword(password);
            const hashedPasswordMatchesPassword = await bcrypt.compare(password, hashedPassword);

            expect(hashedPasswordMatchesPassword).toBeTruthy();
        });
    });

    describe('user.checkPassword', () => {
        it('should return false if the plain text password argument doesn\'t matche the user\'s saved, hashed password', async () => {
            let { username, email, password } = testAccount;
            const user = new User({ username, email });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            password = 'aDifferentPassword';
            const result = await user.checkPassword(password);

            expect(result).toBeFalsy();
        });

        it('should return true if the plain text password argument matches the user\'s saved, hashed password', async () => {
            const { username, email, password } = testAccount;
            const user = new User({ username, email });
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            const result = await user.checkPassword(password);

            expect(result).toBeTruthy();
        });
    });
});
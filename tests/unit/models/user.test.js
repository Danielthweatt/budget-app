const bcrypt = require('bcrypt');
const { testAccount } = require('../../test-documents');
const { User } = require('../../../models');

let username, email, password, salt, user;

describe('User Model', () => {
    beforeAll(async () => {
        salt = await bcrypt.genSalt(10);
    });

    beforeEach(() => {
        username = testAccount.username;
        email = testAccount.email;
        password = testAccount.password;
        user = undefined;
    });

    describe('User.hashPassword', () => {
        it('should hash a password', async () => {
            const hashedPassword = await User.hashPassword(password);
            const hashedPasswordMatchesPassword = await bcrypt.compare(password, hashedPassword);

            expect(hashedPasswordMatchesPassword).toBeTruthy();
        });
    });

    describe('user.checkPassword', () => {
        it('should return false if the plain text password argument doesn\'t matche the user\'s saved, hashed password', async () => {
            user = new User({ username, email });
            user.password = await bcrypt.hash(password, salt);
            password = 'aDifferentPassword';
            const result = await user.checkPassword(password);

            expect(result).toBeFalsy();
        });

        it('should return true if the plain text password argument matches the user\'s saved, hashed password', async () => {
            user = new User({ username, email });
            user.password = await bcrypt.hash(password, salt);
            const result = await user.checkPassword(password);

            expect(result).toBeTruthy();
        });
    });
});
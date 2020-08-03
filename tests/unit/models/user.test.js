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
});
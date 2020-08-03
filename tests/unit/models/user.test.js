const bcrypt = require('bcrypt');
const { User } = require('../../../models');

const testAccount = {
    username: 'Test Account', 
    email: 'test@example.com', 
    password: 'Testing1!'
};

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
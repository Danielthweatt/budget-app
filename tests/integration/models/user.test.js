const bcrypt = require('bcrypt');
const { testAccount } = require('../../test-documents');
const { User, Budget } = require('../../../models');

let username, email, password, error, user;

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_user_tests';

describe('User Model', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    beforeEach(() => {
        username = testAccount.username;
        email = testAccount.email;
        password = testAccount.password;
        error = undefined;
        user = undefined;
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Budget.deleteMany({});
    });

    describe('Save a new user', () => {
        it('should not save a new user in the database if the user\'s username is less than 3 characters', async () => {
            username = new Array(3).join('a');

            try {
                user = new User({ username, email });
                user.password = await User.hashPassword(password);

                await user.save();
            } catch(err) {
                error = err;
            }

            user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s username is more than 50 characters', async () => {
            username = new Array(52).join('a');

            try {
                user = new User({ username, email });
                user.password = await User.hashPassword(password);

                await user.save();
            } catch(err) {
                error = err;
            }

            user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s email is less than 3 characters', async () => {
            email = new Array(3).join('a');

            try {
                user = new User({ username, email });
                user.password = await User.hashPassword(password);

                await user.save();
            } catch(err) {
                error = err;
            }

            user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s email is more than 50 characters', async () => {
            email = new Array(52).join('a');

            try {
                user = new User({ username, email });
                user.password = await User.hashPassword(password);

                await user.save();
            } catch(err) {
                error = err;
            }

            user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user has no password', async () => {
            password = '';

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if a user by that username already exists', async () => {
            user = new User({ username, email });
            user.password = await User.hashPassword(password);

            await user.save();

            try {
                user = new User({ username, email });
                user.password = await User.hashPassword(password);

                await user.save();
            } catch(err) {
                error = err;
            }

            const users = await User.find({ username });

            expect(users.length).toBe(1);
            expect(error).not.toBeUndefined();
        });

        it('should save a new user in the database if the user has a valid username, email, and password, and a user by that username does not exist', async () => {
            user = new User({ username, email });
            user.password = await User.hashPassword(password);

            await user.save();

            user = await User.findOne({ username });
            const hashedPasswordInDBMatchesPassword = await bcrypt.compare(password, user.password);

            expect(user).not.toBeNull();
            expect(user.username).toBe(username);
            expect(user.email).toBe(email);
            expect(hashedPasswordInDBMatchesPassword).toBeTruthy();
        });

        it('should populate a saved user\'s budgets', async () => {
            const { name, monthlyAmount } = testAccount.budgets[0];

            const budget = await (new Budget({ name, monthlyAmount })).save();

            user = new User({ username, email, budgets: [ budget._id ] });
            user.password = await User.hashPassword(password);

            await user.save();

            user = await User.findOne({ username }).populate('budgets');

            expect(user.budgets[0].name).toBe(name);
            expect(user.budgets[0].monthlyAmount).toBe(monthlyAmount);
        });

        it('should return a plain object when getPublicObject() is called on a saved user', async () => {
            user = new User({ username, email });
            user.password = await User.hashPassword(password);

            await user.save();

            user = await User.findOne({ username });

            const publicUser = user.getPublicObject();

            expect(publicUser.constructor).toBe(Object);
        });
    });
});
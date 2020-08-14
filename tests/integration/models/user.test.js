const bcrypt = require('bcrypt');
const { testAccount } = require('../../utils');
const { User, Budget } = require('../../../models');

let username, email, password, error, user;

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_user_tests';

describe('User Model', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    beforeEach(async () => {
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
                await (new User({ username, email, password })).save();
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
                await (new User({ username, email, password })).save();
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
                await (new User({ username, email, password })).save();
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
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s password is less than 8 characters', async () => {
            password = new Array(8).join('a');

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s password is more than 50 characters', async () => {
            password = new Array(52).join('a');

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
            await (new User({ username, email, password })).save();

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            const users = await User.find({ username });

            expect(users.length).toBe(1);
            expect(error).not.toBeUndefined();
        });

        it('should save a new user in the database if the user has a valid username, email, and password, and a user by that username does not exist', async () => {
            await (new User({ username, email, password })).save();

            user = await User.findOne({ username });
            const hashedPasswordInDBMatchesPassword = await bcrypt.compare(password, user.password);

            expect(user).not.toBeNull();
            expect(user.username).toBe(username);
            expect(user.email).toBe(email);
            expect(hashedPasswordInDBMatchesPassword).toBeTruthy();
        });

        it('should hash a new user\'s plain text password when saving the user to the db', async () => {
            user = await (new User({ username, email, password })).save();
            const hashedPasswordMatchesPassword = await bcrypt.compare(password, user.password);
            user = await User.findOne({ username });
            const hashedPasswordInDBMatchesPassword = await bcrypt.compare(password, user.password);

            expect(hashedPasswordMatchesPassword).toBeTruthy();
            expect(hashedPasswordInDBMatchesPassword).toBeTruthy();
        });

        it('should save a user with a hashed password even if it is longer than 50 characters', async () => {
            user = await (new User({ username, email, password })).save();
            
            try {
                await user.save();
            } catch(err) {
                error = err;
            }

            expect(error).toBeUndefined();
        });

        it('should populate a saved user\'s budgets', async () => {
            const { name, amount } = testAccount.budgets[0];

            const budget = await (new Budget({ name, amount })).save();

            await (new User({ username, email, password, budgets: [ budget._id ] })).save();

            user = await User.findOne({ username }).populate('budgets');

            expect(user.budgets[0].name).toBe(name);
            expect(user.budgets[0].amount).toBe(amount);
        });

        it('should return a plain object when getPublicObject() is called on a saved user', async () => {
            await (new User({ username, email, password })).save();

            user = await User.findOne({ username }).populate('budgets');

            const publicUser = user.getPublicObject();

            expect(publicUser.constructor).toBe(Object);
        });
    });
});
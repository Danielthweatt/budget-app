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

    describe('Save a new user', () => {
        it('should not save a new user in the database if the user\'s username is less than 3 characters', async () => {
            let { username, email, password } = testAccount;

            username = new Array(3).join('a');
            
            let error;

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            const user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s username is more than 50 characters', async () => {
            let { username, email, password } = testAccount;

            username = new Array(52).join('a');
            
            let error;

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            const user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s email is less than 3 characters', async () => {
            let { username, email, password } = testAccount;

            email = new Array(3).join('a');
            
            let error;

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            const user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s email is more than 50 characters', async () => {
            let { username, email, password } = testAccount;

            email = new Array(52).join('a');
            
            let error;

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            const user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s password is less than 8 characters', async () => {
            let { username, email, password } = testAccount;

            password = new Array(8).join('a');

            let error;

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            const user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if the user\'s password is more than 50 characters', async () => {
            let { username, email, password } = testAccount;

            password = new Array(52).join('a');

            let error;

            try {
                await (new User({ username, email, password })).save();
            } catch(err) {
                error = err;
            }

            const user = await User.findOne({ username });

            expect(error).not.toBeUndefined();
            expect(user).toBeNull();
        });

        it('should not save a new user in the database if a user by that username already exists', async () => {
            const { username, email, password } = testAccount;

            await (new User({ username, email, password })).save();

            let error;

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
            const { username, email, password } = testAccount;
            
            await (new User({ username, email, password })).save();

            const user = await User.findOne({ username });
            const hashedPasswordInDBMatchesPassword = await bcrypt.compare(password, user.password);

            expect(user).not.toBeNull();
            expect(user.username).toBe(username);
            expect(user.email).toBe(email);
            expect(hashedPasswordInDBMatchesPassword).toBeTruthy();
        });

        it('should hash a new user\'s plain text password when saving the user to the db', async () => {
            const { username, email, password } = testAccount;
            let user = await (new User({ username, email, password })).save();
            const hashedPasswordMatchesPassword = await bcrypt.compare(password, user.password);
            user = await User.findOne({ username });
            const hashedPasswordInDBMatchesPassword = await bcrypt.compare(password, user.password);

            expect(hashedPasswordMatchesPassword).toBeTruthy();
            expect(hashedPasswordInDBMatchesPassword).toBeTruthy();
        });
    });
});
const request = require('supertest');
const { User } = require('../../models');

let server;
const testAccount = {
    username: 'Test Account', 
    email: 'test@example.com', 
    password: 'Testing1!'
};

const createUser = async (username, email, password) => {
    const user = { username, email, password };

    await (new User(user)).save();

    return user;
};

describe('routes', () => {
    beforeEach(() => {
        server = require('../../app');
    });

    afterEach(async () => {
        await server.close();
        await User.remove({});
    });

    describe('GET /', () => {
        it('should return the homepage', async () => {
            const res = await request(server).get('/');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });
    });

    describe('GET /sign-up', () => {
        it('should return the sign up form if the user is not logged in', async () => {
            const res = await request(server).get('/sign-up');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });

        it('should return a redirect if the user is logged in', async () => {
            const { username, email, password } = testAccount;

            await createUser(username, email, password);

            const agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            const res = await agent.get('/sign-up');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });

    describe('POST /sign-up', () => {
        it('should not create a user and return a redirect if a user is already logged in', async () => {
            let { username, email, password } = testAccount;
            
            await createUser(username, email, password);

            const agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            username = 'Test Account 2';

            const res = await agent.post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the username is less than 3 characters', async () => {
            let { username, email, password } = testAccount;
            
            username = new Array(3).join('a');

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the username is more than 50 characters', async () => {
            let { username, email, password } = testAccount;
            
            username = new Array(52).join('a');

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the email is invalid', async () => {
            let { username, email, password } = testAccount;
            
            email = 'a';

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password is less than 8 characters', async () => {
            let { username, email, password } = testAccount;
            
            password = new Array(8).join('a');

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password is more than 50 characters', async () => {
            let { username, email, password } = testAccount;
            
            password = new Array(52).join('a');

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password has no lowercase letters', async () => {
            let { username, email, password } = testAccount;
            
            password = `${new Array(8).join('A')}1`;

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password has no uppercase letters', async () => {
            let { username, email, password } = testAccount;
            
            password = `${new Array(8).join('a')}1`;

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password has no numbers', async () => {
            let { username, email, password } = testAccount;
            
            password = `A${new Array(8).join('a')}`;

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if a user by that username already exists', async () => {
            const { username, email, password } = testAccount;
            
            await createUser(username, email, password);

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const users = await User.find({ username });

            expect(users.length).toBe(1);
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should create a user and return a redirect if no user is logged in, the input is valid, and a user by that username does not exist', async () => {
            const { username, email, password } = testAccount;

            const res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            const user = await User.findOne({ username });

            expect(user).not.toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });
});
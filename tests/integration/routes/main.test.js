const request = require('supertest');
const { testAccount, testAccount2 } = require('../../utils');
const { User } = require('../../../models');

let server;

describe('Main Routes', () => {
    beforeEach(() => {
        server = require('../../../app');
    });

    afterEach(async () => {
        await User.remove({});
        await server.close();
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

            await (new User({ username, email, password })).save();

            const agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            const res = await agent.get('/sign-up');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });

    describe('POST /sign-up', () => {
        it('should not create a user and return a redirect if the user is logged in', async () => {
            const { username, email, password } = testAccount;
            
            await (new User({ username, email, password })).save();

            const agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            const { username: username2, email: email2, password: password2 } = testAccount2;

            const res = await agent.post('/sign-up').send({
                username: username2,
                email: email2,
                password: password2,
                confirmPassword: password2
            });

            const user = await User.findOne({ username: username2 });

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
            
            await (new User({ username, email, password })).save();

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

        it('should create a user and return a redirect if the user is not logged in, the input is valid, and a user by that username does not exist', async () => {
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

    describe('GET /login', () => {
        it('should return the login form if the user is not logged in', async () => {
            const res = await request(server).get('/login');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });

        it('should return a redirect if the user is logged in', async () => {
            const { username, email, password } = testAccount;

            await (new User({ username, email, password })).save();

            const agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            const res = await agent.get('/login');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });

    describe('POST /login', () => {
        it('should return a redirect if the user is logged in', async () => {
            const { username, email, password } = testAccount;

            await (new User({ username, email, password })).save();

            const agent = request.agent(server);

            await agent.post('/login').send({ username, password });           

            const res = await agent.post('/login').send({ username, password });

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not log in the user and return a redirect if there is no username', async () => {
            let { username, email, password } = testAccount;
            
            await (new User({ username, email, password })).save();

            username = '';

            const agent = request.agent(server);

            let res = await agent.post('/login').send({ username, password }); 

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not log in the user and return a redirect if there is no password', async () => {
            let { username, email, password } = testAccount;
            
            await (new User({ username, email, password })).save();

            password = '';

            const agent = request.agent(server);

            let res = await agent.post('/login').send({ username, password }); 

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not log in the user and return a redirect if a user by that username does not exist', async () => {
            const { username, password } = testAccount;

            const agent = request.agent(server);

            let res = await agent.post('/login').send({ username, password }); 

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should log in a user and return a redirect if no user is logged in, the input is valid, and a user by that username does exist', async () => {
            const { username, email, password } = testAccount;

            await (new User({ username, email, password })).save();

            const agent = request.agent(server);

            let res = await agent.post('/login').send({ username, password });

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });
    });

    describe('GET /dashboard', () => {
        it('should return the dashboard if the user is logged in', async () => {
            const { username, email, password } = testAccount;

            await (new User({ username, email, password })).save();

            const agent = request.agent(server);

            await agent.post('/login').send({ username, password });
            
            const res = await agent.get('/dashboard');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });

        it('should return a redirect if the user is not logged in', async () => {
            const res = await request(server).get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });

    describe('POST /logout', () => {
        it('should log the user out and return a redirect if the user is logged in', async () => {
            const { username, email, password } = testAccount;

            await (new User({ username, email, password })).save();

            const agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            let res = await agent.post('/logout');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should return a redirect if the user is not logged in', async () => {
            const res = await request(server).post('/logout');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });
});
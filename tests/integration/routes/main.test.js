const request = require('supertest');
const { testAccount, testAccount2 } = require('../../utils');
const { User } = require('../../../models');

let server, username, email, password, agent, res, user;

describe('Main Routes', () => {
    beforeEach(() => {
        server = require('../../../app');
        username = testAccount.username;
        email = testAccount.email;
        password = testAccount.password;
        agent = undefined;
        res = undefined;
        user = undefined;
    });

    afterEach(async () => {
        await User.deleteMany({});
        await server.close();
    });

    describe('GET /', () => {
        it('should return the homepage', async () => {
            res = await request(server).get('/');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });
    });

    describe('GET /sign-up', () => {
        it('should return the sign up form if the user is not logged in', async () => {
            res = await request(server).get('/sign-up');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });

        it('should return a redirect if the user is logged in', async () => {
            await (new User({ username, email, password })).save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            res = await agent.get('/sign-up');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });

    describe('POST /sign-up', () => {
        it('should not create a user and return a redirect if the user is logged in', async () => {
            await (new User({ username, email, password })).save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            const { username: username2, email: email2, password: password2 } = testAccount2;

            res = await agent.post('/sign-up').send({
                username: username2,
                email: email2,
                password: password2,
                confirmPassword: password2
            });

            user = await User.findOne({ username: username2 });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the username is less than 3 characters', async () => {
            username = new Array(3).join('a');

            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the username is more than 50 characters', async () => {
            username = new Array(52).join('a');

            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the email is invalid', async () => {
            email = 'a';

            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password is less than 8 characters', async () => {
            password = new Array(8).join('a');

            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password is more than 50 characters', async () => {
            password = new Array(52).join('a');

            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password has no lowercase letters', async () => {
            password = `${new Array(8).join('A')}1`;

            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password has no uppercase letters', async () => {
            password = `${new Array(8).join('a')}1`;

            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if the password has no numbers', async () => {
            password = `A${new Array(8).join('a')}`;

            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not create a user and return a redirect if a user by that username already exists', async () => {
            await (new User({ username, email, password })).save();

            res = await request(server).post('/sign-up').send({
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
            res = await request(server).post('/sign-up').send({
                username,
                email,
                password,
                confirmPassword: password
            });

            user = await User.findOne({ username });

            expect(user).not.toBeNull();
            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });

    describe('GET /login', () => {
        it('should return the login form if the user is not logged in', async () => {
            res = await request(server).get('/login');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });

        it('should return a redirect if the user is logged in', async () => {
            await (new User({ username, email, password })).save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            res = await agent.get('/login');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });

    describe('POST /login', () => {
        it('should return a redirect if the user is logged in', async () => {
            await (new User({ username, email, password })).save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });           

            res = await agent.post('/login').send({ username, password });

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not log in the user and return a redirect if there is no username', async () => {
            await (new User({ username, email, password })).save();

            username = '';

            agent = request.agent(server);

            res = await agent.post('/login').send({ username, password }); 

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not log in the user and return a redirect if there is no password', async () => {
            await (new User({ username, email, password })).save();

            password = '';

            agent = request.agent(server);

            res = await agent.post('/login').send({ username, password }); 

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should not log in the user and return a redirect if a user by that username does not exist', async () => {
            agent = request.agent(server);

            res = await agent.post('/login').send({ username, password }); 

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should log in a user and return a redirect if no user is logged in, the input is valid, and a user by that username does exist', async () => {
            await (new User({ username, email, password })).save();

            agent = request.agent(server);

            res = await agent.post('/login').send({ username, password });

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });
    });

    describe('GET /dashboard', () => {
        it('should return the dashboard if the user is logged in', async () => {
            await (new User({ username, email, password })).save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });
            
            res = await agent.get('/dashboard');

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });

        it('should return a redirect if the user is not logged in', async () => {
            res = await request(server).get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });

    describe('POST /logout', () => {
        it('should log the user out and return a redirect if the user is logged in', async () => {
            await (new User({ username, email, password })).save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            res = await agent.post('/logout');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();

            res = await agent.get('/dashboard');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });

        it('should return a redirect if the user is not logged in', async () => {
            res = await request(server).post('/logout');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });
});
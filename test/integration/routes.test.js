const request = require('supertest');
const { User } = require('../../models');

let server;
const testAccount = {
    username: 'Test Account',
    email: 'test@example.com',
    password: 'Testing1!'
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
            const agent = request.agent(server);
            const { username, email, password } = testAccount;

            await agent.post('/sign-up').send({ 
                username, 
                email, 
                password, 
                confirmPassword: password
            });

            await agent.post('/login').send({ username, password });

            const res = await agent.get('/sign-up');

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });
    });
});
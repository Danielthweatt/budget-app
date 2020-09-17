const request = require('supertest');
const { testBudget, testAccount } = require('../../../test-documents');
const { User, Budget } = require('../../../../models');

let server, name, monthlyAmount, username, email, password, res, agent;

process.env.PORT = 3002;
process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_budget_api_tests';

describe('Budget API Routes', () => {
    beforeEach(() => {
        server = require('../../../../app');
        name = testBudget.name;
        monthlyAmount = testBudget.monthlyAmount;
        username = testAccount.username;
        email = testAccount.email;
        password = testAccount.password;
        res = undefined;
        agent = undefined;
    });

    afterEach(async () => {
        await User.deleteMany({});
        await server.close();
    });

    describe('POST /', () => {
        it('should return 401 if the user is not logged in', async () => {
            res = await request(server).post('/api/budget').send({ name, monthlyAmount });

            expect(res.status).toBe(401);
        });

        it('should return 400 if the budget\'s name is less than 3 characters', async () => {
            user = new User({ username, email });
            user.password = await User.hashPassword(password);

            await user.save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            name = new Array(3).join('a');

            res = await agent.post('/api/budget').send({ name, monthlyAmount });

            expect(res.status).toBe(400);
        });

        it('should return 400 if the budget\'s name is more than 50 characters', async () => {
            user = new User({ username, email });
            user.password = await User.hashPassword(password);

            await user.save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            name = new Array(52).join('a');

            res = await agent.post('/api/budget').send({ name, monthlyAmount });

            expect(res.status).toBe(400);
        });

        it('should return 400 if the budget\'s monthly amount is less than 0', async () => {
            user = new User({ username, email });
            user.password = await User.hashPassword(password);

            await user.save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            monthlyAmount = -1;

            res = await agent.post('/api/budget').send({ name, monthlyAmount });

            expect(res.status).toBe(400);
        });

        it('should create and return a budget if the user is logged in and the input is valid', async () => {
            user = new User({ username, email });
            user.password = await User.hashPassword(password);

            await user.save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            res = await agent.post('/api/budget').send({ name, monthlyAmount });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body.name).toBe(name);
            expect(res.body.monthlyAmount).toBe(monthlyAmount);

            const budget = await Budget.findById(res.body._id);

            expect(budget).not.toBeNull();
        });

        it('should relate a user\'s new budget to that user', async () => {
            user = new User({ username, email });
            user.password = await User.hashPassword(password);

            await user.save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            res = await agent.post('/api/budget').send({ name, monthlyAmount });

            user = await User.findOne({ username }).populate('budgets');

            expect(user.budgets[0].name).toBe(name);
            expect(user.budgets[0].monthlyAmount).toBe(monthlyAmount);
        });
    });
});
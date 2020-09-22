const request = require('supertest');
const { testBudget, testAccount } = require('../../../test-documents');
const { User, Budget } = require('../../../../models');

let server, name, monthlyAmount, username, email, password, agent, res, budget, user;

process.env.PORT = 3002;
process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_budget_tests';

describe('Budget Web Routes Integration Tests', () => {
    beforeEach(() => {
        server = require('../../../../app');
        name = testBudget.name;
        monthlyAmount = testBudget.monthlyAmount;
        username = testAccount.username;
        email = testAccount.email;
        password = testAccount.password;
        agent = undefined;
        res = undefined;
        budget = undefined;
        user = undefined;
    });

    afterEach(async () => {
        await User.deleteMany({});
        await Budget.deleteMany({});
        await server.close();
    });

    describe('GET /manage-budget/:_id', () => {
        it('should return a redirect if the user is not logged in', async () => {
            budget = new Budget({ name, monthlyAmount });

            await budget.save();

            user = new User({ username, email, budgets: [ budget._id ] });
            user.password = await User.hashPassword(password);

            await user.save();

            res = await request(server).get(`/manage-budget/${budget._id}`);

            expect(res.status).toBe(302);
            expect(res.redirect).toBeTruthy();
        });


        it('should return the 404 page if the user does not have the budget', async () => {
            budget = new Budget({ name, monthlyAmount });

            await budget.save();

            user = new User({ username, email, budgets: [] });
            user.password = await User.hashPassword(password);

            await user.save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            res = await agent.get(`/manage-budget/${budget._id}`);

            expect(res.status).toBe(404);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });

        it('should return the manage budget page if the user is logged in and has the budget', async () => {
            budget = new Budget({ name, monthlyAmount });

            await budget.save();

            user = new User({ username, email, budgets: [ budget._id ] });
            user.password = await User.hashPassword(password);

            await user.save();

            agent = request.agent(server);

            await agent.post('/login').send({ username, password });

            res = await agent.get(`/manage-budget/${budget._id}`);

            expect(res.status).toBe(200);
            expect(res.headers['content-type']).toMatch(/text\/html/);
        });
    });
});
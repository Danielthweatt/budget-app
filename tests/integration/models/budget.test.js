const { testBudget } = require('../../utils');
const { Budget } = require('../../../models');

let name, amount, purchaseCategories, error, budget;

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_budget_tests';

describe('Budget Model', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    beforeEach(() => {
        name = testBudget.name;
        amount = testBudget.amount;
        purchaseCategories = testBudget.purchaseCategories;
        error = undefined;
        budget = undefined;
    });

    afterEach(async () => {
        await Budget.deleteMany({});
    });


    describe('Save a new budget', () => {
        it('should not save a new budget in the database if the budget\'s name is less than 3 characters', async () => {
            name = new Array(3).join('a');

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should not save a new budget in the database if the budget\'s name is more than 50 characters', async () => {
            name = new Array(52).join('a');

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should not save a new budget in the database if the budget\'s amount is not set', async () => {
            amount = undefined;

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should not save a new budget in the database if the budget\'s amount is less than 0.01', async () => {
            amount = 0.00;

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should not save a new budget in the database if the budget has no purchase categories', async () => {
            purchaseCategories = [];

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should save a new budget in the database if the budget has a valid name and amount, and a valid array of purchase categories', async () => {
            await (new Budget({ name, amount, purchaseCategories })).save();

            budget = await Budget.findOne({ name });

            expect(budget).not.toBeNull();
            expect(budget.name).toBe(name);
            expect(budget.amount).toBe(amount);
            expect(budget.purchaseCategories.length).toBe(purchaseCategories.length);
            expect(budget.purchaseCategories[0].name).toBe(purchaseCategories[0].name);
            expect(budget.purchaseCategories[0].amount).toBe(purchaseCategories[0].amount);
        });
    });
});
const { testBudget } = require('../../utils');
const { Budget } = require('../../../models');

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_budget_tests';

describe('Budget Model', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    afterEach(async () => {
        await Budget.deleteMany({});
    });


    describe('Save a new budget', () => {
        it('should not save a new budget in the database if the budget\'s name is less than 3 characters', async () => {
            let { name, amount, purchaseCategories } = testBudget;

            name = new Array(3).join('a');
            
            let error;

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            const budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should not save a new budget in the database if the budget\'s name is more than 50 characters', async () => {
            let { name, amount, purchaseCategories } = testBudget;

            name = new Array(52).join('a');
            
            let error;

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            const budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should not save a new budget in the database if the budget\'s amount is not set', async () => {
            let { name, amount, purchaseCategories } = testBudget;

            amount = undefined;
            
            let error;

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            const budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should not save a new budget in the database if the budget\'s amount is less than 0.01', async () => {
            let { name, amount, purchaseCategories } = testBudget;

            amount = 0.00;
            
            let error;

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            const budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should not save a new budget in the database if the budget has no purchase categories', async () => {
            let { name, amount, purchaseCategories } = testBudget;

            purchaseCategories = [];
            
            let error;

            try {
                await (new Budget({ name, amount, purchaseCategories })).save();
            } catch(err) {
                error = err;
            }

            const budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should save a new budget in the database if the budget has a valid name and amount, and a valid array of purchase categories', async () => {
            const { name, amount, purchaseCategories } = testBudget;

            await (new Budget({ name, amount, purchaseCategories })).save();

            const budget = await Budget.findOne({ name });

            expect(budget).not.toBeNull();
            expect(budget.name).toBe(name);
            expect(budget.amount).toBe(amount);
            expect(budget.purchaseCategories.length).toBe(purchaseCategories.length);
        });
    });
});
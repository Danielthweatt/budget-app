const { testBudget } = require('../../test-documents');
const { Budget } = require('../../../models');

let name, monthlyAmount, error, budget;

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_budget_tests';

describe('Budget Model Integration Tests', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    beforeEach(() => {
        name = testBudget.name;
        monthlyAmount = testBudget.monthlyAmount;
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
                await (new Budget({ name, monthlyAmount })).save();
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
                await (new Budget({ name, monthlyAmount })).save();
            } catch(err) {
                error = err;
            }

            budget = await Budget.findOne({ name });

            expect(error).not.toBeUndefined();
            expect(budget).toBeNull();
        });

        it('should default a budget\'s monthly amount to 0.00 if no amount is set', async () => {
            monthlyAmount = undefined;

            try {
                await (new Budget({ name, monthlyAmount })).save();
            } catch(err) {
                error = err;
            }

            budget = await Budget.findOne({ name });

            expect(error).toBeUndefined();
            expect(budget.monthlyAmount).toBe(0.00);
        });

        it('should save a new budget in the database if the budget has a valid name and monthly amount', async () => {
            await (new Budget({ name, monthlyAmount })).save();

            budget = await Budget.findOne({ name });

            expect(budget).not.toBeNull();
            expect(budget.name).toBe(name);
            expect(budget.monthlyAmount).toBe(monthlyAmount);
        });

        it('should save a new budget in the database if the budget has a valid name and monthly amount, and a valid array of purchase categories', async () => {
            const purchaseCategories = testBudget.purchaseCategories;
            
            await (new Budget({ name, monthlyAmount, purchaseCategories })).save();

            budget = await Budget.findOne({ name });

            expect(budget).not.toBeNull();
            expect(budget.name).toBe(name);
            expect(budget.monthlyAmount).toBe(monthlyAmount);
            expect(budget.purchaseCategories.length).toBe(purchaseCategories.length);
            expect(budget.purchaseCategories[0].name).toBe(purchaseCategories[0].name);
            expect(budget.purchaseCategories[0].monthlyAmount).toBe(purchaseCategories[0].monthlyAmount);
        });

        it('should return a plain object when getPublicObject() is called on a saved budget', async () => {
            await (new Budget({ name, monthlyAmount })).save();

            budget = await Budget.findOne({ name });

            const publicBudget = budget.getPublicObject();

            expect(publicBudget.constructor).toBe(Object);
        });
    });
});
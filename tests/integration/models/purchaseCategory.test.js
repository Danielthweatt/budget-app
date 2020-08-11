const { testPurchaseCategory } = require('../../utils');
const { PurchaseCategory } = require('../../../models');

let name, amount, error, purchaseCategory;

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_purchase_category_tests';

describe('PurchaseCategory Model', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    beforeEach(() => {
        name = testPurchaseCategory.name;
        amount = testPurchaseCategory.amount;
        error = undefined;
        purchaseCategory = undefined;
    });

    afterEach(async () => {
        await PurchaseCategory.deleteMany({});
    });

    it('should not save a new purchase category in the database if the purchase category\'s name is less than 3 characters', async () => {
        name = new Array(3).join('a');

        try {
            await (new PurchaseCategory({ name, amount })).save();
        } catch(err) {
            error = err;
        }

        purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(error).not.toBeUndefined();
        expect(purchaseCategory).toBeNull();
    });

    it('should not save a new purchase category in the database if the purchase category\'s name is more than 50 characters', async () => {
        name = new Array(52).join('a');

        try {
            await (new PurchaseCategory({ name, amount })).save();
        } catch(err) {
            error = err;
        }

        purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(error).not.toBeUndefined();
        expect(purchaseCategory).toBeNull();
    });

    it('should not save a new purchase category in the database if the purchase category\'s amount is less than 0.01', async () => {
        amount = 0.00;

        try {
            await (new PurchaseCategory({ name, amount })).save();
        } catch(err) {
            error = err;
        }

        purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(error).not.toBeUndefined();
        expect(purchaseCategory).toBeNull();
    });

    it('should save a new purchase category in the database if the pruchase category has a valid name and amount', async () => {
        await (new PurchaseCategory({ name, amount })).save();

        purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(purchaseCategory).not.toBeNull();
        expect(purchaseCategory.name).toBe(name);
        expect(purchaseCategory.amount).toBe(amount);
    });
});
const { testPurchaseCategory } = require('../../utils');
const { PurchaseCategory } = require('../../../models');

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_purchase_category_tests';

describe('PurchaseCategory Model', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    afterEach(async () => {
        await PurchaseCategory.deleteMany({});
    });

    it('should not save a new purchase category in the database if the purchase category\'s name is less than 3 characters', async () => {
        let { name, amount } = testPurchaseCategory;

        name = new Array(3).join('a');
        
        let error;

        try {
            await (new PurchaseCategory({ name, amount })).save();
        } catch(err) {
            error = err;
        }

        const purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(error).not.toBeUndefined();
        expect(purchaseCategory).toBeNull();
    });

    it('should not save a new purchase category in the database if the purchase category\'s name is more than 50 characters', async () => {
        let { name, amount } = testPurchaseCategory;

        name = new Array(52).join('a');
        
        let error;

        try {
            await (new PurchaseCategory({ name, amount })).save();
        } catch(err) {
            error = err;
        }

        const purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(error).not.toBeUndefined();
        expect(purchaseCategory).toBeNull();
    });

    it('should not save a new purchase category in the database if the purchase category\'s amount is less than 0.01', async () => {
        let { name, amount } = testPurchaseCategory;

        amount = 0.00;
        
        let error;

        try {
            await (new PurchaseCategory({ name, amount })).save();
        } catch(err) {
            error = err;
        }

        const purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(error).not.toBeUndefined();
        expect(purchaseCategory).toBeNull();
    });

    it('should save a new purchase category in the database if the pruchase category has a valid name and amount', async () => {
        const { name, amount } = testPurchaseCategory;

        await (new PurchaseCategory({ name, amount })).save();

        const purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(purchaseCategory).not.toBeNull();
        expect(purchaseCategory.name).toBe(name);
        expect(purchaseCategory.amount).toBe(amount);
    });
});
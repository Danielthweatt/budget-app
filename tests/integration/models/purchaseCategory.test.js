const { testPurchaseCategory } = require('../../test-documents');
const { PurchaseCategory } = require('../../../models');

let name, monthlyAmount, error, purchaseCategory;

process.env.MONGODB_URI = 'mongodb://localhost:27017/budget_app_purchase_category_tests';

describe('PurchaseCategory Model Integration Tests', () => {
    beforeAll(() => {
        require('../../../boot/db')();
    });

    beforeEach(() => {
        name = testPurchaseCategory.name;
        monthlyAmount = testPurchaseCategory.monthlyAmount;
        error = undefined;
        purchaseCategory = undefined;
    });

    afterEach(async () => {
        await PurchaseCategory.deleteMany({});
    });

    it('should not save a new purchase category in the database if the purchase category\'s name is less than 3 characters', async () => {
        name = new Array(3).join('a');

        try {
            await (new PurchaseCategory({ name, monthlyAmount })).save();
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
            await (new PurchaseCategory({ name, monthlyAmount })).save();
        } catch(err) {
            error = err;
        }

        purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(error).not.toBeUndefined();
        expect(purchaseCategory).toBeNull();
    });

    it('should default a purchase category\'s monthly amount to 0.00 if no amount is set', async () => {
        monthlyAmount = undefined;

        try {
            await (new PurchaseCategory({ name, monthlyAmount })).save();
        } catch(err) {
            error = err;
        }

        purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(error).toBeUndefined();
        expect(purchaseCategory.monthlyAmount).toBe(0.00);
    });

    it('should save a new purchase category in the database if the pruchase category has a valid name and monthly amount', async () => {
        await (new PurchaseCategory({ name, monthlyAmount })).save();

        purchaseCategory = await PurchaseCategory.findOne({ name });

        expect(purchaseCategory).not.toBeNull();
        expect(purchaseCategory.name).toBe(name);
        expect(purchaseCategory.monthlyAmount).toBe(monthlyAmount);
    });

    it('should return a plain object when getPublicObject() is called on a saved purchase category', async () => {
        await (new PurchaseCategory({ name, monthlyAmount })).save();

        purchaseCategory = await PurchaseCategory.findOne({ name });

        const publicPurchaseCategory = purchaseCategory.getPublicObject();

        expect(publicPurchaseCategory.constructor).toBe(Object);
    });
});
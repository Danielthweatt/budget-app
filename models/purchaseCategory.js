const mongoose = require('mongoose');

const purchaseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    budgetedMonthlyAmount: {
        type: Number,
        min: 0.01
    }
});

module.exports = {
    purchaseCategorySchema,
    PurchaseCategory: mongoose.model('PurchaseCategory', purchaseCategorySchema)
};
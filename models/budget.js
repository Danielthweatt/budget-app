const mongoose = require('mongoose');
const { purchaseCategorySchema } = require('./purchaseCategory');

const budgetSchema = new mongoose.Schema({
    monthlyAmount: {
        type: Number,
        required: true,
        min: 0.01
    },
    purchaseCategories: [ purchaseCategorySchema ]
});

module.exports = {
    budgetSchema,
    Budget: mongoose.model('Budget', budgetSchema)
};
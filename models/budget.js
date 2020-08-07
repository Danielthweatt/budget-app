const mongoose = require('mongoose');
const { purchaseCategorySchema } = require('./purchaseCategory');

const budgetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    amount: {
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
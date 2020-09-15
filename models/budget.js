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
        default: 0.00
    },
    purchaseCategories: [ purchaseCategorySchema ]
});

//Instance methods
budgetSchema.methods.getPublicObject = function() {
    return {
        _id: this._id,
        name: this.name,
        amount: this.amount,
        purchaseCategories: this.purchaseCategories.map(purchaseCategory => purchaseCategory.getPublicObject())
    };
};

module.exports = {
    budgetSchema,
    Budget: mongoose.model('Budget', budgetSchema)
};
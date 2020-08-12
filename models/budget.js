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
    purchaseCategories: {
        type: [ purchaseCategorySchema ],
        validate(val) {
            return val.length > 0;
        }
    }
});

//Instance methods
budgetSchema.methods.getSessionObject = function() {
    return {
        _id: this._id ? this._id : '',
        name: this.name ? this.name : '',
        amount: this.amount ? this.amount : 0.00
    };
};

module.exports = {
    budgetSchema,
    Budget: mongoose.model('Budget', budgetSchema)
};
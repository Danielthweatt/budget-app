const mongoose = require('mongoose');

const purchaseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    amount: {
        type: Number,
        min: 0.01
    }
});

module.exports = {
    purchaseCategorySchema,
    PurchaseCategory: mongoose.model('PurchaseCategory', purchaseCategorySchema)
};
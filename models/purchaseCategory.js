const mongoose = require('mongoose');

const purchaseCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    monthlyAmount: {
        type: Number,
        min: 0.01
    }
});

module.exports = {
    purchaseCategorySchema,
    PurchaseCategory: mongoose.model('PurchaseCategory', purchaseCategorySchema)
};
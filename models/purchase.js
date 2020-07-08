const mongoose = require('mongoose');
const { purchaseCategorySchema } = require('./purchaseCategory');

const purchaseSchema = new mongoose.Schema({
    category: {
        type: purchaseCategorySchema,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = {
    purchaseSchema,
    Purchase: mongoose.model('Purchase', purchaseSchema)
};
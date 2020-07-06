const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true
        //Use enum???
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
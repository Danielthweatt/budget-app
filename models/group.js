const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    }
});

module.exports = {
    groupSchema,
    Group: mongoose.model('User', groupSchema)
};
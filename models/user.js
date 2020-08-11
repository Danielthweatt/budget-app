const mongoose = require('mongoose');
const { Budget } = require('./budget');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true
    },
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 50
    },
    budgets: [ {
        type: Schema.Types.ObjectId,
        ref: Budget
    } ]
});

//Static methods
userSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);

    return bcrypt.hash(password, salt);
};


//Instance methods
userSchema.methods.checkPassword = function(password) {
    return bcrypt.compare(password, this.password);
};

//Pre Hooks
userSchema.pre('save', async function(next){
	if (this.password && this.password.charAt(0) !== '$') {
		this.password = await this.constructor.hashPassword(this.password);
		next();
	} else {
		next();
	}
});

module.exports = {
    userSchema,
    User: mongoose.model('User', userSchema)
};
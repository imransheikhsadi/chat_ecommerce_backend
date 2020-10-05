const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    avatar: String,
    role: {
        type: String,
        default: 'user',
        enum: ['user','admin','moderator']
    },
    email: {
        type: String,
        required: [true,'User must have a Email'],
        unique: true
    },
    password: {
        type: String,
        required: [true,'Please provide a strong Password'],
        minlength: 8,
        select: false
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function(val){
                return val === this.password
            },
            message: "Password didn't match"
        }
    },
    purchased: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Product'
    }],
    joinedAt: {
        type: Date,
        default: Date.now()
    },
    totalTransaction: Number,
    transaction: Number,
    passwordResetToken: String,
    passwordResetExpire: Date
});

userSchema.index({'name': 'text','email':'text'});

userSchema.pre('save',async function(next){
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;

    next();
});

userSchema.methods.checkPassword = async function(givenPassword,storedPassword){
    return await bcrypt.compare(givenPassword,storedPassword);
}

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpire = Date.now() + 30 * 60 * 1000;


    return resetToken;
}


const User = mongoose.model('User',userSchema);

module.exports = User;
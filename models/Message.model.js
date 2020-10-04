const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    messageType: {
        type: String,
        enum: ['image','text','emoji'],
        default: 'text'
    },
    src: String,
    seen: Boolean,
    createdBy: String
});


const Message = mongoose.model('Message', messageSchema
);

module.exports = Message;
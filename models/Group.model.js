const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    name: {
        type: String,
        required: true
    }
});


const Group = mongoose.model('Group', groupSchema
);

module.exports = Group;
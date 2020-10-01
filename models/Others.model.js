const mongoose = require('mongoose');

const otherSchema = new mongoose.Schema({},{strict: false});


const Other = mongoose.model('Other',otherSchema);

module.exports = Other;
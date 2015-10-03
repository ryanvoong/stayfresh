var mongoose = require('mongoose');

var itemSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    expiration: Date
});

module.exports = mongoose.model('Item', itemSchema);
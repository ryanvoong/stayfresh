var mongoose = require('mongoose');

var pantrySchema = new mongoose.Schema({
    items: [{
        name: { type: String, default: '' },
        expiration: Date
    }]
});

module.exports = mongoose.model('Pantry', pantrySchema);
var mongoose = require('mongoose');

var shoppingListSchema = new mongoose.Schema({
    items: [{
        name: { type: String, default: '' },
        url: { type: String, default: '' },
        expiration: Date
    }]
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
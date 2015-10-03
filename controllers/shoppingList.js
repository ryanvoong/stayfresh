var User = require('../models/User');
var ShoppingList = require('../models/shoppingList');

exports.getShoppingList = function(req, res) {
    ShoppingList.findById({ _id: req.user.shoppingList}, function(err, shoppingList) {
        if (err || !shoppingList) {
            User.findById({ _id: req.user._id }, function(e, user) {
                shoppingList = new ShoppingList();
                shoppingList.items = [];
                shoppingList.save();
                user.shoppingList = shoppingList._id;
                user.save();
            });
        }
        res.render('shoppingList', {
            title: 'Shopping List',
            shoppingList: shoppingList
        });
    });
};

exports.postDelete = function(req, res) {
    res.redirect('/pantry');
};

exports.postAddToCart = function(req, res) {
    res.redirect('/pantry');
};

exports.postAddItem = function(req, res) {
    if (req.body.name) {
        ShoppingList.findById({ _id: req.user.shoppingList}, function(err, shoppingList) {
            var item = {};
            item.name = req.body.name;
            item.expiration = undefined;
            shoppingList.items.push(item);
            shoppingList.save();
        });
        req.flash('success', { msg: 'Item has been added!' });
    }
    else {
        req.flash('errors', { msg: 'Please fill out all form fields' });
    }
    res.redirect('/shopping_list');
};
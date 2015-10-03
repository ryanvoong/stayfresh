var User = require('../models/User');
var Pantry = require('../models/Pantry');

exports.getPantry = function(req, res) {
    Pantry.findById({ _id: req.user.pantry}, function(err, pantry) {
        if (err || !pantry) {
            User.findById({ _id: req.user._id }, function(e, user) {
                pantry = new Pantry();
                pantry.items = [];
                pantry.save();
                user.pantry = pantry._id;
                user.save();
            });
        }
        res.render('pantry', {
            title: 'Pantry',
            pantry: pantry
        });
    });
};

exports.postDelete = function(req, res) {
    res.redirect('/shopping_list');
};

exports.postAddToCart = function(req, res) {
    res.redirect('/shopping_listy');
};

exports.postAddItem = function(req, res) {
    if (req.body.name && req.body.expiration) {
        Pantry.findById({ _id: req.user.pantry }, function(err, pantry) {
            var item = {};
            item.name = req.body.name;
            item.expiration = new Date(req.body.expiration);
            pantry.items.push(item);
            pantry.save();
        });
        req.flash('success', { msg: 'Item has been added!' });
    }
    else {
        req.flash('errors', { msg: 'Please fill out all form fields' });
    }
    res.redirect('/pantry');
};
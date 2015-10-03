var User = require('../models/User');

exports.getPantry = function(req, res) {
    res.render('pantry', {
        title: 'Pantry'
    });
};

exports.getAddItem = function(req, res) {
    res.render('add_item', {
        title: 'Add Item'
    });
};

exports.postAddItem = function(req, res) {
    if (req.body.name && req.body.expiration) {
        User.findById({ _id: req.user._id }, function(err, user) {
            if (!err && user) {
                var item = {};
                item.name = req.body.name;
                item.expiration = new Date(req.body.expiration);
                user.pantry.push(item);
                user.save();
            }
        });
        req.flash('success', { msg: 'Item has been added!' });
    }
    else {
        req.flash('errors', { msg: 'Please fill out all form fields' });
    }
    res.redirect('/add_item');
};
var User = require('../models/User');
var ShoppingList = require('../models/shoppingList');
var request = require('request');
var async = require('async')

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
    async.waterfall([
        function(done) {
            if (req.body.name) {
                return done(null);
            } else {
                req.flash('errors', { msg: 'Please fill out all form fields' });
                return done(true);
            }
        },
        function(done) {
            ShoppingList.findById({ _id: req.user.shoppingList}, function(err, shoppingList) {
                var api = request("http://freeimages.pictures/api/user/6236733284313232/?keyword=" + req.body.name + "&sources=google",
                    function (e, resp, body) {
                        var item = {};
                        item.name = req.body.name;
                        item.expiration = undefined;
                        if (JSON.parse(body)["count"] > 0 && JSON.parse(body)["sources"][0]["count"] > 0) {
                            item.url = JSON.parse(body)["sources"][0]["result"][0]["thumb_url"];
                            console.log(item.url);
                        }
                        shoppingList.items.push(item);
                        shoppingList.save();
                        req.flash('success', { msg: 'Item has been added!' });
                        done(e);
                    });
            });
        },
        function(e) {
            res.redirect('/shopping_list');
        }
    ]);
};
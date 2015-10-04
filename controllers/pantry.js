var User = require('../models/User');
var Pantry = require('../models/Pantry');
var request = require('request');
var async = require('async');

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
    async.waterfall([
        function(done) {
            if (req.body.name && req.body.expiration) {
                return done(null);
            } else {
                req.flash('errors', { msg: 'Please fill out all form fields' });
                return done(true);
            }
        },
        function(done) {
            Pantry.findById({_id: req.user.pantry}, function (err, pantry) {
                var api = request("http://freeimages.pictures/api/user/6236733284313232/?keyword=" + req.body.name + "&sources=google",
                    function (e, resp, body) {
                        console.log(body);
                        var data = JSON.parse(body);
                        var item = {};
                        item.name = req.body.name;
                        item.expiration = new Date(req.body.expiration);
                        if (data["count"] > 0 && data["sources"][0]["count"] > 0) {
                            item.url = data["sources"][0]["result"][0]["thumb_url"];
                            console.log(item.url);
                        }
                        pantry.items.push(item);
                        pantry.save();
                        req.flash('success', { msg: 'Item has been added!' });
                        return done(e);
                    });
            });
        }
    ],
        function (e) {
            res.redirect('/pantry');
        }
    );
};

exports.postRemoveFromPantry = function(req, res) {
    Pantry.findById({ _id: req.user.pantry}, function(err, pantry) {
        if (pantry) {
            pantry.items.forEach(function(item, index) {
                if (item.name == req.body.name && item.expiration == req.body.expiration) {
                    pantry.items.splice(index);
                    pantry.save();

                }
            });
        }
        res.redirect('/pantry');
    });
};
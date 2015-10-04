var Pantry = require('../models/Pantry');
var request = require('request');
var async = require('async');

exports.getRecipes = function(req, res) {
  res.render('recipes', {
    title: 'Recipes',
    recipes: undefined
  });
};

exports.postRecipesQuery = function(req, res) {
  request('http://www.recipepuppy.com/api/?q=' + req.body.query, function(error, response, body) {
    res.render('recipes', {
      title: 'Recipes',
      recipes: JSON.parse(body)['results']
    });
  });
};

exports.postRecipesIngredients = function(req, res) {
  async.waterfall([
    function(done) {
      Pantry.findById({ _id: req.user.pantry }, function(err, pantry) {
        var ingredients = pantry.items.reduce(function (acc, elem, i) {
          if (i === 0) {
            return elem.name;
          } else {
            return acc + "," + elem.name;
          }
        }, "");
        return done(err, ingredients);
      });
    },
    function(ingredients, done) {
      request('http://www.recipepuppy.com/api/?i=' + ingredients, function(error, response, body) {
        return done(error, JSON.parse(body)['results']);
      });
    }
  ], function(err, results) {
    res.render('recipes', {
      title: 'Recipes',
      recipes: results
    });
  });
};
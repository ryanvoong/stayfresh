var Pantry = require('../models/Pantry');
var request = require('request');

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

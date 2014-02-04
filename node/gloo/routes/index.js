
/*
 * GET home page.
 */

var model = require('../model/model.js');

exports.list = function(req, res){
  model.getUser(function(err, users){
    res.render('views/index', {users: users})
  });
}

exports.index = function(req, res){
  res.render('index');
};
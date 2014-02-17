
/**
 * Module dependencies.
 */

var express = require('express');
var extend = require('extend');

var createApp = function (config) {

  //Valeur par défaut
  var def = {
    model: {
      client: 'mysql',
      connection: {
        host     : '127.0.0.1',
        user     : 'root',
        password : '',
        database : 'proftpd',
        charset  : 'utf8'
      },
      debug: true
    }
  };

  config = extend(true, {}, def, config);

  console.log('Starting with options: ', config);

  var path = require('path');
  var model = require('./model/model')(config.model);
  var user = require('./routes/user')(model);
  var group = require('./routes/group')(model);

  var app = express();

  // all environments
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  app.get('/', user.index);

  //Recupérer les listes
  app.get('/users', user.index);
  app.get('/groups', group.index);

  //Ajout
  app.post('/groups', group.addgroup);
  app.post('/users', user.adduser);

  //Edit
  app.put('/groups/:id', group.editgroup);
  app.put('/users/:id', user.edituser);

  //Suppression
  app.delete('/groups/:id', group.deletegroup);
  app.delete('/users/:id', user.deleteuser);

  return app;
};


if (!module.parent) {
  var http = require('http');
  var app = createApp();
  http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
  });
} else {
  module.exports = createApp;
}



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
      debug: false
    }
  };

  config = extend(true, {}, def, config);

  var path = require('path');
  var model = require('./model/model')(config.model);
  var user = require('./routes/user')(model);
  var group = require('./routes/group')(model);

  var app = express();

  // all environments
  app.set('port', config.port || process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
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

  app.get('/users', user.index);
  app.get('/groups', group.index);

  app.post('/groups', group.addgroup);
  app.post('/users', user.adduser);

  app.put('/groups/:id', group.editgroup);
  app.put('/users/:id', user.edituser);

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


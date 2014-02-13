
/**
 * Module dependencies.
 */

var express = require('express');
//var routes = require('./routes');
var user = require('./routes/user');
var group = require('./routes/group');
var http = require('http');
var path = require('path');

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
// app.get('/users', user.index);
// app.get('/groups', group.index);

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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



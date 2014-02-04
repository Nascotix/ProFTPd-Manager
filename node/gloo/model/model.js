
/*
 *  MODEL
 */

var Bookshelf = require('bookshelf');

var MySql = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'proftpd',
    charset  : 'utf8'
  }
});

var user = MySql.Model.extend({
  tableName: 'ftpuser'
});
var group = MySql.Model.extend({
  tableName: 'ftpgroup'
});

exports.getUser = function(){
	new group.fetch().then(function(model) {
    console.log('Userid: ' + model.get('userid'));
  });
}

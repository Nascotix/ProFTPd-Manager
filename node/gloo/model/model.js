
/*
 *  MODEL
 */

'use strict';

var Bookshelf = require('bookshelf');
//var _ = require('lodash');

var MySql = Bookshelf.initialize({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : '',
    database : 'proftpd',
    charset  : 'utf8'
  },
  debug: true
});

//Création de la classe
var User = MySql.Model.extend({
  tableName: 'ftpuser',
  toJSON: function () {
    var mod = MySql.Model.prototype.toJSON.apply(this)
    delete mod['passwd'];
    return mod;
  }
});
//Objet collection pour récupérer tous les utilisateurs
var Users = MySql.Collection.extend({
  model: User,
  toJSON: function () {
    return this.models.map(function (model) {
      var mod = model.toJSON();
      delete mod['passwd'];
      return mod;
    });
  }
});

var Group = MySql.Model.extend({
  tableName: 'ftpgroup',
  idAttribute: 'gid'
});
var Groups = MySql.Collection.extend({
  model: Group
});

//Functions

/**********   Listage   ************/

exports.getUsers = function (callback) {
  var users = new Users();

  users
    .fetch()
    .done(function (models) {
      //console.log('DONE!', arguments);
      callback(null, models.toJSON());
    });
};

exports.getGroups = function (callback) {
  var groups = new Groups();

  groups
    .fetch()
    .done(function (model) {
      //console.log('DONE!', arguments);
      callback(null, model);
    });
};

/**********   Ajout   ************/

exports.addGroup = function (data, callback) {
  new Group(data)
    .save({}, {method: 'insert'})
    .done(function (model) {
      console.log('Just Added a new group!', arguments);
      callback(null, model);
    });
};

exports.addUser = function (data, callback) {
  new User(data)
    .save({}, {method: 'insert'})
    .done(function (model) {
      console.log('Just Added a new user!', arguments);
      callback(null, model);
    });
};


/**********   Suppression   ************/

exports.delGroup = function (id, callback) {

  exports.getGroup(id, function (err, model) {
    if (err) {
      return callback(err);
    }

    if (!model) {
      callback(null, false);
    } else {
      model
        .destroy()
        .done(function () {
          console.log('Group' + id + 'erased!', arguments);
          callback(null, true);
        });
    }
  });
};

exports.delUser = function (id, callback) {

  exports.getUser(id, function (err, model) {
    if (err) {
      return callback(err);
    }

    if (!model) {
      callback(null, false);
    } else {
      model
        .destroy()
        .done(function () {
          console.log('User' + id + 'erased!', arguments);
          callback(null, true);
        });
    }
  });
};

/**********   Modification   ************/

exports.editUser = function (id, params, callback) {
  exports.getUser(id, function (err, model) {
    if (err) {
      return callback(err);
    }

    if (!model) {
      callback(null, false);
    } else {
      model
        .save(params, {method: 'update'})
        .done(function (model) {
          console.log('Just modified the user!', arguments);
          callback(null, model);
        });
    }
  });
};

exports.editGroup = function (id, params, callback) {
  exports.getGroup(id, function (err, model) {
    if (err) {
      return callback(err);
    }

    if (!model) {
      callback(null, false);
    } else {
      model
        .save(params, {method: 'update'})
        .done(function (model) {
          console.log('Just modified the group!', arguments);
          callback(null, model);
        });
    }
  });
}

/**********   Recherche   ************/

exports.getGroup = function (id, callback) {
  var grp = new Groups();

  grp
    .query({where: {gid: id}})
    .fetchOne()
    .done(function (model) {
      console.log('GROUP FOUND!', arguments);
      callback(null, model);
    });
};

exports.getUser = function (id, callback) {
  var usr = new Users();

  usr
    .query({where: {id: id}})
    .fetchOne()
    .done(function (model) {
      console.log('USER FOUND!', arguments);
      callback(null, model);
    });
};

exports.countGroupById = function (id, callback) {
  var grp = new Groups();

  grp
    .query({where: {gid: id}})
    .fetchOne()
    .done(function (model) {
      if (model !== null) {
        //console.log('MODEL : ERR_DUP_ENTRY!', arguments);
        callback(null, false);
      } else {
        //console.log('MODEL : Ok pour le GID', model);
        callback(null, true);
      }
    });
};


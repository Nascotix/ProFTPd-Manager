
/*
 *  MODEL
 */

'use strict';

var Bookshelf = require('bookshelf');
//var _ = require('lodash');

module.exports = function (config) {

  var models = {};

  var MySql = Bookshelf.initialize(config);

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

  models.getUsers = function (callback) {
    var users = new Users();

    users
      .fetch()
      .done(function (models) {
        callback(null, models.toJSON());
      });
  };

  models.getGroups = function (callback) {
    var groups = new Groups();

    groups
      .fetch()
      .done(function (model) {
        callback(null, model);
      });
  };

  /**********   Ajout   ************/

  models.addGroup = function (data, callback) {
    new Group(data)
      .save({}, {method: 'insert'})
      .done(function (model) {
        callback(null, model);
      });
  };

  models.addUser = function (data, callback) {
    new User(data)
      .save({}, {method: 'insert'})
      .done(function (model) {
        callback(null, model);
      });
  };


  /**********   Suppression   ************/

  models.delGroup = function (id, callback) {

    models.getGroup(id, function (err, model) {
      if (err) {
        return callback(err);
      }

      if (!model) {
        callback(null, false);
      } else {
        model
          .destroy()
          .done(function () {
            callback(null, true);
          });
      }
    });
  };

  models.delUser = function (id, callback) {

    models.getUser(id, function (err, model) {
      if (err) {
        return callback(err);
      }

      if (!model) {
        callback(null, false);
      } else {
        model
          .destroy()
          .done(function () {
            callback(null, true);
          });
      }
    });
  };

  /**********   Modification   ************/

  models.editUser = function (id, params, callback) {
    console.log('id: ' + id);
    console.log('params: ' + params);
    models.getUser(id, function (err, model) {
      if (err) {
        return callback(err);
      }

      if (!model) {
        callback(null, false);
      } else {
        model
          .save(params, {method: 'update'})
          .done(function (model) {
            callback(null, model);
          });
      }
    });
  };

  models.editGroup = function (id, params, callback) {
    models.getGroup(id, function (err, model) {
      if (err) {
        return callback(err);
      }

      if (!model) {
        callback(null, false);
      } else {
        model
          .save(params, {method: 'update'})
          .done(function (model) {
            callback(null, model);
          });
      }
    });
  };

  /**********   Recherche   ************/

  models.getGroup = function (id, callback) {
    var grp = new Groups();

    grp
      .query({where: {gid: id}})
      .fetchOne()
      .done(function (model) {
        callback(null, model);
      });
  };

  models.getUser = function (id, callback) {
    var usr = new Users();

    usr
      .query({where: {id: id}})
      .fetchOne()
      .done(function (model) {
        callback(null, model);
      });
  };

  models.countGroupById = function (id, callback) {
    var grp = new Groups();

    grp
      .query({where: {gid: id}})
      .fetchOne()
      .done(function (model) {
        if (model !== null) {
          callback(null, false);
        } else {
          callback(null, true);
        }
      });
  };

  return models;

};

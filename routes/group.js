/*
 * GET group page.
 */

'use strict';

var validator = require('validator');
var revalidator = require('revalidator');

module.exports = function (model) {

  var controller = {};

  controller.validate_group = function () {
    // Set up our request schema for groups
    var schema = {
      properties: {
        grpname: {
          description: 'Validation du champ du nom du groupe',
          type: 'string',
          pattern: /^[-\sa-zA-Z0-9àçèéêëîïôùû]+$/,
          minLength: 3,
          maxLength: 16,
          required: true,
          messages: {
            required: 'Donnez un nom au groupe !',
            pattern: 'Certains caractères ne sont pas autorisés !',
            minLength: 'Le nom de groupe n\'est pas suffisamment explicite ! Minimum 3 lettres.',
            maxLength: 'Limitez le nom du groupe à 16 caractères !'
          }
        },
        grpid: {
          description: 'validation du champ gid',
          pattern: /^[0-9]+$/,
          messages: {
            pattern: 'Le Gid doit être un nombre !'
          }
        },
        grpmember: {
          description: 'validation du champ membres du groupe',
          type: 'string',
          pattern: /^[-\sa-zA-Z0-9àçèéêëîïôùû]+$/,
          minLength: 2,
          maxLength: 16,
          messages: {
            pattern: 'Certains caractères ne sont pas autorisés !',
            minLength: 'Le nom du membre n\'est pas suffisamment explicite ! Minimum 2 lettres.',
            maxLength: 'Limitez le nom du membre à 16 caractères !'
          }
        }
      }
    };
    return schema;
  };

  controller.list = function (req, res, next) {
    model.getGroups(function (err, groups) {
      if (err) {
        next(err);
        return;
      }
      res.send(groups);
    });
  };

  controller.index = function (req, res, next) {
    res.format({
      'text/html': function () {
        res.render('groups');
      },
      'application/json': function () {
        controller.list(req, res, next);
      }
    });
  };

  controller.addgroup = function (req, res, next) {
    var obj = {};
    obj.grpname = validator.trim(req.body.nameGrp);
    obj.grpmember = validator.trim(req.body.membGrp);
    obj.grpid = validator.trim(req.body.idGroup);

    var schema = controller.validate_group();
    var validation = revalidator.validate(obj, schema);
    if (!validation.valid) {
      res.send(validation);
      return;
    } else {
      model.countGroupById(req.body.idGroup, function (err, count) {
        if (count !== false) {
          model.addGroup({
            groupname: req.body.nameGrp,
            gid: req.body.idGroup,
            members: req.body.membGrp
          }, function (err, group) {
            if (err) {
              next(err);
              return;
            }
            res.send(group);
          });
        } else {
          var er = {};
          er.dup = 'Ce Gid existe déjà !';
          res.send(er);
        }
      });
    }
  };

  controller.deletegroup = function (req, res, next) {
    model.delGroup(req.params.id, function (err, grp) {
      if (err) {
        next(err);
        return;
      }
      res.send(grp);
    });
  };

  controller.editgroup = function (req, res, next) {

    var obj = {};
    obj.grpname = validator.trim(req.body.nameGrp);
    obj.grpmember = validator.trim(req.body.membGrp);

    var schema = controller.validate_group();
    var validation = revalidator.validate(obj, schema);
    if (!validation.valid) {
      res.send(validation);
      return;
    } else {
      model.editGroup(req.params.id, {
        groupname: req.body.nameGrp,
        gid: req.body.idGroup,
        members: req.body.membGrp
      }, function (err, group) {
        if (err) {
          next(err);
          return;
        }
        res.send(group);
      });
    }
  };

  return controller;

};
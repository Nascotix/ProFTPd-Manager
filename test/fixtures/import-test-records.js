
var mysql = require('mysql');
var async = require('async');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

var schemaSQLFile = path.join(__dirname, '../../config', 'sql-schema.sql');
var recordsSQLFile = path.join(__dirname, 'test-records.sql');

module.exports = function (config, done) {
  config = _.merge({}, config);
  config.multipleStatements = true

  var createConnection = function () {
    return mysql.createConnection(config);
  };

  var connection, schema, records;

  async.series([
    function (done) {
      fs.readFile(schemaSQLFile, function (err, res) {
        if (res) {
          schema = res.toString('utf8');
        }
        done(err);
      });
    },
    function (done) {
      fs.readFile(recordsSQLFile, function (err, res) {
        if (res) {
          records = res.toString('utf8');
        }
        done(err);
      });
    },
    function (done) {
      connection = createConnection();
      connection.connect(done);
    },
    function (done) {
      connection.query('DROP DATABASE ' + config.database + '; CREATE DATABASE ' + config.database + ';', done);
    },
    function (done) {
      connection.end(done);
    },
    function (done) {
      connection = createConnection();
      connection.connect(done);
    },
    function (done) {
      connection.query(schema, done);
    },
    function (done) {
      connection.query(records, done)
    },
    function (done) {
      connection.end(done);
    }
  ], done);
};

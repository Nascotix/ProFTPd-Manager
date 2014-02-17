/*
 *  TEST
 */

'use strict';

// var chai = require('chai');
// var assert = chai.assert;
// var expect = chai.expect;
var request = require('supertest');

var app = require('../app')({
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
});

describe('GET /users', function () {
  it('Should return all users in json', function (done) {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });

  it('Should return all users in html', function (done) {
    request(app)
      .get('/users')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});

describe('GET /groups', function () {
  it('Should return all groups in html', function (done) {
    request(app)
      .get('/groups')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('Should return all groups in json', function (done) {
    request(app)
      .get('/groups')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function (err) {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});

describe('POST /groups', function () {
  it('Should be 200 OK', function (done) {
    request(app)
      .post('/groups')
      .expect(200, done);
  });
});

// request(app)
//   .get('/users')
//   .set('Accept', 'application/json')
//   .expect('Content-Type', /json/)
//   .expect(200)
//   .end(function(err, res){
//     if (err) throw err;
//   });

// request(app)
//   .get('/groups')
//   .set('Accept', 'text/html')
//   .expect('Content-Type', /html/)
//   .expect(200)
//   .end(function(err, res){
//     if (err) throw err;
//   });


// describe('description', function () {
//   it('description', function (done) {
//     request(app)
//       .expect()
//       .end(function (err, res) {
//         if (err) {
//           return done(err);
//         }

//         res.

//         done()
//       })
//   });
// });

describe('User', function(){
  describe('#save()', function(){
    it('should save without error', function(done){
      var user = new User('Luna');
      user.save(function(err){
        if (err) throw err;
        done();
      });
    });
  });
});
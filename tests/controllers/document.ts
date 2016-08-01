import * as app from "../../app";
import * as request from "supertest";
import * as should from "should";

describe('controllers', function(){
    describe('echo', function() {
        it('should accept null parameters', function(done) {
            request(app.server)
              .get('/echo')
              .expect(200)
              .end(function(err, res) {
                should.not.exist(err);
                should.not.exist(res.body.message);
                res.body.should.be.empty();
                done();
            });
        });

        it('should accept null parameters with trailing slash', function(done) {
            request(app.server)
              .get('/echo/')
              .expect(200)
              .end(function(err, res) {
                should.not.exist(err);
                should.not.exist(res.body.message);
                res.body.should.be.empty();
                done();
            });
        });

        it('should echo back message', function(done){
            request(app.server)
              .get('/echo/hello')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                should.not.exist(err);
                res.body.message.should.equal('hello');
                done();
            });
        });
    });
});
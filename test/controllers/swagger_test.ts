import * as app from "../../app";
import * as request from "supertest";
import * as should from "should";

describe('controllers', function () {
    describe('swagger', function () {
        describe('get', function () {
            it('should return 200', function (done) {
                request(app.server)
                    .get('/swagger')
                    .expect(200);
                done();
            });
            it('should have hostname as the host', function (done) {
                request(app.server)
                    .get('/swagger')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.host.should.not.equal('<host>');
                        done();
                    });

            });
        });
    });
});
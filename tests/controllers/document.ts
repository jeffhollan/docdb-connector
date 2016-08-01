import * as app from "../../app";
import * as request from "supertest";
import * as should from "should";
import * as strings from "../../tools/resources/strings"

describe('controllers', function () {
    describe('document', function () {
        describe('post', function () {
            describe('validation', function () {
                it('should not accept any path parameters', function (done) {
                    request(app.server)
                        .post('/docs/1234')
                        .expect(404);
                    done();
                });

                it('should accept a trailing slash', function (done) {
                    request(app.server)
                        .post('/docs/')
                        .expect(400)
                        .end(function (err, res) {
                            done();
                        });

                });

                it('should require masterkey', function (done) {
                    process.env.masterkey = '';
                    request(app.server)
                        .post('/docs')
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.equal(strings.err_missing_master_key);
                            done();
                        });

                });

                it('should require x-ms-dbs header', function (done) {

                    request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', '1234567890')
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.equal(strings.err_missing_dbs_header);
                            done();
                        });

                });

                it('should require x-ms-colls header', function (done) {
                    process.env.masterkey = '';
                    request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', '1234567890')
                        .set('x-ms-dbs', 'testingDB')
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.equal(strings.err_missing_colls_header);
                            done();
                        });

                });

                it('should require valid JSON Body', function (done) {
                    this.slow(500);
                    let test_string = "some string";
                    process.env.masterkey = '';
                    request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', '1234567890')
                        .set('x-ms-dbs', 'testingDB')
                        .set('x-ms-colls', 'testingColls')
                        .send(test_string)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.equal(strings.err_invalid_json_body(test_string));
                            test_array_request;
                        });

                    let test_array = ["some", "array"];
                    const test_array_request = request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', '1234567890')
                        .set('x-ms-dbs', 'testingDB')
                        .set('x-ms-colls', 'testingColls')
                        .send(test_array)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.equal(strings.err_invalid_json_body(test_array));
                            test_object_request;
                        });

                    let test_valid_object = { "id": "someObject" };
                    const test_object_request = request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', '1234567890')
                        .set('x-ms-dbs', 'testingDB')
                        .set('x-ms-colls', 'testingColls')
                        .send(test_valid_object)
                        .expect(400)
                        .end(function (err, res) {
                            should.exist(err);
                            done();
                        });
                });
            });

            describe('create doc', function(){
                
            });
        });
    });
});
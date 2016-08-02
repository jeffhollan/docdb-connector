import * as app from "../../app";
import * as request from "supertest";
import * as should from "should";
import * as strings from "../../resources/strings";
import * as resources from "../resources";
import * as nock from "nock";

const configureNock = function () {
    nock('https://test.documents.azure.com')
      .post(/docs$/)
      .reply(201, resources.sample_create_doc_response);
}

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

                it('should require x-ms-account header', function (done) {
                    process.env.masterkey = '';
                    request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', '1234567890')
                        .set('x-ms-dbs', 'testingDB')
                        .set('x-ms-colls', 'testingColls')
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.equal(strings.err_missing_account_header);
                            done();
                        });

                });

                it('should require valid JSON Body', function (done) {

                    configureNock();
                    this.slow(1500);
                    let test_string = "some string";
                    process.env.masterkey = '';
                    request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', '1234567890')
                        .set('x-ms-dbs', 'testingDB')
                        .set('x-ms-colls', 'testingColls')
                        .set('x-ms-account', 'test')
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
                        .set('x-ms-account', 'test')
                        .send(test_array)
                        .expect(400)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.should.equal(strings.err_invalid_json_body(test_array));
                            // done();
                            test_object_request;
                        });

                    let test_valid_object = { "id": "test-valid-object" };
                    const test_object_request = request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', '1234567890')
                        .set('x-ms-dbs', 'testingDB')
                        .set('x-ms-colls', 'testingColls')
                        .set('x-ms-account', 'test')
                        .send(test_valid_object)
                        .expect(201)
                        .end(function (err, res) {
                            should.not.exist(err);
                            done();
                        });
                });
            });

            describe('create doc', function () {

                configureNock();
                let test_input = { "id": "test-create-doc" }
                it('should return 201', function (done) {
                    request(app.server)
                        .post('/docs')
                        .set('x-ms-masterkey', 'testing-create')
                        .set('x-ms-dbs', 'testingDB')
                        .set('x-ms-colls', 'testingColls')
                        .set('x-ms-account', 'test')
                        .send(test_input)
                        .expect(201)
                        .end(function (err, res) {
                            should.not.exist(err);
                            res.body.id.should.equal('AndersenFamily');
                            done();
                        });
                })
            });
        });
    });
});


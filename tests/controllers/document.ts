import * as app from "../../app";
import * as request from "supertest";
import * as should from "should";
import * as strings from "../../resources/strings";
import * as resources from "../resources";
import * as nock from "nock";

describe('controllers', function () {
    describe('document', function () {
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
        });
        describe('post', function () {
            it('should require valid JSON Body', function (done) {

                configureNock();
                this.slow(1500);
                let test_string = "some string";
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
            it('should return 201', function (done) {
                configureNock();
                let test_input = { "id": "test-create-doc" }
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
            });
        });
        describe('get', function () {
            it('should not allow multiple paths', function(done){
                request(app.server)
                    .get('/docs/12345/abc')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test')
                    .expect(404)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });

            it('should require id path', function(done){
                request(app.server)
                    .get('/docs/')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test')
                    .expect(405)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });

            it('should return 200', function(done){
                configureNock();
                request(app.server)
                    .get('/docs/test')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.id.should.equal('SalesOrder1');
                        done();
                    });
            });
        });
    });
});


function configureNock() {
    nock('https://test.documents.azure.com')
        .post(/docs$/)
        .reply(201, resources.sample_create_doc_response);
    
    nock('https://test.documents.azure.com')
        .get(/docs\/test$/)
        .reply(200, resources.sample_get_doc_response);
}
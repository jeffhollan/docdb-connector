import * as app from "../app";
import * as request from "supertest";
import * as should from "should";
import * as strings from "../resources/strings";
import * as resources from "./resources";
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
                delete process.env.masterkey;
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

            it('should allow masterkey from env variable', function (done) {
                configureNock();
                let test_input = { "id": "test-create-doc" }
                process.env.masterkey = 'testing-create';
                request(app.server)
                    .post('/docs')
                    // .set('x-ms-masterkey', 'testing-create')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test')
                    .send(test_input)
                    .expect(201)
                    .end(function (err, res) {
                        should.not.exist(err);
                        should.exist(res.header['x-ms-doc-id']);
                        res.body.id.should.equal('AndersenFamily');
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
                        should.exist(res.header['x-ms-doc-id']);
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
                        should.exist(res.header['x-ms-doc-id']);
                        res.body.id.should.equal('SalesOrder1');
                        done();
                    });
            });
        });

         describe('delete', function () {
            it('should return 204', function(done){
                configureNock();
                request(app.server)
                    .del('/docs/test')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test')
                    .expect(204)
                    .end(function (err, res) {
                        should.not.exist(err);
                        res.body.should.be.empty();
                        done();
                    });
            });
        });

        describe('put', function () {
            it('should return 204', function(done){
                configureNock();
                request(app.server)
                    .put('/docs/test')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test')
                    .expect(200)
                    .end(function (err, res) {
                        should.not.exist(err);
                        should.exist(res.header['x-ms-doc-id']);
                        res.body.id.should.equal('_SalesOrder5');
                        done();
                    });
            });
        });

        describe('upsert', function () {
            it('should return 201', function(done){
                configureNock();
                request(app.server)
                    .put('/docs')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test')
                    .expect(201)
                    .end(function (err, res) {
                        should.not.exist(err);
                        should.exist(res.header['x-ms-doc-id']);
                        res.body.id.should.equal('AndersenFamily');
                        done();
                    });
            });
            it('should have upsert headers and method', function(done){
                configureNock();
                request(app.server)
                    .put('/docs')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test-upsert')
                    .expect(201)
                    .end(function (err, res) {
                        should.not.exist(err);
                        should.exist(res.header['x-ms-doc-id']);
                        res.body.id.should.equal('UpsertId');
                        res.body['x-ms-documentdb-is-upsert'].should.equal(true);
                        done();
                    });
            });
        });

        describe('query', function () {
            it('should return 201', function(done){
                configureNock();
                request(app.server)
                    .post('/query/docs')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test-query')
                    .send(resources.sample_query_request)
                    .end(function (err, res) {
                        should.not.exist(err);
                        should.not.exist(res.header['x-ms-doc-id']);
                        res.body.Documents[0].id.should.equal('test-query');
                        done();
                    });
            });
            it('should have query headers', function(done){
                configureNock();
                request(app.server)
                    .post('/query/docs')
                    .set('x-ms-masterkey', '1234567890')
                    .set('x-ms-dbs', 'testingDB')
                    .set('x-ms-colls', 'testingColls')
                    .set('x-ms-account', 'test-query')
                    .send(resources.sample_query_request)
                    .expect(201)
                    .end(function (err, res) {
                        should.not.exist(err);
                        should.not.exist(res.header['x-ms-doc-id']);
                        res.body.Documents[0].id.should.equal('test-query');
                        res.body['isquery'].should.equal(true);
                        res.body['content-type'].should.equal('application/query+json');
                        done();
                    });
            });
        });
    });
});


function configureNock() {
    nock('https://test.documents.azure.com')
        .post(/docs$/)
        .reply(201, resources.sample_post_doc_response);
    
    nock('https://test.documents.azure.com')
        .get(/docs\/test$/)
        .reply(200, resources.sample_get_doc_response);

    nock('https://test.documents.azure.com')
        .delete(/docs\/test$/)
        .reply(204, null);

    nock('https://test.documents.azure.com')
        .put(/docs\/test$/)
        .reply(200, resources.sample_put_doc_response);

    nock('https://test-upsert.documents.azure.com')
        .post(/docs$/)
        .reply(function(uri, requestBody){
            let response = resources.sample_post_doc_response;
            response['id'] = "UpsertId";
            response['x-ms-documentdb-is-upsert'] = this.req.headers['x-ms-documentdb-is-upsert'];
            return [201, response, this.req.headers];
        });

    nock('https://test-query.documents.azure.com')
        .post(/docs$/)
        .reply(function(uri, requestBody){
            let response = resources.sample_query_response;
            response['isquery'] = this.req.headers['x-ms-documentdb-isquery'];
            response['content-type'] = this.req.headers['content-type'];
            return [201, response, {"content-type": "application/json"}];
        });
   
}
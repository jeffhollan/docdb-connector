import * as request from "supertest";
import * as should from "should";
import * as utils from "../resources/utils";
import * as restify from "restify";

const resourceId: string = "/subscriptions/80d4fe69-1234-5678-9123-9250f1c8ab03/resourceGroups/myRG/providers/Microsoft.DocumentDB/databaseAccounts/myDb";
const resourceType: string = "docs";
const masterKey: string = "wzdwMTS70xomt8Xz61Jr1ZgLLrrm4bkv3o2WrqUcPre5eOk0C4GlqXZnT4x9oSBCB0AVcA8b5Eiucbws1TtIpg==";
const date: string = new Date().toUTCString();


describe('resources', function () {
    describe('utils', function () {
        describe('generateAuth', function () {
            it('generates token without date', function (done) {

                let result = utils.getAuthorizationUsingMasterKey("GET", resourceId, resourceType, null, masterKey);

                result.should.startWith('type');
                //Case insensitive
                result.should.equal(utils.getAuthorizationUsingMasterKey("get", resourceId, resourceType.toUpperCase(), null, masterKey));
                done();
            });

            it('generates token with date', function (done) {
                let result = utils.getAuthorizationUsingMasterKey("POST", resourceId, resourceType, date, masterKey);

                result.should.startWith('type');
                //Case insensitive
                result.should.equal(utils.getAuthorizationUsingMasterKey("post", resourceId, resourceType.toUpperCase(), date.toUpperCase(), masterKey));
                done();
            });
        });

        describe('getMasterKey', function () {
            it('should return environment variable', function (done) {
                let req = generateFakeRequest();
                process.env.masterkey = 'envKey';
                let m = utils.getMasterKey(req);
                m.should.equal('envKey');
                done();
            });
            it('should return request header if no environment', function (done) {
                let req = generateFakeRequest();
                delete process.env.masterkey;
                let m = utils.getMasterKey(req);
                m.should.equal('headerKey');
                done();
             });
            it('should return null if neither exists', function (done) { 
                let req = generateFakeRequest();
                req['header'] = function (header) { return null;}
                delete process.env.masterkey;
                let m = utils.getMasterKey(req);
                should.not.exist(m);
                done();
            });
        });
    });
});

function generateFakeRequest(): any {
    return {
        "header": function(header : string) {
            if(header == 'x-ms-masterkey')
                return "headerKey";
        }
    };
}
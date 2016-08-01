import * as request from "supertest";
import * as should from "should";
import * as generator from "../../tools/generateAuth";

const resourceId : string = "/subscriptions/80d4fe69-1234-5678-9123-9250f1c8ab03/resourceGroups/myRG/providers/Microsoft.DocumentDB/databaseAccounts/myDb";
const resourceType : string = "docs";
const masterKey : string = "wzdwMTS70xomt8Xz61Jr1ZgLLrrm4bkv3o2WrqUcPre5eOk0C4GlqXZnT4x9oSBCB0AVcA8b5Eiucbws1TtIpg==";
const date : string = new Date().toUTCString();


describe('tools', function() {
    describe('generateAuth', function(){
        it('generates token without date', function(done){
            
            let result = generator.getAuthorizationUsingMasterKey("GET", resourceId, resourceType, null, masterKey);

            result.should.startWith('type');  
            //Case insensitive
            result.should.equal(generator.getAuthorizationUsingMasterKey("get", resourceId, resourceType.toUpperCase(), null, masterKey));
            done();
        });

        it('generates token with date', function(done){
            let result = generator.getAuthorizationUsingMasterKey("POST", resourceId, resourceType, date, masterKey);

            result.should.startWith('type');  
            //Case insensitive
            result.should.equal(generator.getAuthorizationUsingMasterKey("post", resourceId, resourceType.toUpperCase(), date.toUpperCase(), masterKey));
            done();
        });
    });
});
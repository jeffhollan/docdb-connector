import * as restify from "restify";
import * as docDbClient from "documentdb";
import * as constants from "../tools/constants";
import * as authGenerotor from "../tools/generateAuth";
import * as https from "https";

const date : string = new Date().toUTCString();

export function post(req: restify.Request, res: restify.Response, next: restify.Next) {
        validateRequest(req).then((msg) => {
            const authorization = authGenerotor.getAuthorizationUsingMasterKey("POST", constants.ResourceId, "docs", 
                date, constants.MasterKey);
            
            let options = setOptions(authorization, req.body);
            //Make the outgoing request to docDb
            const outgoing_req = https.request(options, (outgoing_res) => {

                //When a successful response is recieved
                outgoing_res.on('data', (d) => {
                    res.send(outgoing_res.statusCode, JSON.parse(d), outgoing_res.headers);
                });
            });
          //  outgoing_req.write(req.body);
            outgoing_req.end(JSON.stringify(req.body));

            //If the request to docDB fails
            outgoing_req.on('error', (e) => {
                res.send(400, e.toString());
            });
        
            })
        //If validation fails
        .catch((err) => {
            res.send(400, err);
            });
        next();
    };

function validateRequest(req: restify.Request) : Promise<string> {
    let p = new Promise<string>((resolve, reject) => {
        if(typeof req.params.id == 'string' || req.params.id instanceof String)
            if(constants.ResourceId && constants.MasterKey)
                resolve("validated");
            else
                reject(new Error('Missing environment variables: \
                    These should go in your App Settings under `resourceId` and `masterKey`.'));
        else
            reject(new Error("invalid ID type - must be a string"));
    });
    return p;
}

function setOptions(auth: string, post_data) : https.RequestOptions {
    let options : https.RequestOptions = {
        hostname: '<db>.documents.azure.com',
        port: 443,
        path: '/dbs/<db>Dev/colls/test/docs',
        method: 'post',
        headers: {
            Authorization: auth,
            'Content-Type': "application/query",
            'Content-Length': Buffer.byteLength(JSON.stringify(post_data)),
            'x-ms-date': date,
            'x-ms-version': '2015-12-16'

        }
    }
    return options;
}
import * as restify from "restify";
import * as docDbClient from "documentdb";
import * as constants from "../tools/constants";
import * as authGenerator from "../tools/generateAuth";
import * as https from "https";
import * as strings from "../tools/resources/strings"

const date : string = new Date().toUTCString();

export function post(req: restify.Request, res: restify.Response, next: restify.Next) {
        validateRequest(req).then(() => {
            const database = req.headers['x-ms-dbs'];
            const collection = req.headers['x-ms-colls'];
            const masterkey = constants.MasterKey || req.headers['x-ms-masterkey'];
            const authorization = authGenerator.getAuthorizationUsingMasterKey("POST", '/dbs/${database}/colls/${collection}/docs', 'docs', 
                date, masterkey);
            
            let options = setOptions(authorization || req.headers['x-ms-masterkey'], database, collection, req.body);
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

function setOptions(auth: string, database : string, collection : string, post_data) : https.RequestOptions {
    let options : https.RequestOptions = {
        hostname: `jehollan.documents.azure.com`,
        port: 443,
        path: `/dbs/${database}/colls/${collection}/docs`,
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

function validateRequest(req: restify.Request) : Promise<void> {
    let p = new Promise<void>((resolve, reject) => {
        //Check masterkey
        if(!req.headers['x-ms-masterkey']) {
            reject(strings.err_missing_master_key);
        }
        //Check database
        if(!req.headers['x-ms-dbs'])
            reject(strings.err_missing_dbs_header);
        //Check colletion
        if(!req.headers['x-ms-colls'])
            reject(strings.err_missing_colls_header);
        //Check body
        if(typeof req.body == 'string' || Array.isArray(req.body))
            reject(strings.err_invalid_json_body(req.body));
        
        resolve();
            
    });
    return p;
}
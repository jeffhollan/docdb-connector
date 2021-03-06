import * as restify from "restify";
import * as utils from "../resources/utils";
import * as https from "https";
import * as strings from "../resources/strings"
import * as model_docs from "../models/doc";

const date: string = new Date().toUTCString();

/**
 *  POST - create a document
 */
export function post(req: restify.Request, res: restify.Response, next: restify.Next) {
    validateRequest(req, true).then(() => {
        const request_params = generateRequestParams(req);
        const path = `dbs/${request_params.database}/colls/${request_params.collection}`;

        const authorization = utils.getAuthorizationUsingMasterKey(req.method, path, 'docs', date, utils.getMasterKey(req));
        let options = setOptions('/' + path + '/docs', req.method, request_params.account, authorization, req.body);

        if(req.header('x-ms-documentdb-is-upsert'))
            options.headers['x-ms-documentdb-is-upsert'] = true;

        //Make the outgoing request to docDb
        http_request(req, res, options);
    })
        //If validation fails
        .catch((err) => {
            res.send(400, err);
        });
    next();
};

/**
 *  POST - Upsert a document - called from a PUT /docs on client
 */
export function upsert(req: restify.Request, res: restify.Response, next: restify.Next) {
    req.headers['x-ms-documentdb-is-upsert'] = true;
    req.method = 'POST';
    post(req, res, next);
}

/**
 *  GET - get a document by index
 */
export function getOrDel(req: restify.Request, res: restify.Response, next: restify.Next) {
    validateRequest(req, false).then(() => {
        const request_params = generateRequestParams(req);
        const path = `dbs/${request_params.database}/colls/${request_params.collection}/docs/${req.params.id}`;
        const authorization = utils.getAuthorizationUsingMasterKey(req.method, path, 'docs', date, utils.getMasterKey(req));
        const options = setOptions('/' + path, req.method, request_params.account, authorization);
        // Make the outgoing reqest to GET doc
        http_request(req, res, options);

    }).catch((err) => {
        res.send(400, err);
    });
    next();
}

/**
 *  PUT - replace a document by index
 */
export function put(req: restify.Request, res: restify.Response, next: restify.Next) {
    validateRequest(req, true).then(() => {
        const request_params = generateRequestParams(req);
        const path = `dbs/${request_params.database}/colls/${request_params.collection}/docs/${req.params.id}`;
        const authorization = utils.getAuthorizationUsingMasterKey(req.method, path, 'docs', date, utils.getMasterKey(req));
        const options = setOptions('/' + path, req.method, request_params.account, authorization, req.body);
        //Make the outgoing request to PUT doc
        http_request(req, res, options);
    })
        //If validation fails
        .catch((err) => {
            res.send(400, err);
        });
    next();
};

/**
 *  POST - query for documents - client calls via POST on /query/docs
 */
export function query(req: restify.Request, res: restify.Response, next: restify.Next) {
    validateRequest(req, true)
    .then(()=> {
        const request_params = generateRequestParams(req);
        const path = `dbs/${request_params.database}/colls/${request_params.collection}`;
        const authorization = utils.getAuthorizationUsingMasterKey(req.method, path, 'docs', date, utils.getMasterKey(req));
        const options = setOptions('/' + path + '/docs', req.method, request_params.account, authorization, req.body);
        options.headers['x-ms-documentdb-isquery'] = true;
        options.headers['Content-Type'] = "application/query+json";
        // Make the outgoing reqest to POST query
        http_request(req, res, options);
    })
    .catch((err) => {
        res.send(400, err);
    });
    next();
}

function http_request(req, res, options) {
    const outgoing_req = https.request(options, (outgoing_res) => {
        
        let data = null;
        outgoing_res.setEncoding('utf8');

        // When a successful response is recieved
        outgoing_res.on('data', (d) => {
           data = JSON.parse(d);
        });
        outgoing_res.on('end', () => {
            let res_headers = {};
            if(data && data['id']) {
                res_headers['x-ms-doc-id'] = data['id'];
            }
            res.send(outgoing_res.statusCode, data, res_headers );
        })
    });
    outgoing_req.end(JSON.stringify(req.body));
    //If the request to docDB fails
    outgoing_req.on('error', (e) => {
        res.send(400, e.toString());
    });
}


// setting options for HTTPS request
function setOptions(path: string, method: string, account: string, auth: string, post_data?: Object): https.RequestOptions {
    let options: https.RequestOptions = {
        hostname: `${account}.documents.azure.com`,
        port: 443,
        path: path,
        method: method,
        headers: {
            'Authorization': auth,
            'x-ms-date': date,
            'x-ms-version': '2015-12-16'
        }
    }
    if (post_data) {
        options.headers['Content-Type'] = "application/json";
        options.headers['Content-Length'] = Buffer.byteLength(JSON.stringify(post_data));
    }
    return options;
}

function validateRequest(req: restify.Request, hasBody: boolean): Promise<void> {
    let p = new Promise<void>((resolve, reject) => {
        //Check masterkey
        if (!utils.getMasterKey(req)) {
            reject(strings.err_missing_master_key);
        }
        //Check database
        if (!req.header('x-ms-dbs'))
            reject(strings.err_missing_dbs_header);
        //Check collection
        if (!req.header('x-ms-colls'))
            reject(strings.err_missing_colls_header);
        //Check account
        if (!req.header('x-ms-account'))
            reject(strings.err_missing_account_header);
        //Check body
        if (hasBody && typeof req.body == 'string' || Array.isArray(req.body))
            reject(strings.err_invalid_json_body(req.body));
        resolve();

    });
    return p;
}

function generateRequestParams(req): model_docs.Document_Request {
    return {
        account: req.headers['x-ms-account'],
        database: req.headers['x-ms-dbs'],
        collection: req.headers['x-ms-colls']
    };
}
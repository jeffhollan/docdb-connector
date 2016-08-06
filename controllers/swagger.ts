import * as restify from "restify";
import * as fs from "fs";
import * as resources from "../resources/constants"

export function get(req: restify.Request, res: restify.Response, next: restify.Next) {
    generateSwagger(req).then((swagger) => {
        res.send(200, swagger);
    }).catch((err) => {
        res.send(err);
    });
    
}

function generateSwagger(req: restify.Request): Promise<string> {
    let promise = new Promise<string>((resolve, reject) => {
        fs.readFile(__dirname + '/../resources/swagger.json', 'utf8', function (err, data) {
            if (err)
                reject(err);

            let swagger = JSON.parse(data);
            swagger['host'] = req.headers.host;
            resolve(swagger);
        });
    });
    return promise;

}
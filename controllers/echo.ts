import * as restify from "restify";

export function get(req: restify.Request, res: restify.Response, next: restify.Next) {
        if(req.params.message) 
            res.send(req.headers);
            
        else
            res.send(200);
        next();
    };
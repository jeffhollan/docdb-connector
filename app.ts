import * as restify from "restify";
import * as routes from "./routes";

//config
export const server = restify.createServer({
    name: 'docdb-connector',
    version: '0.1.0'
});

//parsing settings
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.pre(restify.pre.sanitizePath());
server.use(restify.dateParser());

//call the routes.ts file for available REST API routes
routes.setRoutes(server);

//when running the app will listen locally to port 51234
server.listen(51234, function() {
    console.log('%s listening at %s', server.name, server.url);
})


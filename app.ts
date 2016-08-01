import * as restify from "restify";
import * as routes from "./routes";

//config
export const server = restify.createServer({
    name: 'myAPI',
    version: '1.0.0'
});

//parsing settings
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.pre(restify.pre.sanitizePath());

//call the routes.ts file for available REST API routes
console.log('setting routes...');
routes.setRoutes(server);

//when running the app will listen locally to port 51234
server.listen(51234, function() {
    console.log('%s listening at %s', server.name, server.url);
})


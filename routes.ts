import * as document from "./controllers/document";
import * as swagger from "./controllers/swagger"

export function setRoutes(server) {
    // Document operations
        server.post('/docs', document.post);
        server.post('/docs/', document.post);
        server.get('/docs/:id', document.getOrDel);
        server.del('/docs/:id', document.getOrDel);
        server.put('/docs/:id', document.put);
        server.put('/docs', document.upsert);
        server.put('/docs/', document.upsert);
        server.post('/query/docs', document.query);
        server.post('/query/docs/', document.query);

        server.get('/swagger', swagger.get );

        server.get('/', function(req, res, next) {
            res.send(`Azure DocumentDB Connector - swagger at https://${req.headers['host']}/swagger`);
            next();
        })
    }
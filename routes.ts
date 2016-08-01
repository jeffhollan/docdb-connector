import * as echo from "./controllers/echo";
import * as document from "./controllers/document";

export function setRoutes(server) {
    //ECHO route - respond with whatever was passed in the path
        server.get('/echo/:message', echo.get);
        server.get('/echo', echo.get);
        server.post('/docs', document.post);
        console.log('set routes...');
    }
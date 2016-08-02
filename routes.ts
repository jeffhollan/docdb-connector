import * as document from "./controllers/document";

export function setRoutes(server) {
        server.post('/docs', document.post);
        server.post('/docs/', document.post);
    }
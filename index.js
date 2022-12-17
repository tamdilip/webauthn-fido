const http = require('http');
const requestListener = require('./api/listener');

const SERVER_PORT = process.env.PORT || 3000;

const server = http.createServer(requestListener);
server.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT} : http://localhost:${SERVER_PORT}`);
});
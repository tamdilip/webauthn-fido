const http = require('http');
const { SERVER_PORT } = require('./config/env');
const { requestListener } = require('./router/listener');

const server = http.createServer(requestListener);
server.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT} : http://localhost:${SERVER_PORT}`);
});
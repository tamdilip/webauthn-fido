
const urlParser = require('url');
const staticResources = require('./static');
const deleteUsers = require('./delete-users');
const loginRequest = require('./login-request');
const registerRequest = require('./register-request');
const registerResponse = require('./register-response');

const requestListener = async (req, res) => {
    const urlParsed = urlParser.parse(req.url, true);
    const { pathname } = urlParsed;
    console.log(`Incoming request: ${req.url}`);

    if (pathname === '/register-request') registerRequest(req, res);
    else if (pathname === '/register-response') registerResponse(req, res);
    else if (pathname === '/login-request') loginRequest(req, res);
    else if (pathname === '/delete-users') deleteUsers(req, res);
    else staticResources(req, res)
};

module.exports = { requestListener };

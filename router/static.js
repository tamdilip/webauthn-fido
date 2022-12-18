const fs = require('fs');
const path = require('path');
const urlParser = require('url');
const { getContentType } = require('../utils/mime');

const uiRoutes = {
    '/': '/index.html'
};

const handler = async (req, res) => {
    const urlParsed = urlParser.parse(req.url, true);
    const { pathname } = urlParsed;

    fs.promises.readFile(path.join(__dirname, '..', 'views', `${uiRoutes[pathname] || pathname}`))
        .then(html => {
            res.writeHead(200, { 'Content-Type': getContentType(pathname) });
            res.end(html);
        }).catch((err) => {
            console.log(err);
            res.writeHead(400);
            res.end('Invalid request !!');
        });
};

module.exports = handler;
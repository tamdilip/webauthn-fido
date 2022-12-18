const fs = require('fs');
const http = require('http');
const path = require('path');
const urlParser = require('url');

const SERVER_PORT = process.env.PORT || 3000;

const getChallenge = (key = `${new Date().getTime()}`) => Uint8Array.from(key, c => c.charCodeAt(0));

const getContentType = (filePath) => {
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm',
    };
    return mimeTypes[extname] || 'text/html';
};

const uiRoutes = {
    '/': '/index.html'
};

let users = {
    test: true
};

const getReqBody = req => new Promise(res => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        res(JSON.parse(body));
    });
});



const requestListener = async (req, res) => {
    const urlParsed = urlParser.parse(req.url, true);
    const { pathname } = urlParsed;
    console.log(`Incoming request: ${req.url}`);

    if (pathname === '/register-request' && req.method === 'POST') {

        const { username } = await getReqBody(req);

        let response = {};
        if (users[username]) {
            response = { status: 409, body: JSON.stringify({ message: 'User already exists !!' }) };
        } else {
            const AUTH_TIMEOUT = 60000;
            const ATTESTATION = 'direct';
            const KEY_TYPE = 'public-key';
            const AUTH_ATTACH = 'platform';
            const APP_HOST = req.headers.host;
            const APP_NAME = 'WebAuthn FIDO';

            const publicKeyCredentialCreationOptions = {
                user: {
                    name: username,
                    displayName: username,
                    id: getChallenge(username)
                },
                timeout: AUTH_TIMEOUT,
                attestation: ATTESTATION,
                challenge: getChallenge(),
                rp: { id: APP_HOST, name: APP_NAME },
                pubKeyCredParams: [{ alg: -7, type: KEY_TYPE }],
                authenticatorSelection: { authenticatorAttachment: AUTH_ATTACH }
            };

            response = { status: 200, body: JSON.stringify(publicKeyCredentialCreationOptions) };
        }

        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(response.body);
    } else {
        fs.promises.readFile(__dirname + `/views${uiRoutes[pathname] || pathname}`)
            .then(html => {
                res.writeHead(200, { 'Content-Type': getContentType(pathname) });
                res.end(html);
            }).catch(() => {
                res.writeHead(400);
                res.end('Invalid request !!');
            });
    }
};

const server = http.createServer(requestListener);
server.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT} : http://localhost:${SERVER_PORT}`);
});
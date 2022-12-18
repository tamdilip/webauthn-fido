
const { findUser } = require('../utils/db');
const { getReqBody } = require('../utils/http');
const { getChallenge } = require('../utils/common');
const { APP_NAME, ATTESTATION, AUTH_ATTACH, AUTH_TIMEOUT, KEY_TYPE } = require('../config/env');

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { username } = await getReqBody(req);
        const userId = findUser(username);

        let response = {};
        if (userId) {
            response = { status: 409, body: JSON.stringify({ message: 'User already exists !!' }) };
        } else {
            const APP_HOST = req.headers.host;
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
    }
};

module.exports = handler;
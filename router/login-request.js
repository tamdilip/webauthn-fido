const { findUser } = require('../utils/db');
const { getReqBody } = require('../utils/http');
const { getChallenge } = require('../utils/common');
const { AUTH_TIMEOUT, KEY_TYPE } = require('../config/env');

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const { username } = await getReqBody(req);
        const userId = findUser(username);

        let response = {};
        if (!userId) {
            response = { status: 400, body: JSON.stringify({ message: `User doesn't exists !!` }) };
        } else {
            const APP_HOST = req.headers.host;

            const credentialRequestOptions = {
                rpId: APP_HOST,
                timeout: AUTH_TIMEOUT,
                challenge: getChallenge(),
                userVerification: 'required',
                allowCredentials: [{ id: userId, type: KEY_TYPE }]
            };
            response = { status: 200, body: JSON.stringify(credentialRequestOptions) };
        }

        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(response.body);
    }
};

module.exports = handler;
const { saveUser } = require('../utils/db');
const { getReqBody } = require('../utils/http');

const handler = async (req, res) => {
    if (req.method === 'POST') {
        const userInfo = await getReqBody(req);
        saveUser(userInfo);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Resgistered successfully !!' }));
    }
};

module.exports = handler;
const { deleteAllUsers } = require('../utils/db');

const handler = async (req, res) => {
    if (req.method === 'GET') {
        deleteAllUsers();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'All users deleted successfully !!' }));
    }
};

module.exports = handler;
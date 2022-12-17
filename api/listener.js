
const path = require('path');
const fs = require('fs').promises;

const requestListener = async (req, res) => {
    const { url } = req;
    console.log(`Incoming request: ${url}`);

    fs.readFile(path.join(__dirname, '..', 'views', 'index.html'))
        .then(html => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        })
        .catch(error => {
            console.error(error);
            res.writeHead(400);
            res.end('Invalid request !!');
        });

};

module.exports = requestListener;

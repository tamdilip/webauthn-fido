const getReqBody = req => new Promise(res => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        res(JSON.parse(body));
    });
});

module.exports = { getReqBody };

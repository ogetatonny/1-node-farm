const fs = require('fs');
const http = require('http');

const server = http.createServer((req, res) => {
    const pathName = req.url;

    if (pathName === '/' || pathName === '/overview') {
        res.end('This is the Overview');
    } else if (pathName === '/product') {
        res.end('This is the PRODUCT');
    } else if (pathName === '/api') {
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-type': 'text/html' });
                res.end('<h1>Internal Server Error</h1>');
                return;
            }
            try {
                const productData = JSON.parse(data);
                console.log(productData);
                res.writeHead(200, { 'Content-type': 'application/json' });
                res.end(data);
            } catch (parseError) {
                res.writeHead(500, { 'Content-type': 'text/html' });
                res.end('<h1>Internal Server Error</h1>');
            }
        });
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});

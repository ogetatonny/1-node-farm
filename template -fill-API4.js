////parsing variables from urls

const fs = require('fs');
const http = require('http');
const url = require('url');

// Function to replace placeholders in the template with actual product data
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    else output = output.replace(/{%NOT_ORGANIC%}/g, '');

    return output;
}

// Read the HTML templates and JSON data
const tempOverview = fs.readFileSync('./templates/template-overview1.html', 'utf-8');
const tempCard = fs.readFileSync('./templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('./templates/template-product1.html', 'utf-8');
const data = fs.readFileSync('./dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

// Create the server
const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    // Product Page
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        const product = dataObj[query.id];
        if (product) {
            const output = replaceTemplate(tempProduct, product);
            res.end(output);
        } else {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>Product not found</h1>');
        }

    // API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data);

    // Not found
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }
});

// Start the server
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});

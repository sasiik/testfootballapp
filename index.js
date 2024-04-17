const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    console.log('Request for ' + req.url + ' by method ' + req.method);

    if (req.method === 'GET') {
        let fileUrl = req.url;
        if (fileUrl === '/') {
            fileUrl = '/index.html';
        }

        const filePath = path.resolve('./public' + fileUrl);
        const fileExt = path.extname(filePath);

        if (!['.html', '.css', '.jpg', '.jpeg', '.png', '.gif'].includes(fileExt)) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            res.end(`<html><body><h1>Error 404: ${fileUrl} not supported</h1></body></html>`);
            return;
        }

        fs.access(filePath, fs.constants.R_OK, (err) => {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/html');
                res.end(`<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`);
                return;
            }

            res.statusCode = 200;
            switch (fileExt) {
                case '.html':
                    res.setHeader('Content-Type', 'text/html');
                    break;
                case '.css':
                    res.setHeader('Content-Type', 'text/css');
                    break;
                case '.jpg':
                case '.jpeg':
                    res.setHeader('Content-Type', 'image/jpeg');
                    break;
                case '.png':
                    res.setHeader('Content-Type', 'image/png');
                    break;
                case '.gif':
                    res.setHeader('Content-Type', 'image/gif');
                    break;
                default:
                    res.setHeader('Content-Type', 'application/octet-stream');
            }

            fs.createReadStream(filePath).pipe(res);
        });
    } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end(`<html><body><h1>Error 404: ${req.method} not supported</h1></body></html>`);
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

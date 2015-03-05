/**
 * Created by le on 05/03/15.
 */

var fs = require('fs');
var join = require('path').join;
var parse = require('url').parse;
var http = require('http');
var root = __dirname;

http.createServer(function (req, res) {
    var path = join(root, parse(req.url).pathname);

    // 1. this is very simple way to realize the file server
    /*
    fs.exists(path, function (exists) {
        if (!exists) {
            res.statusCode = 404;
            res.end();
        } else {
            var stream = fs.createReadStream(path);

            stream.on('data', function (chunk) {
                res.write(chunk);
            });
            stream.on('end', function () {
                res.end();
            });



        }
    });
     */

    //2. the more convient way to realize the file server
    var stream = fs.createReadStream(path);
    fs.stat(path, function (err, stat) {
        if (err) {
            if (err.code == 'ENOENT') {
                res.statusCode = 404;
                res.end('File not found');
            } else {
                res.statusCode = 500;
                res.end('Internal server error');
            }
        } else {
            stream.pipe(res);
            stream.on('error', function (err) {
                res.statusCode = 500;
                res.end('Internal server error');
            });
        }
    });

}).listen(3000);
// Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var comments = [];
var server = http.createServer(function(request, response){
    var urlObj = url.parse(request.url, true);
    var pathname = urlObj.pathname;
    if(pathname === '/'){
        fs.readFile('./index.html', function(err, data){
            if(err){
                console.log(err);
            }else{
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(data);
                response.end();
            }
        });
    }else if(pathname === '/comment'){
        var comment = urlObj.query;
        comments.push(comment);
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write('ok');
        response.end();
    }else if(pathname === '/getComments'){
        var data = qs.parse(urlObj.query);
        var start = parseInt(data.start || 0);
        var count = parseInt(data.count || 5);
        var end = start + count;
        var ret = comments.slice(start, end);
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.write(JSON.stringify(ret));
        response.end();
    }else{
        static(pathname, response);
    }
});
function static(pathname, response){
    var ext = path.extname(pathname);
    ext = ext ? ext.slice(1) : 'unknown';
    fs.readFile(__dirname + pathname, function(err, data){
        if(err){
            response.writeHead(404, {'Content-Type': 'text/plain'});
            response.write('This request URL ' + pathname + ' was not found on this server.');
            response.end();
        }else{
            var contentType = {
                html: 'text/html',
                css: 'text/css',
                js: 'application/javascript',
                json: 'application/json',
                gif: 'image/gif',
                jpg: 'image/jpeg',
                png: 'image/png'
            }[ext];
            response.writeHead(200, {'Content-Type': contentType});
            response.write(data);
            response.end();
        }
    });
}
server.listen(3000);
console.log('Server is running at http://
var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path');


var app = http.createServer(function(req, res){

    var pathname = url.parse(req.url).pathname,
        ext = pathname.substring(pathname.lastIndexOf('.'));
    var mime = '';
    if(pathname === '/favicon.ico'){
        return
    }
    switch(ext){
        case '.html':
            mime = 'text/html';
            break;
        case '.js':
            mime = 'application/x-javascript';
            break;
        default: 
            mime = 'text/plain';
    }

    fs.readFile(path.join(__dirname, pathname), function(err, data){
        if(err) {
            sendError(req, res, err)
            return;
        }

        console.log(pathname);
        res.writeHead(200, {'Content-Type': mime});
        res.end(data);
    })

})

app.listen(3000, function(){
    console.log('Server is running ar port 3000 ====')
})


function sendError(req, res, error, status){
    console.log(error);
    var status = status || 404;
    res.writeHead(status, {'Content-Type': 'text/plain'})
    res.end('出错了');
}
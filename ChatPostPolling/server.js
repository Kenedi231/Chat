var http = require('http');
var fs = require('fs');
var chat = require('./chat');

http.createServer(function(req, res) {
        switch (req.url) {
            case '/':
                sendFile("index.html", res);
                break;

            case '/subscribe':
                chat.subscribe(req, res);
                break;

            case '/publish':
                var body = "";

                req
                    .on('readable', function() {
                        var stream=req.read();
                        if(stream!=null){
                                body+=stream;
                        }
                    })
                    .on('end',function() {
                        try {
                                body = JSON.parse(body);
                        } catch (e) {
                                res.statusCode = 500;
                                res.end("Server error");
                        }
                        chat.publish(body.message);
                        res.end('ok');
                    });
                res.end("ok");
                break;

            default:
                res.statusCode = 404;
                res.end("Page not found");
        }
}).listen(3000);

function sendFile(fileName, res) {
        var fileStream = fs.createReadStream(fileName);
        fileStream
            .on('error', function() {
                    res.statusCode = 500;
                    res.end("Server error");
                    console.log("error");
            })
            .on('open', function() {
                    fileStream.pipe(res);
            });
};

/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.form_accept);
app.get('/users', user.list);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var fs = require('fs');
var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  socket.on('upload', function (data) {
                var name = data.name || anonymous;
                var img = data.data;

                var imgStructure = img.split(',');
                var base64 = imgStructure[1];

                console.log(base64);
                if (!base64) {
                    console.log('fal to parse image');
                }

                fs.writeFile(
                    './public/' + name,
                    new Buffer(base64, 'base64'),
                    function (err) {
                        console.log(err);
                    }
                );
//                socket.emit('notify', {image : data});
  });
});

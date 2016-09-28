var http = require('http');
var https = require('https');

// var connectReq = http.request({ // establishing a tunnel
//   host: 'proxy.ontwikkel.local',
//   port: 8080,
//   method: 'CONNECT',
//   path: 'api.github.com/users:443',
// }).on('connect', function(res, socket, head) {

  // should check res.statusCode here
  var req = https.get({
    host: 'api.github.com/users',
    socket: socket, // using a tunnel
    agent: false    // cannot use a default agent
  }, function(res) {
    res.setEncoding('utf8');
    res.on('data', console.log.bind(console));
    res.on('error', console.log.bind(console));

  });
// }).end();

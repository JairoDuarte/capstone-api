'use strict';

import http from 'http';
import socketio from 'socket.io';
import debug from 'debug';
import app from './src/app';


debug('testexp:server');

var port = process.env.PORT || '4000';
app.set('port', port);

var server = http.createServer(app);

server.listen(port, ()=>{
  console.log(`app running on http://localhost:${server.address().port}`);
})

server.on('error', onError);
server.on('listening', onListening);

const io = socketio.listen(server);
app.set('io', io);
io.origins('*:*');
io.set('origins', '*:*');

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');

      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
'use strict';

import http from 'http';
import debug from 'debug';
import socketio from 'socket.io'
//import { log } from 'util';
import app from './src/app';
import User from './src/models/user';

debug('testexp:server');

const port = process.env.PORT || '4000';
app.set('port', port);

const server = http.createServer(app);


server.on('error', onError);
server.on('listening', onListening);
const io = socketio.listen(server);
const redis = app.get('redis');
app.set('io', io)
io.origins('*:*')
io.set('origins', '*:*');
io.on('connection', function (socket) {
  socket.emit('auth', {});
  socket.on('signin', function (data) {
    redis.soid({ app: 'jible', id: data.id }, (err, resp) => {
      if (err) {
        console.error(err);
         
      }
      for (let index = 0; index < resp.sessions.length; index++) {
        const element = resp.sessions[index];
        if (element.d.socketid === socket.id) return null
      }
      redis.create({ app: 'jible', ip: socket.handshake.address, id: data.id, ttl: 3600 * 1, d: { socketid: socket.id } },
        function (err, resp) {
          if (err) {
            console.error(err, resp);
             
          }
        })
    })
  });
  socket.on('location', function (data) {
    User.updateLocation(data.location.longitude, data.location.latitude, data.id);
    console.log('location', data.location);
  });

});



server.listen(port, () => {
  console.log(`app running on http://localhost:${server.address().port}`);
})

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
const express = require('express');
const app = express();
const http = require('http');
const { userInfo } = require('os');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

var listUsers = [];

var messages = [
  {
    to: "paco",
    msg: "hola jeje soy paco"
  }
]

io.on('connection', async (socket) => {

  listUsers.push(socket.id); 
  io.emit('users active',listUsers);

  console.log('a user connected: '+socket.id); 
  
  socket.emit('user', socket.id);

  socket.on("private message", (anotherSocketId, msg) => {
    socket.to(anotherSocketId).emit("private message", socket.id, msg); 
  });

  socket.on('chat message',(msg)=>{ 
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('get messages',(mySocketId, otherSocketId)=>{ 
    //Get messages from otherSocketId 
    console.log({mySocketId,otherSocketId});
    socket.to(mySocketId).emit("get message from", messages);
  }); 

  socket.on('disconnect',()=>{
    const index = listUsers.indexOf(socket.id);
    if (index > -1) { 
      listUsers.splice(index, 1);  
    }
  }); 

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
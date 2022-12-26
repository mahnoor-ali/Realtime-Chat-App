const io = require('socket.io')(8000) // import the Socket.IO library and create a new Socket.IO server that listens for connections on port 8000

const users = {};

io.on('connection', socket => {  // set up an event listener for when a new client connects to the server
  socket.on('new-user-joined', name => {  // set up an event listener for the 'new-user-joined' event, emitted by the client
    users[socket.id] = name;  // add the client's ID and name to the 'users' object
    socket.broadcast.emit('user-joined', name)  // emit a 'user-joined' event to all clients except the one that just connected
  })
})

socket.on('send', message => {  // set up an event listener for the 'send' event, emitted by the client
  socket.broadcast.emit('receive', { message: message, name: users[socket.id] })  // emit a 'receive' event to all clients except the one that just sent the message, along with the message and the sender's name
})

/*
NOTES:
This code sets up a Socket.IO server and listens for connection and message events from the client. 
When a new client connects, the server adds the client's ID and name to the users object and broadcasts a 'user-joined' event to all
other clients. When a client sends a message, the server broadcasts a 'receive' event to all other clients, along with the message and the sender's name.
*/
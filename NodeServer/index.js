// import the Socket.IO library and create a new Socket.IO server that listens for connections on port 8000
const { Server } = require("socket.io"); 

//below code is to allow cross-origin requests from the client (i.e. the web page) to the server (i.e. the Node.js server) 
const io = new Server({
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const users = {};

io.on('connection', socket => {  
  // listen for 'connection' event emitted by the server when a new client connects
    socket.on('new-user-joined', name => {  // set up an event listener for the 'new-user-joined' event, emitted by the client
    users[socket.id] = name;  // add the client's ID and name to the 'users' object
    socket.broadcast.emit('user-joined', name)  // emit a 'user-joined' event to all clients except the one that just connected
  })

  socket.on('send', message => {  // set up an event listener for the 'send' event, emitted by the client
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] })  // emit a 'receive' event to all clients except the one that just sent the message, along with the message and the sender's name
  })

  
  socket.on("disconnect", message => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id]; //delete client's record from users object
  });
  })

  io.listen(8000); // listen for connections on port 8000
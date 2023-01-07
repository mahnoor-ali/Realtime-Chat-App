/* includes the Socket.IO client library in a web page.
allows the web page to establish a connection with the Socket.IO server and send and receive events through that connection*/
const socket = io("http://localhost:8000");

// Get DOM elements in respective JS variables
const inputMsg = document.getElementById("typeMsg");
const inputForm = document.getElementById("typing-box");
const messageContainer = document.querySelector(".chat-box"); //container that only have messages of receiver and sender

const userName = prompt("Please enter your name");
socket.emit('new-user-joined', userName); //send 'new-user-joined'event from the client to server

socket.on('user-joined', name => {
 append(`${name} has joined the chat`, "centre");
}) //listen the 'user-joined' event emitted by server, then append the message to chatbox

socket.on('receive', data =>{
  append(`${data.name}: ${data.message}`, "left");
});

socket.on('left', name => {
  append(`${name} left the chat`, "centre");
 }) //listen the 'left' event emitted by server, then append the message to chatbox
 
 
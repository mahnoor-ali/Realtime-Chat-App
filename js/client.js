/* includes the Socket.IO client library in a web page.
allows the web page to establish a connection with the Socket.IO server and send and receive events through that connection*/
const socket = io("http://localhost:8000");

// Get DOM elements in respective JS variables
const inputMsg = document.getElementById("typeMsg");
const inputForm = document.getElementById("typing-box");
const messageContainer = document.querySelector(".chat-box"); //container that only have messages of receiver and sender
var audio = new Audio('tingg.mp3'); //audio file to play when a new user joins or leaves the chat Or a message is received
var today = new Date();
var hours = today.getHours();
var minutes = today.getMinutes();var am_pm = hours >= 12 ? 'PM' : 'AM'; //convert 24 hour format to 12 hour format
hours = hours%12 ? hours : 12; // the hour '0' should be '12'
var time = hours + ':' + minutes + ' ' + am_pm;

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
 
 
inputForm.addEventListener('submit', (e)=>
{
    e.preventDefault(); //prevent the page from reloading
    const message = inputMsg.value; //get the message from input box
    append(`${message}`, "right"); 
    socket.emit('send', message); //send the message to server
    inputMsg.value = ''; //clear the input box
});

function append(message, positionOfMsg)
{
    const joinedMessage = document.createElement('div');
    if(positionOfMsg!="centre") //if the message is of type 'send' or 'receive' 
    {
    joinedMessage.classList.add(positionOfMsg);
    joinedMessage.classList.add("message-container");
    joinedMessage.innerHTML= `<div class="message-container ${positionOfMsg}}">
                              <div class="message-bubble"> ${message} 
                              <p id="time"> ${time} </p>
                              </div>
                              </div>`;
    }
    else //if the message is of type 'user joined' or 'user left'
    { 
      joinedMessage.innerHTML= `<div> ${message} </div>`;
    joinedMessage.id="joined-update"; //add id to the message container to style it differently from other messages (already created in css file)
    }

    messageContainer.append(joinedMessage); //append the message to chatbox container 
    if(positionOfMsg=="left" || positionOfMsg=="centre") //if the message is of type 'user left'
      audio.play();
}
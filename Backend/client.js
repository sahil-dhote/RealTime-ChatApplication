const socket = io('http://localhost:5000')

const form = document.getElementById('sendMsg')
const messageInput = document.getElementById('messageinp')
const messageContainer = document.querySelector('.container')
var audio = new Audio('ting.mp3')


const append = (message,position) =>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if(position == 'left')
    {
        audio.play();
    }
}

form.addEventListener('submit',(e)=>{
    e.preventDefault; //This will stop page from reloading
    const message = messageInput.value;
    append(`You: ${message}`,'right')
    socket.emit('sendMsg',message);
    messageInput.value = '';
})

const userName = prompt("Enter your name"); //This will give alert type box

socket.emit('newUserJoined',userName); //This "newUserJoined" we are using from index.js file and this will emit that function based on "newUserJoined" name


socket.on('user-joined', name=>{
    append(`${name} joined`, 'right');

})

socket.on('receive', data=>{
    append(`${data.name}:${data.message}`, 'left'); //we are taking data.message as we are sending object from index.js
})


socket.on('left', name=>{
    append(`${name} left the chat`, 'left');
})
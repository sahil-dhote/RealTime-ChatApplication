//Here we will handle socket connections


const express = require('express');
const app = express();
const httpServer = require('http').createServer(app)


const io = require('socket.io')(httpServer, {
    cors:{
        origin:"*"
    }
});

const users = {};

//Note: 
//"io.on" is a socket.io instance that listens various socket.io connections for ex- people are joining, people are sending msg,etc. whereas
//"theSocket.on" will be used to define a particular connection
// Names below other than "io.on(connection)", we can keep anything
// We will be defining/using everything such as "newUserJoined","userJoined",etc in client.js

io.on('connection', theSocket=>{ //we are saying when connection comes run the arrow function

    theSocket.on('newUserJoined', name=>{ //So here we are handling when new user joins
        console.log("New user joined",name);
        users[theSocket.id] = name; //Storing there name with unique id in users object. We are using unique id to avoid confusion.
        theSocket.broadcast.emit('user-joined', name) // This will emit others that someone has joined
    });

    theSocket.on('sendMsg', message=>{ //This is for sending message
        console.log("sending msg", message);
        theSocket.broadcast.emit('receive',{message:message, name: users[theSocket.id]}) //This will emit message to others
    });

    theSocket.on('left', (name) => { //so we are writting this because in react we are calling left when user clicks on exit
        console.log(`${name} has left the chat`);
        theSocket.broadcast.emit('left', users[theSocket.id]);
        delete users[theSocket.id];
    });

    theSocket.on('disconnect', message=>{ //So diconnect should be written "disconnect" only 
        console.log("disconnecting", users, users[theSocket.id]);
        // theSocket.broadcast.emit('left', users[theSocket.id])
        // delete users[theSocket.id];
    });

})

app.get("/yo",(res,req)=>{
    req.send("yo");
})

httpServer.listen(5000, () => {
    console.log('listening on *:5000');
  });
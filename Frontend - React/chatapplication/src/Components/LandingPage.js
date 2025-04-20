import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

import './LandingPage.css' //using tailwind here

const socket = io('http://localhost:5000');


function LandingPage()
{
    const [messageFromUs, setMessageFromUs] = useState('');
    const [message, setMessage] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    //for scrolling top to bottom and bottom to top
    const chatMessagesRef = useRef(null);

    useEffect(() => {

        if (loggedIn) {
            socket.emit('newUserJoined', userName);
        }

        socket.on('user-joined', (name) => {
            appendMessage(`${name} joined`, 'bg-gray-300 text-gray-800 rounded-lg p-3 max-w-xs self-start');
        });

        socket.on('receive', (data) => {
            appendMessage(`${data.name}: ${data.message.message}`, 'bg-gray-300 text-gray-800 rounded-lg p-3 max-w-xs self-start');
        });

        socket.on('left', (name) => {
            appendMessage(`${name} left the chat`, 'bg-gray-300 text-gray-800 rounded-lg p-3 max-w-xs self-start');
        });

        return () => {
            socket.off('user-joined');
            socket.off('receive');
            socket.off('left');
        };
    }, [loggedIn, userName]);

    

    const appendMessage = (message,position) =>{
        setMessage((prevMessage)=> [...prevMessage, {message,position}]);
    }

    const handleLogin = (e) => 
    {
        e.preventDefault();

        if (userName.trim()) {
            setLoggedIn(true);
        }
    };

    const handleExitChat = () => {
        socket.emit('left', userName); // Notify others that the user has left
        setLoggedIn(false);
        setMessage([]); // Optional: Clear messages on exit
        setUserName(''); // Optional: Reset username
    };


    const handleSubmit = (e) => 
    {
        e.preventDefault();

        if (messageFromUs.trim()) //trim will remove white spaces
        {
            appendMessage(`You: ${messageFromUs}`, 'bg-blue-500 text-white rounded-lg p-3 max-w-xs self-end');
            socket.emit('sendMsg', { name: userName, message: messageFromUs });
            setMessageFromUs('');
            chatMessagesRef.current.scrollTo({
                top: chatMessagesRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }


    const scrollToTop = () =>{
        if (chatMessagesRef.current) 
        {
            console.log("scrolling to top");
            chatMessagesRef.current.scrollTo({
                top:0,
                behavior: 'smooth'
            });
        }
    };


    const scrollToBottom = () => {
        if (chatMessagesRef.current) {
            console.log("Scrolling to bottom");
            chatMessagesRef.current.scrollTo({
                top: chatMessagesRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    };


    return(
        <div className='container'>
            
            {/*Below h-screen :- This sets the height of the outer div to the full height of the viewport,  
                mt - margin-top - we have added "-" this will be minus as we are moving box at top
            */}
            <div className="flex items-center justify-center h-screen mt-2">
                <div className="box-border h-svh w-1/2 p-4 border-4"> {/* h is height, w is width, p is padding */}

                <h4 className="text-4xl font-bold text-gray-800 mb-4">Chat Application</h4>

                {!loggedIn ? (
                    <form onSubmit={handleLogin} className="flex flex-col space-y-4 mt-4">
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="h-10 w-auto p-2 border-4 rounded"
                        placeholder="Enter your username"
                    />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Login
                    </button>
                </form>
            ) : (
                    <>
                    <div className='flex justify-between items-center mt-4'>
                    <div className="box-content h-4 w-3/4 p-2 border-4 rounded"> 
                        <h3 className="text-xl font-normal text-black-500 mb-2">{userName}</h3>
                    </div>
                    <button 
                        onClick={handleExitChat} 
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Exit Chat
                    </button>
                    </div>

                    <div className="box-border h-80 w-full p-4 border-4 mt-2 flex flex-col space-y-2 overflow-y-auto" ref={chatMessagesRef}>  
                        <div className="our-msg">Sunil: How are you</div>
                        <div className="user-msg">Anil: Fine bro</div>
                        <div className="our-msg">Sunil: How are you</div>
                        <div className="user-msg">Anil: Fine bro</div>
                        <div className="our-msg">Sunil: How are you</div>
                        <div className="user-msg">Anil: Fine bro</div>
                        

                        {message.map((msg, index) => (
                            <div key={index} className={`${msg.position}`}>
                                {msg.message}
                            </div>
                        ))}
                    </div>
                    
                    <div className='mt-4'>
                    <form id="sendMsg" onSubmit={handleSubmit}>
                        <input type="text" id='txt' 
                            value={messageFromUs} 
                            onChange={(e) => { 
                                console.log(e.target.value)
                                setMessageFromUs(e.target.value) 
                            }} 
                            className="h-10 w-5/6 p-2 border-4 rounded" 
                            placeholder="Enter text here">

                        </input>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded">
                            Send
                        </button>
                    </form>
                    </div>
                    <div className='flex items-center justify-center mt-2'>
                        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded mr-2" onClick={scrollToBottom}> 
                            Scroll to Bottom 
                        </button>

                        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded ml-2" onClick={scrollToTop}> 
                            Scroll to Top 
                        </button>
                    </div>
                    </>
                    
            )}
                </div>
                
            </div>
        </div>
    )
}

export default LandingPage;




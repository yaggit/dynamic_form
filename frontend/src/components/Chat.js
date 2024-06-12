import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import * as mdb from 'mdb-ui-kit';


const ENDPOINT = 'http://localhost:5000';

const Chat = () => {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [isRoomActive, setIsRoomActive] = useState(false);
  const [getUsersRoom, setGetUsersRoom] = useState([]);

  const navigate = useNavigate()

  useEffect(() => {

    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
    } else {
      console.log('No token found. User is not authenticated.');
      navigate('/');
    }

    const headers = {
      'Authorization': localStorage.getItem('accessToken')
    }

    if (!isUsernameSet) return;

    const newSocket = io(ENDPOINT);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [isUsernameSet]);

  const handleUsernameInput = (e) => {
    setUsername(e.target.value);
  };

  const handleSetUsername = async () => {
    if (username.trim() !== '') {
      setIsUsernameSet(true);

      const token = localStorage.getItem('accessToken');
      if (token) {
        const decoded = jwtDecode(token);
        const getUsersRoom = await axios.get(`${ENDPOINT}/roomsByUser/${decoded.id}`)
        if (getUsersRoom.data.rooms) {
          setGetUsersRoom(getUsersRoom.data.rooms)
          console.log(getUsersRoom.data.rooms)
        }

      } else {
        console.log('can not access user id')
      }

    }
  };

  const joinRoom = async (roomId) => {
    console.log(roomId)

    if (socket) {
      try {
        const response = await fetch(`${ENDPOINT}/getRoom/${roomId}`);

        const room = await response.json();
        if (room && response.status == 200) {
          socket.emit('joinRoom', roomId);
          setRoomId(roomId);
          setIsRoomActive(true);

          const chatHistory = await fetch(`${ENDPOINT}/chatHistory/${roomId}`);

          chatHistory.json().then((data) => {
            setMessages(data.history)
            console.log(data.history);
          });


          if (chatHistory && chatHistory.status === 200) {
            setMessages(chatHistory.history);
          } else {
            console.log('No chat history found!');
          }
        }

        if (response.status === 404) {
          alert('Room not found');
          return;
        }

      } catch (err) {
        console.error('Error joining room:', err);
        socket.emit('error', { message: 'Failed to join room' });
      }
    }
  };

  const handleCreateRoom = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      const decoded = jwtDecode(token);
      console.log(decoded)
      socket.emit('createRoom', { name: roomId, userId: decoded.id });
    } else {
      console.log('No token found. User is not authenticated.');
      navigate('/');
    }
  };

  const handleSendMessage = async (e) => {
    
    e.preventDefault();

    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('No token found. User is not authenticated.');
      navigate("/")
    }

    const headers = {
      'Authorization': localStorage.getItem('accessToken')
    }

    if (message.trim() !== '' && socket && isRoomActive) {

      setMessages([...messages, { username: 'You', message }]);
      socket.emit('chatMessage', { roomId, message, username });
      await axios.post(`http://localhost:5000/chat`, {
        message: message,
        roomId: roomId,
        userName: username
      })
      setMessage('');
    }
  }

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (msg) => {
        setMessages((prevMessages) => [...prevMessages, msg]);
      });

      socket.on('roomCreated', (room) => {
        joinRoom(room.id);
        setIsRoomActive(true);
      });
    }
  }, [socket]);

  const handleRoomInputChange = (e) => {
    setRoomId(e.target.value);
  };

  return (
    <div className="container mt-5">
      {!isUsernameSet ? (
        <div className="text-center">
          <h1>Enter Your Username</h1>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Enter your username"
            value={username}
            onChange={handleUsernameInput}
          />
          <button className="btn btn-primary" onClick={handleSetUsername}>Set Username</button>
        </div>
      ) : (
        <div>
          <h1 className="text-center mb-4 display-6">
            Chat Here, <span style={{ display: 'inline-block' }}><h1 className="d-inline">{username}</h1></span>
          </h1>

          <div className="row mb-4">
            <div className="col">
              <input
                type="text"
                className="form-control"
                placeholder="Enter room name"
                value={roomId}
                onChange={handleRoomInputChange}
              />
            </div>
            <div className="col-auto">
              <button className="btn btn-success" onClick={handleCreateRoom}>
                Create Room
              </button>
              <button className="btn btn-primary ml-2" onClick={() => joinRoom(roomId)}>Join Room</button>
            </div>


            <div className='col-auto'>
              <h3>Rooms created by you:</h3>
              <ul className="list-group mb-4">
                {getUsersRoom.map((msg, i) => (
                  <li key={i} className="list-group-item">
                    <b>{msg.room_id}:</b> {msg.name}
                  </li>
                ))}

              </ul>
            </div>
          </div>
          {roomId && (
            <div className='row mb-4'>
              <h2>Room: <span className='display-6'>{roomId}</span></h2>
              {Array.isArray(messages) && messages.length > 0 ? (
                <ul className="list-group mb-4">
                  {messages.map((msg, i) => (
                    <li key={i} className="list-group-item">
                      <b>{msg.username}:</b> {msg.message}
                    </li>
                  ))}

                </ul>
              ) : (
                <p>No chat history available.</p>
              )}
              <form className='form-css' onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={!isRoomActive}
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="submit" disabled={!isRoomActive}>Send</button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


export default Chat;


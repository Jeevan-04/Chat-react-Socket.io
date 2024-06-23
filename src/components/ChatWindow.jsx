import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '../styles/ChatWindow.css';

const socket = io('http://localhost:4000');

function ChatWindow() {
  const [jeevanMessage, setJeevanMessage] = useState('');
  const [chaitanyaMessage, setChaitanyaMessage] = useState('');
  const [jeevanMessages, setJeevanMessages] = useState([]);
  const [chaitanyaMessages, setChaitanyaMessages] = useState([]);

  useEffect(() => {
    socket.on('receiveMessage', (message) => {
      if (message.sender === 'jeevan') {
        setChaitanyaMessages((prevMessages) => [...prevMessages, message]);
      } else if (message.sender === 'chaitanya') {
        setJeevanMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  const sendMessage = (sender) => {
    const message = sender === 'jeevan' ? jeevanMessage : chaitanyaMessage;
    if (message.trim() === '') return;

    const newMessage = { sender, text: message };

    if (sender === 'jeevan') {
      setJeevanMessages((prevMessages) => [...prevMessages, newMessage]);
      setJeevanMessage('');
    } else {
      setChaitanyaMessages((prevMessages) => [...prevMessages, newMessage]);
      setChaitanyaMessage('');
    }
    socket.emit('sendMessage', newMessage);
  };

  return (
    <div className="chat-container">
      <div className="chat-box jeevan-box">
        <div className="chat-header">Jeevan</div>
        <div className="messages">
          {jeevanMessages.map((msg, index) => (
            <div key={index} className={`message message-${msg.sender}`}>
              <span className="message-text">{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={jeevanMessage}
            onChange={(e) => setJeevanMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage('jeevan')}
          />
          <button onClick={() => sendMessage('jeevan')}>Send</button>
        </div>
      </div>

      <div className="chat-box chaitanya-box">
        <div className="chat-header">Chaitanya</div>
        <div className="messages">
          {chaitanyaMessages.map((msg, index) => (
            <div key={index} className={`message message-${msg.sender}`}>
              <span className="message-text">{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={chaitanyaMessage}
            onChange={(e) => setChaitanyaMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage('chaitanya')}
          />
          <button onClick={() => sendMessage('chaitanya')}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;

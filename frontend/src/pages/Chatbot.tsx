import React, { useState, useEffect } from 'react';
import axios from '../config/axiosConfig';
import './Chatbot.css';
import Navbar from '../components/Home/Navbar'; // Corrected import path

// Define the message type
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch initial messages with proper typing
    axios.get<Message[]>('/chatbot/messages')
      .then(response => setMessages(response.data))
      .catch(error => console.error('Error fetching messages:', error));
  }, []);

  const handleSendMessage = () => {
    if (input.trim() === '') return; // Do not send empty messages

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput(''); // Clear the input field immediately after adding the user message

    // Post a new message with proper typing
    axios.post<{ text: string }>('/chatbot/message', { message: input })
      .then(response => {
        const botMessage: Message = { id: Date.now(), text: response.data.text, sender: 'bot' };
        setMessages(prevMessages => [...prevMessages, botMessage]);
      })
      .catch(error => console.error('Error sending message:', error));
  };

  return (
    <div className="chatbot-page-container">
      <Navbar />
      <div className="chatbot-content">
        <div className="chatbot-container">
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input-container">
            <input
              type="text"
              className="chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' ? handleSendMessage() : null}
            />
            <button className="chatbot-button" onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

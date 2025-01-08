import React, { useState, useEffect } from 'react';
import axios from '../../config/axiosConfig';
import './Chatbot.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    if (isChatbotOpen) {
      axios
        .get<Message[]>('/chatbot/messages')
        .then((response) => setMessages(response.data))
        .catch((error) => console.error('Error fetching messages:', error));
    }
  }, [isChatbotOpen]);

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, userMessage]);
    setInput('');

    axios
      .post<{ text: string }>('/chatbot/message', { message: input })
      .then((response) => {
        const botMessage: Message = { id: Date.now(), text: response.data.text, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      })
      .catch((error) => console.error('Error sending message:', error));
  };

  return (
    <div className="chatbot-container">
      <button className="chatbot-toggle-button" onClick={() => setIsChatbotOpen(!isChatbotOpen)}>
        <span className="chat-icon">💬</span>
      </button>
      <div className={`chatbot-panel ${isChatbotOpen ? 'open' : ''}`}>
        <div className="chatbot-header">
          <h2>Chat online</h2>
          <button className="close-button" onClick={() => setIsChatbotOpen(false)}>
            ✖
          </button>
        </div>
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
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrie mesajul tau aici"
            onKeyPress={(e) => (e.key === 'Enter' ? handleSendMessage() : null)}
          />
          <button className="chatbot-send-button" onClick={handleSendMessage}>
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

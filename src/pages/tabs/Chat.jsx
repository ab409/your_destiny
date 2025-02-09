import React, { useState } from 'react';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import './Chat.css';

const Chat = ({ assistant, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputText,
      type: 'user'
    };
    
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <LeftOutlined onClick={onBack} />
        <span>{assistant?.name}</span>
        <QuestionCircleOutlined />
      </div>

      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.type === 'user' ? 'user' : 'assistant'}`}
          >
            {message.type === 'assistant' && (
              <img src={assistant.avatar} alt={assistant.name} className="avatar" />
            )}
            <div className="message-content">{message.text}</div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入您的疑惑~"
        />
        <button 
          className="send-button"
          onClick={handleSend}
        >
          发送
        </button>
      </div>
    </div>
  );
};

export default Chat;
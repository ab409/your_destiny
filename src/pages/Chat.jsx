import React, { useState, useEffect, useRef } from 'react';
import { LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'antd';
import { assistants } from '../data/assistants';
import './Chat.css';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isHelpVisible, setIsHelpVisible] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const navigate = useNavigate();
    const { assistantId } = useParams();
    const wsRef = useRef(null);
    
    const assistant = assistants.find(a => a.id === parseInt(assistantId));

    useEffect(() => {
        // 连接 WebSocket
        wsRef.current = new WebSocket('ws://your-server-url/chat');
        
        wsRef.current.onmessage = (event) => {
          const response = JSON.parse(event.data);
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: response.message,
            type: 'assistant'
          }]);
          setIsThinking(false);
        };
    
        return () => {
          if (wsRef.current) {
            wsRef.current.close();
          }
        };
      }, []);

      const handleSend = () => {
        if (!inputText.trim() || isThinking) return;
        
        const userMessage = {
          id: Date.now(),
          text: inputText,
          type: 'user'
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsThinking(true);
    
        // 发送消息到服务器
        wsRef.current.send(JSON.stringify({
          message: inputText,
          assistantId: parseInt(assistantId)
        }));
      };
    

  const handleBack = () => {
    navigate('/#ai');
  };


  if (!assistant) {
    return <div>Assistant not found</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <LeftOutlined onClick={handleBack} />
        <span>{assistant.name}</span>
        <QuestionCircleOutlined onClick={() => setIsHelpVisible(true)} />
      </div>
      <Modal
        title={assistant.name}
        open={isHelpVisible}
        onOk={() => setIsHelpVisible(false)}
        onCancel={() => setIsHelpVisible(false)}
        footer={null}
      >
        <p>{assistant.description}</p>
      </Modal>

      <div className="chat-messages">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.type === 'user' ? 'user' : 'assistant'}`}
          >
            {message.type === 'assistant' ? (
              <img src={assistant.avatar} alt={assistant.name} className="avatar" />
            ) : (
              <div className="user-avatar">我</div>
            )}
            <div className="message-content">{message.text}</div>
          </div>
        ))}
        {isThinking && (
          <div className="message assistant">
            <img src={assistant.avatar} alt={assistant.name} className="avatar" />
            <div className="message-content thinking">思考中...</div>
          </div>
        )}
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
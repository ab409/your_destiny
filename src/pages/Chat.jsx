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

    // 从 localStorage 加载历史记录
    useEffect(() => {
      const savedMessages = localStorage.getItem(`chat_history_${assistantId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }, [assistantId]);

    // 保存消息到 localStorage
    useEffect(() => {
      if (messages.length > 0) {
        localStorage.setItem(`chat_history_${assistantId}`, JSON.stringify(messages));
      }
    }, [messages, assistantId]);

    const handleClearHistory = () => {
      localStorage.removeItem(`chat_history_${assistantId}`);
      setMessages([]);
    };

    useEffect(() => {
        // 连接 WebSocket
        wsRef.current = new WebSocket('ws://1.94.209.176/ws');
        
        wsRef.current.onmessage = (event) => {
          if (event.data === '[DONE]') {
            setIsThinking(false);
          } else {
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage && lastMessage.type === 'assistant') {
                // 更新最后一条消息的内容
                return [
                  ...prev.slice(0, -1),
                  { ...lastMessage, text: lastMessage.text + event.data }
                ];
              } else {
                // 创建新的助手消息
                return [...prev, {
                  id: Date.now(),
                  text: event.data,
                  type: 'assistant'
                }];
              }
            });
          }
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
  
      // 构造对话历史
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.text
      }));

      // 添加当前用户消息
      conversationHistory.push({
        role: 'user',
        content: inputText
      });
  
      wsRef.current.send(JSON.stringify({
        messages: conversationHistory,
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
        <div className="header-right">
          <button className="clear-button" onClick={handleClearHistory}>
            清除历史
          </button>
          <QuestionCircleOutlined onClick={() => setIsHelpVisible(true)} />
        </div>
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
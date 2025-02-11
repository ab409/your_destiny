import React, { useState } from 'react';
import Chat from './Chat';
import { assistants } from '../../data/assistants';
import './AIAssistant.css';
import { useNavigate } from 'react-router-dom';

const AIAssistant = () => {
  // const [selectedAssistant, setSelectedAssistant] = useState(null);
  const navigate = useNavigate();
  
  // if (selectedAssistant) {
  //   return (
  //     <Chat 
  //       assistant={selectedAssistant} 
  //       onBack={() => setSelectedAssistant(null)} 
  //     />
  //   );
  // }

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>AI算一算</h2>
      </div>
      {assistants.map(assistant => (
        <div 
          key={assistant.id} 
          className="assistant-card"
          onClick={() => navigate(`/chat/${assistant.id}`)}
        >
          <div className="assistant-avatar">
            <img src={assistant.avatar} alt={assistant.name} />
          </div>
          <div className="assistant-info">
            <h3>{assistant.name}</h3>
            <p>{assistant.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIAssistant;
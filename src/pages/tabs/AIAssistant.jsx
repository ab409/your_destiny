import React, { useState } from 'react';
import Chat from './Chat';
import './AIAssistant.css';

const AIAssistant = () => {
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  
  const assistants = [
    {
      id: 1,
      name: '百晓生',
      avatar: '/avatars/baixiaosheng.jpeg',
      description: '活泼可爱的万事通，积极热情，世间之事，无其不晓~'
    },
    {
      id: 2,
      name: '古今通',
      avatar: '/avatars/gujintong.png',
      description: '博古通今的沉稳智者，睿智渊博，上知天文下知地理，天下万物无所不知，无所不会~'
    },
    {
      id: 3,
      name: '卦天下',
      avatar: '/avatars/guatianxia.jpeg',
      description: '以易经为依据，通过卦象，解读您的健康、爱情、事业、时运、财运~'
    },
    {
      id: 4,
      name: '佛祖',
      avatar: '/avatars/fozu.jpeg',
      description: '智慧的象征，慈悲的化身，佛祖的教义为您指明了人生的真谛，帮助您解脱烦恼，获得涅槃。佛祖为您解惑~'
    },
    {
      id: 5,
      name: '翻译成【中文】',
      avatar: '/avatars/translate-cn.jpeg',
      description: '将其它语言翻译成中文，支持包括英、日、韩、法、西、俄等100多种语言。'
    },
    {
      id: 6,
      name: '翻译成【英文】',
      avatar: '/avatars/translate-en.jpeg',
      description: '将其它语言翻译成英文，支持包括英、日、韩、法、西、俄等100多种语言。'
    }
  ];

  if (selectedAssistant) {
    return (
      <Chat 
        assistant={selectedAssistant} 
        onBack={() => setSelectedAssistant(null)} 
      />
    );
  }

  return (
    <div className="ai-assistant">
      <div className="ai-header">
        <h2>AI算一算</h2>
      </div>
      {assistants.map(assistant => (
        <div 
          key={assistant.id} 
          className="assistant-card"
          onClick={() => setSelectedAssistant(assistant)}
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
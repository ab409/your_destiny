import React from 'react';
import { RightOutlined } from '@ant-design/icons';
import './YiJing.css';

const YiJing = () => {
  const hexagrams = [
    { id: 1, symbol: '☰', name: '乾', description: '乾为天' },
    { id: 2, symbol: '☷', name: '坤', description: '坤为地' },
    { id: 3, symbol: '☳', name: '屯', description: '水雷屯' },
    { id: 4, symbol: '☵', name: '蒙', description: '山水蒙' },
    { id: 5, symbol: '☵', name: '需', description: '水天需' },
    { id: 6, symbol: '☰', name: '讼', description: '天水讼' },
    { id: 7, symbol: '☵', name: '师', description: '地水师' },
    { id: 8, symbol: '☵', name: '比', description: '水地比' },
  ];

  return (
    <div className="yijing-container">
      <h1>易经</h1>
      <div className="hexagram-list">
        {hexagrams.map(hexagram => (
          <div key={hexagram.id} className="hexagram-item">
            <div className="hexagram-number">{hexagram.id}</div>
            <div className="hexagram-symbol">{hexagram.symbol}</div>
            <div className="hexagram-info">
              <span className="hexagram-name">{hexagram.name}</span>
              <span className="hexagram-description">{hexagram.description}</span>
            </div>
            <RightOutlined />
          </div>
        ))}
      </div>
    </div>
  );
};

export default YiJing;
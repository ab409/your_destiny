import React from 'react';
import './TabBar.css';

const TabBar = ({ items, activeKey, onChange }) => {
  return (
    <div className="tab-bar">
      {items.map(item => (
        <div
          key={item.key}
          className={`tab-item ${activeKey === item.key ? 'active' : ''}`}
          onClick={() => onChange(item.key)}
        >
          {React.cloneElement(item.icon, {
            className: activeKey === item.key ? 'active-icon' : ''
          })}
          <span>{item.title}</span>
        </div>
      ))}
    </div>
  );
};

export default TabBar;
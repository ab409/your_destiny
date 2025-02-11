import React, { useState, useEffect } from 'react';
import { TabBar } from '../components';
import { CalendarOutlined, StarOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import CalendarTab from './tabs/Calendar';
import AIAssistantTab from './tabs/AIAssistant';
import YiJingTab from './tabs/YiJing';
import SettingsTab from './tabs/Settings';
import './Home.css';

const Home = () => {
  const [activeTab, setActiveTab] = useState(() => {
    // 从 URL 锚点获取初始 tab，如果没有则默认为 calendar
    return window.location.hash.slice(1) || 'calendar';
  });

  const tabs = [
    {
      key: 'calendar',
      title: '卦历',
      icon: <CalendarOutlined />,
      component: <CalendarTab />
    },
    {
      key: 'ai',
      title: 'AI助手',
      icon: <StarOutlined />,
      component: <AIAssistantTab />
    },
    {
      key: 'yijing',
      title: '易经',
      icon: <AppstoreOutlined />,
      component: <YiJingTab />
    },
    {
      key: 'settings',
      title: '我的',
      icon: <SettingOutlined />,
      component: <SettingsTab />
    },
  ];

  // 监听 hash 变化
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && tabs.some(tab => tab.key === hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (key) => {
    setActiveTab(key);
    window.location.hash = key;
  };

  const getCurrentComponent = () => {
    return tabs.find(tab => tab.key === activeTab)?.component;
  };

  return (
    <div className="home">
      {getCurrentComponent()}
      {activeTab === 'calendar' && (
        <div className="bottom-buttons">
          <button className="fortune-button">普通卦</button>
          <button className="fortune-button special">三才卦</button>
        </div>
      )}
      <TabBar items={tabs} activeKey={activeTab} onChange={handleTabChange} />
    </div>
  );
};

export default Home;
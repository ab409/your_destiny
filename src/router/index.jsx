import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import CalendarTab from '../pages/tabs/Calendar';
import AIAssistantTab from '../pages/tabs/AIAssistant';
import YiJingTab from '../pages/tabs/YiJing';
import SettingsTab from '../pages/tabs/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    children: [
      {
        path: '/',
        element: <CalendarTab />,
      },
      {
        path: '/calendar',
        element: <CalendarTab />,
      },
      {
        path: '/ai',
        element: <AIAssistantTab />,
      },
      {
        path: '/yijing',
        element: <YiJingTab />,
      },
      {
        path: '/settings',
        element: <SettingsTab />,
      },
    ],
  },
]);
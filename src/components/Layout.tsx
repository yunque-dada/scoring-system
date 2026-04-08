import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Award, BarChart2, Layers } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/groups', icon: Layers, label: '赛事组别' },
    { path: '/students', icon: Users, label: '学生管理' },
    { path: '/scoring', icon: Award, label: '记分系统' },
    { path: '/ranking', icon: BarChart2, label: '组别排行' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边导航栏 */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-6 border-b border-indigo-800">
          <h1 className="text-xl font-bold">记分系统</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-indigo-800 text-white' : 'hover:bg-indigo-800/50'}`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {navItems.find(item => item.path === location.pathname)?.label || '首页'}
          </h2>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Trophy, BarChart2, Layers, Menu, X } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/groups', icon: Layers, label: '赛事组别' },
    { path: '/students', icon: Users, label: '学生管理' },
    { path: '/scoring', icon: Trophy, label: '记分系统' },
    { path: '/ranking', icon: BarChart2, label: '组别排行' },
  ];

  return (
    <div className="flex h-screen">
      {/* 移动端顶部栏 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">记分系统</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 桌面端侧边栏 */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-72 bg-white shadow-md border-r border-gray-200">
        {/* Logo区域 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">记分系统</h1>
              <p className="text-sm text-gray-500">Scoring System</p>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`group relative flex items-center px-5 py-3 rounded-xl transition-all duration-300 overflow-hidden ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    <Icon className={`w-5 h-5 mr-4 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-500'}`} />
                    <span className={`font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <div className="absolute right-0 top-0 bottom-0 w-1 bg-white" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 底部装饰 */}
        <div className="absolute bottom-8 left-6 right-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-indigo-700">准备好了吗？</span>
            </div>
            <p className="text-sm text-gray-600">开始管理你的比赛记分吧！</p>
          </div>
        </div>
      </div>

      {/* 移动端侧边栏 */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-white shadow-lg">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">记分系统</h1>
                  <p className="text-xs text-gray-500">Scoring System</p>
                </div>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`group flex items-center px-5 py-3 rounded-xl transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'hover:bg-gray-100'}`}
                    >
                      <Icon className={`w-5 h-5 mr-4 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-500'}`} />
                      <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="lg:ml-72 flex-1 flex flex-col overflow-hidden">
        {/* 桌面端顶部栏 */}
        <div className="hidden lg:block sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {navItems.find(item => item.path === location.pathname)?.label || '首页'}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {location.pathname === '/' && '查看比赛的整体统计和概览'}
                  {location.pathname === '/groups' && '管理和创建不同的比赛组别'}
                  {location.pathname === '/students' && '管理参赛学生的信息'}
                  {location.pathname === '/scoring' && '为学生进行实时记分'}
                  {location.pathname === '/ranking' && '查看各组别的排名情况'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <span className="font-bold text-white">管</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端标题 */}
        <div className="lg:hidden px-4 py-6 pt-20">
          <h2 className="text-xl font-semibold text-gray-900">
            {navItems.find(item => item.path === location.pathname)?.label || '首页'}
          </h2>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="fade-in">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
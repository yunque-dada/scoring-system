import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Trophy, BarChart2, Layers } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const navItems = [
    { path: '/groups', icon: Layers, label: '赛事组别' },
    { path: '/students', icon: Users, label: '学生管理' },
    { path: '/scoring', icon: Trophy, label: '记分系统' },
    { path: '/ranking', icon: BarChart2, label: '组别排行' },
  ];

  const handleNavClick = useCallback((e: React.MouseEvent, path: string) => {
    if (isNavigating || location.pathname === path) {
      e.preventDefault();
      return;
    }
    setIsNavigating(true);
    setTimeout(() => {
      setIsNavigating(false);
    }, 300);
  }, [isNavigating, location.pathname]);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 桌面端侧边栏 */}
      <div className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 sm:w-72 bg-white shadow-md border-r border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Trophy className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">记分系统</h1>
              <p className="text-xs sm:text-sm text-gray-500">Scoring System</p>
            </div>
          </div>
        </div>

        <nav className="p-3 sm:p-4 flex-1">
          <ul className="space-y-1 sm:space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={(e) => handleNavClick(e, item.path)}
                    className={`group relative flex items-center px-4 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all duration-200 overflow-hidden ${isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' : 'hover:bg-gray-100'}`}
                  >
                    <Icon className={`w-4 sm:w-5 h-4 sm:h-5 mr-3 sm:mr-4 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-indigo-500'}`} />
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
      </div>

      {/* 主内容区域 */}
      <div className="lg:ml-64 sm:lg:ml-72 flex-1 flex flex-col overflow-hidden">
        {/* 桌面端顶部栏 */}
        <div className="hidden lg:block sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {navItems.find(item => item.path === location.pathname)?.label || '首页'}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {location.pathname === '/groups' && '管理和创建不同的比赛组别'}
                  {location.pathname === '/students' && '管理参赛学生的信息'}
                  {location.pathname === '/scoring' && '为学生进行实时记分'}
                  {location.pathname === '/ranking' && '查看各组别的排名情况'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 移动端标题 */}
        <div className="lg:hidden px-4 py-3 pt-4 bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <h2 className="text-lg font-semibold text-gray-900">
            {navItems.find(item => item.path === location.pathname)?.label || '首页'}
          </h2>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto pb-20">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </div>

        {/* 移动端底部导航栏 */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white shadow-lg border-t border-gray-200">
          <div className="flex justify-around items-center h-16">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`flex flex-col items-center justify-center px-3 py-2 transition-all duration-200 ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;

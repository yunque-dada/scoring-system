import React, { useEffect } from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Users, Layers, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { groups, students, scores, fetchGroups, fetchStudents, fetchScores, calculateRankings } = useStore();

  useEffect(() => {
    fetchGroups();
    fetchStudents();
    fetchScores();
  }, []);

  useEffect(() => {
    calculateRankings();
  }, [scores, students, groups]);

  // 统计数据
  const stats = {
    totalGroups: groups.length,
    totalStudents: students.length,
    totalScores: scores.length,
  };

  // 按组别统计学生人数
  const studentsByGroup = groups.map(group => ({
    name: group.name,
    count: students.filter(student => student.group_id === group.id).length
  }));

  const colors = [
    '#6366f1',
    '#8b5cf6',
    '#ec4899',
    '#10b981',
    '#f59e0b',
  ];

  const statCards = [
    {
      title: '赛事组别',
      value: stats.totalGroups,
      icon: Layers,
      color: 'from-indigo-500 to-blue-500',
      description: '个不同组别'
    },
    {
      title: '参赛学生',
      value: stats.totalStudents,
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      description: '名学生参赛'
    },
    {
      title: '已记录分数',
      value: stats.totalScores,
      icon: TrendingUp,
      color: 'from-emerald-500 to-green-500',
      description: '条成绩记录'
    }
  ];

  const quickActions = [
    { title: '创建组别', icon: Layers, path: '/groups', color: 'from-indigo-500 to-blue-500' },
    { title: '添加学生', icon: Users, path: '/students', color: 'from-purple-500 to-pink-500' },
    { title: '开始记分', icon: Trophy, path: '/scoring', color: 'from-amber-500 to-orange-500' },
    { title: '查看排行', icon: TrendingUp, path: '/ranking', color: 'from-emerald-500 to-green-500' },
  ];

  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">欢迎回来！</h1>
                <p className="text-white/80">管理你的比赛记分系统</p>
              </div>
            </div>
            <p className="text-white/90 max-w-2xl">
              这是一个现代化的比赛记分系统，支持多组别管理、学生信息维护、实时记分和排名展示。
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-5xl font-bold">🎯</p>
              <p className="text-white/80 mt-2">准备好比赛了吗？</p>
            </div>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title}
              className="card p-6"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-2">{card.title}</p>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                <span className="text-gray-500 text-sm">{card.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 图表和快速操作 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 图表 */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">学生组别分布</h3>
              <p className="text-sm text-gray-500 mt-1">查看每个组别的学生人数</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByGroup} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <YAxis 
                  stroke="#6b7280"
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {studentsByGroup.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="card p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900">快速操作</h3>
            <p className="text-sm text-gray-500 mt-1">一键开始管理</p>
          </div>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link 
                  key={action.title} 
                  to={action.path}
                  className="group flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 border border-gray-100 hover:border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900">{action.title}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 特色介绍 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mb-6">
            <Layers className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">多组别管理</h3>
          <p className="text-gray-600">轻松创建和管理不同的比赛组别，满足各种比赛需求</p>
        </div>
        <div className="card p-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6">
            <Users className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">学生信息维护</h3>
          <p className="text-gray-600">完整的学生信息管理系统，支持添加、编辑和删除学生</p>
        </div>
        <div className="card p-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6">
            <Trophy className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">实时记分排行</h3>
          <p className="text-gray-600">支持实时记分和动态排名更新，让比赛更加精彩</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
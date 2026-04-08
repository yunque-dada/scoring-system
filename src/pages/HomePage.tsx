import React, { useEffect } from 'react';
import { useStore } from '../store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

  return (
    <div className="space-y-6">
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">赛事组别</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalGroups}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">参赛学生</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">已记录分数</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalScores}</p>
        </div>
      </div>

      {/* 学生分布图表 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">学生组别分布</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studentsByGroup}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3182ce" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <span>创建组别</span>
          </button>
          <button className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <span>添加学生</span>
          </button>
          <button className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <span>开始记分</span>
          </button>
          <button className="bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
            <span>查看排行</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
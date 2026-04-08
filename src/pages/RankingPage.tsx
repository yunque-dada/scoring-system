import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../store';
import { Download } from 'lucide-react';

const RankingPage: React.FC = () => {
  const { groups, students, scores, rankings, calculateRankings } = useStore();
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    calculateRankings();
  }, [scores, students, groups]);

  // 按组别筛选排名
  const filteredRankings = useMemo(() => {
    return selectedGroup
      ? rankings.filter(ranking => ranking.group_id === selectedGroup)
      : rankings;
  }, [selectedGroup, rankings]);

  // 按组别分组
  const rankingsByGroup = useMemo(() => {
    return filteredRankings.reduce((acc, ranking) => {
      if (!acc[ranking.group_id]) {
        acc[ranking.group_id] = [];
      }
      acc[ranking.group_id].push(ranking);
      return acc;
    }, {} as Record<string, typeof filteredRankings>);
  }, [filteredRankings]);

  // 导出排行榜数据
  const handleExport = () => {
    // 模拟导出功能
    alert('导出功能已触发，实际项目中可以实现Excel或PDF导出');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">组别排行</h2>
        <button
          onClick={handleExport}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center w-full sm:w-auto justify-center"
        >
          <Download className="w-4 h-4 mr-2" />
          <span>导出排行榜</span>
        </button>
      </div>

      {/* 筛选器 */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label htmlFor="group-filter" className="text-sm font-medium text-gray-700 w-full sm:w-auto">
            按组别筛选：
          </label>
          <select
            id="group-filter"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-auto"
          >
            <option value="">全部组别</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 排行榜 */}
      <div className="space-y-6">
        {Object.entries(rankingsByGroup).map(([group_id, groupRankings]) => {
          const group = groups.find(g => g.id === group_id);
          if (!group) return null;

          return (
            <div key={group_id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-indigo-600 text-white px-4 sm:px-6 py-3 sm:py-4">
                <h3 className="text-lg font-semibold">{group.name} - 排行榜</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-y-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        排名
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        学生姓名
                      </th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        分数
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-y-gray-200">
                    {(groupRankings as typeof rankings).map((ranking, index) => (
                      <tr key={ranking.student_id} className={index < 3 ? 'bg-yellow-50' : ''}>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ranking.rank}
                        </td>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-900">
                          {ranking.student_name}
                        </td>
                        <td className="px-4 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                          {ranking.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* 无数据提示 */}
        {Object.keys(rankingsByGroup).length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
            <p className="text-gray-500">暂无排名数据</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingPage;
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { Score } from '../types';
import { Save, X } from 'lucide-react';

const ScoringPage: React.FC = () => {
  const { groups, students, scores, fetchGroups, fetchStudents, fetchScores, addScore, updateScore, loading } = useStore();
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchGroups();
    fetchStudents();
    fetchScores();
  }, []);

  const handleGroupChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = e.target.value;
    setSelectedGroup(groupId);
    setSelectedStudent('');
    setScore(0);
  };

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    // 查找该学生的现有分数
    const existingScore = scores.find(s => s.student_id === studentId);
    if (existingScore) {
      setScore(existingScore.score);
    } else {
      setScore(0);
    }
  };

  const handleScoreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScore(parseInt(e.target.value) || 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !selectedStudent) return;

    // 检查是否已存在分数
    const existingScore = scores.find(s => s.student_id === selectedStudent);
    if (existingScore) {
      await updateScore({ ...existingScore, score });
    } else {
      await addScore({ student_id: selectedStudent, group_id: selectedGroup, score });
    }
    // 重置表单
    setSelectedStudent('');
    setScore(0);
  };

  // 按组别筛选学生
  const filteredStudents = selectedGroup
    ? students.filter(student => student.group_id === selectedGroup)
    : [];

  // 按时间倒序排列分数历史
  const sortedScores = [...scores].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <h2 className="text-2xl font-bold text-gray-900">记分系统</h2>

      {/* 记分表单 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">添加/修改分数</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                选择组别
              </label>
              <select
                id="group"
                value={selectedGroup}
                onChange={handleGroupChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">请选择组别</option>
                {groups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-1">
                选择学生
              </label>
              <select
                id="student"
                value={selectedStudent}
                onChange={handleStudentChange}
                disabled={!selectedGroup}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">请选择学生</option>
                {filteredStudents.map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="score" className="block text-sm font-medium text-gray-700 mb-1">
                分数
              </label>
              <input
                type="number"
                id="score"
                value={score || ''}
                onChange={handleScoreChange}
                min="0"
                max="100"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading || !selectedGroup || !selectedStudent}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? '保存中...' : '保存分数'}
            </button>
          </div>
        </form>
      </div>

      {/* 分数历史记录 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">分数历史记录</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  学生姓名
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  组别
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分数
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  更新时间
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedScores.map((scoreItem) => {
                const student = students.find(s => s.id === scoreItem.student_id);
                const group = groups.find(g => g.id === scoreItem.group_id);
                return (
                  <tr key={scoreItem.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student?.name || '未知学生'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {group?.name || '未知组别'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {scoreItem.score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(scoreItem.updated_at).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScoringPage;
import { create } from 'zustand';
import { Group, Student, Score, Ranking } from '../types';
import { supabase } from '../utils/supabase';

interface Store {
  // 状态
  groups: Group[];
  students: Student[];
  scores: Score[];
  rankings: Ranking[];
  loading: boolean;
  error: string | null;

  // 组别相关操作
  fetchGroups: () => Promise<void>;
  createGroup: (group: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateGroup: (group: Group) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;

  // 学生相关操作
  fetchStudents: () => Promise<void>;
  createStudent: (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateStudent: (student: Student) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  // 分数相关操作
  fetchScores: () => Promise<void>;
  addScore: (score: Omit<Score, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateScore: (score: Score) => Promise<void>;

  // 排行相关操作
  calculateRankings: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  // 初始状态
  groups: [],
  students: [],
  scores: [],
  rankings: [],
  loading: false,
  error: null,

  // 组别相关操作
  fetchGroups: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*');
      if (error) throw error;
      set({ groups: data || [] });
    } catch (error) {
      set({ error: '获取组别失败' });
      // 模拟数据
      set({ groups: [
        { id: '1', name: '初中组', description: '初中学生比赛组别', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', name: '高中组', description: '高中学生比赛组别', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', name: '大学组', description: '大学学生比赛组别', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]});
    } finally {
      set({ loading: false });
    }
  },

  createGroup: async (group) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert(group)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        set((state) => ({ groups: [...state.groups, data[0]] }));
      }
    } catch (error) {
      set({ error: '创建组别失败' });
      // 模拟数据
      const newGroup = {
        id: Date.now().toString(),
        ...group,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set((state) => ({ groups: [...state.groups, newGroup] }));
    } finally {
      set({ loading: false });
    }
  },

  updateGroup: async (group) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('groups')
        .update(group)
        .eq('id', group.id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        set((state) => ({
          groups: state.groups.map((g) => g.id === group.id ? data[0] : g)
        }));
      }
    } catch (error) {
      set({ error: '更新组别失败' });
      // 模拟数据
      set((state) => ({
        groups: state.groups.map((g) => g.id === group.id ? { ...g, ...group, updated_at: new Date().toISOString() } : g)
      }));
    } finally {
      set({ loading: false });
    }
  },

  deleteGroup: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);
      if (error) throw error;
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id)
      }));
    } catch (error) {
      set({ error: '删除组别失败' });
      // 模拟数据
      set((state) => ({
        groups: state.groups.filter((g) => g.id !== id)
      }));
    } finally {
      set({ loading: false });
    }
  },

  // 学生相关操作
  fetchStudents: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('group_id', '1');
      if (error) throw error;
      set({ students: data || [] });
    } catch (error) {
      set({ error: '获取学生失败' });
      // 模拟数据
      set({ students: [
        { id: '1', name: '张三', gender: '男', age: 14, group_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', name: '李四', gender: '女', age: 15, group_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', name: '王五', gender: '男', age: 14, group_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', name: '赵六', gender: '女', age: 15, group_id: '2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '5', name: '钱七', gender: '男', age: 16, group_id: '2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '6', name: '孙八', gender: '女', age: 17, group_id: '3', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]});
    } finally {
      set({ loading: false });
    }
  },

  createStudent: async (student) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(student)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        set((state) => ({ students: [...state.students, data[0]] }));
      }
    } catch (error) {
      set({ error: '创建学生失败' });
      // 模拟数据
      const newStudent = {
        id: Date.now().toString(),
        ...student,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set((state) => ({ students: [...state.students, newStudent] }));
    } finally {
      set({ loading: false });
    }
  },

  updateStudent: async (student) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('students')
        .update(student)
        .eq('id', student.id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        set((state) => ({
          students: state.students.map((s) => s.id === student.id ? data[0] : s)
        }));
      }
    } catch (error) {
      set({ error: '更新学生失败' });
      // 模拟数据
      set((state) => ({
        students: state.students.map((s) => s.id === student.id ? { ...s, ...student, updated_at: new Date().toISOString() } : s)
      }));
    } finally {
      set({ loading: false });
    }
  },

  deleteStudent: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      if (error) throw error;
      set((state) => ({
        students: state.students.filter((s) => s.id !== id)
      }));
    } catch (error) {
      set({ error: '删除学生失败' });
      // 模拟数据
      set((state) => ({
        students: state.students.filter((s) => s.id !== id)
      }));
    } finally {
      set({ loading: false });
    }
  },

  // 分数相关操作
  fetchScores: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('scores')
        .select('*');
      if (error) throw error;
      set({ scores: data || [] });
    } catch (error) {
      set({ error: '获取分数失败' });
      // 模拟数据
      set({ scores: [
        { id: '1', student_id: '1', group_id: '1', score: 95, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '2', student_id: '2', group_id: '1', score: 88, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '3', student_id: '3', group_id: '1', score: 92, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '4', student_id: '4', group_id: '2', score: 90, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '5', student_id: '5', group_id: '2', score: 85, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        { id: '6', student_id: '6', group_id: '3', score: 93, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
      ]});
    } finally {
      set({ loading: false });
    }
  },

  addScore: async (score) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('scores')
        .insert(score)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        set((state) => ({ scores: [...state.scores, data[0]] }));
        get().calculateRankings();
      }
    } catch (error) {
      set({ error: '添加分数失败' });
      // 模拟数据
      const newScore = {
        id: Date.now().toString(),
        ...score,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set((state) => ({ scores: [...state.scores, newScore] }));
      get().calculateRankings();
    } finally {
      set({ loading: false });
    }
  },

  updateScore: async (score) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('scores')
        .update(score)
        .eq('id', score.id)
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        set((state) => ({
          scores: state.scores.map((s) => s.id === score.id ? data[0] : s)
        }));
        get().calculateRankings();
      }
    } catch (error) {
      set({ error: '更新分数失败' });
      // 模拟数据
      set((state) => ({
        scores: state.scores.map((s) => s.id === score.id ? { ...s, ...score, updated_at: new Date().toISOString() } : s)
      }));
      get().calculateRankings();
    } finally {
      set({ loading: false });
    }
  },

  // 排行相关操作
  calculateRankings: async () => {
    const { scores, students, groups } = get();
    
    // 按组别分组
    const scoresByGroup = scores.reduce((acc, score) => {
      if (!acc[score.group_id]) {
        acc[score.group_id] = [];
      }
      acc[score.group_id].push(score);
      return acc;
    }, {} as Record<string, Score[]>);

    // 计算每个组别的排名
    const rankings: Ranking[] = [];
    
    Object.entries(scoresByGroup).forEach(([group_id, groupScores]) => {
      // 按分数降序排序
      const sortedScores = groupScores.sort((a, b) => b.score - a.score);
      
      // 添加排名
      sortedScores.forEach((score, index) => {
        const student = students.find(s => s.id === score.student_id);
        const group = groups.find(g => g.id === score.group_id);
        
        if (student && group) {
          rankings.push({
            student_id: score.student_id,
            student_name: student.name,
            group_id: score.group_id,
            group_name: group.name,
            score: score.score,
            rank: index + 1
          });
        }
      });
    });
    
    set({ rankings });
  }
}));

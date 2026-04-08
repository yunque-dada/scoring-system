import { create } from 'zustand';
import { Group, Student, Score, Ranking } from '../types';

// 初始数据
const initialGroups: Group[] = [
  { id: '1', name: '初中组', description: '初中学生比赛组别', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: '高中组', description: '高中学生比赛组别', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: '大学组', description: '大学学生比赛组别', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const initialStudents: Student[] = [
  { id: '1', name: '张三', gender: '男', age: 14, group_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', name: '李四', gender: '女', age: 15, group_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', name: '王五', gender: '男', age: 14, group_id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', name: '赵六', gender: '女', age: 15, group_id: '2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', name: '钱七', gender: '男', age: 16, group_id: '2', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', name: '孙八', gender: '女', age: 17, group_id: '3', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

const initialScores: Score[] = [
  { id: '1', student_id: '1', group_id: '1', score: 95, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '2', student_id: '2', group_id: '1', score: 88, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '3', student_id: '3', group_id: '1', score: 92, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '4', student_id: '4', group_id: '2', score: 90, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '5', student_id: '5', group_id: '2', score: 85, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: '6', student_id: '6', group_id: '3', score: 93, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
];

// localStorage工具函数
const STORAGE_KEYS = {
  GROUPS: 'scoring-system-groups',
  STUDENTS: 'scoring-system-students',
  SCORES: 'scoring-system-scores'
};

const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    console.log(`已保存数据到 ${key}:`, data);
  } catch (e) {
    console.error('保存到localStorage失败:', e);
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    console.log(`从 ${key} 加载数据:`, data);
    if (data) {
      const parsed = JSON.parse(data) as T;
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      console.log('localStorage数据为空或无效，使用默认值');
    }
    return defaultValue;
  } catch (e) {
    console.error('从localStorage加载失败:', e);
    return defaultValue;
  }
};

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
    const groups = loadFromStorage<Group[]>(STORAGE_KEYS.GROUPS, initialGroups);
    set({ groups, loading: false });
  },

  createGroup: async (group) => {
    set({ loading: true, error: null });
    const newGroup = {
      id: Date.now().toString(),
      ...group,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    set((state) => {
      const newGroups = [...state.groups, newGroup];
      saveToStorage(STORAGE_KEYS.GROUPS, newGroups);
      return { groups: newGroups };
    });
    set({ loading: false });
  },

  updateGroup: async (group) => {
    set({ loading: true, error: null });
    set((state) => {
      const newGroups = state.groups.map((g) => 
        g.id === group.id ? { ...g, ...group, updated_at: new Date().toISOString() } : g
      );
      saveToStorage(STORAGE_KEYS.GROUPS, newGroups);
      return { groups: newGroups };
    });
    set({ loading: false });
  },

  deleteGroup: async (id) => {
    set({ loading: true, error: null });
    set((state) => {
      const newGroups = state.groups.filter((g) => g.id !== id);
      saveToStorage(STORAGE_KEYS.GROUPS, newGroups);
      return { groups: newGroups };
    });
    set({ loading: false });
  },

  // 学生相关操作
  fetchStudents: async () => {
    set({ loading: true, error: null });
    const students = loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
    set({ students, loading: false });
  },

  createStudent: async (student) => {
    set({ loading: true, error: null });
    const newStudent = {
      id: Date.now().toString(),
      ...student,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    set((state) => {
      const newStudents = [...state.students, newStudent];
      saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
      return { students: newStudents };
    });
    set({ loading: false });
  },

  updateStudent: async (student) => {
    set({ loading: true, error: null });
    set((state) => {
      const newStudents = state.students.map((s) => 
        s.id === student.id ? { ...s, ...student, updated_at: new Date().toISOString() } : s
      );
      saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
      return { students: newStudents };
    });
    set({ loading: false });
  },

  deleteStudent: async (id) => {
    set({ loading: true, error: null });
    set((state) => {
      const newStudents = state.students.filter((s) => s.id !== id);
      saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
      return { students: newStudents };
    });
    set({ loading: false });
  },

  // 分数相关操作
  fetchScores: async () => {
    set({ loading: true, error: null });
    const scores = loadFromStorage<Score[]>(STORAGE_KEYS.SCORES, initialScores);
    set({ scores, loading: false });
  },

  addScore: async (score) => {
    set({ loading: true, error: null });
    const newScore = {
      id: Date.now().toString(),
      ...score,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    set((state) => {
      const newScores = [...state.scores, newScore];
      saveToStorage(STORAGE_KEYS.SCORES, newScores);
      return { scores: newScores };
    });
    get().calculateRankings();
    set({ loading: false });
  },

  updateScore: async (score) => {
    set({ loading: true, error: null });
    set((state) => {
      const newScores = state.scores.map((s) => 
        s.id === score.id ? { ...s, ...score, updated_at: new Date().toISOString() } : s
      );
      saveToStorage(STORAGE_KEYS.SCORES, newScores);
      return { scores: newScores };
    });
    get().calculateRankings();
    set({ loading: false });
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
      const sortedScores = (groupScores as Score[]).sort((a, b) => b.score - a.score);
      
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

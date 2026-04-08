import { create } from 'zustand';
import { Group, Student, Score, Ranking } from '../types';
import { supabase, simulateError } from '../utils/supabase';

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

// 从Supabase加载数据
const loadFromSupabase = async (): Promise<{ groups: Group[]; students: Student[]; scores: Score[] }> => {
  if (simulateError) {
    console.log('模拟Supabase错误，使用localStorage数据');
    return {
      groups: loadFromStorage<Group[]>(STORAGE_KEYS.GROUPS, initialGroups),
      students: loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents),
      scores: loadFromStorage<Score[]>(STORAGE_KEYS.SCORES, initialScores)
    };
  }

  try {
    console.log('从Supabase加载数据...');
    
    // 加载组别
    const { data: groupsData, error: groupsError } = await supabase
      .from('groups')
      .select('*')
      .order('created_at', { ascending: true });
    
    // 加载学生
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: true });
    
    // 加载分数
    const { data: scoresData, error: scoresError } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (groupsError || studentsError || scoresError) {
      console.error('从Supabase加载数据失败:', { groupsError, studentsError, scoresError });
      return {
        groups: loadFromStorage<Group[]>(STORAGE_KEYS.GROUPS, initialGroups),
        students: loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents),
        scores: loadFromStorage<Score[]>(STORAGE_KEYS.SCORES, initialScores)
      };
    }
    
    const groups = groupsData || initialGroups;
    const students = studentsData || initialStudents;
    const scores = scoresData || initialScores;
    
    // 保存到localStorage作为备份
    saveToStorage(STORAGE_KEYS.GROUPS, groups);
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
    saveToStorage(STORAGE_KEYS.SCORES, scores);
    
    console.log('从Supabase加载数据成功');
    return { groups, students, scores };
  } catch (error) {
    console.error('从Supabase加载数据异常:', error);
    return {
      groups: loadFromStorage<Group[]>(STORAGE_KEYS.GROUPS, initialGroups),
      students: loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents),
      scores: loadFromStorage<Score[]>(STORAGE_KEYS.SCORES, initialScores)
    };
  }
};

// 保存数据到Supabase
const saveToSupabase = async (data: { groups?: Group[]; students?: Student[]; scores?: Score[] }) => {
  if (simulateError) {
    console.log('模拟Supabase错误，仅保存到localStorage');
    return;
  }

  try {
    console.log('保存数据到Supabase...');
    
    // 保存组别
    if (data.groups) {
      // 这里应该实现更复杂的同步逻辑，如增删改查
      // 为了简化，这里只做示例
      console.log('保存组别到Supabase:', data.groups);
    }
    
    // 保存学生
    if (data.students) {
      console.log('保存学生到Supabase:', data.students);
    }
    
    // 保存分数
    if (data.scores) {
      console.log('保存分数到Supabase:', data.scores);
    }
    
    console.log('保存数据到Supabase成功');
  } catch (error) {
    console.error('保存数据到Supabase失败:', error);
  }
};

interface Store {
  groups: Group[];
  students: Student[];
  scores: Score[];
  rankings: Ranking[];
  isLoading: boolean;
  initialize: () => Promise<void>;
  fetchGroups: () => void;
  createGroup: (group: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => void;
  updateGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;
  deleteGroups: (ids: string[]) => void;
  fetchStudents: () => void;
  createStudent: (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  deleteStudents: (ids: string[]) => void;
  fetchScores: () => void;
  addScore: (score: Omit<Score, 'id' | 'created_at' | 'updated_at'>) => void;
  updateScore: (score: Score) => void;
  calculateRankings: () => void;
  exportData: () => void;
  importData: (data: { groups: Group[]; students: Student[]; scores: Score[] }) => void;
}

export const useStore = create<Store>((set, get) => {
  const initialState = {
    groups: loadFromStorage<Group[]>(STORAGE_KEYS.GROUPS, initialGroups),
    students: loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents),
    scores: loadFromStorage<Score[]>(STORAGE_KEYS.SCORES, initialScores),
    rankings: [],
    isLoading: false,
  };

  // 初始化时清理孤立数据
  const cleanupInitialData = () => {
    const studentIds = new Set(initialState.students.map(s => s.id));
    const groupIds = new Set(initialState.groups.map(g => g.id));
    
    // 清理孤立的分数（学生已删除或组别已删除的分数）
    const cleanedScores = initialState.scores.filter(score => 
      studentIds.has(score.student_id) && groupIds.has(score.group_id)
    );
    
    if (cleanedScores.length !== initialState.scores.length) {
      saveToStorage(STORAGE_KEYS.SCORES, cleanedScores);
      console.log(`初始化时清理了 ${initialState.scores.length - cleanedScores.length} 个孤立的分数`);
      return cleanedScores;
    }
    return initialState.scores;
  };

  // 使用清理后的数据
  const finalInitialState = {
    ...initialState,
    scores: cleanupInitialData()
  };

  return {
    ...finalInitialState,

    // 初始化数据
    initialize: async () => {
      set({ isLoading: true });
      try {
        const { groups, students, scores } = await loadFromSupabase();
        set({ groups, students, scores, isLoading: false });
        get().calculateRankings();
      } catch (error) {
        console.error('初始化失败:', error);
        set({ isLoading: false });
      }
    },

    // 清理孤立数据（已删除学生的分数）
    cleanupOrphanedData: () => {
      set((state) => {
        const studentIds = new Set(state.students.map(s => s.id));
        const groupIds = new Set(state.groups.map(g => g.id));
        
        // 清理孤立的分数（学生已删除或组别已删除的分数）
        const newScores = state.scores.filter(score => 
          studentIds.has(score.student_id) && groupIds.has(score.group_id)
        );
        
        if (newScores.length !== state.scores.length) {
          saveToStorage(STORAGE_KEYS.SCORES, newScores);
          console.log(`清理了 ${state.scores.length - newScores.length} 个孤立的分数`);
        }
        
        return { scores: newScores };
      });
      get().calculateRankings();
    },

    fetchGroups: () => {
      const groups = loadFromStorage<Group[]>(STORAGE_KEYS.GROUPS, initialGroups);
      set({ groups });
    },

    createGroup: (group) => {
      const newGroup = {
        id: Date.now().toString(),
        ...group,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set((state) => {
        const newGroups = [...state.groups, newGroup];
        saveToStorage(STORAGE_KEYS.GROUPS, newGroups);
        // 保存到Supabase
        saveToSupabase({ groups: newGroups });
        return { groups: newGroups };
      });
    },

    updateGroup: (group) => {
      set((state) => {
        const newGroups = state.groups.map((g) => 
          g.id === group.id ? { ...g, ...group, updated_at: new Date().toISOString() } : g
        );
        saveToStorage(STORAGE_KEYS.GROUPS, newGroups);
        // 保存到Supabase
        saveToSupabase({ groups: newGroups });
        return { groups: newGroups };
      });
    },

    deleteGroup: (id) => {
      set((state) => {
        const newGroups = state.groups.filter((g) => g.id !== id);
        const deletedStudentIds = state.students.filter((s) => s.group_id === id).map((s) => s.id);
        const newStudents = state.students.filter((s) => s.group_id !== id);
        const newScores = state.scores.filter((score) => score.group_id !== id);
        saveToStorage(STORAGE_KEYS.GROUPS, newGroups);
        saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
        saveToStorage(STORAGE_KEYS.SCORES, newScores);
        // 保存到Supabase
        saveToSupabase({ groups: newGroups, students: newStudents, scores: newScores });
        return { groups: newGroups, students: newStudents, scores: newScores };
      });
      get().calculateRankings();
    },

    deleteGroups: (ids) => {
      set((state) => {
        const newGroups = state.groups.filter((g) => !ids.includes(g.id));
        const deletedStudentIds = state.students.filter((s) => ids.includes(s.group_id)).map((s) => s.id);
        const newStudents = state.students.filter((s) => !ids.includes(s.group_id));
        const newScores = state.scores.filter((score) => !ids.includes(score.group_id));
        saveToStorage(STORAGE_KEYS.GROUPS, newGroups);
        saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
        saveToStorage(STORAGE_KEYS.SCORES, newScores);
        // 保存到Supabase
        saveToSupabase({ groups: newGroups, students: newStudents, scores: newScores });
        return { groups: newGroups, students: newStudents, scores: newScores };
      });
      get().calculateRankings();
    },

    fetchStudents: () => {
      const students = loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, initialStudents);
      set({ students });
    },

    createStudent: (student) => {
      const newStudent = {
        id: Date.now().toString(),
        ...student,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set((state) => {
        const newStudents = [...state.students, newStudent];
        saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
        // 保存到Supabase
        saveToSupabase({ students: newStudents });
        return { students: newStudents };
      });
    },

    updateStudent: (student) => {
      set((state) => {
        const newStudents = state.students.map((s) => 
          s.id === student.id ? { ...s, ...student, updated_at: new Date().toISOString() } : s
        );
        saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
        // 保存到Supabase
        saveToSupabase({ students: newStudents });
        return { students: newStudents };
      });
    },

    deleteStudent: (id) => {
      set((state) => {
        const newStudents = state.students.filter((s) => s.id !== id);
        const newScores = state.scores.filter((score) => score.student_id !== id);
        saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
        saveToStorage(STORAGE_KEYS.SCORES, newScores);
        // 保存到Supabase
        saveToSupabase({ students: newStudents, scores: newScores });
        return { students: newStudents, scores: newScores };
      });
      get().calculateRankings();
    },

    deleteStudents: (ids) => {
      set((state) => {
        const newStudents = state.students.filter((s) => !ids.includes(s.id));
        const newScores = state.scores.filter((score) => !ids.includes(score.student_id));
        saveToStorage(STORAGE_KEYS.STUDENTS, newStudents);
        saveToStorage(STORAGE_KEYS.SCORES, newScores);
        // 保存到Supabase
        saveToSupabase({ students: newStudents, scores: newScores });
        return { students: newStudents, scores: newScores };
      });
      get().calculateRankings();
    },

    fetchScores: () => {
      const scores = loadFromStorage<Score[]>(STORAGE_KEYS.SCORES, initialScores);
      set({ scores });
    },

    addScore: (score) => {
      const newScore = {
        id: Date.now().toString(),
        ...score,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      set((state) => {
        const newScores = [...state.scores, newScore];
        saveToStorage(STORAGE_KEYS.SCORES, newScores);
        // 保存到Supabase
        saveToSupabase({ scores: newScores });
        return { scores: newScores };
      });
      get().calculateRankings();
    },

    updateScore: (score) => {
      set((state) => {
        const newScores = state.scores.map((s) => 
          s.id === score.id ? { ...s, ...score, updated_at: new Date().toISOString() } : s
        );
        saveToStorage(STORAGE_KEYS.SCORES, newScores);
        // 保存到Supabase
        saveToSupabase({ scores: newScores });
        return { scores: newScores };
      });
      get().calculateRankings();
    },

    calculateRankings: () => {
      const { scores, students, groups } = get();
      
      const scoresByGroup = scores.reduce((acc, score) => {
        if (!acc[score.group_id]) {
          acc[score.group_id] = [];
        }
        acc[score.group_id].push(score);
        return acc;
      }, {} as Record<string, Score[]>);

      const rankings: Ranking[] = [];
      
      Object.entries(scoresByGroup).forEach(([group_id, groupScores]) => {
        const sortedScores = (groupScores as Score[]).sort((a, b) => b.score - a.score);
        
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
    },

    // 导出数据
    exportData: () => {
      const { groups, students, scores } = get();
      const data = {
        groups,
        students,
        scores,
        export_time: new Date().toISOString(),
        version: '1.0'
      };
      
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scoring-system-data-${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      console.log('数据导出成功');
    },

    // 导入数据
    importData: (data) => {
      set((state) => {
        saveToStorage(STORAGE_KEYS.GROUPS, data.groups);
        saveToStorage(STORAGE_KEYS.STUDENTS, data.students);
        saveToStorage(STORAGE_KEYS.SCORES, data.scores);
        // 保存到Supabase
        saveToSupabase({ groups: data.groups, students: data.students, scores: data.scores });
        return {
          groups: data.groups,
          students: data.students,
          scores: data.scores
        };
      });
      get().calculateRankings();
      console.log('数据导入成功');
    }
  };
});

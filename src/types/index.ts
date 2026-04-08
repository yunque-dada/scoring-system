export interface Group {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  name: string;
  gender: string;
  age: number;
  group_id: string;
  created_at: string;
  updated_at: string;
  group?: Group;
}

export interface Score {
  id: string;
  student_id: string;
  group_id: string;
  score: number;
  created_at: string;
  updated_at: string;
  student?: Student;
  group?: Group;
}

export interface Ranking {
  student_id: string;
  student_name: string;
  group_id: string;
  group_name: string;
  score: number;
  rank: number;
}
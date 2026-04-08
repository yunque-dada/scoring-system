import { createClient } from '@supabase/supabase-js';

// 由于是演示环境，使用模拟数据
// 实际生产环境中应该使用真实的Supabase URL和密钥
const SUPABASE_URL = 'https://example.supabase.co';
const SUPABASE_ANON_KEY = '*********************************************************************************************************************************************************************************************************';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 模拟Supabase错误，确保使用模拟数据
export const simulateError = true;
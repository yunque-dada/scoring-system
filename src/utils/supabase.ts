import { createClient } from '@supabase/supabase-js';

// 由于是演示环境，使用默认的Supabase URL和密钥
// 实际生产环境中应该使用环境变量
const SUPABASE_URL = 'https://example.supabase.co';
const SUPABASE_ANON_KEY = '*********************************************************************************************************************************************************************************************************';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
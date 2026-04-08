// GitHub Gists API 配置
const GITHUB_API_URL = 'https://api.github.com';

// 由于是演示环境，使用模拟数据
// 实际使用时需要设置GitHub Personal Access Token
export const GITHUB_TOKEN = '';

// 模拟GitHub API错误，确保使用模拟数据
export const simulateError = true;

// 数据同步状态
export interface SyncState {
  lastSync: string;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  error: string | null;
}

export const initialSyncState: SyncState = {
  lastSync: '',
  syncStatus: 'idle',
  error: null
};
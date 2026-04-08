import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import GroupsPage from './pages/GroupsPage';
import StudentsPage from './pages/StudentsPage';
import ScoringPage from './pages/ScoringPage';
import RankingPage from './pages/RankingPage';
import { useStore } from './store';

const App: React.FC = () => {
  const { initialize, isLoading } = useStore();

  useEffect(() => {
    // 应用启动时初始化数据
    initialize();
  }, [initialize]);

  return (
    <Router basename="/scoring-system">
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/groups" replace />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/scoring" element={<ScoringPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
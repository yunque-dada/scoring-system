import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GroupsPage from './pages/GroupsPage';
import StudentsPage from './pages/StudentsPage';
import ScoringPage from './pages/ScoringPage';
import RankingPage from './pages/RankingPage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
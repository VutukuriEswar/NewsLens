import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import ArticleView from './pages/ArticleView';
import { Activity } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar glass-panel">
          <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity color="var(--accent-primary)" />
            NewsLens
          </Link>
          <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/article/:id" element={<ArticleView />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

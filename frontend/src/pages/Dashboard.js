import React, { useEffect, useState } from 'react';
import { fetchSavedArticles } from '../api';
import NewsCard from '../components/NewsCard';
import { CategoryChart, TrendChart } from '../components/Charts';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, TrendingUp, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedArticles().then(data => {
      setArticles(data || []);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const filteredArticles = filter === 'All'
    ? articles
    : articles.filter(a => a.category === filter);

  const categories = ['All', ...new Set(articles.map(a => a.category))].filter(Boolean).sort();

  const handleDelete = (id) => {
    setArticles(articles.filter(a => a.id !== id));
  };

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Intelligence Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitoring {articles.length} global signal threads</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end', maxWidth: '60%' }}>
          <Filter size={16} color="var(--accent-primary)" />
          {categories.map(c => (
            <motion.button
              key={c}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(c)}
              style={{
                background: filter === c ? 'var(--accent-primary)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--panel-border)',
                color: filter === c ? 'white' : 'var(--text-secondary)',
                padding: '6px 16px',
                borderRadius: '100px',
                cursor: 'pointer',
                transition: '0.3s',
                fontSize: '0.8rem',
                fontWeight: filter === c ? '600' : '400'
              }}
            >
              {c}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="news-list">
          <AnimatePresence mode="popLayout">
            {filteredArticles.length === 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}>No intelligence signals found for this category.</motion.p>
            ) : (
              filteredArticles.map((article, idx) => (
                <motion.div
                  key={article.id || idx}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
                >
                  <NewsCard article={article} onDelete={handleDelete} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          <section className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(96, 165, 250, 0.2)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <BarChart3 size={18} color="var(--accent-primary)" /> Topic Distribution
            </h3>
            {articles.length > 0 ? <CategoryChart articles={articles} /> : <p>Waiting for data influx...</p>}
          </section>

          <section className="glass-panel" style={{ padding: '2rem', border: '1px solid rgba(192, 132, 252, 0.2)' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
              <TrendingUp size={18} color="var(--accent-secondary)" /> Intelligence Velocity
            </h3>
            {articles.length > 0 ? <TrendChart articles={articles} /> : <p>Monitoring network...</p>}
          </section>

          <div className="glass-panel" style={{ padding: '1.5rem', background: 'var(--accent-gradient)', opacity: 0.9 }}>
            <h4 style={{ color: 'white', marginBottom: '0.5rem' }}>System Status: Active</h4>
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
              AI is currently monitoring and indexing global news feeds with high precision IPTC tagging.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;

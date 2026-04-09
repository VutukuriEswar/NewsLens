import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSavedArticles } from '../api';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FinancialTicker, EventTimeline } from '../components/InteractiveComponents';

const ArticleView = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedArticles().then(data => {
      const found = data.find(a => a.id === id);
      setArticle(found);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;
  if (!article) return <div style={{ textAlign: 'center', marginTop: '4rem' }}><h2>Article Not Found</h2><Link to="/dashboard" className="btn-primary">Back to Dashboard</Link></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> Back to Dashboard
      </Link>

      <div className="dashboard-grid">
        <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className={`tag ${article.category?.toLowerCase().split(' ')[0]}`}>{article.category}</span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {article.date} | {new URL(article.source).hostname}
            </span>
          </div>

          <h1 style={{ fontSize: '2.8rem', lineHeight: 1.1, fontWeight: '800' }}>{article.title}</h1>

          <div style={{ background: 'rgba(59, 130, 246, 0.05)', borderLeft: '4px solid var(--accent-primary)', padding: '1.5rem', borderRadius: '0 12px 12px 0' }}>
            <p style={{ fontStyle: 'italic', color: '#cbd5e1', lineHeight: 1.6, fontSize: '1.1rem', margin: 0 }}>
              "{article.summary}"
            </p>
          </div>

          <div style={{ padding: '1rem 0' }}>
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1.5rem', fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Intelligence Report
            </h4>
            <div style={{ paddingLeft: '0', marginBottom: '2rem' }}>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.9, color: '#f8fafc', whiteSpace: 'pre-line', fontWeight: '400' }}>
                {article.text}
              </p>
            </div>

            {article.raw_text && article.raw_text !== article.text && (
              <details style={{ marginTop: '3rem', cursor: 'pointer', opacity: 0.4 }}>
                <summary style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Show Original Source Fragment</summary>
                <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px' }}>
                  {article.raw_text}...
                </p>
              </details>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <FinancialTicker data={article.financial_data} />
          <EventTimeline events={article.events} />

          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>Source Analysis Complete</p>
            <a href={article.source} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-block', width: '100%', textDecoration: 'none' }}>
              Visit Origin Website
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleView;

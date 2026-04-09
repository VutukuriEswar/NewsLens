import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TrendingUp, Calendar, Hash, Trash2 } from 'lucide-react';
import { deleteArticle } from '../api';

const NewsCard = ({ article, onDelete }) => {
  const handleDeleteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm(`Delete "${article.title}"?`)) {
      try {
        await deleteArticle(article.id);
        onDelete(article.id);
      } catch (err) {
        alert("Failed to delete article.");
      }
    }
  };

  const prob = (article.probability || 1.0) * 100;

  return (
    <motion.div 
      className="glass-panel"
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
      style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', textDecoration: 'none', color: 'inherit', position: 'relative' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className={`tag ${article.category?.toLowerCase()}`}>
          <Hash size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/>
          {article.category} ({prob.toFixed(0)}%)
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={14} /> {article.date}
          </span>
          <motion.button 
            whileHover={{ scale: 1.2, color: 'var(--danger)' }}
            onClick={handleDeleteClick}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>
      
      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', lineHeight: 1.4 }}>{article.title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
        {article.summary || article.text}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--panel-border)' }}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {article.sentiment === 'Positive' && <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: '600' }}>● Positive</span>}
          {article.sentiment === 'Negative' && <span style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '600' }}>● Negative</span>}
          {article.sentiment === 'Neutral' && <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: '600' }}>● Neutral</span>}
          
          {article.financial_data && article.financial_data.length > 0 && (
            <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={14} /> Market Move
            </span>
          )}
        </div>
        
        <Link to={`/article/${article.id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>
          Analyze
        </Link>
      </div>
    </motion.div>
  );
};

export default NewsCard;

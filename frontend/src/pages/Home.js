import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchPipelineData } from '../api';
import { Search, Globe, ChevronRight } from 'lucide-react';

const presetSites = [
  { name: "BBC News", url: "https://www.bbc.com/news" },
  { name: "Reuters", url: "https://www.reuters.com/" },
  { name: "TechCrunch", url: "https://techcrunch.com/" },
  { name: "Yahoo Finance", url: "https://finance.yahoo.com/" }
];

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [loadingText, setLoadingText] = useState('Scraping and analyzing news across the globe...');
  const navigate = useNavigate();

  const handleFetchNews = async (targetUrl) => {
    if (!targetUrl) return;
    setLoading(true);
    setLoadingText(`Crawling and parsing ${new URL(targetUrl).hostname}...`);
    try {
      await fetchPipelineData(targetUrl); 
      navigate('/dashboard'); 
    } catch (error) {
      console.error("Failed to fetch news", error);
      alert("Failed to analyze URL. Is the backend running and OpenRouter key set?");
      setLoading(false);
    }
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if(urlInput.trim()) {
      handleFetchNews(urlInput.trim());
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ width: '100%', maxWidth: '900px' }}
      >
        <motion.div
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <h1 style={{ 
            fontSize: '5rem', 
            fontWeight: 900, 
            marginBottom: '1rem', 
            background: 'var(--accent-gradient)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em',
            lineHeight: 1
          }}>
            Intelligence.<br/>Extracted.
          </h1>
        </motion.div>
        
        <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '1.5rem auto 3.5rem auto', lineHeight: 1.5, fontWeight: '300' }}>
          Deep-dive signal analysis and predictive tagging powered by high-fidelity AI models.
        </p>
        
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }} 
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {loadingText}
            </motion.p>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            style={{ display: 'flex', flexDirection: 'column', gap: '3rem', alignItems: 'center', width: '100%' }}
          >
            
            <motion.form 
              variants={itemVariants}
              onSubmit={handleCustomSubmit} 
              style={{ display: 'flex', width: '100%', maxWidth: '650px', gap: '15px' }}
            >
              <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', flex: 1, borderRadius: '100px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Search size={22} color="var(--accent-primary)" style={{ marginRight: '12px' }} />
                <input 
                  type="url"
                  placeholder="Intercept data from any URL..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  style={{ background: 'transparent', border: 'none', color: 'white', flex: 1, outline: 'none', fontSize: '1.1rem' }}
                  required
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="btn-primary"
                style={{ borderRadius: '100px', padding: '0.75rem 2.5rem', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', fontWeight: 'bold' }}
              >
                Intercept <ChevronRight size={20} />
              </motion.button>
            </motion.form>

            <motion.div 
              variants={itemVariants}
              style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '500px' }}
            >
               <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, var(--panel-border))' }}></div>
               <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.5 }}>Target Frequency</span>
               <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, var(--panel-border))' }}></div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}
            >
              {presetSites.map((site) => (
                <motion.button
                  key={site.name}
                  whileHover={{ scale: 1.05, y: -5, borderColor: 'var(--accent-primary)', backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFetchNews(site.url)}
                  className="glass-panel"
                  style={{ 
                    padding: '1rem 2rem', 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid var(--panel-border)', 
                    color: 'white', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s'
                  }}
                >
                  <Globe size={18} color="var(--accent-primary)" />
                  {site.name}
                </motion.button>
              ))}
            </motion.div>

          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Home;

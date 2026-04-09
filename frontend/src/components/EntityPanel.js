import React from 'react';
import { motion } from 'framer-motion';

const EntityPanel = ({ entities }) => {
  if (!entities || Object.keys(entities).length === 0) return <p>No entities found.</p>;

  const validGroups = Object.keys(entities).filter(key => entities[key].length > 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {validGroups.map(group => (
        <div key={group}>
          <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{group}</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {entities[group].map((ent, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="glass-panel"
                style={{ padding: '4px 10px', fontSize: '0.85rem' }}
              >
                {ent}
              </motion.span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EntityPanel;

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export const FinancialTicker = ({ data }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--success)', overflow: 'hidden' }}>
      <h3 style={{ color: 'var(--success)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp size={20} /> Market Intelligence
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {data.map((fin, idx) => {
          const isUp = fin.change?.toLowerCase().includes('rose') ||
            fin.change?.toLowerCase().includes('jump') ||
            fin.change?.toLowerCase().includes('up') ||
            fin.change?.includes('+');

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                borderLeft: `4px solid ${isUp ? 'var(--success)' : 'var(--danger)'}`
              }}
            >
              <div style={{
                background: isUp ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                padding: '8px',
                borderRadius: '50%'
              }}>
                {isUp ? <ArrowUpRight color="var(--success)" size={18} /> : <ArrowDownRight color="var(--danger)" size={18} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600', fontSize: '1rem' }}>{fin.company}</span>
                  <span style={{
                    color: isUp ? 'var(--success)' : 'var(--danger)',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    {fin.change}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {fin.context || 'Market reaction to breaking news.'}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export const EventTimeline = ({ events }) => {
  if (!events || events.length === 0) return null;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Activity size={20} color="var(--accent-primary)" /> Situation Timeline
      </h3>
      <div style={{ position: 'relative', paddingLeft: '30px' }}>
        <div style={{
          position: 'absolute',
          left: '7.5px',
          top: '0',
          bottom: '0',
          width: '2px',
          background: 'linear-gradient(to bottom, var(--accent-primary), transparent)',
          opacity: 0.3
        }} />

        {events.map((ev, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
            style={{ marginBottom: '2rem', position: 'relative' }}
          >
            <div style={{
              position: 'absolute',
              left: '-22.5px',
              top: '5px',
              width: '15px',
              height: '15px',
              borderRadius: '50%',
              background: ev.importance === 'High' ? 'var(--warning)' : 'var(--accent-primary)',
              boxShadow: `0 0 10px ${ev.importance === 'High' ? 'var(--warning)' : 'var(--accent-primary)'}`,
              zIndex: 1
            }} />

            <div style={{
              background: 'rgba(255,255,255,0.02)',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid var(--panel-border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                  {typeof ev === 'string' ? ev : ev.name}
                </span>
                {ev.importance && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 8px',
                    borderRadius: '100px',
                    background: ev.importance === 'High' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                    color: ev.importance === 'High' ? 'var(--warning)' : 'var(--accent-primary)',
                    border: '1px solid currentColor'
                  }}>
                    {ev.importance} Priority
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {typeof ev === 'string' ? 'Incident detected in news flow.' : ev.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

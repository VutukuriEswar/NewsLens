import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

export const CategoryChart = ({ articles }) => {
  const categoryCounts = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(categoryCounts).map(key => ({
    name: key,
    value: categoryCounts[key]
  }));

  const COLORS = ['#60a5fa', '#c084fc', '#f87171', '#34d399', '#fbbf24', '#f472b6', '#2dd4bf'];

  return (
    <div style={{ height: '300px', width: '100%', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
            itemStyle={{ color: '#fff', fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', opacity: 0.8 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const TrendChart = ({ articles }) => {
  const dailyData = articles.reduce((acc, article) => {
    const date = article.date || 'Unknown';
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(dailyData).sort().map(date => ({
    date,
    volume: dailyData[date]
  }));

  return (
    <div style={{ height: '220px', width: '100%', marginTop: '1rem' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="var(--text-secondary)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="var(--text-secondary)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--panel-bg)', borderRadius: '12px', border: '1px solid var(--panel-border)' }}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke="var(--accent-primary)"
            fillOpacity={1}
            fill="url(#colorVolume)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

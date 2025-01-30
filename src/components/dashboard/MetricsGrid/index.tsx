'use client';

import React from 'react';
import { TrendingUp, Users, Clock, MessageSquare } from 'lucide-react';
import styles from './styles.module.css';

export interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, trend }) => (
  <div className={styles.metricCard}>
    <div className={styles.metricIcon}>{icon}</div>
    <div className={styles.metricContent}>
      <h3>{title}</h3>
      <div className={styles.metricValue}>{value}</div>
      <div className={`${styles.metricChange} ${styles[trend]}`}>
        {change}
      </div>
    </div>
  </div>
);

export const defaultMetrics: MetricCardProps[] = [
  {
    title: 'Taxa de Automação',
    value: '85%',
    change: '+2.5% esta semana',
    icon: <TrendingUp size={24} />,
    trend: 'up',
  },
  {
    title: 'Assistentes Ativos',
    value: '12',
    change: '+3 este mês',
    icon: <Users size={24} />,
    trend: 'up',
  },
  {
    title: 'Tempo de Resposta',
    value: '1.2s',
    change: '-0.3s que ontem',
    icon: <Clock size={24} />,
    trend: 'down',
  },
  {
    title: 'Total de Interações',
    value: '15.420',
    change: '+1.2k hoje',
    icon: <MessageSquare size={24} />,
    trend: 'up',
  },
];

export const MetricsGrid: React.FC<{ metrics?: MetricCardProps[] }> = ({ 
  metrics = defaultMetrics 
}) => (
  <section className={styles.metricsGrid}>
    {metrics.map((metric, index) => (
      <MetricCard key={index} {...metric} />
    ))}
  </section>
);

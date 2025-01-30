'use client';

import React from 'react';
import {
  Search,
  Settings,
  Zap,
  Mic2,
  BarChart2,
  TrendingUp,
  Users,
  Clock,
  MessageSquare
} from 'lucide-react';
import styles from './styles.module.css';

interface MetricCardProps {
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

const QuickActionButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({
  icon,
  label,
  onClick,
}) => (
  <button className={styles.quickActionButton} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </button>
);

export default function DashboardPage() {
  const metrics = [
    {
      title: 'Taxa de Automação',
      value: '85%',
      change: '+2.5% esta semana',
      icon: <TrendingUp size={24} />,
      trend: 'up' as const,
    },
    {
      title: 'Assistentes Ativos',
      value: '12',
      change: '+3 este mês',
      icon: <Users size={24} />,
      trend: 'up' as const,
    },
    {
      title: 'Tempo de Resposta',
      value: '1.2s',
      change: '-0.3s que ontem',
      icon: <Clock size={24} />,
      trend: 'down' as const,
    },
    {
      title: 'Total de Interações',
      value: '15.420',
      change: '+1.2k hoje',
      icon: <MessageSquare size={24} />,
      trend: 'up' as const,
    },
  ];

  const handleQuickAction = (action: string) => {
    console.log(`Ação rápida: ${action}`);
  };

  const quickActions = [
    {
      icon: <Settings size={20} />,
      label: 'Configurar Linhas',
      onClick: () => handleQuickAction('Configurar Linhas'),
    },
    {
      icon: <Zap size={20} />,
      label: 'Automação de Respostas',
      onClick: () => handleQuickAction('Automação de Respostas'),
    },
    {
      icon: <Mic2 size={20} />,
      label: 'Vozes e Recursos',
      onClick: () => handleQuickAction('Vozes e Recursos'),
    },
    {
      icon: <BarChart2 size={20} />,
      label: 'Análise Técnica',
      onClick: () => handleQuickAction('Análise Técnica'),
    },
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Pesquisando:', e.target.value);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Cabeçalho e Busca */}
      <header className={styles.header}>
        <h1>Logs</h1>
        <div className={styles.searchContainer}>
          <Search className={styles.searchIcon} size={20} />
          <input
            type="text"
            placeholder="Buscar assistentes, fluxos ou logs..."
            className={styles.searchInput}
            onChange={handleSearch}
          />
        </div>
      </header>

      {/* Métricas */}
      <section className={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </section>

      {/* Ações Rápidas */}
      <section className={styles.quickActions}>
        <h2>Ações Rápidas</h2>
        <div className={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <QuickActionButton key={index} {...action} />
          ))}
        </div>
      </section>
    </div>
  );
}

'use client';

import React, { useCallback } from 'react';
import { Settings, Zap, Mic2, BarChart2 } from 'lucide-react';
import styles from './styles.module.css';

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionProps> = React.memo(({
  icon,
  label,
  onClick,
}) => (
  <button className={styles.quickActionButton} onClick={onClick}>
    {icon}
    <span>{label}</span>
  </button>
));

QuickActionButton.displayName = 'QuickActionButton';

export const defaultQuickActions = [
  {
    icon: <Settings size={20} />,
    label: 'Configurar Linhas',
    action: 'Configurar Linhas',
  },
  {
    icon: <Zap size={20} />,
    label: 'Automação de Respostas',
    action: 'Automação de Respostas',
  },
  {
    icon: <Mic2 size={20} />,
    label: 'Vozes e Recursos',
    action: 'Vozes e Recursos',
  },
  {
    icon: <BarChart2 size={20} />,
    label: 'Análise Técnica',
    action: 'Análise Técnica',
  },
];

interface QuickActionsGridProps {
  actions?: typeof defaultQuickActions;
  onActionClick?: (action: string) => void;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ 
  actions = defaultQuickActions,
  onActionClick,
}) => {
  const handleQuickAction = useCallback((action: string) => {
    console.log(`Ação rápida: ${action}`);
    onActionClick?.(action);
  }, [onActionClick]);

  return (
    <section className={styles.quickActions}>
      <h2>Ações Rápidas</h2>
      <div className={styles.quickActionsGrid}>
        {actions.map((action, index) => (
          <QuickActionButton
            key={index}
            icon={action.icon}
            label={action.label}
            onClick={() => handleQuickAction(action.action)}
          />
        ))}
      </div>
    </section>
  );
};

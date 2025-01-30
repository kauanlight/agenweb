'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Sidebar } from './Sidebar';
import styles from './styles.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const onboardingCompleted = localStorage.getItem("onboarding_completed");
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }

      const sidebarState = localStorage.getItem("sidebar_state");
      setIsSidebarOpen(sidebarState !== "closed");
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => {
      const newState = !prev;
      if (typeof window !== "undefined") {
        localStorage.setItem("sidebar_state", newState ? "open" : "closed");
      }
      return newState;
    });
  }, []);

  return (
    <div className={`${styles.layoutContainer} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}>
      <h1>AgenWeb - Atendimento Automático e Inteligente</h1>
      <Sidebar isOpen={isSidebarOpen} />
      <button 
        className={styles.sidebarToggle}
        onClick={toggleSidebar}
        title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
      >
        {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
      </button>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

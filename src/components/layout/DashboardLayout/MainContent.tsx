import React from 'react';
import styles from './styles.module.css';

interface MainContentProps {
  children: React.ReactNode;
}

export const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className={styles.mainContent}>
      <div className={styles.contentWrapper}>{children}</div>
    </main>
  );
};

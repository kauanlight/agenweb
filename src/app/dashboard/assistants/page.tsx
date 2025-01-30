'use client';

import React, { useState, useCallback } from 'react';
import { Search, RefreshCcw } from 'lucide-react';
import { MetricsGrid } from '@/components/dashboard/MetricsGrid';
import { QuickActionsGrid } from '@/components/dashboard/QuickActions';
import styles from './styles.module.css';

export default function AssistantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }, []);

  const handleQuickAction = useCallback((action: string) => {
    // Implementar lógica de ações rápidas aqui
    console.log(`Executando ação: ${action}`);
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Biblioteca de Assistentes</h1>
        <div className={styles.headerActions}>
          <button className={styles.syncButton}>
            <RefreshCcw size={20} />
            Sincronizar
          </button>
          <button className={styles.newButton}>
            + Novo agente
          </button>
        </div>
      </header>

      <div className={styles.searchBar}>
        <div className={styles.searchInput}>
          <Search size={20} />
          <input
            type="text"
            placeholder="Buscar por palavra-chave"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={styles.categorySelect}
        >
          <option value="all">Todas Categorias</option>
          <option value="health">Saúde</option>
          <option value="ecommerce">E-commerce</option>
          <option value="general">Geral</option>
        </select>
      </div>

      {/* Métricas */}
      <MetricsGrid />

      {/* Ações Rápidas */}
      <QuickActionsGrid onActionClick={handleQuickAction} />
    </div>
  );
}

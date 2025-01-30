'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bot,
  Phone,
  MessageSquare,
  Library,
  FileText,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import styles from './styles.module.css';

const menuItems = [
  { icon: LayoutDashboard, label: 'Visão Geral', href: '/dashboard' },
  { icon: Bot, label: 'Assistentes', href: '/dashboard/assistants' },
  { icon: Phone, label: 'Números de Telefone', href: '/dashboard/phone-numbers' },
  { icon: MessageSquare, label: 'Fluxos de Conversação', href: '/dashboard/flows' },
  { icon: Library, label: 'Biblioteca', href: '/dashboard/library' },
  { icon: FileText, label: 'Logs', href: '/dashboard/logs' },
  { icon: BarChart2, label: 'Análise Técnica', href: '/dashboard/analytics' },
];

const bottomMenuItems = [
  { icon: Settings, label: 'Configurações', href: '/dashboard/settings' },
  { icon: LogOut, label: 'Sair', href: '/logout' },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const sidebarClass = `${styles.sidebar} ${!isOpen ? styles.collapsed : ''} ${
    isMobileOpen ? styles.mobileOpen : ''
  }`;

  return (
    <>
      <aside className={sidebarClass}>
        <div className={styles.sidebarHeader}>
          <Link href="/dashboard" className={styles.logo}>
            <Logo className={styles.logoIcon} />
            <span>AgenWeb</span>
          </Link>
        </div>

        <nav className={styles.navigation}>
          <ul className={styles.menu}>
            {menuItems.map((item) => (
              <li key={item.href} className={styles.menuItem}>
                <Link
                  href={item.href}
                  className={`${styles.menuLink} ${
                    pathname === item.href ? styles.active : ''
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon className={styles.menuIcon} size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <ul className={styles.bottomMenu}>
            {bottomMenuItems.map((item) => (
              <li key={item.href} className={styles.menuItem}>
                <Link
                  href={item.href}
                  className={`${styles.menuLink} ${
                    pathname === item.href ? styles.active : ''
                  }`}
                  title={!isOpen ? item.label : undefined}
                >
                  <item.icon className={styles.menuIcon} size={20} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <button
        className={styles.mobileMenuButton}
        onClick={toggleMobileSidebar}
        title="Menu"
      >
        <MessageSquare size={24} />
      </button>

      {isMobileOpen && (
        <div 
          className={`${styles.overlay} ${isMobileOpen ? styles.visible : ''}`}
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

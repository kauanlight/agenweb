import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AgenWeb',
  description: 'Plataforma de assistentes virtuais inteligentes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsOpen] = React.useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isSidebarOpen);
    // Lógica adicional para garantir que os itens do menu sejam renderizados corretamente
  };

  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}

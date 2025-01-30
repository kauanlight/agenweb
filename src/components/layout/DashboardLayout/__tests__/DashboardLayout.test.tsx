import { render, screen, fireEvent } from '@testing-library/react';
import { DashboardLayout } from '../index';

describe('DashboardLayout', () => {
  it('should render the layout correctly', () => {
    render(<DashboardLayout>Test Content</DashboardLayout>);
    
    // Verifica se o título está presente
    expect(screen.getByText('AssistPro AI - Atendimento Automático e Inteligente')).toBeInTheDocument();
    
    // Verifica se o conteúdo filho está presente
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render all menu items in sidebar', () => {
    render(<DashboardLayout>Test Content</DashboardLayout>);
    
    const menuItems = [
      'Visão Geral',
      'Assistentes',
      'Números de Telefone',
      'Fluxos de Conversação',
      'Biblioteca',
      'Logs',
      'Análise técnica'
    ];
    
    menuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('should toggle sidebar on mobile view', () => {
    render(<DashboardLayout>Test Content</DashboardLayout>);
    
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    // Verifica se a sidebar está visível após o clique
    const sidebar = document.querySelector('.sidebar');
    expect(sidebar).toHaveClass('open');
  });

  it('should maintain layout structure', () => {
    render(<DashboardLayout>Test Content</DashboardLayout>);
    
    const container = document.querySelector('.dashboardContainer');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.mainContent');
    
    expect(container).toBeInTheDocument();
    expect(sidebar).toBeInTheDocument();
    expect(mainContent).toBeInTheDocument();
  });
});

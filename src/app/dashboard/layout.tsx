'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'
import OnboardingModal from '@/components/dashboard/OnboardingModal'
import { 
  Search, 
  Bell, 
  HelpCircle, 
  User,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'

const DashboardLayout = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboarding_completed')
    
    if (!onboardingCompleted) {
      setShowOnboarding(true)
    }
  }, [])

  const handleCloseOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem('onboarding_completed', 'true')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      {isSidebarOpen && <Sidebar />}

      {/* Conteúdo Principal */}
      <div className={`flex-1 ${isSidebarOpen ? 'ml-64' : ''} p-8 transition-all duration-300 ease-in-out`}>
        {/* Botão de Alternância do Sidebar */}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-white shadow-md"
        >
          {isSidebarOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
        </Button>

        {/* Cabeçalho */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4 w-full">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Pesquisar no dashboard" 
                className="pl-10 w-full"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <HelpCircle className="w-5 h-5" />
              </Button>

              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Perfil</DropdownMenuItem>
                  <DropdownMenuItem>Configurações</DropdownMenuItem>
                  <DropdownMenuItem>Sair</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Conteúdo da Página */}
        {children}
      </div>

      {/* Modal de Onboarding */}
      {showOnboarding && (
        <OnboardingModal onClose={handleCloseOnboarding} />
      )}
    </div>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null; // Evita renderizar até que o cliente esteja pronto
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}

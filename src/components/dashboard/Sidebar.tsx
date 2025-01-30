'use client'

import Link from 'next/link'
import { 
  LayoutDashboard, 
  Phone, 
  FileText, 
  Settings, 
  LogOut, 
  User, 
  HelpCircle,
  Workflow,
  Archive,
  MessageCircle
} from 'lucide-react'

export default function Sidebar() {
  const menuItems = [
    {
      label: 'Visão Geral',
      icon: LayoutDashboard,
      href: '/dashboard'
    },
    {
      label: 'Assistentes',
      icon: MessageCircle,
      href: '/dashboard/assistants',
      description: 'Gerencie seus assistentes de IA'
    },
    {
      label: 'Números de Telefone',
      icon: Phone,
      href: '/dashboard/phone-numbers',
      description: 'Configurar e gerenciar linhas'
    },
    {
      label: 'Fluxos de Conversação',
      icon: Workflow,
      href: '/dashboard/workflows',
      description: 'Automação de respostas'
    },
    {
      label: 'Biblioteca',
      icon: Archive,
      href: '/dashboard/library',
      description: 'Vozes e recursos'
    },
    {
      label: 'Logs',
      icon: FileText,
      href: '/dashboard/logs',
      description: 'Análise técnica'
    }
  ]

  const accountItems = [
    {
      label: 'Perfil',
      icon: User,
      href: '/dashboard/profile'
    },
    {
      label: 'Configurações',
      icon: Settings,
      href: '/dashboard/settings'
    },
    {
      label: 'Suporte',
      icon: HelpCircle,
      href: '/dashboard/support'
    }
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-md p-4 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="mb-6">
          <span className="text-2xl font-bold text-primary">AssistPro</span>
        </Link>
      </div>

      <nav className="flex-grow">
        <div className="space-y-2 mb-6">
          <p className="text-xs uppercase text-gray-500 mb-2">Menu Principal</p>
          {menuItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="flex items-center p-2 hover:bg-gray-100 rounded-md group"
            >
              <item.icon className="mr-3 text-gray-500 group-hover:text-blue-600" />
              <div>
                <span className="text-sm font-medium group-hover:text-blue-600">
                  {item.label}
                </span>
                {item.description && (
                  <p className="text-xs text-gray-400">{item.description}</p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs uppercase text-gray-500 mb-2">Conta</p>
          {accountItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href} 
              className="flex items-center p-2 hover:bg-gray-100 rounded-md group"
            >
              <item.icon className="mr-3 text-gray-500 group-hover:text-blue-600" />
              <span className="text-sm font-medium group-hover:text-blue-600">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="mt-auto mb-4">
        <Link 
          href="/logout" 
          className="flex items-center p-2 hover:bg-gray-100 rounded-md group"
        >
          <LogOut className="mr-3 text-gray-500 group-hover:text-red-600" />
          <span className="text-sm font-medium group-hover:text-red-600">
            Sair
          </span>
        </Link>
      </div>
    </aside>
  )
}

"use client"

import Link from 'next/link'
import { useState } from 'react'
import { 
  Layers as LayersIcon, 
  ChevronDown as ChevronDownIcon,
  HomeIcon,
  RocketIcon,
  UsersIcon,
  HelpCircleIcon,
  SettingsIcon
} from 'lucide-react'

const menuItems = [
  { 
    label: 'Início', 
    href: '/', 
    icon: HomeIcon 
  },
  { 
    label: 'Funcionalidades', 
    icon: RocketIcon,
    subMenu: [
      { 
        label: 'Assistente Virtual', 
        href: '/funcionalidades/assistente-virtual',
        icon: LayersIcon 
      },
      { 
        label: 'Atendimento Multilíngue', 
        href: '/funcionalidades/atendimento-multilíngue',
        icon: UsersIcon 
      },
      { 
        label: 'Suporte Personalizado', 
        href: '/funcionalidades/suporte-personalizado',
        icon: HelpCircleIcon 
      }
    ]
  },
  { 
    label: 'Casos de Uso', 
    icon: SettingsIcon,
    subMenu: [
      { 
        label: 'E-commerce', 
        href: '/casos-de-uso/e-commerce',
        icon: LayersIcon 
      },
      { 
        label: 'Suporte Técnico', 
        href: '/casos-de-uso/suporte-tecnico',
        icon: HelpCircleIcon 
      },
      { 
        label: 'Saúde', 
        href: '/casos-de-uso/saude',
        icon: UsersIcon 
      },
      { 
        label: 'Educação', 
        href: '/casos-de-uso/educacao',
        icon: RocketIcon 
      }
    ]
  },
  { 
    label: 'Preços', 
    href: '/precos',
    icon: LayersIcon 
  },
  { 
    label: 'Demonstração', 
    href: '/demo',
    icon: RocketIcon 
  },
  { 
    label: 'Entrar', 
    href: '/login',
    icon: UsersIcon 
  }
]

export default function MainNavigation() {
  const [openMenu, setOpenMenu] = useState<string | null>(null)

  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label)
  }

  return (
    <nav className="bg-white shadow-soft">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">AgenWeb</span>
          </Link>
        </div>

        {/* Menu Principal */}
        <div className="hidden md:flex space-x-6 items-center">
          {menuItems.map((item, index) => (
            <div key={index} className="relative group">
              <button 
                onClick={() => item.subMenu ? toggleMenu(item.label) : null}
                className="flex items-center text-gray-800 hover:text-primary transition-colors"
              >
                {item.icon && <item.icon className="mr-2 w-5 h-5" />}
                <span>{item.label}</span>
                {item.subMenu && (
                  <ChevronDownIcon 
                    className={`ml-1 w-4 h-4 transition-transform ${
                      openMenu === item.label ? 'rotate-180' : ''
                    }`} 
                  />
                )}
              </button>

              {item.subMenu && openMenu === item.label && (
                <div className="absolute z-50 left-0 mt-2 w-56 bg-white shadow-lg rounded-lg overflow-hidden">
                  {item.subMenu.map((subItem, subIndex) => (
                    <Link 
                      key={subIndex} 
                      href={subItem.href} 
                      className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
                    >
                      {subItem.icon && <subItem.icon className="mr-3 w-5 h-5 text-primary" />}
                      <span>{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botão Mobile */}
        <div className="md:hidden">
          <button className="text-primary">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

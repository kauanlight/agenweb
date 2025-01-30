'use client'

import { useState } from 'react'
import { 
  Stethoscope, 
  ShoppingCart,
  SwitchCamera 
} from '@/lib/icons'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useVertical } from '@/contexts/VerticalContext'
import { toast } from '@/components/ui/use-toast'

export default function VerticalSwitcher() {
  const { 
    currentVertical, 
    switchVertical, 
    availableVerticals 
  } = useVertical()

  const handleVerticalSwitch = (vertical: 'healthcare' | 'ecommerce') => {
    if (vertical === currentVertical) return

    try {
      switchVertical(vertical)
      toast({
        title: 'Setor Alterado',
        description: `Você agora está no setor de ${
          vertical === 'healthcare' ? 'Saúde' : 'E-commerce'
        }`,
        variant: 'default'
      })
    } catch (error) {
      toast({
        title: 'Erro ao Trocar Setor',
        description: 'Não foi possível trocar o setor. Tente novamente.',
        variant: 'destructive'
      })
    }
  }

  const verticalDetails = {
    healthcare: {
      icon: Stethoscope,
      color: 'text-green-500',
      label: 'Saúde'
    },
    ecommerce: {
      icon: ShoppingCart,
      color: 'text-blue-500',
      label: 'E-commerce'
    }
  }

  const CurrentIcon = currentVertical 
    ? verticalDetails[currentVertical].icon 
    : SwitchCamera

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <CurrentIcon 
            className={`mr-2 w-4 h-4 ${
              currentVertical 
                ? verticalDetails[currentVertical].color 
                : 'text-gray-500'
            }`} 
          />
          {currentVertical 
            ? verticalDetails[currentVertical].label 
            : 'Selecionar Setor'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Trocar Setor</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableVerticals.map(vertical => (
          <DropdownMenuItem 
            key={vertical}
            onSelect={() => handleVerticalSwitch(vertical)}
            disabled={vertical === currentVertical}
            className={`cursor-pointer ${
              vertical === currentVertical 
                ? 'bg-gray-100 text-gray-500' 
                : 'hover:bg-gray-50'
            }`}
          >
            {vertical === 'healthcare' ? (
              <Stethoscope className="mr-2 w-4 h-4 text-green-500" />
            ) : (
              <ShoppingCart className="mr-2 w-4 h-4 text-blue-500" />
            )}
            {vertical === 'healthcare' ? 'Saúde' : 'E-commerce'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

'use client'

import { useState } from 'react'
import { 
  Stethoscope, 
  ShoppingCart, 
  CheckCircle,
  AlertCircle 
} from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useVertical } from '@/contexts/VerticalContext'
import { usePermissions } from '@/contexts/PermissionsContext'

export default function VerticalSelector() {
  const { selectVertical, completeOnboarding, availableVerticals } = useVertical()
  const { currentUser } = usePermissions()
  const [selectedVertical, setSelectedVertical] = useState<'healthcare' | 'ecommerce' | null>(null)
  const [error, setError] = useState<string | null>(null)

  console.log('VerticalSelector Render', {
    currentUser: currentUser?.name,
    selectedVertical,
    availableVerticals,
    isOnboardingComplete: localStorage.getItem('agenweb_onboarding_complete')
  })

  const handleVerticalSelection = () => {
    if (!selectedVertical) {
      setError('Por favor, selecione um setor antes de continuar.')
      return
    }

    try {
      selectVertical(selectedVertical)
      completeOnboarding()
    } catch (err) {
      setError('Erro ao selecionar o setor. Por favor, tente novamente.')
      console.error(err)
    }
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Bem-vindo ao AgenWeb, {currentUser.name}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <p className="text-center text-gray-600 mb-6">
            Selecione o setor principal da sua empresa
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all ${
                selectedVertical === 'healthcare' 
                  ? 'border-primary ring-2 ring-primary' 
                  : 'hover:border-gray-300'
              } ${
                availableVerticals.includes('healthcare')
                  ? ''
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => {
                if (!availableVerticals.includes('healthcare')) return
                setSelectedVertical('healthcare')
                setError(null)
              }}
            >
              <CardContent className="flex flex-col items-center p-6">
                <Stethoscope className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Saúde</h3>
                <p className="text-sm text-gray-500 text-center">
                  Assistente para clínicas, hospitais e profissionais de saúde
                </p>
                {selectedVertical === 'healthcare' && (
                  <CheckCircle className="absolute top-2 right-2 text-primary" />
                )}
                {availableVerticals.includes('healthcare') && (
                  <span className="mt-2 text-xs text-green-600">
                    Disponível
                  </span>
                )}
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all ${
                selectedVertical === 'ecommerce' 
                  ? 'border-primary ring-2 ring-primary' 
                  : 'hover:border-gray-300'
              } ${
                availableVerticals.includes('ecommerce')
                  ? ''
                  : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => {
                if (!availableVerticals.includes('ecommerce')) return
                setSelectedVertical('ecommerce')
                setError(null)
              }}
            >
              <CardContent className="flex flex-col items-center p-6">
                <ShoppingCart className="w-12 h-12 text-blue-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">E-commerce</h3>
                <p className="text-sm text-gray-500 text-center">
                  Assistente para lojas online e gestão de vendas
                </p>
                {selectedVertical === 'ecommerce' && (
                  <CheckCircle className="absolute top-2 right-2 text-primary" />
                )}
                {availableVerticals.includes('ecommerce') && (
                  <span className="mt-2 text-xs text-blue-600">
                    Disponível
                  </span>
                )}
              </CardContent>
            </Card>
          </div>

          <Button 
            className="w-full mt-6"
            disabled={!selectedVertical}
            onClick={handleVerticalSelection}
          >
            Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

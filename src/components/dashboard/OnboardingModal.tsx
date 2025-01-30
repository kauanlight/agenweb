'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
  MessageCircle, 
  Settings, 
  Rocket, 
  Users, 
  CheckCircle 
} from 'lucide-react'

const ONBOARDING_STEPS = [
  {
    title: 'Bem-vindo ao AgenWeb',
    description: 'Vamos configurar seu primeiro assistente virtual',
    icon: MessageCircle,
    content: 'O AgenWeb permite criar assistentes inteligentes para diversos setores, como saúde, educação e atendimento ao cliente.'
  },
  {
    title: 'Configuração Inicial',
    description: 'Personalize seu ambiente de trabalho',
    icon: Settings,
    content: 'Defina preferências de interface, escolha temas de cores e configure suas integrações principais.'
  },
  {
    title: 'Criação de Assistentes',
    description: 'Monte seu time de assistentes virtuais',
    icon: Rocket,
    content: 'Selecione templates prontos ou crie assistentes personalizados para cada área de atuação.'
  },
  {
    title: 'Gestão de Equipe',
    description: 'Colaboração e permissões',
    icon: Users,
    content: 'Adicione membros da equipe, defina níveis de acesso e gerencie permissões de forma simples e intuitiva.'
  }
]

export default function OnboardingModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem('agenweb_onboarding_completed')
    if (!hasCompletedOnboarding) {
      setIsOpen(true)
    }
  }, [])

  const handleNextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinishOnboarding = () => {
    localStorage.setItem('agenweb_onboarding_completed', 'true')
    setIsOpen(false)
  }

  const CurrentStepIcon = ONBOARDING_STEPS[currentStep].icon

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <CurrentStepIcon className="mr-2 w-6 h-6" />
            {ONBOARDING_STEPS[currentStep].title}
          </DialogTitle>
          <DialogDescription>
            {ONBOARDING_STEPS[currentStep].description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h1>Bem-vindo ao AgenWeb!</h1>
            <h1>Vamos configurar seu primeiro assistente virtual.</h1>
            <p className="text-gray-700">
              {ONBOARDING_STEPS[currentStep].content}
            </p>
          </div>
          <div className="flex flex-col justify-center items-center space-y-4">
            <img 
              src={`/onboarding/step-${currentStep + 1}.png`} 
              alt={`Passo ${currentStep + 1}`} 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePreviousStep}>
                Anterior
              </Button>
            )}
            {currentStep < ONBOARDING_STEPS.length - 1 ? (
              <Button onClick={handleNextStep}>
                Próximo
              </Button>
            ) : (
              <Button 
                onClick={handleFinishOnboarding}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="mr-2" /> Concluir Onboarding
              </Button>
            )}
          </div>
          <Button 
            variant="ghost" 
            onClick={() => {
              localStorage.setItem('agenweb_onboarding_completed', 'true')
              setIsOpen(false)
            }}
          >
            Pular Tutorial
          </Button>
        </div>

        <div className="flex justify-center space-x-2 mt-4">
          {ONBOARDING_STEPS.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full ${
                index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

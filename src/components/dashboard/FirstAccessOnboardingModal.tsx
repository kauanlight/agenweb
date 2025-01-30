'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useVertical } from '@/contexts/VerticalContext'
import { Stethoscope, ShoppingCart } from 'lucide-react'

const SECTORS = [
  { value: 'healthcare', label: 'Saúde' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'education', label: 'Educação' },
  { value: 'finance', label: 'Finanças' },
  { value: 'other', label: 'Outro' }
]

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 funcionários' },
  { value: '11-50', label: '11-50 funcionários' },
  { value: '51-200', label: '51-200 funcionários' },
  { value: '201-500', label: '201-500 funcionários' },
  { value: '500+', label: '500+ funcionários' }
]

const DISCOVERY_CHANNELS = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'google', label: 'Google' },
  { value: 'referral', label: 'Indicação' },
  { value: 'conference', label: 'Conferência' },
  { value: 'other', label: 'Outro' }
]

export default function FirstAccessOnboardingModal() {
  const { selectVertical, completeOnboarding } = useVertical()
  const [isOpen, setIsOpen] = useState(true)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    sector: '',
    companySize: '',
    discoveryChannel: '',
    specificNeeds: '',
    vertical: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (step < 5) {
      setStep(prev => prev + 1)
    }
  }

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Salvar dados de onboarding
    localStorage.setItem('assistpro_first_access', JSON.stringify({
      ...formData,
      timestamp: new Date().toISOString()
    }))
    
    // Definir vertical baseado na seleção
    selectVertical(formData.vertical || 'healthcare')
    
    // Marcar onboarding como concluído
    completeOnboarding()
    
    setIsOpen(false)
  }

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Bem-vindo à AssistPro AI</DialogTitle>
              <DialogDescription>
                Vamos personalizar sua experiência
              </DialogDescription>
            </DialogHeader>
            <Input 
              placeholder="Nome da empresa" 
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
            />
            <Select 
              value={formData.sector}
              onValueChange={(value) => handleInputChange('sector', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu setor" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map(sector => (
                  <SelectItem key={sector.value} value={sector.value}>
                    {sector.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Escolha seu Nicho de Atuação</DialogTitle>
              <DialogDescription>
                Selecione o setor específico para personalizar sua experiência
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant={formData.vertical === 'healthcare' ? 'default' : 'outline'}
                onClick={() => handleInputChange('vertical', 'healthcare')}
                className="flex flex-col items-center justify-center h-32"
              >
                <Stethoscope className="mb-2" size={32} />
                Saúde
              </Button>
              <Button 
                variant={formData.vertical === 'ecommerce' ? 'default' : 'outline'}
                onClick={() => handleInputChange('vertical', 'ecommerce')}
                className="flex flex-col items-center justify-center h-32"
              >
                <ShoppingCart className="mb-2" size={32} />
                E-commerce
              </Button>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Tamanho da Empresa</DialogTitle>
              <DialogDescription>
                Nos ajude a entender o porte da sua empresa
              </DialogDescription>
            </DialogHeader>
            <Select 
              value={formData.companySize}
              onValueChange={(value) => handleInputChange('companySize', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Número de funcionários" />
              </SelectTrigger>
              <SelectContent>
                {COMPANY_SIZES.map(size => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Como nos conheceu?</DialogTitle>
              <DialogDescription>
                Queremos entender como você chegou até nós
              </DialogDescription>
            </DialogHeader>
            <Select 
              value={formData.discoveryChannel}
              onValueChange={(value) => handleInputChange('discoveryChannel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Canal de descoberta" />
              </SelectTrigger>
              <SelectContent>
                {DISCOVERY_CHANNELS.map(channel => (
                  <SelectItem key={channel.value} value={channel.value}>
                    {channel.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 5:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Necessidades Específicas</DialogTitle>
              <DialogDescription>
                Conte-nos um pouco mais sobre suas expectativas
              </DialogDescription>
            </DialogHeader>
            <Input 
              placeholder="Descreva suas necessidades específicas" 
              value={formData.specificNeeds}
              onChange={(e) => handleInputChange('specificNeeds', e.target.value)}
            />
          </div>
        )
      default:
        return null
    }
  }

  const isFirstAccess = () => {
    const firstAccessData = localStorage.getItem('assistpro_first_access')
    return !firstAccessData
  }

  return (
    <Dialog open={isOpen && isFirstAccess()} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        {renderStep()}
        <div className="flex justify-between">
          {step > 1 && (
            <Button variant="outline" onClick={handlePreviousStep}>
              Anterior
            </Button>
          )}
          {step < 5 ? (
            <Button onClick={handleNextStep}>
              Próximo
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={!formData.vertical}
            >
              Concluir
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

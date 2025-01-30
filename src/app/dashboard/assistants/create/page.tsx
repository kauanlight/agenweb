'use client'

import { useState } from 'react'
import { 
  Rocket, 
  UserPlus, 
  HelpCircle, 
  GamepadIcon, 
  PhoneCallIcon, 
  BookOpenIcon 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TEMPLATES = [
  {
    id: 'blank',
    name: 'Modelo em Branco',
    description: 'Um modelo em branco com configurações mínimas. Ponto de partida para criar seu assistente personalizado.',
    icon: Rocket,
    recommended: false
  },
  {
    id: 'appointment',
    name: 'Agendador de Consultas',
    description: 'Projetado para práticas odontológicas para demonstrar agendamento de consultas. Agiliza o processo de marcação.',
    icon: PhoneCallIcon,
    recommended: true
  },
  {
    id: 'customer-support',
    name: 'Suporte ao Cliente',
    description: 'Um modelo versátil com inteligência emocional e conhecimento técnico. Ideal para suporte ao cliente empático e eficiente.',
    icon: UserPlus,
    recommended: false
  },
  {
    id: 'inbound-qa',
    name: 'Perguntas e Respostas',
    description: 'Agente de chamadas de entrada projetado para fornecer suporte abrangente. Com profundo entendimento de detalhes do produto.',
    icon: HelpCircle,
    recommended: false
  },
  {
    id: 'game-npc',
    name: 'NPC de Jogo',
    description: 'Um assistente para demonstrar um NPC de jogo, projetado para oferecer orientação, história e insights sobre o mundo do jogo.',
    icon: GamepadIcon,
    recommended: false
  },
  {
    id: 'book-assistant',
    name: 'Assistente de Leitura',
    description: 'Assistente especializado em análise de livros, discussões literárias e recomendações personalizadas de leitura.',
    icon: BookOpenIcon,
    recommended: false
  }
]

export default function CreateAssistantPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [assistantName, setAssistantName] = useState('')

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleCreateAssistant = () => {
    // Lógica para criar assistente
    console.log('Criando assistente:', {
      name: assistantName,
      template: selectedTemplate
    })
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Criar Assistente</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Escolha um Modelo</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEMPLATES.map((template) => (
            <Card 
              key={template.id}
              className={`cursor-pointer transition-all hover:border-primary 
                ${selectedTemplate === template.id 
                  ? 'border-2 border-primary bg-primary/10' 
                  : 'border'}`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <template.icon className="w-8 h-8 text-primary" />
                  {template.recommended && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Recomendado
                    </span>
                  )}
                </div>
                <CardTitle>{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{template.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedTemplate && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Nome do Assistente</h2>
          <div className="max-w-md">
            <Input 
              placeholder="Digite o nome do seu assistente" 
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              className="mb-4"
            />
            <Button 
              onClick={handleCreateAssistant}
              disabled={!assistantName}
              className="w-full"
            >
              Criar Novo Assistente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

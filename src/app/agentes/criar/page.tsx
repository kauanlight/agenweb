'use client'

import { useState } from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  AgentType, 
  LanguageCode, 
  PersonalityTrait, 
  DataSourceType 
} from '@/types/agent'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

const AgentCreationSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  type: z.nativeEnum(AgentType),
  primaryLanguage: z.nativeEnum(LanguageCode),
  supportedLanguages: z.array(z.nativeEnum(LanguageCode)).optional(),
  personalityTraits: z.array(z.nativeEnum(PersonalityTrait)).max(3),
  maxContextTokens: z.number().min(100).max(4000).default(2048),
  temperature: z.number().min(0).max(1).default(0.7),
  dataSources: z.array(z.object({
    type: z.nativeEnum(DataSourceType),
    uri: z.string().url()
  })).optional()
})

type AgentCreationFormData = z.infer<typeof AgentCreationSchema>

export default function CriarAgentePage() {
  const { 
    control, 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<AgentCreationFormData>({
    resolver: zodResolver(AgentCreationSchema),
    defaultValues: {
      type: AgentType.CUSTOMER_SUPPORT,
      primaryLanguage: LanguageCode.PT_BR,
      maxContextTokens: 2048,
      temperature: 0.7
    }
  })

  const [dataSourceCount, setDataSourceCount] = useState(1)

  const onSubmit: SubmitHandler<AgentCreationFormData> = async (data) => {
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        // Redirecionar ou mostrar sucesso
      }
    } catch (error) {
      console.error('Erro ao criar agente', error)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Criar Novo Agente AI</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Nome do Agente</label>
              <Input 
                {...register('name')}
                placeholder="Digite o nome do agente"
              />
              {errors.name && <p className="text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label>Tipo de Agente</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AgentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.type && <p className="text-red-500">{errors.type.message}</p>}
            </div>

            <div>
              <label>Descrição</label>
              <Textarea 
                {...register('description')}
                placeholder="Descreva o propósito do agente"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações Linguísticas</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <label>Idioma Principal</label>
              <Controller
                name="primaryLanguage"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o idioma" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(LanguageCode).map(lang => (
                        <SelectItem key={lang} value={lang}>
                          {lang}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">
          Criar Agente
        </Button>
      </form>
    </div>
  )
}

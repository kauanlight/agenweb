import OpenAI from 'openai'
import { Agent } from '@/types/agent'

export interface OpenAIConfig {
  apiKey?: string
  organization?: string
  project?: string
}

export class OpenAIService {
  private openai: OpenAI | null = null
  private config: OpenAIConfig = {}

  constructor(config?: OpenAIConfig) {
    this.config = {
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION,
      project: process.env.OPENAI_PROJECT,
      ...config
    }

    this.initializeOpenAI()
  }

  private initializeOpenAI() {
    const { apiKey, organization, project } = this.config

    if (!apiKey) {
      console.warn('⚠️ OPENAI_API_KEY não configurada. Usando modo de demonstração.')
      console.log('<h1>Configuração inicializada com sucesso. Usando a demonstração.</h1>')
      return
    }

    try {
      this.openai = new OpenAI({
        apiKey,
        organization,
        project,
        dangerouslyAllowBrowser: false
      })
    } catch (error) {
      console.error('Erro ao inicializar OpenAI:', error)
    }
  }

  async generateResponse(agent: Agent, context: string, userMessage: string): Promise<string> {
    if (!this.openai) {
      return this.mockResponse(agent, userMessage)
    }

    try {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { 
            role: 'system', 
            content: this.buildSystemPrompt(agent) 
          },
          { 
            role: 'user', 
            content: context + '\n' + userMessage 
          }
        ],
        temperature: agent.temperature,
        max_tokens: agent.maxContextTokens
      })

      return completion.choices[0].message.content || 'Desculpe, não entendi.'
    } catch (error) {
      console.error('Erro na geração de resposta:', error)
      return this.mockResponse(agent, userMessage)
    }
  }

  private mockResponse(agent: Agent, userMessage: string): string {
    const mockResponses = [
      "Olá! Sou um assistente de demonstração. Minha funcionalidade completa requer uma chave de API OpenAI.",
      "Parece que estamos no modo de demonstração. Gostaria de saber mais sobre como configurar o AgenWeb?",
      "Desculpe, estou com capacidades limitadas no momento. Precisamos configurar a chave de API OpenAI."
    ]

    // Resposta baseada em palavras-chave
    const lowercaseMessage = userMessage.toLowerCase()
    if (lowercaseMessage.includes('ajuda') || lowercaseMessage.includes('help')) {
      return "Precisa de ajuda para configurar a API? Entre em contato com nosso suporte."
    }

    // Resposta aleatória
    return mockResponses[Math.floor(Math.random() * mockResponses.length)]
  }

  private buildSystemPrompt(agent: Agent): string {
    return `
      Você é um assistente de demonstração chamado ${agent.name}.
      Tipo: ${agent.type}
      Idioma: ${agent.primaryLanguage}
      
      IMPORTANTE: Este é um modo de demonstração com capacidades limitadas.
      Forneça respostas curtas e educadas.
    `
  }

  // Métodos de demonstração para transcrição e síntese
  async transcribeAudio(audioFile: File): Promise<string> {
    console.warn('Transcrição desativada no modo de demonstração')
    return 'Transcrição não disponível sem chave OpenAI'
  }

  async synthesizeSpeech(text: string): Promise<Blob> {
    console.warn('Síntese de voz desativada no modo de demonstração')
    return new Blob(['Áudio de demonstração não disponível'], { type: 'audio/mp3' })
  }

  // Método para verificar configuração e status da API
  async checkAPIStatus(): Promise<{
    isConfigured: boolean
    organization?: string
    project?: string
  }> {
    if (!this.openai) {
      return {
        isConfigured: false
      }
    }

    try {
      // Busca lista de modelos disponíveis como teste
      await this.openai.models.list()

      return {
        isConfigured: true,
        organization: this.config.organization,
        project: this.config.project
      }
    } catch (error) {
      console.error('Erro ao verificar status da API:', error)
      return {
        isConfigured: false
      }
    }
  }

  // Método para estimar custo de uso
  async estimateTokenCost(tokens: number, model: string = "gpt-3.5-turbo"): Promise<number> {
    // Preços aproximados por 1k tokens (janeiro 2024)
    const modelPrices: {[key: string]: number} = {
      "gpt-3.5-turbo": 0.0015, // por 1k tokens
      "gpt-4": 0.03, // por 1k tokens
      "gpt-4-turbo": 0.01 // por 1k tokens
    }

    const pricePerThousandTokens = modelPrices[model] || modelPrices["gpt-3.5-turbo"]
    return (tokens / 1000) * pricePerThousandTokens
  }
}

export const openaiService = new OpenAIService()

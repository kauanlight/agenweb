import { Agent, AgentType, LanguageCode } from "@/types/agent"
import { agentRepository } from "./agent-repository"

export class AgentService {
  // Criar agente de suporte padrão
  createDefaultCustomerSupportAgent(companyName: string): Agent {
    return agentRepository.create({
      name: `Assistente de Suporte ${companyName}`,
      description: `Assistente virtual para atendimento ao cliente da ${companyName}`,
      type: AgentType.CUSTOMER_SUPPORT,
      primaryLanguage: LanguageCode.PT_BR,
      supportedLanguages: [LanguageCode.PT_BR, LanguageCode.EN_US],
      dataSources: [],
      personalityConfig: {
        traits: ['professional', 'friendly'],
        tone: 'cordial',
        formalityLevel: 7
      },
      maxContextTokens: 2048,
      temperature: 0.7,
      isActive: true
    })
  }

  // Encontrar agentes por tipo
  findAgentsByType(type: AgentType): Agent[] {
    return agentRepository.filter(agent => agent.type === type)
  }

  // Ativar/Desativar agente
  toggleAgentStatus(agentId: string): Agent {
    const agent = agentRepository.findById(agentId)
    if (!agent) {
      throw new Error('Agente não encontrado')
    }

    return agentRepository.update(agentId, { 
      isActive: !agent.isActive 
    })
  }

  // Adicionar fonte de dados a um agente
  addDataSourceToAgent(agentId: string, dataSource: any): Agent {
    const agent = agentRepository.findById(agentId)
    if (!agent) {
      throw new Error('Agente não encontrado')
    }

    return agentRepository.update(agentId, {
      dataSources: [...agent.dataSources, dataSource]
    })
  }

  // Métricas básicas de agentes
  getAgentMetrics() {
    const totalAgents = agentRepository.count()
    const activeAgents = agentRepository.filter(agent => agent.isActive).length

    return {
      totalAgents,
      activeAgents,
      inactiveAgents: totalAgents - activeAgents,
      agentTypeDistribution: Object.values(AgentType).reduce((acc, type) => {
        acc[type] = agentRepository.filter(agent => agent.type === type).length
        return acc
      }, {} as Record<AgentType, number>)
    }
  }
}

export const agentService = new AgentService()

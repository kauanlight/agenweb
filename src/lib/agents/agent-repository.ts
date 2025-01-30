import { Agent, validateAgent } from "@/types/agent"
import { v4 as uuidv4 } from 'uuid'

export class AgentRepository {
  private agents: Map<string, Agent> = new Map()

  // Criar novo agente
  create(agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Agent {
    const newAgent: Agent = {
      ...agentData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    if (!validateAgent(newAgent)) {
      throw new Error('Dados do agente inválidos')
    }

    this.agents.set(newAgent.id, newAgent)
    return newAgent
  }

  // Atualizar agente existente
  update(id: string, updateData: Partial<Agent>): Agent {
    const existingAgent = this.agents.get(id)
    if (!existingAgent) {
      throw new Error('Agente não encontrado')
    }

    const updatedAgent: Agent = {
      ...existingAgent,
      ...updateData,
      updatedAt: new Date()
    }

    if (!validateAgent(updatedAgent)) {
      throw new Error('Dados atualizados inválidos')
    }

    this.agents.set(id, updatedAgent)
    return updatedAgent
  }

  // Buscar agente por ID
  findById(id: string): Agent | undefined {
    return this.agents.get(id)
  }

  // Listar todos os agentes
  listAll(): Agent[] {
    return Array.from(this.agents.values())
  }

  // Filtrar agentes
  filter(predicate: (agent: Agent) => boolean): Agent[] {
    return Array.from(this.agents.values()).filter(predicate)
  }

  // Deletar agente
  delete(id: string): boolean {
    return this.agents.delete(id)
  }

  // Contar agentes
  count(): number {
    return this.agents.size
  }
}

// Singleton para gerenciar agentes globalmente
export const agentRepository = new AgentRepository()

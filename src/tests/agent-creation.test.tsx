import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CriarAgentePage from '@/app/agentes/criar/page'
import { AgentType, LanguageCode } from '@/types/agent'

// Mock do fetch global
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 'test-agent-id' })
  })
) as jest.Mock

describe('Criação de Agente', () => {
  beforeEach(() => {
    render(<CriarAgentePage />)
  })

  it('renderiza o formulário de criação', () => {
    expect(screen.getByText('Criar Novo Agente AI')).toBeInTheDocument()
    expect(screen.getByText('Nome do Agente')).toBeInTheDocument()
  })

  it('valida campos obrigatórios', async () => {
    const submitButton = screen.getByText('Criar Agente')
    
    fireEvent.click(submitButton)

    // Verificar mensagens de erro
    await waitFor(() => {
      expect(screen.getByText('Nome deve ter no mínimo 3 caracteres')).toBeInTheDocument()
    })
  })

  it('submete formulário corretamente', async () => {
    // Preencher campos
    const nomeInput = screen.getByPlaceholderText('Digite o nome do agente')
    fireEvent.change(nomeInput, { target: { value: 'Agente Teste' } })

    const submitButton = screen.getByText('Criar Agente')
    fireEvent.click(submitButton)

    // Verificar chamada de API
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/agents', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }))
    })
  })
})

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/page'

// Mocks globais
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}))

// Mock das funções de mídia
const mockGetUserMedia = jest.fn()
const mockMediaRecorder = {
  start: jest.fn(),
  stop: jest.fn(),
  state: 'inactive',
  ondataavailable: jest.fn(),
  onstop: jest.fn()
}

// Mock do serviço OpenAI
jest.mock('@/lib/llm/openai-service', () => ({
  openaiService: {
    transcribeAudio: jest.fn().mockResolvedValue('Transcrição de teste'),
    generateResponse: jest.fn().mockResolvedValue('Resposta de teste'),
    synthesizeSpeech: jest.fn().mockResolvedValue(new Blob())
  }
}))

describe('Teste de Permissão de Microfone', () => {
  beforeEach(() => {
    // Configurar mocks globais
    global.navigator.mediaDevices = {
      getUserMedia: mockGetUserMedia
    } as any

    global.MediaRecorder = jest.fn(() => mockMediaRecorder) as any
    global.AudioContext = jest.fn(() => ({
      createMediaStreamSource: jest.fn().mockReturnValue({
        connect: jest.fn()
      }),
      createAnalyser: jest.fn().mockReturnValue({
        frequencyBinCount: 1024,
        getByteFrequencyData: jest.fn().mockImplementation((dataArray) => {
          // Preencher array com valores simulados
          for (let i = 0; i < dataArray.length; i++) {
            dataArray[i] = 50  // Volume simulado
          }
        })
      })
    })) as any
    
    // Limpar mocks antes de cada teste
    mockGetUserMedia.mockClear()
    mockMediaRecorder.start.mockClear()
    mockMediaRecorder.stop.mockClear()
  })

  test('Renderização inicial', () => {
    render(<Home />)
    
    // Verificar elementos principais
    expect(screen.getByText(/Transforme seu Atendimento com IA/i)).toBeInTheDocument()
    expect(screen.getByText(/AgenWeb/i)).toBeInTheDocument()
  })

  test('Botão de microfone deve estar visível', () => {
    render(<Home />)
    const micButton = screen.getByLabelText(/iniciar gravação por voz/i)
    expect(micButton).toBeInTheDocument()
  })

  test('Fluxo de permissão de microfone bem-sucedido', async () => {
    // Simular permissão concedida
    mockGetUserMedia.mockResolvedValue({
      getAudioTracks: () => [{
        getCapabilities: () => ({}),
        getSettings: () => ({ deviceId: 'test-device' }),
        label: 'Test Microphone',
        stop: jest.fn()
      }],
      getTracks: () => [{ stop: jest.fn() }]
    })

    render(<Home />)
    const micButton = screen.getByLabelText(/iniciar gravação por voz/i)
    
    fireEvent.click(micButton)

    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith(
        expect.objectContaining({
          audio: expect.objectContaining({
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          })
        })
      )
    })
  })

  test('Tratamento de negação de permissão', async () => {
    // Simular erro de permissão
    mockGetUserMedia.mockRejectedValue(
      new DOMException('Permissão negada', 'NotAllowedError')
    )

    render(<Home />)
    const micButton = screen.getByLabelText(/iniciar gravação por voz/i)
    
    fireEvent.click(micButton)

    await waitFor(() => {
      const errorDialog = screen.getByText(/Permissão de microfone negada/i)
      expect(errorDialog).toBeInTheDocument()
    })
  })

  test('Responsividade do layout', () => {
    // Testes de responsividade
    const breakpoints = [
      { width: 375, height: 667 },   // Mobile pequeno
      { width: 768, height: 1024 },  // Tablet
      { width: 1024, height: 768 },  // Desktop
      { width: 1440, height: 900 }   // Desktop grande
    ]

    breakpoints.forEach(({ width, height }) => {
      // Definir viewport
      Object.defineProperty(window, 'innerWidth', { value: width })
      Object.defineProperty(window, 'innerHeight', { value: height })
      window.dispatchEvent(new Event('resize'))

      const { container } = render(<Home />)

      // Verificar elementos principais
      const heroSection = container.querySelector('section')
      expect(heroSection).toBeInTheDocument()

      // Verificar classes responsivas
      expect(heroSection).toHaveClass('grid')
      expect(heroSection).toHaveClass('md:grid-cols-2')
    })
  })

  test('Elementos de acessibilidade', () => {
    render(<Home />)
    
    // Verificar botões com aria-labels
    const micButton = screen.getByLabelText(/iniciar gravação por voz/i)
    expect(micButton).toHaveAttribute('aria-label')
    
    // Verificar contraste de cores
    const heroTitle = screen.getByText(/Transforme seu Atendimento com IA/i)
    const computedStyle = window.getComputedStyle(heroTitle)
    
    // Verificar contraste básico
    expect(computedStyle.color).not.toBe(computedStyle.backgroundColor)
  })
})

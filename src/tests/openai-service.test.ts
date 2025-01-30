import { OpenAIService } from '@/lib/llm/openai-service'
import { Agent, AgentType, LanguageCode, PersonalityTrait } from '@/types/agent'

// Mock OpenAI
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ 
            message: { 
              content: 'Resposta de teste do assistente' 
            } 
          }]
        })
      }
    },
    audio: {
      transcriptions: {
        create: jest.fn().mockResolvedValue({ text: 'Transcrição de teste' })
      },
      speech: {
        create: jest.fn().mockResolvedValue(new Blob(['audio teste']))
      }
    }
  }))
})

describe('OpenAI Service', () => {
  let openaiService: OpenAIService
  let mockAgent: Agent

  beforeEach(() => {
    openaiService = new OpenAIService()
    mockAgent = {
      id: 'test-agent',
      name: 'Agente Teste',
      type: AgentType.CUSTOMER_SUPPORT,
      primaryLanguage: LanguageCode.PT_BR,
      personalityTraits: [PersonalityTrait.FRIENDLY],
      maxContextTokens: 2048,
      temperature: 0.7,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      dataSources: [],
      supportedLanguages: [LanguageCode.PT_BR]
    }
  })

  it('deve gerar resposta de IA', async () => {
    const response = await openaiService.generateResponse(
      mockAgent, 
      'Contexto de teste', 
      'Qual é a sua função?'
    )

    expect(response).toBe('Resposta de teste do assistente')
  })

  it('deve transcrever áudio', async () => {
    const mockAudioFile = new File(['audio'], 'audio.mp3', { type: 'audio/mpeg' })
    const transcription = await openaiService.transcribeAudio(mockAudioFile)

    expect(transcription).toBe('Transcrição de teste')
  })

  it('deve sintetizar voz', async () => {
    const speech = await openaiService.synthesizeSpeech('Texto de teste')

    expect(speech).toBeInstanceOf(Blob)
  })
})

import { PrismaClient } from '@prisma/client'
import { AgentType, LanguageCode, PersonalityTrait, DataSourceType } from '@/types/agent'

const prisma = new PrismaClient()

describe('Prisma Agent Repository', () => {
  afterEach(async () => {
    await prisma.agent.deleteMany()
  })

  it('should create an agent', async () => {
    const agent = await prisma.agent.create({
      data: {
        name: 'Test Agent',
        type: AgentType.CUSTOMER_SUPPORT,
        primaryLanguage: LanguageCode.PT_BR,
        personalityTraits: [PersonalityTrait.FRIENDLY],
        dataSources: {
          create: [{
            type: DataSourceType.MANUAL,
            uri: 'https://example.com/manual'
          }]
        }
      }
    })

    expect(agent).toBeDefined()
    expect(agent.name).toBe('Test Agent')
  })

  it('should retrieve agent with data sources', async () => {
    const agent = await prisma.agent.create({
      data: {
        name: 'Retrieval Agent',
        type: AgentType.TECHNICAL,
        primaryLanguage: LanguageCode.EN_US,
        dataSources: {
          create: [
            { type: DataSourceType.CSV, uri: 'https://example.com/data.csv' },
            { type: DataSourceType.PDF, uri: 'https://example.com/docs.pdf' }
          ]
        }
      },
      include: { dataSources: true }
    })

    expect(agent.dataSources).toHaveLength(2)
    expect(agent.dataSources[0].type).toBe(DataSourceType.CSV)
  })
})

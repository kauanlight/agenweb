import { z } from "zod"

// Enums para padronização
export enum AgentType {
  CUSTOMER_SUPPORT = "CUSTOMER_SUPPORT",
  SALES = "SALES", 
  TECHNICAL = "TECHNICAL",
  HR = "HR",
  GENERAL = "GENERAL"
}

export enum LanguageCode {
  PT_BR = "PT_BR",
  EN_US = "EN_US",
  ES_ES = "ES_ES"
}

export enum DataSourceType {
  CSV = "CSV",
  PDF = "PDF", 
  WEBSITE = "WEBSITE",
  DATABASE = "DATABASE",
  MANUAL = "MANUAL"
}

export enum PersonalityTrait {
  PROFESSIONAL = "PROFESSIONAL",
  FRIENDLY = "FRIENDLY",
  TECHNICAL = "TECHNICAL", 
  EMPATHETIC = "EMPATHETIC"
}

// Esquemas de validação Zod
export const AgentTypeSchema = z.nativeEnum(AgentType)
export const LanguageCodeSchema = z.nativeEnum(LanguageCode)
export const DataSourceTypeSchema = z.nativeEnum(DataSourceType)
export const PersonalityTraitSchema = z.nativeEnum(PersonalityTrait)

// Esquema de fonte de dados
export const DataSourceSchema = z.object({
  type: DataSourceTypeSchema,
  uri: z.string().url(),
  lastSync: z.date().optional()
})

// Esquema de configuração de personalidade
export const PersonalityConfigSchema = z.object({
  traits: z.array(PersonalityTraitSchema).max(3),
  tone: z.string().optional(),
  formalityLevel: z.number().min(0).max(10).optional()
})

// Esquema completo de Agente
export const AgentSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  type: AgentTypeSchema,
  primaryLanguage: LanguageCodeSchema,
  supportedLanguages: z.array(LanguageCodeSchema).optional(),
  
  dataSources: z.array(DataSourceSchema).optional(),
  personalityTraits: z.array(PersonalityTraitSchema).max(3),
  personalityConfig: PersonalityConfigSchema.optional(),
  
  maxContextTokens: z.number().min(100).max(4000).default(2048),
  temperature: z.number().min(0).max(1).default(0.7),
  
  isActive: z.boolean().default(true),
  
  webhookUrl: z.string().url().optional(),
  apiKeys: z.record(z.string(), z.string()).optional(),
  
  createdAt: z.date(),
  updatedAt: z.date()
})

// Tipos inferidos dos esquemas
export type Agent = z.infer<typeof AgentSchema>
export type DataSource = z.infer<typeof DataSourceSchema>
export type PersonalityConfig = z.infer<typeof PersonalityConfigSchema>

// Função de validação
export function validateAgent(agent: unknown): agent is Agent {
  try {
    AgentSchema.parse(agent)
    return true
  } catch {
    return false
  }
}

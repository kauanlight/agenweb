import axios from 'axios'

export interface IntegrationConfig {
  name: string
  type: 'crm' | 'erp' | 'helpdesk' | 'payment'
  baseUrl: string
  authType: 'apiKey' | 'oauth'
  vertical: 'healthcare' | 'ecommerce' | 'education' | 'all'
}

export const EXTERNAL_INTEGRATIONS: IntegrationConfig[] = [
  {
    name: 'Zendesk',
    type: 'helpdesk',
    baseUrl: 'https://api.zendesk.com/v2',
    authType: 'oauth',
    vertical: 'all'
  },
  {
    name: 'Shopify',
    type: 'erp',
    baseUrl: 'https://api.shopify.com/admin/api/2023-04',
    authType: 'oauth',
    vertical: 'ecommerce'
  },
  {
    name: 'Salesforce',
    type: 'crm',
    baseUrl: 'https://login.salesforce.com/services/data/v54.0',
    authType: 'oauth',
    vertical: 'all'
  }
]

export class IntegrationService {
  private config: IntegrationConfig
  private apiKey?: string
  private accessToken?: string

  constructor(integrationName: string) {
    const integration = EXTERNAL_INTEGRATIONS.find(
      int => int.name.toLowerCase() === integrationName.toLowerCase()
    )
    
    if (!integration) {
      throw new Error(`Integração ${integrationName} não encontrada`)
    }
    
    this.config = integration
  }

  async authenticate(credentials: {
    apiKey?: string
    clientId?: string
    clientSecret?: string
  }) {
    switch(this.config.authType) {
      case 'apiKey':
        if (!credentials.apiKey) {
          throw new Error('API Key é necessária')
        }
        this.apiKey = credentials.apiKey
        break
      
      case 'oauth':
        if (!credentials.clientId || !credentials.clientSecret) {
          throw new Error('Client ID e Client Secret são necessários')
        }
        // Implementação simplificada de OAuth
        const response = await axios.post(
          `${this.config.baseUrl}/oauth/token`,
          {
            grant_type: 'client_credentials',
            client_id: credentials.clientId,
            client_secret: credentials.clientSecret
          }
        )
        this.accessToken = response.data.access_token
        break
    }
  }

  async makeRequest(
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any
  ) {
    if (!this.apiKey && !this.accessToken) {
      throw new Error('Autenticação não realizada')
    }

    try {
      const response = await axios({
        method,
        url: `${this.config.baseUrl}${endpoint}`,
        headers: {
          'Authorization': this.apiKey 
            ? `ApiKey ${this.apiKey}` 
            : `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        data
      })

      return response.data
    } catch (error) {
      console.error('Erro na integração:', error)
      throw error
    }
  }
}

export async function testIntegration(
  integrationName: string, 
  credentials: any
) {
  try {
    const service = new IntegrationService(integrationName)
    await service.authenticate(credentials)
    
    // Teste básico de conexão
    const result = await service.makeRequest('/test')
    return {
      success: true,
      message: 'Integração realizada com sucesso',
      data: result
    }
  } catch (error) {
    return {
      success: false,
      message: 'Falha na integração',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}

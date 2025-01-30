export interface ConversationNode {
  id: string
  type: 'start' | 'message' | 'question' | 'end'
  content: string
  options?: {
    text: string
    nextNodeId?: string
    condition?: (context: any) => boolean
  }[]
  action?: (context: any) => void
}

export interface ConversationFlow {
  id: string
  name: string
  vertical: 'healthcare' | 'ecommerce' | 'education'
  nodes: Record<string, ConversationNode>
  startNodeId: string
}

export const CONVERSATION_FLOWS: Record<string, ConversationFlow> = {
  healthcare_patient_intake: {
    id: 'healthcare_patient_intake',
    name: 'Triagem de Pacientes',
    vertical: 'healthcare',
    startNodeId: 'welcome',
    nodes: {
      'welcome': {
        id: 'welcome',
        type: 'start',
        content: 'Bem-vindo ao nosso sistema de triagem. Como posso ajudar hoje?',
        options: [
          { 
            text: 'Marcar Consulta', 
            nextNodeId: 'consultation_type' 
          },
          { 
            text: 'Dúvidas Médicas', 
            nextNodeId: 'medical_questions' 
          }
        ]
      },
      'consultation_type': {
        id: 'consultation_type',
        type: 'question',
        content: 'Que tipo de consulta você deseja agendar?',
        options: [
          { 
            text: 'Consulta Geral', 
            nextNodeId: 'general_consultation_details' 
          },
          { 
            text: 'Consulta Especializada', 
            nextNodeId: 'specialist_consultation' 
          }
        ]
      },
      'general_consultation_details': {
        id: 'general_consultation_details',
        type: 'message',
        content: 'Por favor, forneça alguns detalhes sobre sua consulta.',
        action: (context) => {
          // Lógica para coletar informações adicionais
        },
        options: [
          { 
            text: 'Continuar', 
            nextNodeId: 'schedule_confirmation' 
          }
        ]
      },
      'schedule_confirmation': {
        id: 'schedule_confirmation',
        type: 'end',
        content: 'Sua consulta foi agendada com sucesso!',
        action: (context) => {
          // Lógica para confirmar agendamento
        }
      }
    }
  },
  
  ecommerce_support: {
    id: 'ecommerce_support',
    name: 'Suporte de E-commerce',
    vertical: 'ecommerce',
    startNodeId: 'welcome',
    nodes: {
      'welcome': {
        id: 'welcome',
        type: 'start',
        content: 'Bem-vindo ao nosso suporte. Como podemos ajudar?',
        options: [
          { 
            text: 'Rastrear Pedido', 
            nextNodeId: 'order_tracking' 
          },
          { 
            text: 'Problema com Produto', 
            nextNodeId: 'product_issue' 
          }
        ]
      },
      'order_tracking': {
        id: 'order_tracking',
        type: 'question',
        content: 'Por favor, insira o número do seu pedido',
        action: (context) => {
          // Lógica de rastreamento
        },
        options: [
          { 
            text: 'Verificar Status', 
            nextNodeId: 'order_status' 
          }
        ]
      },
      'order_status': {
        id: 'order_status',
        type: 'end',
        content: 'Status do pedido: Em processamento',
        action: (context) => {
          // Lógica de detalhamento do status
        }
      }
    }
  }
}

export function getConversationFlow(
  flowId: string
): ConversationFlow | undefined {
  return CONVERSATION_FLOWS[flowId]
}

export function processConversationNode(
  flow: ConversationFlow, 
  currentNodeId: string, 
  userInput?: string
): { 
  currentNode: ConversationNode, 
  possibleNextNodes: string[] 
} {
  const currentNode = flow.nodes[currentNodeId]
  
  return {
    currentNode,
    possibleNextNodes: currentNode.options?.map(opt => opt.nextNodeId || '') || []
  }
}

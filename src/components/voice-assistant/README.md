# AssistPro AI - Módulo de Assistente de Voz

## Visão Geral
O módulo de Assistente de Voz do AssistPro AI é uma solução avançada para processamento e síntese de voz, projetado para fornecer uma experiência de interação de voz inteligente e flexível.

## Arquitetura

### Componentes Principais
- `VoiceAssistantSettings`: Configurações e gerenciamento do assistente
- `VoiceTranscription`: Captura e processamento de áudio
- `TTSStrategy`: Estratégia de síntese de voz

### Fluxo de Processamento
1. Captura de Áudio
2. Transcrição (Speech-to-Text)
3. Processamento de Intenção
4. Geração de Resposta
5. Síntese de Voz (Text-to-Speech)

## Providers Suportados
- Google Cloud TTS
- Microsoft Azure TTS
- Provedor Open Source
- Extensível para novos providers

## Configuração

### Variáveis de Ambiente
```bash
VOICE_PROVIDER=google  # Provider padrão
MAX_RECORDING_TIME=30  # Tempo máximo de gravação
VOICE_LANGUAGE=pt-BR   # Idioma padrão
```

## Extensibilidade
O sistema utiliza o padrão Strategy para permitir fácil integração de novos providers de TTS.

## Segurança
- Validação de entrada
- Limitação de tempo de gravação
- Autorização de endpoints

## Próximos Passos
- Integração com mais providers
- Suporte multilíngue
- Aprimoramento de IA

## Contribuição
Consulte as diretrizes de contribuição para adicionar novos providers ou melhorar o módulo.

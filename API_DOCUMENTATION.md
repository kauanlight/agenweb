# AssistPro AI - Documentação de API

## Visão Geral
Esta documentação descreve os endpoints de API para o módulo de Assistente de Voz.

## Autenticação
Todos os endpoints requerem autenticação via token JWT.

## Endpoints de Voz

### 1. Treinamento de Assistente
- **URL**: `/api/voice/train`
- **Método**: `POST`
- **Descrição**: Treina o assistente de voz com um prompt personalizado

#### Parâmetros de Requisição
```json
{
  "prompt_type": "custom",
  "prompt_text": "string",
  "language": "pt-BR"
}
```

#### Respostas
- **200 OK**: Treinamento iniciado
- **400 Bad Request**: Prompt inválido
- **401 Unauthorized**: Sem permissão

### 2. Iniciar Chamada
- **URL**: `/api/voice/call`
- **Método**: `POST`
- **Descrição**: Inicia uma chamada de voz simulada

#### Parâmetros de Requisição
```json
{
  "phone_number": "+55 (XX) XXXXX-XXXX",
  "prompt": "string"
}
```

#### Respostas
- **200 OK**: Chamada iniciada
- **400 Bad Request**: Número inválido
- **429 Too Many Requests**: Limite de chamadas excedido

### 3. Transcrição de Áudio
- **URL**: `/api/voice/transcribe`
- **Método**: `POST`
- **Descrição**: Transcreve arquivo de áudio para texto

#### Parâmetros de Requisição
- `file`: Arquivo de áudio (multipart/form-data)

#### Respostas
- **200 OK**: 
```json
{
  "transcripts": ["string"],
  "language": "pt-BR"
}
```
- **413 Payload Too Large**: Arquivo muito grande
- **415 Unsupported Media Type**: Formato de áudio inválido

### 4. Síntese de Voz
- **URL**: `/api/voice/synthesize`
- **Método**: `POST`
- **Descrição**: Converte texto para áudio

#### Parâmetros de Requisição
```json
{
  "text": "string",
  "voice": "female|male",
  "language": "pt-BR",
  "provider": "google|azure"
}
```

#### Respostas
- **200 OK**: Áudio em base64
- **400 Bad Request**: Texto inválido

## Códigos de Erro
- `VOICE_001`: Erro de transcrição
- `VOICE_002`: Erro de síntese
- `VOICE_003`: Limite de uso excedido

## Exemplos de Uso

### Python (Requests)
```python
import requests

# Treinamento
response = requests.post('/api/voice/train', json={
    'prompt_type': 'custom',
    'prompt_text': 'Assistente de suporte técnico'
})

# Chamada
response = requests.post('/api/voice/call', json={
    'phone_number': '+55 (11) 99999-9999',
    'prompt': 'Chamada de teste'
})
```

### JavaScript (Fetch)
```javascript
// Transcrição
const formData = new FormData();
formData.append('file', audioBlob);

const response = await fetch('/api/voice/transcribe', {
    method: 'POST',
    body: formData
});
```

## Considerações
- Limite de 30 segundos por gravação
- Suporte para português brasileiro
- Múltiplos providers de TTS

## Próximas Versões
- Suporte multilíngue
- Mais providers de TTS
- Análise de sentimento em transcrições

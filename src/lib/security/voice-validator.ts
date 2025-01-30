export class VoiceValidator {
  // Validação de número de telefone brasileiro
  static validatePhoneNumber(phoneNumber: string): boolean {
    const brazilianPhoneRegex = /^(\+55\s?)?(\(?\d{2}\)?[\s-]?)?\d{4,5}[-\s]?\d{4}$/;
    return brazilianPhoneRegex.test(phoneNumber);
  }

  // Validação de texto para síntese de voz
  static validateTextForSynthesis(text: string): boolean {
    // Verificações de segurança e qualidade
    if (!text || text.trim() === '') {
      return false;
    }

    // Limite de caracteres
    if (text.length > 1000) {
      return false;
    }

    // Remover caracteres especiais potencialmente perigosos
    const sanitizedText = this.sanitizeText(text);

    // Verificar presença de conteúdo significativo
    const significantContentRegex = /[a-zA-Z0-9\u00C0-\u00FF]{3,}/;
    return significantContentRegex.test(sanitizedText);
  }

  // Sanitização de texto para prevenir injeções
  static sanitizeText(text: string): string {
    // Remover tags HTML
    const htmlTagsRegex = /<[^>]*>/g;
    
    // Remover scripts
    const scriptTagsRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    
    // Remover caracteres de controle
    const controlCharsRegex = /[\x00-\x1F\x7F]/g;

    return text
      .replace(htmlTagsRegex, '')
      .replace(scriptTagsRegex, '')
      .replace(controlCharsRegex, '')
      .trim();
  }

  // Verificação de linguagem suportada
  static isSupportedLanguage(language: string): boolean {
    const supportedLanguages = ['pt-BR', 'en-US', 'es-ES'];
    return supportedLanguages.includes(language);
  }

  // Validação de prompt para treinamento
  static validateTrainingPrompt(prompt: string, type: string): boolean {
    if (!prompt || prompt.trim() === '') {
      return false;
    }

    const validTypes = ['custom', 'predefined', 'faq'];
    if (!validTypes.includes(type)) {
      return false;
    }

    // Limite de caracteres baseado no tipo de prompt
    const maxLengths: { [key: string]: number } = {
      'custom': 500,
      'predefined': 300,
      'faq': 200
    };

    return prompt.length <= maxLengths[type];
  }

  // Autorização de chamada de voz
  static async authorizeVoiceCall(userId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/auth/voice-permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const { authorized } = await response.json();
      return authorized;
    } catch (error) {
      console.error('Erro na autorização de chamada de voz', error);
      return false;
    }
  }

  // Validação de tamanho do áudio
  static validateAudioSize(audioBlob: Blob, maxSizeInMB: number = 10): boolean {
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    return audioBlob.size <= maxSizeInBytes;
  }

  // Validação de duração do áudio
  static validateAudioDuration(audioDuration: number, maxDuration: number = 30): boolean {
    return audioDuration <= maxDuration;
  }
}

// Exemplo de uso
export function processVoiceInput(input: string) {
  if (!VoiceValidator.validateTextForSynthesis(input)) {
    throw new Error('Entrada de texto inválida');
  }

  const sanitizedInput = VoiceValidator.sanitizeText(input);
  // Processar entrada sanitizada
}

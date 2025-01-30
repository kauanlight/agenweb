export interface TTSProvider {
  synthesize(text: string, options?: TTSOptions): Promise<string>;
}

export interface TTSOptions {
  language?: string;
  voice?: string;
  pitch?: number;
  speed?: number;
}

export class TTSStrategy {
  private providers: Record<string, TTSProvider> = {};
  private currentProvider: string = 'default';

  registerProvider(name: string, provider: TTSProvider) {
    this.providers[name] = provider;
  }

  setCurrentProvider(name: string) {
    if (!this.providers[name]) {
      throw new Error(`Provider ${name} not registered`);
    }
    this.currentProvider = name;
  }

  async synthesize(text: string, options?: TTSOptions): Promise<string> {
    const provider = this.providers[this.currentProvider];
    
    if (!provider) {
      throw new Error('No TTS provider configured');
    }

    return provider.synthesize(text, options);
  }

  getAvailableProviders(): string[] {
    return Object.keys(this.providers);
  }
}

// Providers de exemplo
export class GoogleTTSProvider implements TTSProvider {
  async synthesize(text: string, options?: TTSOptions): Promise<string> {
    // Implementação mock
    return btoa(text);
  }
}

export class AzureTTSProvider implements TTSProvider {
  async synthesize(text: string, options?: TTSOptions): Promise<string> {
    // Implementação mock
    return btoa(`Azure: ${text}`);
  }
}

export class OpenSourceTTSProvider implements TTSProvider {
  async synthesize(text: string, options?: TTSOptions): Promise<string> {
    // Implementação mock
    return btoa(`OpenSource: ${text}`);
  }
}

// Singleton
export const ttsManager = new TTSStrategy();

// Registrar providers padrão
ttsManager.registerProvider('google', new GoogleTTSProvider());
ttsManager.registerProvider('azure', new AzureTTSProvider());
ttsManager.registerProvider('open-source', new OpenSourceTTSProvider());

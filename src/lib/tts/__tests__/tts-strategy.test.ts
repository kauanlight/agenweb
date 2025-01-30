import { 
  TTSStrategy, 
  GoogleTTSProvider, 
  AzureTTSProvider, 
  OpenSourceTTSProvider 
} from '../tts-strategy';

describe('TTSStrategy', () => {
  let ttsManager: TTSStrategy;
  
  beforeEach(() => {
    ttsManager = new TTSStrategy();
  });

  it('registers and sets providers', () => {
    const mockProvider = {
      synthesize: jest.fn().mockResolvedValue('test')
    };

    ttsManager.registerProvider('mock', mockProvider);
    ttsManager.setCurrentProvider('mock');

    expect(ttsManager.getAvailableProviders()).toContain('mock');
  });

  it('throws error for unregistered provider', () => {
    expect(() => {
      ttsManager.setCurrentProvider('nonexistent');
    }).toThrow('Provider nonexistent not registered');
  });

  it('synthesizes text with default providers', async () => {
    const googleProvider = new GoogleTTSProvider();
    const azureProvider = new AzureTTSProvider();
    const openSourceProvider = new OpenSourceTTSProvider();

    const googleSpy = jest.spyOn(googleProvider, 'synthesize');
    const azureSpy = jest.spyOn(azureProvider, 'synthesize');
    const openSourceSpy = jest.spyOn(openSourceProvider, 'synthesize');

    ttsManager.registerProvider('google', googleProvider);
    ttsManager.registerProvider('azure', azureProvider);
    ttsManager.registerProvider('open-source', openSourceProvider);

    ttsManager.setCurrentProvider('google');
    await ttsManager.synthesize('Teste Google');
    expect(googleSpy).toHaveBeenCalledWith('Teste Google', undefined);

    ttsManager.setCurrentProvider('azure');
    await ttsManager.synthesize('Teste Azure');
    expect(azureSpy).toHaveBeenCalledWith('Teste Azure', undefined);

    ttsManager.setCurrentProvider('open-source');
    await ttsManager.synthesize('Teste Open Source');
    expect(openSourceSpy).toHaveBeenCalledWith('Teste Open Source', undefined);
  });
});

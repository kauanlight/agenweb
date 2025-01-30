import { voiceLogger } from '../voice-logger';

describe('VoiceLogger', () => {
  beforeEach(() => {
    // Limpar logs antes de cada teste
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log voice events', () => {
    const mockLogEntry = {
      type: 'recording',
      success: true,
      details: 'Gravação iniciada'
    };

    const consoleSpy = jest.spyOn(console, 'log');
    voiceLogger.log(mockLogEntry);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'recording',
        success: true,
        details: 'Gravação iniciada'
      })
    );
  });

  it('should handle error logging', () => {
    const mockErrorEntry = {
      type: 'transcription',
      success: false,
      details: 'Falha na transcrição'
    };

    const consoleErrorSpy = jest.spyOn(console, 'error');
    voiceLogger.log(mockErrorEntry);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'transcription',
        success: false,
        details: 'Falha na transcrição'
      })
    );
  });
});

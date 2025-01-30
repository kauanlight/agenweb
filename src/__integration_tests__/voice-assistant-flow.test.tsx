import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VoiceAssistantSettings } from '@/components/voice-assistant/voice-settings';
import { VoiceTranscription } from '@/components/voice-assistant/voice-transcription';
import { ttsManager } from '@/lib/tts/tts-strategy';
import { VoiceValidator } from '@/lib/security/voice-validator';
import { voiceLogger } from '@/lib/logging/voice-logger';

// Mock global fetch e APIs
global.fetch = jest.fn();
global.navigator.mediaDevices = {
  getUserMedia: jest.fn(() => Promise.resolve({
    getTracks: () => [{ stop: jest.fn() }]
  }))
} as any;

describe('Voice Assistant Integration Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    voiceLogger.getLogs().length = 0; // Limpar logs
  });

  it('completes full voice assistant workflow', async () => {
    // Mock respostas de API
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ json: () => Promise.resolve({ status: 'training_simulated' }) }) // Train
      .mockResolvedValueOnce({ json: () => Promise.resolve({ call_sid: 'mock_call_123' }) }) // Call
      .mockResolvedValueOnce({ json: () => Promise.resolve({ transcripts: ['Teste de transcrição'] }) }); // Transcribe

    render(
      <>
        <VoiceAssistantSettings />
        <VoiceTranscription />
      </>
    );

    // Ativar assistente de voz
    const voiceSwitch = screen.getByRole('switch', { name: /Assistente de Voz Ativo/i });
    fireEvent.click(voiceSwitch);

    // Configurar prompt personalizado
    const promptInput = screen.getByPlaceholderText('Defina um prompt personalizado para o assistente');
    fireEvent.change(promptInput, { target: { value: 'Assistente de teste' } });

    // Treinar assistente
    const trainButton = screen.getByText('Treinar Assistente');
    fireEvent.click(trainButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/voice/train', expect.any(Object));
    });

    // Testar chamada
    const phoneInput = screen.getByPlaceholderText('+55 (XX) XXXXX-XXXX');
    fireEvent.change(phoneInput, { target: { value: '+55 (11) 99999-9999' } });

    const testCallButton = screen.getByText('Testar Chamada');
    fireEvent.click(testCallButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/voice/call', expect.any(Object));
    });

    // Iniciar gravação
    const startRecordingButton = screen.getByText('Iniciar Gravação');
    fireEvent.click(startRecordingButton);

    // Parar gravação
    const stopRecordingButton = screen.getByText('Parar Gravação');
    fireEvent.click(stopRecordingButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/voice/transcribe', expect.any(Object));
      expect(screen.getByText('Teste de transcrição')).toBeInTheDocument();
    });

    // Verificar logs
    const logs = voiceLogger.getLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.some(log => log.type === 'recording' && log.success)).toBeTruthy();
  });

  it('handles invalid inputs', async () => {
    render(
      <>
        <VoiceAssistantSettings />
        <VoiceTranscription />
      </>
    );

    // Testar número de telefone inválido
    const phoneInput = screen.getByPlaceholderText('+55 (XX) XXXXX-XXXX');
    fireEvent.change(phoneInput, { target: { value: '123' } });

    const testCallButton = screen.getByText('Testar Chamada');
    fireEvent.click(testCallButton);

    await waitFor(() => {
      expect(screen.getByText('Número Inválido')).toBeInTheDocument();
    });

    // Testar prompt inválido
    const promptInput = screen.getByPlaceholderText('Defina um prompt personalizado para o assistente');
    fireEvent.change(promptInput, { target: { value: '<script>alert("test")</script>' } });

    const trainButton = screen.getByText('Treinar Assistente');
    fireEvent.click(trainButton);

    await waitFor(() => {
      expect(screen.getByText('Prompt Inválido')).toBeInTheDocument();
    });
  });

  it('tests TTS provider switching', () => {
    const googleProvider = ttsManager.getAvailableProviders().includes('google');
    const azureProvider = ttsManager.getAvailableProviders().includes('azure');

    expect(googleProvider).toBeTruthy();
    expect(azureProvider).toBeTruthy();

    // Trocar provider
    ttsManager.setCurrentProvider('azure');
    expect(ttsManager.getCurrentProvider()).toBe('azure');
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VoiceAssistantDemo } from '@/components/voice-assistant/voice-demo';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { VoiceValidator } from '@/lib/security/voice-validator';
import { voiceLogger } from '@/lib/logging/voice-logger';

// Mocks globais
jest.mock('@/hooks/use-voice-assistant', () => ({
  useVoiceAssistant: jest.fn()
}));

jest.mock('@/lib/security/voice-validator', () => ({
  VoiceValidator: {
    validateTextForSynthesis: jest.fn(),
    validatePhoneNumber: jest.fn()
  }
}));

jest.mock('@/lib/logging/voice-logger', () => ({
  voiceLogger: {
    log: jest.fn()
  }
}));

describe('Integração do Assistente de Voz', () => {
  const mockStartRecording = jest.fn();
  const mockStopRecording = jest.fn();
  const mockSynthesizeSpeech = jest.fn();

  beforeEach(() => {
    // Configuração padrão dos mocks
    (useVoiceAssistant as jest.Mock).mockReturnValue({
      isRecording: false,
      transcripts: [],
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      synthesizeSpeech: mockSynthesizeSpeech
    });

    (VoiceValidator.validateTextForSynthesis as jest.Mock).mockReturnValue(true);
    (VoiceValidator.validatePhoneNumber as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Fluxo Completo de Gravação e Transcrição', () => {
    it('deve realizar gravação e transcrição completa', async () => {
      // Simular fluxo completo de gravação
      (useVoiceAssistant as jest.Mock).mockReturnValueOnce({
        isRecording: false,
        transcripts: [],
        startRecording: mockStartRecording,
        stopRecording: mockStopRecording,
        synthesizeSpeech: mockSynthesizeSpeech
      }).mockReturnValueOnce({
        isRecording: true,
        transcripts: [],
        startRecording: mockStartRecording,
        stopRecording: mockStopRecording,
        synthesizeSpeech: mockSynthesizeSpeech
      }).mockReturnValueOnce({
        isRecording: false,
        transcripts: ['Transcrição de teste'],
        startRecording: mockStartRecording,
        stopRecording: mockStopRecording,
        synthesizeSpeech: mockSynthesizeSpeech
      });

      render(<VoiceAssistantDemo />);
      
      // Iniciar gravação
      const startButton = screen.getByText('Iniciar Gravação');
      fireEvent.click(startButton);
      expect(mockStartRecording).toHaveBeenCalledTimes(1);

      // Parar gravação
      const stopButton = screen.getByText('Parar Gravação');
      fireEvent.click(stopButton);
      expect(mockStopRecording).toHaveBeenCalledTimes(1);

      // Verificar transcrição
      await waitFor(() => {
        expect(screen.getByText('Transcrição de teste')).toBeInTheDocument();
      });
    });
  });

  describe('Validações de Segurança', () => {
    it('deve impedir síntese com texto inválido', () => {
      (VoiceValidator.validateTextForSynthesis as jest.Mock).mockReturnValue(false);

      render(<VoiceAssistantDemo />);
      
      const input = screen.getByPlaceholderText('Digite texto para síntese de voz');
      const synthesizeButton = screen.getByText('Sintetizar Voz');

      fireEvent.change(input, { target: { value: 'Texto inválido' } });
      fireEvent.click(synthesizeButton);

      expect(VoiceValidator.validateTextForSynthesis).toHaveBeenCalledWith('Texto inválido');
      expect(mockSynthesizeSpeech).not.toHaveBeenCalled();
      expect(voiceLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'validation',
          success: false
        })
      );
    });
  });

  describe('Logging e Monitoramento', () => {
    it('deve registrar eventos de voz', () => {
      render(<VoiceAssistantDemo />);
      
      const input = screen.getByPlaceholderText('Digite texto para síntese de voz');
      const synthesizeButton = screen.getByText('Sintetizar Voz');

      fireEvent.change(input, { target: { value: 'Texto de teste' } });
      fireEvent.click(synthesizeButton);

      expect(voiceLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'synthesis',
          success: true
        })
      );
    });
  });

  describe('Performance e Limite de Recursos', () => {
    it('deve limitar o tamanho do texto para síntese', () => {
      const longText = 'a'.repeat(1001); // Texto maior que 1000 caracteres

      render(<VoiceAssistantDemo />);
      
      const input = screen.getByPlaceholderText('Digite texto para síntese de voz');
      const synthesizeButton = screen.getByText('Sintetizar Voz');

      fireEvent.change(input, { target: { value: longText } });
      fireEvent.click(synthesizeButton);

      expect(VoiceValidator.validateTextForSynthesis).toHaveBeenCalledWith(longText);
      expect(mockSynthesizeSpeech).not.toHaveBeenCalled();
      expect(voiceLogger.log).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'validation',
          success: false,
          details: expect.stringContaining('Texto muito longo')
        })
      );
    });
  });
});

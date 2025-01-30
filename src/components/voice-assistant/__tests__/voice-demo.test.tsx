import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VoiceAssistantDemo } from '../voice-demo';
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { VoiceValidator } from '@/lib/security/voice-validator';

// Mock dos hooks e validadores
jest.mock('@/hooks/use-voice-assistant', () => ({
  useVoiceAssistant: jest.fn()
}));

jest.mock('@/lib/security/voice-validator', () => ({
  VoiceValidator: {
    validateTextForSynthesis: jest.fn()
  }
}));

describe('VoiceAssistantDemo', () => {
  const mockStartRecording = jest.fn();
  const mockStopRecording = jest.fn();
  const mockSynthesizeSpeech = jest.fn();

  beforeEach(() => {
    (useVoiceAssistant as jest.Mock).mockReturnValue({
      isRecording: false,
      transcripts: [],
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      synthesizeSpeech: mockSynthesizeSpeech
    });

    (VoiceValidator.validateTextForSynthesis as jest.Mock).mockReturnValue(true);
  });

  it('renderiza corretamente', () => {
    render(<VoiceAssistantDemo />);
    
    expect(screen.getByText('Demonstração de Voz')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Gravação')).toBeInTheDocument();
    expect(screen.getByText('Parar Gravação')).toBeInTheDocument();
    expect(screen.getByText('Sintetizar Voz')).toBeInTheDocument();
  });

  it('inicia gravação corretamente', () => {
    render(<VoiceAssistantDemo />);
    
    const startButton = screen.getByText('Iniciar Gravação');
    fireEvent.click(startButton);

    expect(mockStartRecording).toHaveBeenCalledTimes(1);
  });

  it('para gravação corretamente', () => {
    (useVoiceAssistant as jest.Mock).mockReturnValue({
      isRecording: true,
      transcripts: [],
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      synthesizeSpeech: mockSynthesizeSpeech
    });

    render(<VoiceAssistantDemo />);
    
    const stopButton = screen.getByText('Parar Gravação');
    fireEvent.click(stopButton);

    expect(mockStopRecording).toHaveBeenCalledTimes(1);
  });

  it('sintetiza voz com texto válido', async () => {
    render(<VoiceAssistantDemo />);
    
    const input = screen.getByPlaceholderText('Digite texto para síntese de voz');
    const synthesizeButton = screen.getByText('Sintetizar Voz');

    fireEvent.change(input, { target: { value: 'Texto de teste' } });
    fireEvent.click(synthesizeButton);

    expect(VoiceValidator.validateTextForSynthesis).toHaveBeenCalledWith('Texto de teste');
    expect(mockSynthesizeSpeech).toHaveBeenCalledWith('Texto de teste');
  });

  it('impede síntese com texto inválido', () => {
    (VoiceValidator.validateTextForSynthesis as jest.Mock).mockReturnValue(false);

    render(<VoiceAssistantDemo />);
    
    const input = screen.getByPlaceholderText('Digite texto para síntese de voz');
    const synthesizeButton = screen.getByText('Sintetizar Voz');

    fireEvent.change(input, { target: { value: 'Texto inválido' } });
    fireEvent.click(synthesizeButton);

    expect(VoiceValidator.validateTextForSynthesis).toHaveBeenCalledWith('Texto inválido');
    expect(mockSynthesizeSpeech).not.toHaveBeenCalled();
  });

  it('exibe transcrições quando disponíveis', () => {
    (useVoiceAssistant as jest.Mock).mockReturnValue({
      isRecording: false,
      transcripts: ['Transcrição de teste 1', 'Transcrição de teste 2'],
      startRecording: mockStartRecording,
      stopRecording: mockStopRecording,
      synthesizeSpeech: mockSynthesizeSpeech
    });

    render(<VoiceAssistantDemo />);
    
    expect(screen.getByText('Transcrição de teste 1')).toBeInTheDocument();
    expect(screen.getByText('Transcrição de teste 2')).toBeInTheDocument();
  });
});

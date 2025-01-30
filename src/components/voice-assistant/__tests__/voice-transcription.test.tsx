import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VoiceTranscription } from '../voice-transcription';
import { Toaster } from '@/components/ui/toaster';

// Mock das funções globais
const mockGetUserMedia = jest.fn();
const mockFetch = jest.fn();

beforeEach(() => {
  // Mock navigator.mediaDevices.getUserMedia
  Object.defineProperty(navigator, 'mediaDevices', {
    value: {
      getUserMedia: mockGetUserMedia
    },
    writable: true
  });

  // Mock global fetch
  global.fetch = mockFetch;

  // Configuração padrão dos mocks
  mockGetUserMedia.mockResolvedValue({
    getTracks: () => [{ stop: jest.fn() }]
  });

  mockFetch.mockResolvedValue({
    json: () => Promise.resolve({ 
      transcripts: ['Transcrição de teste'] 
    })
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('VoiceTranscription', () => {
  it('renderiza componentes de transcrição', () => {
    render(
      <>
        <VoiceTranscription />
        <Toaster />
      </>
    );

    expect(screen.getByText('Transcrição e Síntese de Voz')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Gravação')).toBeInTheDocument();
    expect(screen.getByText('Parar Gravação')).toBeInTheDocument();
  });

  it('inicia e para gravação corretamente', async () => {
    render(
      <>
        <VoiceTranscription />
        <Toaster />
      </>
    );

    // Iniciar gravação
    const startButton = screen.getByText('Iniciar Gravação');
    fireEvent.click(startButton);

    // Verificar se getUserMedia foi chamado
    await waitFor(() => {
      expect(mockGetUserMedia).toHaveBeenCalledWith({ audio: true });
    });

    // Parar gravação
    const stopButton = screen.getByText('Parar Gravação');
    fireEvent.click(stopButton);

    // Verificar transcrição
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/voice/transcribe', expect.any(Object));
      expect(screen.getByText('Transcrição de teste')).toBeInTheDocument();
    });
  });

  it('sintetiza texto corretamente', async () => {
    render(
      <>
        <VoiceTranscription />
        <Toaster />
      </>
    );

    const input = screen.getByPlaceholderText('Digite texto para síntese');
    const synthesizeButton = screen.getByText('Sintetizar');

    fireEvent.change(input, { target: { value: 'Texto de teste' } });
    fireEvent.click(synthesizeButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/voice/synthesize', expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      }));
    });
  });

  it('mostra erro ao falhar gravação', async () => {
    // Simular falha na gravação
    mockGetUserMedia.mockRejectedValue(new Error('Erro de microfone'));

    render(
      <>
        <VoiceTranscription />
        <Toaster />
      </>
    );

    const startButton = screen.getByText('Iniciar Gravação');
    fireEvent.click(startButton);

    await waitFor(() => {
      expect(screen.getByText('Erro de Gravação')).toBeInTheDocument();
    });
  });

  it('deve renderizar todos os itens do menu quando a sidebar está colapsada', async () => {
    render(
      <>
        <VoiceTranscription />
        <Toaster />
      </>
    );

    // Simular colapso da sidebar
    const sidebarToggle = screen.getByLabelText('Toggle menu');
    fireEvent.click(sidebarToggle);

    const menuItems = ['Visão Geral', 'Assistentes', 'Números de Telefone', 'Fluxos de Conversação', 'Biblioteca', 'Logs', 'Análise Técnica'];

    menuItems.forEach(item => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});

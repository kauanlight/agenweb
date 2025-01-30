import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VoiceAssistantSettings } from '../voice-settings';
import { Toaster } from '@/components/ui/toaster';

// Mock global fetch
global.fetch = jest.fn();

describe('VoiceAssistantSettings', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it('renders settings components', () => {
    render(
      <>
        <VoiceAssistantSettings />
        <Toaster />
      </>
    );

    expect(screen.getByText('Configurações do Assistente de Voz')).toBeInTheDocument();
    expect(screen.getByText('Assistente de Voz Ativo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+55 (XX) XXXXX-XXXX')).toBeInTheDocument();
  });

  it('handles training assistant', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ status: 'training_simulated' })
    });

    render(
      <>
        <VoiceAssistantSettings />
        <Toaster />
      </>
    );

    const voiceSwitch = screen.getByRole('switch', { name: /Assistente de Voz Ativo/i });
    fireEvent.click(voiceSwitch);

    const promptInput = screen.getByPlaceholderText('Defina um prompt personalizado para o assistente');
    fireEvent.change(promptInput, { target: { value: 'Test prompt' } });

    const trainButton = screen.getByText('Treinar Assistente');
    fireEvent.click(trainButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/voice/train', expect.any(Object));
    });
  });

  it('handles test call', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ call_sid: 'mock_call_123' })
    });

    render(
      <>
        <VoiceAssistantSettings />
        <Toaster />
      </>
    );

    const voiceSwitch = screen.getByRole('switch', { name: /Assistente de Voz Ativo/i });
    fireEvent.click(voiceSwitch);

    const phoneInput = screen.getByPlaceholderText('+55 (XX) XXXXX-XXXX');
    fireEvent.change(phoneInput, { target: { value: '+5511999999999' } });

    const testCallButton = screen.getByText('Testar Chamada');
    fireEvent.click(testCallButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/voice/call', expect.any(Object));
    });
  });
});

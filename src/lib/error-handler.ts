import React from 'react';
import { voiceLogger } from '@/lib/logging/voice-logger';

export class VoiceAssistantError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'VoiceAssistantError';
    this.code = code;
    this.details = details;
  }

  static fromFetch(response: Response): VoiceAssistantError {
    return new VoiceAssistantError(
      `Erro na requisição: ${response.status}`,
      'FETCH_ERROR',
      { status: response.status, statusText: response.statusText }
    );
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details
    };
  }
}

export class ErrorHandler extends React.Component<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
}, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.handleVoiceError(error);
  }

  handleVoiceError(error: Error) {
    try {
      voiceLogger.log({
        type: 'error',
        success: false,
        details: error.message
      });
    } catch (logError) {
      console.error('Falha ao registrar erro', logError);
    }
  }

  reportError(error: VoiceAssistantError) {
    this.handleVoiceError(error);
  }

  createErrorBoundary() {
    return class extends React.Component {
      state = { hasError: false };

      static getDerivedStateFromError(error: Error) {
        return { hasError: true };
      }

      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        ErrorHandler.prototype.handleVoiceError(error);
      }

      render() {
        if (this.state.hasError) {
          return this.props.fallback || <h1>Algo deu errado no Assistente de Voz</h1>;
        }

        return this.props.children;
      }
    };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <h1>Algo deu errado no Assistente de Voz</h1>;
    }

    return this.props.children;
  }
}

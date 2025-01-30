import { useState, useCallback, useRef } from 'react';
import { VoiceValidator } from '@/lib/security/voice-validator';
import { voiceLogger } from '@/lib/logging/voice-logger';
import { toast } from '@/components/ui/use-toast';

interface VoiceAssistantState {
  isRecording: boolean;
  transcripts: string[];
  error?: string;
}

export function useVoiceAssistant() {
  const [state, setState] = useState<VoiceAssistantState>({
    isRecording: false,
    transcripts: [],
    error: undefined
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = handleTranscribe;
      mediaRecorderRef.current.start();

      setState(prev => ({
        ...prev,
        isRecording: true,
        error: undefined
      }));

      voiceLogger.log({
        type: 'recording',
        success: true,
        details: 'Gravação iniciada'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState(prev => ({
        ...prev,
        isRecording: false,
        error: errorMessage
      }));

      voiceLogger.log({
        type: 'recording',
        success: false,
        details: `Falha ao iniciar gravação: ${errorMessage}`
      });

      toast({
        title: 'Erro na Gravação',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setState(prev => ({
        ...prev,
        isRecording: false
      }));
    }
  }, []);

  const handleTranscribe = useCallback(async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erro na transcrição');
      }

      const data = await response.json();
      
      if (data.transcripts) {
        setState(prev => ({
          ...prev,
          transcripts: data.transcripts
        }));

        voiceLogger.log({
          type: 'transcription',
          success: true,
          details: `Transcrições geradas: ${data.transcripts.length}`
        });

        toast({
          title: 'Transcrição Concluída',
          description: 'Áudio transcrito com sucesso!'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setState(prev => ({
        ...prev,
        error: errorMessage
      }));

      voiceLogger.log({
        type: 'transcription',
        success: false,
        details: `Falha na transcrição: ${errorMessage}`
      });

      toast({
        title: 'Erro na Transcrição',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, []);

  const synthesizeSpeech = useCallback(async (text: string) => {
    try {
      // Validar texto
      if (!VoiceValidator.validateTextForSynthesis(text)) {
        voiceLogger.log({
          type: 'validation',
          success: false,
          details: 'Texto inválido para síntese'
        });

        toast({
          title: 'Texto Inválido',
          description: 'O texto não atende aos requisitos para síntese.',
          variant: 'destructive'
        });
        return;
      }

      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Erro na síntese de voz');
      }

      const data = await response.json();

      if (data.audioUrl) {
        voiceLogger.log({
          type: 'synthesis',
          success: true,
          details: `Síntese de voz gerada: ${text.length} caracteres`
        });

        // Reproduzir áudio
        const audio = new Audio(data.audioUrl);
        audio.play();

        toast({
          title: 'Síntese de Voz',
          description: 'Áudio gerado com sucesso!'
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      voiceLogger.log({
        type: 'synthesis',
        success: false,
        details: `Falha na síntese: ${errorMessage}`
      });

      toast({
        title: 'Erro na Síntese',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, []);

  return {
    ...state,
    startRecording,
    stopRecording,
    synthesizeSpeech
  };
}

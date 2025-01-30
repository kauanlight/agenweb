"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

export function VoiceTranscription() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RECORDING_TIME = 30; // segundos

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = handleTranscribe;
      mediaRecorderRef.current.start();
      setIsRecording(true);
      startRecordingTimer();
    } catch (error) {
      toast({
        title: "Erro de Gravação",
        description: "Não foi possível iniciar a gravação de áudio.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopRecordingTimer();
    }
  };

  const startRecordingTimer = () => {
    setRecordingTime(0);
    recordingTimerRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= MAX_RECORDING_TIME) {
          stopRecording();
          return MAX_RECORDING_TIME;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const handleTranscribe = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (data.transcripts) {
        setTranscripts(data.transcripts);
        toast({
          title: "Transcrição Concluída",
          description: "Áudio transcrito com sucesso!",
        });
      }

      // Limpar chunks de áudio
      audioChunksRef.current = [];
    } catch (error) {
      toast({
        title: "Erro na Transcrição",
        description: "Não foi possível transcrever o áudio.",
        variant: "destructive"
      });
    }
  };

  const handleTextToSpeech = async (text: string) => {
    try {
      const response = await fetch('/api/voice/synthesize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      
      if (data.audio_content) {
        // Decodificar áudio base64
        const audioBlob = new Blob([atob(data.audio_content)], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audio.play();

        toast({
          title: "Síntese de Voz",
          description: "Texto convertido para áudio.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Síntese de Voz",
        description: "Não foi possível converter texto para áudio.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Transcrição e Síntese de Voz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex space-x-4">
          <Button 
            onClick={startRecording} 
            disabled={isRecording}
            variant="outline"
          >
            Iniciar Gravação
          </Button>
          <Button 
            onClick={stopRecording} 
            disabled={!isRecording}
            variant="destructive"
          >
            Parar Gravação
          </Button>
          {isRecording && (
            <p>Tempo de gravação: {recordingTime} segundos</p>
          )}
        </div>

        {transcripts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Transcrições:</h3>
            {transcripts.map((transcript, index) => (
              <div key={index} className="flex justify-between items-center mb-2">
                <p>{transcript}</p>
                <Button 
                  size="sm" 
                  variant="secondary"
                  onClick={() => handleTextToSpeech(transcript)}
                >
                  Ouvir
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

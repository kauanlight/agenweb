"use client";

import { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, toast } from "@/components/ui";
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { VoiceValidator } from '@/lib/security/voice-validator';

export function VoiceAssistantDemo() {
  const { 
    isRecording, 
    transcripts, 
    startRecording, 
    stopRecording,
    synthesizeSpeech
  } = useVoiceAssistant();

  const [demoText, setDemoText] = useState('');

  const handleSynthesizeSpeech = () => {
    if (!VoiceValidator.validateTextForSynthesis(demoText)) {
      toast({
        title: "Texto Inválido",
        description: "Por favor, insira um texto válido para síntese.",
        variant: "destructive"
      });
      return;
    }

    synthesizeSpeech(demoText);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Demonstração de Voz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
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
        </div>

        {transcripts.length > 0 && (
          <div className="bg-muted p-3 rounded-md">
            <h3 className="font-semibold mb-2">Transcrições:</h3>
            {transcripts.map((transcript, index) => (
              <p key={index} className="text-sm text-muted-foreground">
                {transcript}
              </p>
            ))}
          </div>
        )}

        <div className="flex space-x-2">
          <input 
            type="text"
            placeholder="Digite texto para síntese de voz"
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            className="flex-1 border p-2 rounded-md"
          />
          <Button 
            onClick={handleSynthesizeSpeech}
            variant="secondary"
          >
            Sintetizar Voz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

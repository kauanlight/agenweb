"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { useVoiceAssistant } from '@/hooks/use-voice-assistant';
import { VoiceValidator } from '@/lib/security/voice-validator';
import { voiceLogger } from '@/lib/logging/voice-logger';

export function VoiceAssistantSettings() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const { 
    isRecording, 
    startRecording, 
    stopRecording, 
    changeProvider,
    synthesizeSpeech
  } = useVoiceAssistant();

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    
    if (match) {
      return `+55 (${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return value;
  };

  const isValidPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const handleTrainAssistant = async () => {
    const sanitizedPrompt = VoiceValidator.sanitizeText(customPrompt);
    
    if (!VoiceValidator.validateTextForSynthesis(sanitizedPrompt)) {
      toast({
        title: "Prompt Inválido",
        description: "O prompt contém caracteres não permitidos.",
        variant: "destructive"
      });
      return;
    }

    voiceLogger.log({
      type: 'recording',
      success: true,
      details: 'Treinamento de assistente iniciado'
    });

    try {
      const response = await fetch('/api/voice/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt_type: 'custom',
          prompt_text: sanitizedPrompt
        })
      });

      const data = await response.json();
      
      if (data.status === 'training_simulated') {
        toast({
          title: "Treinamento Concluído",
          description: "Seu assistente de voz foi atualizado com sucesso!",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no Treinamento",
        description: "Não foi possível treinar o assistente de voz.",
        variant: "destructive"
      });
    }
  };

  const handleTestCall = async () => {
    const sanitizedPhone = VoiceValidator.sanitizeText(phoneNumber);
    
    if (!VoiceValidator.validatePhoneNumber(sanitizedPhone)) {
      toast({
        title: "Número Inválido",
        description: "Por favor, insira um número de telefone válido.",
        variant: "destructive"
      });
      return;
    }

    voiceLogger.log({
      type: 'recording',
      success: true,
      details: 'Teste de chamada iniciado'
    });

    try {
      const response = await fetch('/api/voice/call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: sanitizedPhone,
          prompt: customPrompt
        })
      });

      const data = await response.json();
      
      if (data.call_sid) {
        toast({
          title: "Chamada Iniciada",
          description: `Chamada simulada para ${phoneNumber}`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Chamada",
        description: "Não foi possível iniciar a chamada.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Configurações do Assistente de Voz</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="voice-assistant">Assistente de Voz Ativo</Label>
          <Switch
            id="voice-assistant"
            checked={isVoiceEnabled}
            onCheckedChange={setIsVoiceEnabled}
          />
        </div>

        <div className="space-y-2">
          <Label>Número de Telefone para Teste</Label>
          <Input 
            placeholder="+55 (XX) XXXXX-XXXX" 
            value={formatPhoneNumber(phoneNumber)}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Prompt Personalizado</Label>
          <Input 
            placeholder="Defina um prompt personalizado para o assistente" 
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <Button 
            onClick={handleTrainAssistant}
            disabled={!isVoiceEnabled}
          >
            Treinar Assistente
          </Button>
          <Button 
            variant="outline" 
            onClick={handleTestCall}
            disabled={!isVoiceEnabled || !isValidPhoneNumber(phoneNumber)}
          >
            Testar Chamada
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

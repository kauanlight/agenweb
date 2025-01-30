"use client";

import { VoiceAssistantSettings } from "@/components/voice-assistant/voice-settings";
import { VoiceTranscription } from "@/components/voice-assistant/voice-transcription";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VoiceAssistantPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Assistente de Voz</h1>
      
      <Tabs defaultValue="settings">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="transcription">Teste de Voz</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
          <VoiceAssistantSettings />
        </TabsContent>
        
        <TabsContent value="transcription">
          <VoiceTranscription />
        </TabsContent>
      </Tabs>
    </div>
  );
}

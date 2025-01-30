"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bot, 
  Mic, 
  Zap, 
  Globe, 
  Check, 
  Headphones, 
  ArrowRight,
  Send,
  StopCircle,
  AlertTriangle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { AgentType, LanguageCode, PersonalityTrait } from "@/types/agent";
import { openaiService } from "@/lib/llm/openai-service";
import { OnboardingModal, OnboardingData } from '@/components/onboarding/OnboardingModal';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    // Save onboarding data
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('onboardingData', JSON.stringify(data));
    
    // Close modal and redirect to dashboard
    setShowOnboarding(false);
    router.push('/dashboard');
  };

  const handleOnboardingClose = () => {
    setShowOnboarding(false);
    router.push('/dashboard');
  };

  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [microphoneError, setMicrophoneError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Configurações do agente de demonstração
  const demoAgent = {
    id: 'demo-agent-001',
    name: 'AssistPro Demo',
    type: AgentType.CUSTOMER_SUPPORT,
    primaryLanguage: LanguageCode.PT_BR,
    personalityTraits: [PersonalityTrait.FRIENDLY],
    maxContextTokens: 2048,
    temperature: 0.7,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    dataSources: [],
    supportedLanguages: [LanguageCode.PT_BR]
  };

  // Verificação de permissão de microfone
  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const tracks = stream.getAudioTracks();
      
      if (tracks.length === 0) {
        throw new Error('Nenhum dispositivo de áudio encontrado');
      }

      stream.getTracks().forEach(track => track.stop());
      setMicrophoneError(null);
      return true;
    } catch (error) {
      console.error('Erro de permissão de microfone:', error);
      
      let errorMessage = 'Não foi possível acessar o microfone.';
      if (error instanceof DOMException) {
        switch (error.name) {
          case 'NotAllowedError':
            errorMessage = 'Permissão de microfone negada. Verifique suas configurações.';
            break;
          case 'NotFoundError':
            errorMessage = 'Nenhum microfone encontrado. Conecte um dispositivo.';
            break;
          case 'OverconstrainedError':
            errorMessage = 'Configurações de microfone incompatíveis.';
            break;
        }
      }
      setMicrophoneError(errorMessage);
      return false;
    }
  };

  // Iniciar gravação de áudio
  const startRecording = async () => {
    const hasPermission = await checkMicrophonePermission();
    if (!hasPermission) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        try {
          const transcription = await openaiService.transcribeAudio(audioBlob);
          
          if (transcription) {
            setMessage(transcription);
            await handleSendMessage(transcription);
          }
        } catch (error) {
          console.error('Erro na transcrição:', error);
          setMicrophoneError('Não foi possível transcrever o áudio.');
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      setMicrophoneError('Não foi possível iniciar a gravação.');
    }
  };

  // Parar gravação de áudio
  const stopRecording = () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  };

  // Enviar mensagem
  const handleSendMessage = async (inputMessage?: string) => {
    const currentMessage = inputMessage || message;
    if (!currentMessage.trim()) return;

    const newConversation = [
      ...conversation, 
      { role: 'user', content: currentMessage }
    ];
    setConversation(newConversation);
    setMessage('');
    setIsLoading(true);

    try {
      const context = conversation
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      const response = await openaiService.generateResponse(
        demoAgent, 
        context, 
        currentMessage
      );

      setConversation(prev => [
        ...prev, 
        { role: 'assistant', content: response }
      ]);

      // Sintetizar resposta em voz
      try {
        const audioBlob = await openaiService.synthesizeSpeech(response);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
      } catch (audioError) {
        console.error('Erro na síntese de voz:', audioError);
      }
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      setConversation(prev => [
        ...prev, 
        { role: 'assistant', content: 'Desculpe, ocorreu um erro. Tente novamente.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Seções de recursos
  const capabilities = [
    {
      icon: Bot,
      title: "Atendimento Inteligente",
      description: "Resposta instantânea em múltiplos idiomas, com compreensão contextual avançada."
    },
    {
      icon: Globe,
      title: "Integração Multicanal",
      description: "Conecte-se com clientes em diferentes plataformas de forma unificada."
    },
    {
      icon: Zap,
      title: "Automação Inteligente",
      description: "Reduza tempos de espera e aumente a eficiência do seu atendimento."
    },
    {
      icon: Headphones,
      title: "Suporte 24/7",
      description: "Atendimento contínuo, sem pausas ou limites de horário."
    }
  ];

  return (
    <div className="min-h-screen w-full flex flex-col">
      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
        onComplete={handleOnboardingComplete}
      />
      {/* Seção Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-24 rounded-[30px]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 max-w-3xl mx-auto">
            Revolucione seu Atendimento com Inteligência Artificial
          </h1>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            AssistPro AI: Automatize, Personalize e Escale seu Atendimento ao Cliente
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/comece-agora">
              <Button size="lg" variant="secondary" className="shadow-lg">
                Iniciar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="hover:bg-white/10"
              >
                Agendar Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Recursos */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Recursos que Transformam seu Negócio
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="mb-6 flex justify-center">
                    <capability.icon className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{capability.title}</h3>
                  <p className="text-gray-600">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Demonstração de Chat */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 h-96 overflow-y-auto">
              {conversation.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.role === 'user'
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="text-center text-gray-500">
                  Digitando...
                </div>
              )}
            </div>

            <div className="p-6 border-t flex space-x-2">
              <Input 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-grow mr-4"
              />
              <Button 
                onClick={() => handleSendMessage()} 
                disabled={isLoading}
                variant="outline"
                size="icon"
              >
                <Send className="w-5 h-5" />
              </Button>
              <Button 
                onClick={isRecording ? stopRecording : startRecording}
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                aria-label={isRecording ? "Parar gravação" : "Iniciar gravação por voz"}
              >
                {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Chamada para Ação */}
      <section className="bg-blue-600 text-white py-24 rounded-[30px]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Transforme seu Negócio Hoje
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Não perca mais tempo. Comece a automatizar e escalar seu atendimento com AssistPro AI
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/comece-agora">
              <Button size="lg" variant="secondary" className="shadow-lg">
                Iniciar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-white hover:bg-white/20 hover:text-white"
              >
                Agendar Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-gray-100 py-16 rounded-[30px]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AssistPro AI</h3>
              <p className="text-gray-600">Revolucionando o atendimento com inteligência artificial</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Produtos</h4>
              <ul className="space-y-2">
                <li><Link href="/funcionalidades/assistente-virtual" className="text-gray-600 hover:text-primary">Assistente Virtual</Link></li>
                <li><Link href="/funcionalidades/atendimento-multilíngue" className="text-gray-600 hover:text-primary">Atendimento Multilíngue</Link></li>
                <li><Link href="/precos" className="text-gray-600 hover:text-primary">Preços</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Empresa</h4>
              <ul className="space-y-2">
                <li><Link href="/sobre" className="text-gray-600 hover:text-primary">Sobre Nós</Link></li>
                <li><Link href="/casos-de-uso" className="text-gray-600 hover:text-primary">Casos de Uso</Link></li>
                <li><Link href="/contato" className="text-gray-600 hover:text-primary">Contato</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Contato</h4>
              <p className="text-gray-600">contato@assistproai.com</p>
              <p className="text-gray-600">(11) 4002-8922</p>
              <div className="flex space-x-4 mt-4">
                <Link href="#" className="text-gray-600 hover:text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    {/* Ícone do LinkedIn */}
                  </svg>
                </Link>
                <Link href="#" className="text-gray-600 hover:text-primary">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    {/* Ícone do Instagram */}
                  </svg>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-600"> 2024 AssistPro AI. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de Erro de Microfone */}
      <Dialog open={!!microphoneError} onOpenChange={() => setMicrophoneError(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
              Erro de Microfone
            </DialogTitle>
            <DialogDescription className="text-left">
              <p className="mb-4">{microphoneError}</p>
              <details className="text-sm text-gray-600">
                <summary>Possíveis soluções</summary>
                <ul className="list-disc pl-5 mt-2">
                  <li>Verifique se o microfone está conectado</li>
                  <li>Permita o acesso ao microfone nas configurações do navegador</li>
                  <li>Reinicie o aplicativo</li>
                  <li>Teste outro navegador ou dispositivo</li>
                </ul>
              </details>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { NextResponse } from 'next/server';
import { voiceLogger } from '@/lib/logging/voice-logger';
import { VoiceValidator } from '@/lib/security/voice-validator';

export async function POST(request: Request) {
  try {
    const { phone_number, prompt } = await request.json();

    // Validar número de telefone
    if (!VoiceValidator.validatePhoneNumber(phone_number)) {
      return NextResponse.json({ 
        error: 'Número de telefone inválido' 
      }, { status: 400 });
    }

    // Log da chamada
    voiceLogger.log({
      type: 'recording',
      success: true,
      details: `Chamada iniciada para ${phone_number}`
    });

    return NextResponse.json({
      call_sid: 'mock_call_' + Math.random().toString(36).substr(2, 9),
      status: 'call_initiated',
      phone_number,
      message: 'Chamada simulada com sucesso'
    });
  } catch (error) {
    console.error('Erro na chamada:', error);
    
    voiceLogger.log({
      type: 'recording',
      success: false,
      details: 'Falha na inicialização da chamada'
    });

    return NextResponse.json({ 
      error: 'Erro interno na chamada' 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { voiceLogger } from '@/lib/logging/voice-logger';

export async function POST(request: Request) {
  try {
    const { prompt_type, prompt_text } = await request.json();

    // Validação básica
    if (!prompt_text) {
      return NextResponse.json({ 
        error: 'Prompt de treinamento é obrigatório' 
      }, { status: 400 });
    }

    // Log do treinamento
    voiceLogger.log({
      type: 'recording',
      success: true,
      details: `Treinamento com prompt: ${prompt_type}`
    });

    return NextResponse.json({
      status: 'training_simulated',
      prompt_type,
      message: 'Treinamento iniciado com sucesso'
    });
  } catch (error) {
    console.error('Erro no treinamento:', error);
    
    voiceLogger.log({
      type: 'recording',
      success: false,
      details: 'Falha no treinamento do assistente'
    });

    return NextResponse.json({ 
      error: 'Erro interno no treinamento' 
    }, { status: 500 });
  }
}

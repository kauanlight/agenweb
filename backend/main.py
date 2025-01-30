from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from app.core.chat import ChatManager
from app.core.config import Settings
from app.api.routes import chat, auth
import openai
import speech_recognition as sr
from google.cloud import speech_v1p1beta1 as speech
from google.cloud import texttospeech
from twilio.rest import Client

# Carregar variáveis de ambiente
load_dotenv()

# Configurar chave da OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Configurações
twilio_client = Client(os.getenv("TWILIO_ACCOUNT_SID"), os.getenv("TWILIO_AUTH_TOKEN"))

# Modelo de requisição
class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    max_tokens: Optional[int] = 150

# Modelo de resposta
class ChatResponse(BaseModel):
    response: str
    context: Optional[str] = None

# Serviços de Voz
class VoiceCallRequest(BaseModel):
    phone_number: str
    prompt: Optional[str] = None

class VoiceLogEntry(BaseModel):
    call_id: str
    timestamp: str
    duration: int
    transcript: str
    resolution_status: str

class VoiceTrainingRequest(BaseModel):
    prompt_type: str
    prompt_text: str
    context: Optional[dict] = None

# Criar instância do FastAPI
app = FastAPI(
    title="AssistPro AI API",
    description="API para o sistema de chat com IA AssistPro",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, especificar os domínios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rotas
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        # Chamar API do OpenAI
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "Você é um assistente de IA para atendimento ao cliente."},
                {"role": "user", "content": request.message}
            ],
            max_tokens=request.max_tokens or 150
        )
        
        # Extrair resposta
        ai_response = response.choices[0].message.content.strip()
        
        return ChatResponse(
            response=ai_response,
            context=request.context
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/")
async def root():
    return {"message": "Bem-vindo à API do AssistPro AI"}

# Rotas de Voz - Implementações Mockadas
@app.post("/voice/call")
async def initiate_voice_call(request: VoiceCallRequest):
    """Simula inicialização de chamada de voz"""
    return {
        "call_sid": "mock_call_123",
        "status": "simulated_call_initiated",
        "phone_number": request.phone_number
    }

@app.post("/voice/logs")
async def save_voice_log(log_entry: VoiceLogEntry):
    """Simula salvamento de log de chamada"""
    return {
        "status": "log_saved_mock", 
        "log_id": log_entry.call_id
    }

@app.post("/voice/train")
async def train_voice_assistant(training_request: VoiceTrainingRequest):
    """Simula treinamento do assistente"""
    return {
        "status": "training_simulated", 
        "prompt_type": training_request.prompt_type
    }

@app.post("/voice/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Mock de transcrição de áudio"""
    try:
        # Simulação de transcrição
        content = await file.read()
        mock_transcripts = [
            "Olá, gostaria de saber sobre meu pedido",
            "Qual é o status da minha entrega?"
        ]
        return {"transcripts": mock_transcripts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/voice/synthesize")
async def synthesize_speech(text: str):
    """Mock de síntese de voz"""
    try:
        # Simulação de conversão texto para áudio
        mock_audio = base64.b64encode(text.encode()).decode()
        return {"audio_content": mock_audio}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

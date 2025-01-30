from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from ...core.chat import ChatManager
from ...core.config import get_settings

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    prompt: str
    history: Optional[List[ChatMessage]] = None
    system_prompt: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    history: List[ChatMessage]

@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    settings = Depends(get_settings)
) -> ChatResponse:
    try:
        chat_manager = ChatManager(settings)
        
        # Converter o histórico para o formato esperado
        history = None
        if request.history:
            history = [{"role": msg.role, "content": msg.content} for msg in request.history]
        
        # Obter resposta do chat
        response = await chat_manager.get_response(
            prompt=request.prompt,
            history=history,
            system_prompt=request.system_prompt
        )
        
        # Atualizar histórico
        new_history = request.history or []
        new_history.append(ChatMessage(role="user", content=request.prompt))
        new_history.append(ChatMessage(role="assistant", content=response))
        
        return ChatResponse(
            response=response,
            history=new_history
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao processar chat: {str(e)}"
        )

from langchain.chat_models import ChatOpenAI
from langchain.schema import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    BaseMessage
)
from typing import List, Dict, Optional
from .config import Settings

class ChatManager:
    def __init__(self, settings: Settings):
        self.settings = settings
        self.chat_model = ChatOpenAI(
            model_name=settings.default_model,
            temperature=settings.temperature,
            openai_api_key=settings.openai_api_key
        )
        self.system_prompt = """Você é um assistente virtual profissional e prestativo.
Seu objetivo é ajudar os usuários da melhor forma possível, sempre mantendo um tom profissional e amigável.
Responda de forma clara e concisa, mas forneça detalhes quando necessário.
Se não souber algo com certeza, admita isso e sugira alternativas ou peça mais informações."""
    
    def create_messages(
        self,
        prompt: str,
        history: Optional[List[Dict[str, str]]] = None,
        system_prompt: Optional[str] = None
    ) -> List[BaseMessage]:
        messages: List[BaseMessage] = []
        
        # Adiciona o prompt do sistema
        messages.append(SystemMessage(content=system_prompt or self.system_prompt))
        
        # Adiciona o histórico se existir
        if history:
            for msg in history[-self.settings.max_history_length:]:
                if msg["role"] == "user":
                    messages.append(HumanMessage(content=msg["content"]))
                elif msg["role"] == "assistant":
                    messages.append(AIMessage(content=msg["content"]))
        
        # Adiciona a mensagem atual do usuário
        messages.append(HumanMessage(content=prompt))
        
        return messages
    
    async def get_response(
        self,
        prompt: str,
        history: Optional[List[Dict[str, str]]] = None,
        system_prompt: Optional[str] = None
    ) -> str:
        messages = self.create_messages(prompt, history, system_prompt)
        response = await self.chat_model.agenerate([messages])
        return response.generations[0][0].text
    
    def update_system_prompt(self, new_prompt: str):
        """Atualiza o prompt do sistema para personalizar o comportamento do assistente"""
        self.system_prompt = new_prompt

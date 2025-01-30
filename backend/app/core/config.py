from pydantic_settings import BaseSettings
from typing import Optional
from functools import lru_cache

class Settings(BaseSettings):
    # OpenAI
    openai_api_key: str
    
    # App
    app_secret_key: str
    app_environment: str = "development"
    
    # Chat
    max_history_length: int = 10
    default_model: str = "gpt-4-1106-preview"
    temperature: float = 0.7
    
    # Database
    database_url: str = "sqlite:///./assistpro.db"
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

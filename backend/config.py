from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Email server settings
    SMTP_HOST: str
    SMTP_PORT: int
    SMTP_USER: str
    SMTP_PASSWORD: str
    
    # Application settings
    DOMAIN: str = "tempmail.com"
    SECRET_KEY: str
    
    # Premium settings
    PREMIUM_PRICE: float = 5.0
    PREMIUM_DURATION_DAYS: int = 30
    
    class Config:
        env_file = ".env"

settings = Settings() 
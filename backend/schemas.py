from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

class EmailBase(BaseModel):
    sender: str
    subject: str
    body: str
    html_body: Optional[str] = None

class EmailCreate(EmailBase):
    recipient: str

class Email(EmailBase):
    id: int
    received_at: datetime
    recipient_id: int

    class Config:
        from_attributes = True

class EmailAddressBase(BaseModel):
    address: str
    expiration_time: datetime
    is_premium: bool = False

class EmailAddressCreate(EmailAddressBase):
    pass

class EmailAddress(EmailAddressBase):
    id: int
    created_at: datetime
    messages: List[Email] = []

    class Config:
        from_attributes = True

class PremiumUpgrade(BaseModel):
    email_address: str
    subscription_days: int = 30 
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from database import Base

class EmailAddress(Base):
    __tablename__ = "email_addresses"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expiration_time = Column(DateTime)
    is_premium = Column(Boolean, default=False)
    messages = relationship("Email", back_populates="recipient")

class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    recipient_id = Column(Integer, ForeignKey("email_addresses.id"))
    sender = Column(String)
    subject = Column(String)
    body = Column(Text)
    html_body = Column(Text, nullable=True)
    received_at = Column(DateTime, default=datetime.utcnow)
    recipient = relationship("EmailAddress", back_populates="messages") 
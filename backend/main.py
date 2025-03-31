from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import random
import string
from typing import List, Optional

from database import SessionLocal, engine
import models, schemas
from config import settings
from email_server import EmailServer

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Temporary Email Service",
    description="A secure temporary email service API",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize email server
email_server = EmailServer()

@app.get("/")
async def root():
    return {"message": "Welcome to Temporary Email Service API"}

@app.post("/email/create", response_model=schemas.EmailAddress)
async def create_email(
    expiration_hours: Optional[int] = 24,
    db: Session = Depends(get_db)
):
    """Create a new temporary email address"""
    # Generate random email address
    username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    email_address = f"{username}@{settings.DOMAIN}"
    
    # Calculate expiration time
    expiration_time = datetime.utcnow() + timedelta(hours=expiration_hours)
    
    # Create email address in database
    db_email = models.EmailAddress(
        address=email_address,
        expiration_time=expiration_time,
        is_premium=False
    )
    db.add(db_email)
    db.commit()
    db.refresh(db_email)
    
    return db_email

@app.get("/email/{email_address}/messages", response_model=List[schemas.Email])
async def get_messages(
    email_address: str,
    db: Session = Depends(get_db)
):
    """Get all messages for a specific email address"""
    db_email = db.query(models.EmailAddress).filter(
        models.EmailAddress.address == email_address
    ).first()
    
    if not db_email:
        raise HTTPException(status_code=404, detail="Email address not found")
    
    if datetime.utcnow() > db_email.expiration_time:
        raise HTTPException(status_code=400, detail="Email address has expired")
    
    messages = db.query(models.Email).filter(
        models.Email.recipient == email_address
    ).all()
    
    return messages

@app.get("/email/{email_address}/message/{message_id}", response_model=schemas.Email)
async def get_message(
    email_address: str,
    message_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific message by ID"""
    message = db.query(models.Email).filter(
        models.Email.id == message_id,
        models.Email.recipient == email_address
    ).first()
    
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    return message

@app.delete("/email/{email_address}")
async def delete_email(
    email_address: str,
    db: Session = Depends(get_db)
):
    """Delete an email address and all its messages"""
    db_email = db.query(models.EmailAddress).filter(
        models.EmailAddress.address == email_address
    ).first()
    
    if not db_email:
        raise HTTPException(status_code=404, detail="Email address not found")
    
    # Delete all messages
    db.query(models.Email).filter(
        models.Email.recipient == email_address
    ).delete()
    
    # Delete email address
    db.delete(db_email)
    db.commit()
    
    return {"message": "Email address and messages deleted successfully"}

@app.post("/premium/upgrade")
async def upgrade_to_premium(
    email_address: str,
    db: Session = Depends(get_db)
):
    """Upgrade an email address to premium"""
    db_email = db.query(models.EmailAddress).filter(
        models.EmailAddress.address == email_address
    ).first()
    
    if not db_email:
        raise HTTPException(status_code=404, detail="Email address not found")
    
    db_email.is_premium = True
    db_email.expiration_time = datetime.utcnow() + timedelta(days=30)
    db.commit()
    
    return {"message": "Email address upgraded to premium successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
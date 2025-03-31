import asyncio
import aiosmtplib
from email.message import EmailMessage
from email.policy import SMTP
from datetime import datetime
from typing import Optional
import logging

from .database import SessionLocal
from . import models, schemas
from .config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EmailServer:
    def __init__(self):
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.smtp_user = settings.SMTP_USER
        self.smtp_password = settings.SMTP_PASSWORD
        self.domain = settings.DOMAIN

    async def start(self):
        """Start the SMTP server"""
        try:
            server = aiosmtplib.SMTP(
                hostname=self.smtp_host,
                port=self.smtp_port,
                use_tls=True
            )
            await server.connect()
            await server.login(self.smtp_user, self.smtp_password)
            logger.info("SMTP server started successfully")
        except Exception as e:
            logger.error(f"Failed to start SMTP server: {e}")
            raise

    async def handle_email(self, message: EmailMessage):
        """Handle incoming email messages"""
        try:
            recipient = message["to"]
            if not recipient or not recipient.endswith(f"@{self.domain}"):
                return

            # Get email address from database
            db = SessionLocal()
            try:
                email_address = db.query(models.EmailAddress).filter(
                    models.EmailAddress.address == recipient
                ).first()

                if not email_address:
                    logger.warning(f"Email address not found: {recipient}")
                    return

                if datetime.utcnow() > email_address.expiration_time:
                    logger.warning(f"Email address expired: {recipient}")
                    return

                # Create email record
                db_email = models.Email(
                    sender=message["from"],
                    subject=message["subject"],
                    body=message.get_body(preferencelist=("plain",)).get_content(),
                    html_body=message.get_body(preferencelist=("html",)).get_content(),
                    recipient_id=email_address.id
                )
                db.add(db_email)
                db.commit()
                logger.info(f"Email saved for {recipient}")
            finally:
                db.close()

        except Exception as e:
            logger.error(f"Error handling email: {e}")

    async def send_email(
        self,
        to: str,
        subject: str,
        body: str,
        html_body: Optional[str] = None
    ):
        """Send an email"""
        try:
            message = EmailMessage(policy=SMTP)
            message["From"] = f"noreply@{self.domain}"
            message["To"] = to
            message["Subject"] = subject

            if html_body:
                message.set_content(body)
                message.add_alternative(html_body, subtype="html")
            else:
                message.set_content(body)

            server = aiosmtplib.SMTP(
                hostname=self.smtp_host,
                port=self.smtp_port,
                use_tls=True
            )
            await server.connect()
            await server.login(self.smtp_user, self.smtp_password)
            await server.send_message(message)
            await server.quit()
            logger.info(f"Email sent to {to}")
        except Exception as e:
            logger.error(f"Failed to send email: {e}")
            raise 
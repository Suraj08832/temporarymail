# Temporary Email Service

A secure and user-friendly temporary email service that allows users to generate disposable email addresses to protect their primary email from spam.

## Features

- Generate random temporary email addresses
- View incoming emails in real-time
- Automatic email expiration and deletion
- Premium features (custom domains, extended expiration)
- Mobile-responsive design
- Ad-free experience for premium users

## Tech Stack

- Backend: Python (FastAPI)
- Frontend: React with TypeScript
- Database: PostgreSQL
- Email Server: SMTP server implementation
- Authentication: JWT
- Deployment: Render

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Suraj08832/temporarymail.git
cd temporarymail
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Set up the frontend:
```bash
cd frontend
npm install
```

4. Set up environment variables:
Create `.env` files in both backend and frontend directories with the following variables:

Backend (.env):
```
DATABASE_URL=postgresql://user:password@localhost:5432/tempmail
SECRET_KEY=your-secret-key
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:8000
```

### Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Deployment

This application is configured for deployment on Render. Follow these steps:

1. Push your code to GitHub
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Configure the environment variables
5. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
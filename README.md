# 🌱 GreenPact

**GreenPact** is a comprehensive contract farming platform that connects farmers and contractors, streamlining agricultural contracts, crop management, and communication. Built with Django REST Framework and Next.js, it provides a modern, real-time solution for agricultural contract management.

[![Django](https://img.shields.io/badge/Django-5.2.8-green.svg)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.6-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Key Modules](#-key-modules)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 👨‍🌾 For Farmers
- **Profile Management**: Complete profile setup with verification (Aadhar, signature, QR code)
- **Crop Listing**: List available crops with details and pricing
- **Contract Management**: View, create, and manage farming contracts
- **Progress Tracking**: Update crop progress with images and notes
- **Real-time Chat**: Direct communication with contractors
- **Demand Browsing**: Explore crop demands from contractors
- **Rating System**: Rate contractors after successful transactions

### 🏢 For Contractors
- **Demand Creation**: Post crop requirements with specifications
- **Farmer Discovery**: Browse verified farmer profiles and their crops
- **Contract Negotiation**: Create and negotiate contract terms
- **Transaction Management**: Track payments and receipts
- **Real-time Notifications**: Stay updated on contract status
- **Progress Monitoring**: View farmer crop progress updates

### 🔐 Admin Panel
- **User Management**: Approve/manage farmer and contractor registrations
- **Verification System**: Review and verify user documents
- **Concern Resolution**: Handle user concerns and support tickets
- **Analytics Dashboard**: Monitor platform activity and statistics

### 🤖 Additional Features
- **AI Chatbot (GreenBot)**: Integrated AI assistant powered by Llama 3.3 for agricultural queries
- **Real-time WebSocket Communication**: Live chat and notifications using Django Channels
- **PDF Contract Generation**: Automated contract document generation with ReportLab
- **Responsive Design**: Mobile-first UI with Tailwind CSS
- **Secure Authentication**: JWT-based authentication with token refresh

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Django 5.2.8
- **API**: Django REST Framework 3.16.1
- **Authentication**: JWT (djangorestframework-simplejwt 5.5.1)
- **WebSockets**: Django Channels 4.3.1
- **Database**: PostgreSQL (via psycopg2)
- **PDF Generation**: ReportLab 4.4.4
- **AI Integration**: OpenAI API 2.8.0 (for LLM integration)

### Frontend
- **Framework**: Next.js 15.1.6 (React 18.3.1)
- **State Management**: Redux Toolkit 2.5.1
- **UI Components**: Radix UI primitives
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 12.0.6
- **Charts**: Recharts 2.15.2
- **Date Handling**: date-fns 3.6.0

### DevOps
- **Containerization**: Docker
- **Environment Variables**: python-dotenv
- **CORS**: django-cors-headers

---

## 📁 Project Structure

```
GreenPact/
├── greenpact/                 # Django Backend
│   ├── chat/                  # Real-time chat module
│   ├── contract/              # Contract management
│   ├── crops/                 # Crop listings
│   ├── demands/               # Crop demand management
│   ├── greenbot/              # AI chatbot integration
│   ├── ratings/               # Rating system
│   ├── user/                  # User authentication & profiles
│   ├── utils/                 # Utility functions (PDF, auth, LLM)
│   ├── greenpact/             # Django settings & configuration
│   ├── requirements.txt       # Python dependencies
│   ├── Dockerfile            # Docker configuration
│   └── manage.py             # Django management script
│
└── frontend/                  # Next.js Frontend
    ├── app/                   # Next.js app directory
    │   ├── admin/            # Admin dashboard pages
    │   ├── chat/             # Chat interface
    │   ├── contract(s)/      # Contract views
    │   ├── crop(s)/          # Crop management
    │   ├── demand(s)/        # Demand browsing
    │   ├── Login/            # Authentication pages
    │   ├── market/           # Marketplace
    │   └── profile/          # User profiles
    ├── components/            # React components
    │   ├── admin/            # Admin components
    │   ├── Chat/             # Chat components
    │   ├── chatbot/          # Chatbot UI
    │   ├── Home/             # Landing page
    │   ├── Navbar/           # Navigation
    │   └── ui/               # Reusable UI components
    ├── redux/                 # Redux store & slices
    └── package.json          # Node dependencies
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python** 3.11 or higher
- **Node.js** 18.x or higher
- **npm** or **yarn**
- **PostgreSQL** 14 or higher
- **Docker** (optional, for containerized deployment)
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ramanand87/GreenPact.git
cd GreenPact
```

### 2. Backend Setup

```bash
cd greenpact

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
yarn install
```

---

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `greenpact/` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/greenpact_db

# AI Chatbot
GREENBOT_API_KEY=your_openrouter_api_key_here

# Django Secret Key (generate a new one for production)
SECRET_KEY=your-secret-key-here

# Redis (if using Redis for channels)
# redis_host=redis://localhost:6379
```

2. Create PostgreSQL database:

```sql
CREATE DATABASE greenpact_db;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE greenpact_db TO your_username;
```

3. Run migrations:

```bash
cd greenpact
python manage.py makemigrations
python manage.py migrate
```

4. Create superuser:

```bash
python manage.py createsuperuser
```

### Frontend Configuration

1. Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## 🏃 Running the Application

### Development Mode

#### Backend (Django)

```bash
cd greenpact
python manage.py runserver
```

The backend API will be available at: `http://localhost:8000`

Admin panel: `http://localhost:8000/admin`

#### Frontend (Next.js)

```bash
cd frontend
npm run dev
# or
yarn dev
```

The frontend will be available at: `http://localhost:3000`

### Production Mode

#### Using Docker

```bash
# Build and run with Docker
docker build -t greenpact-backend ./greenpact
docker run -p 8000:8000 greenpact-backend
```

#### Frontend Production Build

```bash
cd frontend
npm run build
npm start
```

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/user/register/          # Register new user
POST   /api/user/login/             # Login
POST   /api/user/token/refresh/     # Refresh JWT token
GET    /api/user/profile/           # Get user profile
```

### Contract Endpoints

```
GET    /api/contract/               # List contracts
POST   /api/contract/               # Create contract
GET    /api/contract/{id}/          # Get contract details
PUT    /api/contract/{id}/          # Update contract
DELETE /api/contract/{id}/          # Delete contract
```

### Crop Endpoints

```
GET    /api/crops/                  # List crops
POST   /api/crops/                  # Create crop listing
GET    /api/crops/{id}/             # Get crop details
PUT    /api/crops/{id}/             # Update crop
DELETE /api/crops/{id}/             # Delete crop
```

### Demand Endpoints

```
GET    /api/demands/                # List demands
POST   /api/demands/                # Create demand
GET    /api/demands/{id}/           # Get demand details
```

### Chat Endpoints

```
WebSocket: /ws/chat/{username}/    # Real-time chat connection
```

---

## 🔑 Key Modules

### User Management (`user/`)
- Custom user model supporting Farmer and Contractor types
- Profile management with document verification
- Aadhar and signature upload
- QR code generation for farmers

### Contract Management (`contract/`)
- Contract creation and negotiation
- PDF contract generation
- Transaction tracking
- Progress monitoring with images
- Real-time notifications via WebSockets

### Chat System (`chat/`)
- Real-time WebSocket-based messaging
- User-to-user communication
- Message history
- Online status tracking

### AI Chatbot (`greenbot/`)
- Integrated Llama 3.3 AI assistant
- Agricultural query handling
- Context-aware responses

### Crop & Demand Management
- Crop listing with details
- Demand posting and matching
- Rating and review system

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint configuration for JavaScript/React
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is part of a B.Tech Semester VII project. All rights reserved.

---

## 👥 Team

Developed as part of B.Tech Project (BTP SEM VII)

---

## 📞 Support

For support and queries:
- Create an issue in the repository
- Contact the development team

-----
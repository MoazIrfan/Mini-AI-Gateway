# Mini AI Gateway

A lightweight, full-stack API gateway application for managing AI requests with authentication, credit-based usage tracking, and API key management. Built with modern web technologies for developers who need a simple yet powerful way to control and monitor AI API access.


[![📟](https://raw.githubusercontent.com/MoazIrfan/Mini-AI-Gateway/main/.github/mini-api-gateway.gif)](./../../)

## Features

✨ **User Authentication** - Secure JWT-based signup and login  
🔑 **API Key Management** - Generate, regenerate, and manage API keys with hashed storage  
💰 **Credit System** - Track usage with a credit-based system (100 credits per user, 5 per request)  
🎮 **Interactive Playground** - Test AI endpoints directly from the dashboard  
📊 **Request Logging** - Monitor all API requests with detailed logs  
🎨 **Modern UI** - Clean, responsive interface built with Next.js and shadcn/ui  

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. **Backend Setup**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the backend directory:

    ```env
    PORT=5000
    JWT_SECRET=a8f5f167f44f4964e6c998dee827110c3e8f5f167f44f4964e6c998dee827110c
    DATABASE_URL="file:./prisma/dev.db"
    NODE_ENV=development
    ```

    Then run:

    ```bash
    npm run prisma:generate
    npx prisma migrate dev --name init 
    npm run dev
    ```

3. **Frontend Setup** (open a new terminal)

    ```bash
    cd frontend
    npm install
    ```

    Create a `.env.local` file in the frontend directory:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000
    ```

    Then run:

    ```bash
    npm run dev
    ```

4. **Use it!**

    Open your browser and go to `http://localhost:3000`

## Technologies Used

### Backend
- **Node.js**
- **Express.js**
- **Prisma**
- **SQLite**
- **JWT (jsonwebtoken)**

### Frontend
- **Next.js 16**
- **TypeScript**
- **shadcn/ui**



## Project Structure
```
Mini-AI-Gateway/
├── ai-gateway-backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js           # JWT authentication
│   │   ├── routes/
│   │   │   ├── auth.js           # Signup/Login
│   │   │   ├── apiKey.js         # API key management
│   │   │   ├── ai.js             # AI completions endpoint
│   │   │   └── logs.js           # Request logs
│   │   └── server.js             # Express server
│   ├── .env                      # Environment variables
│   └── package.json
│
└── ai-gateway-frontend/
    ├── app/
    │   ├── dashboard/
    │   │   └── page.tsx          # Main dashboard
    │   ├── login/
    │   │   └── page.tsx          # Login page
    │   ├── signup/
    │   │   └── page.tsx          # Signup page
    │   └── layout.tsx            # Root layout
    ├── components/
    │   ├── dashboard/            # Modular dashboard components
    │   └── ui/                   # shadcn/ui components
    ├── .env.local               # Frontend environment
    └── package.json
```
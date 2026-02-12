# Mini AI Gateway

[![📟](https://raw.githubusercontent.com/MoazIrfan/Mini-AI-Gateway/main/.github/mini-api-gateway.gif)](./../../)


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
    npm run prisma:migrate 
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
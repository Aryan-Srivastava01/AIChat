# GEMINI.md

## Project Overview

This is a full-stack web application that provides a chat interface to interact with an AI model. The application consists of a React frontend and a Node.js backend.

**Frontend:**
- **Framework:** React with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, lucide-react
- **AI SDK:** `@ai-sdk/react`

**Backend:**
- **Framework:** Express.js
- **Language:** TypeScript
- **AI Provider:** OpenRouter
- **AI Model:** `x-ai/grok-4-fast:free`

## Building and Running

### Frontend

To run the frontend, navigate to the `aryan-chat-frontend` directory and run the following commands:

```bash
npm install
npm run dev
```

This will start the development server at `http://localhost:5173`.

To build the frontend for production, run:

```bash
npm run build
```

### Backend

To run the backend, navigate to the `backend` directory and run the following commands:

```bash
npm install
npm run dev
```

This will start the backend server at `http://localhost:5001`.

You will also need to create a `.env` file in the `backend` directory with the following content:

```
OPENROUTER_API_KEY=your_openrouter_api_key
```

## Development Conventions

### Code Style

The project uses ESLint for linting. You can run the linter with the following command in the `aryan-chat-frontend` directory:

```bash
npm run lint
```

### Testing

There are no tests set up for this project yet. The `package.json` in the `backend` directory has a test script that does nothing.

# Qwen Code Context

## Project Overview

This is a fullstack AI chat application called "Aryan Chat" that enables users to have conversations with an AI assistant. The application consists of:

- **Frontend**: A React TypeScript application using Vite, with AI SDK integration for chat functionality
- **Backend**: A Node.js/Express server that integrates with OpenRouter to provide AI chat capabilities
- **Architecture**: The app uses a modern fullstack architecture with streaming responses for real-time chat experiences

## Technology Stack

### Frontend
- React 19.1.1 (with TypeScript)
- Vite 7.1.12 (using rolldown-vite)
- AI SDK (`@ai-sdk/react`, `ai`)
- Tailwind CSS for styling
- Radix UI components
- Lucide React icons
- React Router DOM for routing

### Backend
- Node.js with Express
- TypeScript
- AI SDK for streaming responses
- OpenRouter provider for AI model access
- CORS and body-parser middleware

## Project Structure

```
AIChat/
├── aryan-chat-frontend/     # React frontend application
│   ├── src/
│   │   ├── components/AI/chat.tsx    # Main chat UI component
│   │   ├── pages/HomePage.tsx       # Home page component
│   │   └── App.tsx, main.tsx        # Application entry points
│   ├── package.json                 # Frontend dependencies
│   └── vite.config.ts               # Vite configuration
└── backend/                        # Express backend server
    ├── server.ts                    # Main server file
    ├── routes/chat.routes.ts        # Chat API routes
    ├── controllers/chat.controllers.ts # Chat logic
    └── package.json                 # Backend dependencies
```

## Building and Running

### Prerequisites
- Node.js and Bun (as indicated by bun.lock files)
- OpenRouter API key

### Frontend
```bash
# Navigate to the frontend directory
cd aryan-chat-frontend/

# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

### Backend
```bash
# Navigate to the backend directory
cd backend/

# Install dependencies
npm install

# Run development server (with nodemon)
npm run dev

# Or run in production mode
node server.ts
```

### Environment Variables
- Backend `.env` file contains:
  - `PORT` - server port (default: 5001)
  - `OPENROUTER_API_KEY` - API key for OpenRouter

## Key Features

1. **Real-time Chat Interface**: The frontend provides a clean chat interface with message history and streaming responses
2. **AI Integration**: Backend connects to OpenRouter's Grok-4 model for AI responses
3. **Streaming Responses**: Uses AI SDK's streaming capabilities for real-time chat responses
4. **Modern UI**: Built with React, Tailwind CSS, and Radix UI components
5. **Type Safety**: Full TypeScript support throughout the application

## Development Conventions

- The frontend uses a component-based architecture with proper TypeScript typing
- The Vite configuration includes React plugin and Tailwind CSS integration
- The backend uses Express with proper middleware for CORS and JSON parsing
- Chat messages are streamed from the backend to provide immediate responses
- The frontend communicates with the backend via the `/api/chat` endpoint

## API Endpoints

- `POST /api/chat` - Creates a new chat stream using OpenRouter's AI model
  - Request body: `{ messages: [] }` - Array of chat messages
  - Response: Streaming text response from the AI

## Key Components

### Frontend
- `chat.tsx`: Main chat component using `@ai-sdk/react`'s `useChat` hook
- `HomePage.tsx`: Simple wrapper that renders the chat component
- Various UI components in the `components/` directory

### Backend
- `server.ts`: Main Express server setup
- `chat.routes.ts`: Defines the chat API endpoint
- `chat.controllers.ts`: Implements chat logic with OpenRouter integration
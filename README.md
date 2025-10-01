# AI Chat Application

A full-stack web application that provides a chat interface to interact with an AI model, built with the MERN stack and TypeScript.

## Features

- **Real-time Chat:** Engage in real-time conversations with an AI model.
- **AI Integration:** Powered by the OpenRouter API, utilizing the `x-ai/grok-4-fast:free` model.
- **Modern UI:** A sleek and responsive user interface built with React, TypeScript, and Tailwind CSS.
- **Streaming Responses:** AI responses are streamed back to the user for a more interactive experience.
- **GitHub Integration:** Includes GitHub Actions for CI/CD, automated reviews, and issue triage.

## Tech Stack

### Frontend

- **Framework:** React with Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **UI Components:** Radix UI, lucide-react
- **AI SDK:** `@ai-sdk/react`
- **Routing:** React Router

### Backend

- **Framework:** Express.js
- **Language:** TypeScript
- **AI Provider:** OpenRouter
- **API Client:** Axios

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Installation and Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/AIChat.git
    cd AIChat
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory and add your OpenRouter API key:

    ```
    OPENROUTER_API_KEY=your_openrouter_api_key
    ```

3.  **Frontend Setup:**

    ```bash
    cd ../aryan-chat-frontend
    npm install
    ```

### Running the Application

1.  **Start the backend server:**

    ```bash
    cd backend
    npm run dev
    ```

    The backend will be running on `http://localhost:5001`.

2.  **Start the frontend development server:**

    ```bash
    cd ../aryan-chat-frontend
    npm run dev
    ```

    The frontend will be running on `http://localhost:5173`.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1.  **Fork the repository.**
2.  **Create a new branch:** `git checkout -b feature/your-feature-name`
3.  **Make your changes and commit them with a descriptive message.** This project follows the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
4.  **Push to the branch:** `git push origin feature/your-feature-name`
5.  **Create a pull request.**

Please use the provided issue and pull request templates.

## License

This project is licensed under the ISC License.

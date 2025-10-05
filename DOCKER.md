# Docker Development Guide for Contributors

This guide explains how to use Docker for development in the AIChat project.

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Aryan-Srivastava01/AIChat.git
   cd AIChat
   ```

2. **Set up environment variables:**
   
   **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Then edit `backend/.env` and add your API keys:
   ```
   OPENROUTER_API_KEY=your_openrouter_api_key
   HF_API_KEY=your_hugging_face_api_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_genai_api_key
   ```
   
   **Frontend:**
   ```bash
   cd ../frontend
   cp .env.local.example .env.local
   ```
   
   Edit `frontend/.env.local` (default values should work):
   ```
   VITE_API_BASE_URL=http://localhost:5001
   ```

3. **Start the development environment:**
   ```bash
   cd ..  # Back to root directory
   docker-compose up --build
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001

## Development Features

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Vite dev server automatically reloads when you edit React components
- **Backend**: Nodemon restarts the server when you edit TypeScript files

### Volume Mapping
Your local code is mounted into the containers, so changes you make are immediately reflected:
- `./frontend` → `/app` in frontend container
- `./backend` → `/app` in backend container

The `node_modules` folders use anonymous volumes to prevent conflicts between your host OS and the container.

## Common Commands

### Start containers
```bash
docker-compose up
```

### Start containers in background
```bash
docker-compose up -d
```

### Rebuild containers (after package.json changes)
```bash
docker-compose up --build
```

### Stop containers
```bash
docker-compose down
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Execute commands in containers
```bash
# Frontend
docker-compose exec frontend npm install <package-name>

# Backend
docker-compose exec backend npm install <package-name>
```

### Restart a specific service
```bash
docker-compose restart frontend
docker-compose restart backend
```

### Remove containers and volumes
```bash
docker-compose down -v
```

## Troubleshooting

### Port Already in Use
If you get an error about ports 5173 or 5001 being in use:
1. Stop any local development servers running
2. Or modify the ports in `docker-compose.yml`:
   ```yaml
   ports:
     - "5174:5173"  # Change left number to unused port
   ```

### Changes Not Reflecting
If your code changes aren't showing up:
1. Check that volumes are mounted correctly
2. Restart the container: `docker-compose restart frontend` or `docker-compose restart backend`
3. If still not working, rebuild: `docker-compose up --build`

### Module Not Found Errors
If you get "module not found" errors after adding a new npm package:
1. Rebuild the container:
   ```bash
   docker-compose up --build
   ```
2. Or install directly in the container:
   ```bash
   docker-compose exec frontend npm install
   docker-compose exec backend npm install
   ```

### Permission Issues (Linux)
If you encounter permission issues on Linux:
1. Add your user to the docker group:
   ```bash
   sudo usermod -aG docker $USER
   ```
2. Log out and log back in

### Clean Start
For a completely clean start:
```bash
# Stop containers and remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Rebuild everything
docker-compose up --build
```

## File Structure

```
AIChat/
├── docker-compose.yml          # Multi-container orchestration
├── .dockerignore              # Root dockerignore
├── frontend/
│   ├── Dockerfile.dev         # Development Dockerfile
│   ├── .dockerignore          # Frontend dockerignore
│   ├── .env.local             # Frontend environment variables (create from .env.local.example)
│   ├── .env.local.example     # Example frontend environment variables
│   └── ...
└── backend/
    ├── Dockerfile.dev         # Development Dockerfile
    ├── .dockerignore          # Backend dockerignore
    ├── .env                   # Backend environment variables (create from .env.example)
    ├── .env.example           # Example backend environment variables
    └── ...
```

## Production Dockerfiles

The current setup (`Dockerfile.dev` files) is **for development only**. Production Dockerfiles will be created later with:
- Multi-stage builds
- Optimized images
- No dev dependencies
- Environment-specific configurations

## Environment Variables

Docker Compose uses **service-specific** `.env` files for each container.

### Frontend Environment Variables
**File:** `frontend/.env.local`
```
VITE_API_BASE_URL=http://localhost:5001
```

### Backend Environment Variables
**File:** `backend/.env`
```
OPENROUTER_API_KEY=your_key
HF_API_KEY=your_key
GOOGLE_GENERATIVE_AI_API_KEY=your_key
```

**Note:** The same `.env` files are used for both Docker and local development, eliminating duplication!

## Why Docker for Development?

1. **Consistent Environment**: Everyone uses the same Node version and dependencies
2. **Easy Setup**: New contributors can get started with just `docker-compose up`
3. **Isolated**: Doesn't pollute your system with Node modules
4. **Production Parity**: Development environment matches production more closely

## Need Help?

If you encounter issues not covered here:
1. Check existing issues on GitHub
2. Create a new issue with:
   - Your OS and Docker version
   - Full error message
   - Steps to reproduce


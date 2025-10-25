# AI App Builder - Implementation Guide

## Overview
The AI App Builder is a feature that allows users to generate React components from natural language prompts. It combines a Monaco-based code editor with a live preview powered by Babel transpilation in an iframe.

## Architecture

### Frontend (`/frontend/src/pages/AppBuilderPage.tsx`)
- **Code Editor**: Monaco Editor with syntax highlighting and error detection
- **Live Preview**: Sandboxed iframe with Babel standalone for JSX transpilation
- **Layout**: Resizable split panes using Allotment library
- **Features**:
  - Real-time code preview with 500ms debounce
  - Manual refresh button for preview
  - Keyboard shortcut (Enter) to generate code
  - Beautiful gradient background in preview
  - Error handling for both build and runtime errors

### Backend (`/backend`)
- **Controller**: `controllers/code-gen.controller.ts`
- **Route**: `routes/code-gen.routes.ts`
- **Endpoint**: `POST /api/generate-code`
- **Authentication**: Protected with Clerk auth middleware
- **AI Model**: Google Gemini 1.5 Flash

## Key Technologies

### Frontend
- `@monaco-editor/react`: VS Code-quality code editor
- `@babel/standalone`: Client-side JSX to JS transpilation
- `allotment`: Resizable split pane layout
- React 19 with TypeScript

### Backend
- `@google/generative-ai`: Gemini AI SDK
- Express with TypeScript
- Clerk authentication

## Setup Instructions

### 1. Environment Variables
Ensure these variables are set:

**Frontend** (`.env.local`):
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```

**Backend** (`.env`):
```env
GEMINI_API_KEY=your_gemini_api_key
CLERK_API_KEY=your_clerk_secret_key
FRONTEND_ORIGIN=http://localhost:5173
```

### 2. Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access the App Builder
Navigate to: `http://localhost:5173/app-builder`

## How It Works

### Code Generation Flow
1. User enters a prompt describing the UI component they want
2. Frontend sends POST request to `/api/generate-code` with the prompt
3. Backend uses Gemini AI to generate React component code
4. Generated code is cleaned (removes markdown formatting, exports)
5. Code is displayed in Monaco Editor
6. Live preview automatically updates after 500ms

### Preview Rendering Flow
1. User's code in Monaco Editor is captured
2. Babel transpiles JSX → JavaScript in the browser
3. HTML document is constructed with:
   - React and ReactDOM from CDN
   - Transpiled code
   - Component detection and rendering logic
4. HTML is injected into sandboxed iframe via `srcDoc`

### Security Features
- Iframe sandbox with `allow-scripts` and `allow-same-origin`
- Protected API endpoints with Clerk authentication
- Client-side transpilation (no eval on server)
- Input validation and error handling

## Code Structure

### Frontend Component Structure
```
AppBuilderPage
├── Header (prompt input + generate button)
├── Allotment (split panes)
│   ├── Editor Pane (Monaco Editor)
│   └── Preview Pane (iframe with transpiled code)
```

### Backend API Structure
```
POST /api/generate-code
├── Auth Middleware (Clerk)
├── Controller (code-gen.controller.ts)
│   ├── Validate prompt
│   ├── Call Gemini API
│   ├── Clean response
│   └── Return generated code
```

## Customization

### Changing AI Model
Edit `backend/controllers/code-gen.controller.ts`:
```typescript
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro" // or other Gemini models
});
```

### Adjusting Preview Styles
Edit the `html` template in `updatePreview()` function:
```typescript
const html = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { 
        /* Customize preview background and layout */
      }
    </style>
  </head>
  ...
</html>`;
```

### Modifying System Prompt
Edit `backend/controllers/code-gen.controller.ts`:
```typescript
const systemPrompt = `Your custom instructions for the AI...`;
```

## Troubleshooting

### Common Issues

**Issue**: "Cannot find namespace 'NodeJS'"
- **Solution**: Install `@types/node` in frontend: `npm install --save-dev @types/node`

**Issue**: Preview not updating
- **Solution**: Click the refresh button or check browser console for errors

**Issue**: "Failed to generate code"
- **Solution**: 
  - Check backend server is running
  - Verify GEMINI_API_KEY is set correctly
  - Check backend logs for detailed error messages

**Issue**: Babel transpilation errors
- **Solution**: Ensure code is valid JSX and follows React conventions

**Issue**: Authentication errors
- **Solution**: 
  - Verify you're signed in
  - Check Clerk keys are configured correctly
  - Clear browser cookies and sign in again

## Performance Considerations

1. **Debounced Preview**: 500ms delay prevents excessive re-renders
2. **Production React**: Preview uses production builds of React/ReactDOM
3. **Lazy Loading**: Monaco Editor loads efficiently with built-in code splitting
4. **Sandboxed Execution**: Isolated iframe prevents memory leaks

## Future Enhancements

- [ ] Support for multiple files/components
- [ ] Export generated code as downloadable files
- [ ] Version history and undo/redo
- [ ] Component library integration
- [ ] Real-time collaboration
- [ ] Dark/light mode preview toggle
- [ ] Mobile responsive preview sizes
- [ ] Code formatting and linting
- [ ] TypeScript support in editor
- [ ] NPM package imports in preview

## API Reference

### POST /api/generate-code

**Request**:
```json
{
  "prompt": "A card component with a title, description, and button"
}
```

**Response**:
```json
{
  "code": "function CardComponent() {\n  return (\n    <div>...</div>\n  );\n}"
}
```

**Errors**:
- `400`: Invalid prompt
- `401`: Unauthorized (not signed in)
- `500`: Generation failed

## Contributing

When adding features to the App Builder:
1. Keep the preview sandboxed for security
2. Handle errors gracefully with user-friendly messages
3. Test with various component complexities
4. Maintain TypeScript strict mode compliance
5. Document new features in this README

## License
Same as parent project

## Credits
Built with inspiration from bolt.new and v0.dev

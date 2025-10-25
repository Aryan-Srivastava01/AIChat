# Quick Start Guide - AI App Builder

## ⚡ Get Started in 3 Minutes

### Step 1: Verify Environment Variables

**Backend** - Check `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
CLERK_API_KEY=your_clerk_secret_key_here
FRONTEND_ORIGIN=http://localhost:5173
```

**Frontend** - Check `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:5001
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
```

### Step 2: Install Dependencies (if needed)

```bash
# Frontend
cd frontend
npm install

# Backend  
cd ../backend
npm install
```

### Step 3: Start Both Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

Wait for: `✅ Server running on port 5001`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173`

### Step 4: Test the App Builder

1. Open browser: `http://localhost:5173/app-builder`
2. Sign in with Clerk
3. Try this prompt: "A pricing card with a gradient background, title, price, features list, and a subscribe button"
4. Press Enter or click "Generate"
5. Watch the magic happen! ✨

## ✅ What You Should See

1. **Editor (Left Pane)**: 
   - Monaco editor with generated React code
   - Syntax highlighting
   - Line numbers

2. **Preview (Right Pane)**:
   - Live rendering of your component
   - Gradient background
   - Interactive elements

3. **Features to Test**:
   - Edit code → preview updates automatically
   - Click "🔄 Refresh" button
   - Resize panes by dragging separator
   - Type in prompt input → press Enter

## 🐛 Troubleshooting

### Frontend won't start
- Check Node version (18+ required)
- Delete `node_modules` and run `npm install` again

### Backend won't start
- Verify `GEMINI_API_KEY` is set in `.env`
- Check port 5001 is not already in use

### "Failed to generate code" error
- Verify backend server is running
- Check backend terminal for detailed error
- Confirm `GEMINI_API_KEY` is valid

### Preview not showing
- Check browser console for errors
- Click the refresh button
- Verify code is valid JSX

### Authentication issues
- Clear browser cookies
- Sign out and sign in again
- Verify Clerk keys are correct

## 📝 Example Prompts to Try

1. "A beautiful todo list with add/remove functionality and hover effects"
2. "A profile card with an avatar, name, bio, and social media buttons"
3. "A dashboard widget showing statistics with colorful gradients"
4. "A login form with email, password fields, and a submit button"
5. "A navigation menu with icons and dropdown submenu"

## 🎯 Key Features to Explore

- ✨ **AI Generation**: Natural language → React code
- ⚡ **Live Preview**: See changes instantly
- 🎨 **Monaco Editor**: Professional code editing
- 🔄 **Real-time Updates**: Auto-refresh on code change
- 📐 **Resizable**: Adjust editor/preview sizes
- 🎨 **Beautiful UI**: Dark theme, gradients, smooth animations

## 📞 Need Help?

Check the full documentation:
- `IMPLEMENTATION_SUMMARY.md` - Complete overview
- `APP_BUILDER_README.md` - Detailed docs
- Frontend logs: Browser DevTools Console
- Backend logs: Terminal running `npm run dev`

---

**Status**: ✅ Ready to test!
**Estimated setup time**: 3 minutes
**First generation time**: ~5 seconds

Enjoy building! 🚀

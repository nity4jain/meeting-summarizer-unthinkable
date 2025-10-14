# 🎙️ Meeting Summarizer - FREE API Version

**No billing or paid APIs required!** This version uses completely free services:

## 🆓 FREE SERVICES USED
- **Web Speech API**: Browser-based speech recognition (Chrome/Edge)
- **Google AI Studio**: Free Gemini API (1M tokens/minute)
- **No credit card required for initial setup**

## 🚀 Quick Start (5 Minutes)

### 1. Get FREE Google AI Studio API Key
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with Google account
3. Create new API key (no billing setup required)
4. Copy the key

### 2. Setup Project
```bash
git clone [your-repo]
cd meeting-summarizer

# Backend setup
cd backend
npm install
cp .env.example .env
# Add your GEMINI_API_KEY to .env file

# Start backend
npm run dev

# Frontend setup (new terminal)
cd ../frontend  
npm install
npm start

[📹 Demo Video (Google Drive)](https://drive.google.com/file/d/1RWRxs27tKTiEHRk8e1kBf3zF7VOGbrFD/view?usp=sharing)

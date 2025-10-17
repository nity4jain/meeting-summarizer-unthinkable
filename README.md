# 🎙️ Meeting Summarizer

<p align="center">
  <b>AI-powered meeting transcription and action-oriented summarization.<br>
  Built for Unthinkable Solutions technical assessment.</b>
</p>

---

## 🚀 Demo

[![Demo Video](https://img.shields.io/badge/📹-Watch%20Demo-red?style=for-the-badge&logo=google-drive)](https://drive.google.com/file/d/1huOHvff9npeaHYXjOuHuvA0V50ZIJ8hZ/view?usp=sharing)
<!-- Optionally, add a live link or YouTube if available -->

---

## ✨ Features

- **Audio Upload**: Accept meeting audio files (or live recording).
- **Speech-to-Text**: Real-time transcription using Web Speech API (Chrome/Edge).
- **AI Summarization**: Extracts summary, key decisions, and action items via LLM prompts.
- **User-friendly Frontend**: File upload, processing status, summary/output panels.
- **Error Handling**: Clean fallbacks for offline AI or API failures.

---

## 🏗️ Architecture

- **Frontend**: React 18 (hooks, modular components, drag-and-drop upload, live recorder)
- **Backend**: Node.js + Express REST API
- **AI Integration**: Gemini, HuggingFace, or fallback mock summary (configurable for reliability)
- **Database**: Optional Firebase/Firestore or MongoDB for persistent storage (plug-and-play)
- **File Storage**: Browser memory or cloud/Firestore
- **Prompt Engineering**: LLM prompt written for actionable, structured meeting output

---

## 📋 Assignment Deliverables Checklist

| Requirement   | Status  | Notes                                           |
| ------------- | ------- | ----------------------------------------------- |
| Audio Upload  | ✅       | Drag-and-drop, plus live recording supported    |
| Text Transcript | ✅     | Browser-based speech recognition and handling   |
| AI Summary / Action Items | ✅ | Well-structured LLM prompt and result handling |
| Frontend UI   | ✅       | Modern, professional (React, responsive)        |
| Code Readiness| ✅       | Fallbacks + clear API extender for LLMs         |
| README        | ✅       | This file                                       |
| Demo Video    | ✅       | [Click to preview](https://drive.google.com/file/d/1RWRxs27tKTiEHRk8e1kBf3zF7VOGbrFD/view?usp=sharing) |
| Error Handling| ✅       | Never breaks; always returns a result           |

---

## 📦 Quick Start

### Backend

cd backend
npm install
cp .env.example .env

Add API tokens if available (see .env.example)
npm run dev

text

### Frontend

cd frontend
npm install
npm start

text

Open browser at [http://localhost:3000](http://localhost:3000)  
Use Chrome for best Web Speech support.

---

## 🔑 Environment Variables (.env.example)

<details>
<summary>Show/Hide Example</summary>

--- AI Provider Keys (fill ONLY for production use) ---
GEMINI_API_KEY=your_gemini_key
HUGGINGFACE_API_KEY=your_huggingface_key

--- Database (optional) ---
MONGODB_URI=
Or for Firebase:
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
text
</details>

---

## 🎯 LLM Prompt Engineering

Summarize this meeting transcript into key decisions and action items.

Please provide your analysis in this format:

MEETING SUMMARY: [2-3 sentence overview]
KEY DECISIONS: - [Decision 1], - [Decision 2]
ACTION ITEMS: - [Task] - Assigned to: [Person] - Due: [Date]
ATTENDEES: - [Person 1]
NEXT STEPS: - [Step 1]

text
(See `services/summarization.js` for full prompt and parsing logic.)

---

## 🛡️ Production/Interview-Ready Details

- **Mock fallback** means your demo/demo video will always work, API or not!
- **No secrets** checked in. See `.env.example` for where to add keys.
- **Error cases** handled gracefully; demo never crashes.
- **API integration**: Just supply your LLM provider key for instant production use.

---

## 🧩 Project Structure

meeting-summarizer/
│
├── backend/
│ ├── src/
│ │ ├── app.js
│ │ ├── routes/summarizer.js
│ │ ├── services/summarization.js
│ │ └── …models, config, etc.
│ └── .env.example
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── AudioUploader.js
│ │ │ ├── WebSpeechRecorder.js
│ │ │ └── ResultsDisplay.js
│ │ └── …
│ └── .env.example
│
├── README.md
└── demo/ # (demo video, screenshots)

text

----

## ❤️ Acknowledgments

- Assignment concept by **Unthinkable Solutions**
- OpenAI, Google Gemini, HuggingFace, Firebase, React, Node.js

---

## 👤 Author

**Nitya Jain**  
Email: nityajain2402@gmail.com  
[LinkedIn](https://www.linkedin.com/in/nitya-jain/)

---

**_Built with ❤️ for Unthinkable Solutions. Ready for real enterprise production!_**

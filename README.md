# Voice Command Shopping Assistant

A voice-based shopping list manager with **smart suggestions**, built with:

- **Frontend:** React.js
- **Backend:** FastAPI
- **Database:** MongoDB Atlas
- **NLP:** spaCy
- **Speech-to-Text:** Web Speech API (via react-speech-recognition)
- **Hosting:** Vercel (frontend), Render (backend)

---

## Features

1. **Voice Input**
   - Add/remove items using voice commands (e.g., "Add milk", "Remove apples").
   - Supports multilingual input with spaCy models.
   - Speech-to-text powered by Web Speech API.

2. **Smart Suggestions**
   - Product recommendations based on shopping history.
   - Seasonal/alternative product suggestions.

3. **Shopping List Management**
   - Add, remove, or update items with quantity support.
   - Auto-categorization of items (dairy, produce, snacks, etc.).

4. **Voice-Activated Search**
   - Search items by name, brand, or price range using voice.

5. **UI/UX**
   - Minimalist React UI with real-time list updates.
   - Visual confirmations for each action.

---

## Tech Architecture

**Flow:**  
`User speaks` → `SpeechRecognition (text)` → `NLP (spaCy)` → `FastAPI Backend` → `MongoDB` → `Backend Response` → `React Frontend UI`

---

## Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/voice-shopping-assistant.git
cd voice-shopping-assistant
```

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
npm start
```

### 3. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows use venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 4. MongoDB Setup
- Create a free MongoDB Atlas account: [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- Get your connection URI and add it to `backend/.env`:

```
MONGO_URI="your-mongo-uri"
DB_NAME="shopping_assistant"
```

---

## API Endpoints

- `POST /list/add` → Add item to shopping list  
- `DELETE /list/remove/{item_id}` → Remove item  
- `GET /list` → Fetch current shopping list  
- `GET /suggestions` → Fetch recommended items  
- `POST /search` → Search by keyword/category/price  

---

## Deployment

- **Frontend:** Deploy to [Vercel](https://vercel.com/)  
- **Backend:** Deploy to [Render](https://render.com/)  
- **Database:** MongoDB Atlas Free Tier  

---

## Deliverables

- ✅ Working application URL  
- ✅ GitHub repository with source code and README  
- ✅ Short approach write-up  

---

## Author

Built as part of a technical assessment project.  
**Date:** August 31, 2025
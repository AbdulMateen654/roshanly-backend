# Roshanly AI 🌟
### Making Every Lesson Brighter.

Roshanly is an AI-powered study assistant that transforms your study material into clean summaries and interactive quizzes — helping students learn faster and smarter.

---

## 🚀 Live Demo

- **Frontend:** https://roshanly-frontend.vercel.app
- **Backend:** https://roshanly-backend-production.up.railway.app

---

## ✨ Features

- **AI Summarization** — Paste any study material and get a structured, point-by-point summary instantly
- **Quiz Generation** — Auto-generate 5 MCQs based on your summary to test your knowledge
- **Session History** — All your summaries and quizzes are saved and accessible from the sidebar
- **Dark Mode** — Full dark/light mode toggle
- **Auth System** — Secure signup and login with JWT authentication
- **Delete Account** — Permanently delete your account and all associated data

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- React Router DOM
- Axios
- CSS (custom, no UI library)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

**AI**
- OpenRouter API (Meta Llama 3.1 8B Instruct)

**Deployment**
- Frontend → Vercel
- Backend → Railway
- Database → MongoDB Atlas

---

## 📁 Project Structure

```
roshanly-frontend/
├── src/
│   ├── components/
│   │   ├── ActionButtons.jsx
│   │   ├── DeleteAccount.jsx
│   │   ├── ResponsePanel.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TextInput.jsx
│   │   └── Topbar.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Signup.jsx
│   └── utils/
│       └── validation.js

roshanly-backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── sessionController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── Session.js
│   └── User.js
├── routes/
│   ├── authRoutes.js
│   └── sessionRoutes.js
├── services/
│   └── openRouterService.js
└── server.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- OpenRouter API key

### Backend
```bash
cd roshanly-backend
npm install
```

Create a `.env` file:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENROUTER_API_KEY=your_openrouter_api_key
PORT=5000
```

```bash
node server.js
```

### Frontend
```bash
cd roshanly-frontend
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| DELETE | `/api/auth/delete/:id` | Delete account + all sessions |

### Sessions
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions/create` | Create new session |
| GET | `/api/sessions/:userId` | Get all sessions |
| DELETE | `/api/sessions/:id` | Delete session |
| POST | `/api/sessions/summarize/:id` | Generate AI summary |
| POST | `/api/sessions/quiz/:id` | Generate AI quiz |

---

## 👨‍💻 Developer

Built by **Abdul Mateen**

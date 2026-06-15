# 🌍 Mini Social Feed App

A full-stack **MERN** (MongoDB, Express, React, Node.js) social media application where users can sign up, log in, create posts with text and/or images, view a public feed, and like/comment on posts in real time — inspired by the TaskPlanet social feed.

🔗 **Live Demo:** https://socialfeed-swart.vercel.app/
🔗 **Backend API:** https://socialfeedbackend.onrender.com

> 
---

## 📸 Features

- 🔐 **Authentication** — Signup & Login with email/password, secured using JWT and bcrypt password hashing
- 📝 **Create Posts** — Share text, an image, or both (images stored as base64)
- 📰 **Public Feed** — View all posts from every user, sorted by newest first
- ❤️ **Like / Unlike** — Toggle likes on any post, with usernames of likers tracked
- 💬 **Comments** — Add comments to any post, with usernames tracked
- ⚡ **Instant UI Updates** — Likes and comments reflect immediately without a page reload
- 📱 **Responsive UI** — Clean, mobile-friendly design built with React-Bootstrap

---

## 🛠️ Tech Stack

**Frontend**
- React.js (Create React App)
- React Router DOM
- React-Bootstrap + Bootstrap 5
- Axios

**Backend**
- Node.js
- Express.js
- MongoDB (Mongoose ODM)
- JSON Web Tokens (JWT) for authentication
- bcryptjs for password hashing

**Database**
- MongoDB Atlas (cloud-hosted), with two collections: `users` and `posts`

**Deployment**
- Backend → [Render](https://render.com)
- Frontend → [Vercel](https://vercel.com)
- Database → [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## 📂 Project Structure

```
social-app/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT auth middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Post.js              # Post schema (likes + comments embedded)
│   ├── routes/
│   │   ├── auth.js               # /api/auth/signup, /api/auth/login
│   │   └── posts.js              # /api/posts (CRUD, like, comment)
│   ├── server.js                  # Express app entry point
│   └── .env                       # Environment variables
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── api/
        │   └── api.js              # Axios instance (connects to backend)
        ├── components/
        │   ├── Navbar.js
        │   ├── Login.js
        │   ├── Signup.js
        │   ├── Feed.js
        │   ├── CreatePost.js
        │   └── PostCard.js
        ├── context/
        │   └── AuthContext.js     # Global auth state
        ├── App.js
        └── index.js
```

---

## ⚙️ How It Works

1. **Signup/Login** → user credentials are sent to `/api/auth/signup` or `/api/auth/login`. Passwords are hashed with bcrypt before being stored. On success, the backend returns a **JWT token**, which is saved in the browser's `localStorage`.
2. **Authenticated Requests** → every request to create a post, like, or comment automatically attaches the JWT as a `Bearer` token (handled by an Axios interceptor in `api.js`).
3. **Create Post** → users can submit text, an image (converted to base64 on the frontend), or both. At least one is required.
4. **Feed** → `GET /api/posts` returns all posts (newest first) — no login required to view.
5. **Like/Comment** → `POST /api/posts/:id/like` toggles a like (adds/removes the user from the post's `likes` array). `POST /api/posts/:id/comment` pushes a new comment object into the post's `comments` array. Both return the updated post, which the frontend uses to update the UI instantly.

---

## 🚀 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/your-repo.git
cd your-repo
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxxxx.mongodb.net/socialApp?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

Run the backend:
```bash
npm run dev
```
✅ API runs at `http://localhost:5000`

### 3. Frontend setup
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
✅ App runs at `http://localhost:3000`

---

## 🔌 API Endpoints

| Method | Endpoint                  | Auth Required | Description                  |
|--------|---------------------------|----------------|------------------------------|
| POST   | `/api/auth/signup`         | ❌             | Create a new account          |
| POST   | `/api/auth/login`          | ❌             | Log in and receive a JWT       |
| GET    | `/api/posts`                | ❌             | Get all posts (public feed)    |
| POST   | `/api/posts`                | ✅             | Create a new post (text/image) |
| POST   | `/api/posts/:id/like`       | ✅             | Like or unlike a post          |
| POST   | `/api/posts/:id/comment`    | ✅             | Add a comment to a post        |

---

## 🌐 Deployment

This project is deployed using a split architecture:

- **Backend** → deployed on **Render** as a Node web service, connected to MongoDB Atlas.
- **Frontend** → deployed on **Vercel** as a static Create React App build.

### Environment variables used in production

**Render (backend):**
| Key | Value |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWTs |
| `CLIENT_URL` | URL of the deployed Vercel frontend (for CORS) |

**Vercel (frontend):**
The backend API URL is set directly in `src/api/api.js`:
```js
const api = axios.create({
  baseURL: 'https://socialfeedbackend.onrender.com/api',
});
```

---

## 🗄️ Database Schema

**`users` collection**
```json
{
  "_id": "ObjectId",
  "username": "string",
  "email": "string",
  "password": "hashed string",
  "createdAt": "date"
}
```

**`posts` collection**
```json
{
  "_id": "ObjectId",
  "user": "ObjectId (ref User)",
  "username": "string",
  "text": "string",
  "image": "base64 string",
  "likes": [{ "user": "ObjectId", "username": "string" }],
  "comments": [{ "user": "ObjectId", "username": "string", "text": "string", "createdAt": "date" }],
  "createdAt": "date"
}
```

---

## 🔮 Future Improvements

Profile pages with user's own posts
Edit/delete posts
Image upload via cloud storage (e.g. Cloudinary) instead of base64
Real-time updates using WebSockets/Socket.io
Pagination/infinite scroll for the feed
Follow/unfollow other users


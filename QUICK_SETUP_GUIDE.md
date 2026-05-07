# 🚀 Quick Setup Guide - Real Authentication

## Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

---

## 5-Minute Setup

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

### 2. Configure Environment

**Backend:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/fitzone_superadmin
JWT_SECRET=your_super_secret_key_change_this_min_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_key_change_this_min_32_characters
```

**Frontend:**
```bash
cd ..
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB
```bash
mongod
```

### 4. Start Backend
```bash
cd backend
npm run dev
```

### 5. Start Frontend (New Terminal)
```bash
npm start
```

---

## ✅ Test It!

### Create New Account
1. Open `http://localhost:3000`
2. Click "Get Started"
3. Click "Sign Up" tab
4. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
5. Click "Create Account"
6. ✅ You're logged in!

### Login
1. Logout
2. Login with:
   - Email: test@example.com
   - Password: password123
3. ✅ You're logged in!

### Demo Accounts (Still Work!)
- **Super Admin:** superadmin@gym.com / 123456
- **Admin:** admin@gym.com / 123456
- **Trainer:** trainer@gym.com / 123456
- **Member:** user@gym.com / 123456

---

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod`
- Check port 5000 is available
- Verify `.env` file exists in `backend/`

### Frontend won't connect
- Check backend is running on port 5000
- Verify `.env` file exists in root
- Check `REACT_APP_API_URL` is correct

### Login fails
- Check MongoDB connection
- Check backend console for errors
- Verify user exists in database

---

## 📊 What's Different?

### Before (Demo Only)
- Fake accounts in memory
- No database
- No real authentication
- Lost on refresh

### After (Real Auth)
- ✅ Real database (MongoDB)
- ✅ Secure passwords (bcrypt)
- ✅ JWT tokens
- ✅ Stays logged in
- ✅ Protected routes
- ✅ Demo accounts still work!

---

## 🎯 Key Features

✅ **Real Signup** - Creates users in database  
✅ **Real Login** - Verifies credentials  
✅ **Password Security** - Bcrypt hashing  
✅ **JWT Tokens** - Secure authentication  
✅ **Persistence** - Stays logged in  
✅ **Protected Routes** - Auth required  
✅ **Auto-Logout** - On token expiry  
✅ **Demo Fallback** - Demo accounts work  

---

## 📝 API Endpoints

- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

---

## 🎉 Done!

Your authentication system is now fully functional with real database integration!

**No UI changes - everything looks the same!**

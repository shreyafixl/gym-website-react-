# 🔐 Authentication Module - Testing Guide

## ✅ Module Complete

The Authentication Module has been successfully implemented with the following features:

### 📦 Files Created

```
backend/
├── models/
│   └── SuperAdmin.js           ✅ Super Admin model with bcrypt
├── controllers/
│   └── authController.js       ✅ Authentication logic
├── routes/
│   └── authRoutes.js          ✅ Auth API routes
├── middleware/
│   ├── authMiddleware.js      ✅ JWT verification
│   └── roleMiddleware.js      ✅ Role-based access
├── utils/
│   └── generateToken.js       ✅ JWT token generation
└── scripts/
    └── createSuperAdmin.js    ✅ Seed script
```

---

## 🚀 How to Run the Server

### Step 1: Install Dependencies (if not done)
```bash
cd backend
npm install
```

### Step 2: Configure Environment
Make sure your `.env` file has these variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fitzone_superadmin
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_key_min_32_chars
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### Step 4: Create Super Admin User
```bash
npm run seed:admin
```

**Output:**
```
✅ Super Admin Created Successfully!
📧 Email:    admin@fitzone.com
🔑 Password: Admin@123456
👤 Name:     Aditya Sharma
🎭 Role:     superadmin
```

### Step 5: Start the Server
```bash
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected: localhost
📊 Database: fitzone_superadmin

🚀 ========================================
🏋️  FitZone Super Admin API Server
🚀 ========================================
📡 Server running on port: 5000
🌍 Environment: development
🔗 API URL: http://localhost:5000/api
💚 Health Check: http://localhost:5000/health
🚀 ========================================
```

---

## 🧪 Testing with Postman / Thunder Client

### 1️⃣ Test Login (POST)

**Endpoint:**
```
POST http://localhost:5000/api/superadmin/auth/login
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "admin@fitzone.com",
  "password": "Admin@123456"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "name": "Aditya Sharma",
      "email": "admin@fitzone.com",
      "role": "superadmin",
      "company": "FitZone Group",
      "avatar": "AD",
      "isActive": true,
      "lastLogin": "2026-05-07T10:30:00.000Z",
      "createdAt": "2026-05-07T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

**Copy the `token` value for next requests!**

---

### 2️⃣ Test Get Current Admin (GET)

**Endpoint:**
```
GET http://localhost:5000/api/superadmin/auth/me
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Admin profile retrieved successfully",
  "data": {
    "admin": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "name": "Aditya Sharma",
      "email": "admin@fitzone.com",
      "role": "superadmin",
      "company": "FitZone Group",
      "avatar": "AD",
      "isActive": true,
      "lastLogin": "2026-05-07T10:30:00.000Z",
      "createdAt": "2026-05-07T10:00:00.000Z"
    }
  }
}
```

---

### 3️⃣ Test Update Password (PUT)

**Endpoint:**
```
PUT http://localhost:5000/api/superadmin/auth/password
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Body (JSON):**
```json
{
  "currentPassword": "Admin@123456",
  "newPassword": "NewSecure@123"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": null
}
```

---

### 4️⃣ Test Refresh Token (POST)

**Endpoint:**
```
POST http://localhost:5000/api/superadmin/auth/refresh
```

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

---

### 5️⃣ Test Logout (POST)

**Endpoint:**
```
POST http://localhost:5000/api/superadmin/auth/logout
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

## 🧪 Testing Error Cases

### Invalid Credentials
**Request:**
```json
{
  "email": "admin@fitzone.com",
  "password": "wrongpassword"
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Missing Token
**Request:** GET `/api/superadmin/auth/me` without Authorization header

**Response (401):**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

---

### Invalid Token
**Request:** GET `/api/superadmin/auth/me` with invalid token

**Response (401):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

---

### Expired Token
**Request:** Use token after 1 hour

**Response (401):**
```json
{
  "success": false,
  "message": "Token expired"
}
```

---

## 📋 Available API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/superadmin/auth/login` | Public | Login with email/password |
| GET | `/api/superadmin/auth/me` | Private | Get current admin profile |
| POST | `/api/superadmin/auth/logout` | Private | Logout current session |
| POST | `/api/superadmin/auth/refresh` | Public | Refresh access token |
| PUT | `/api/superadmin/auth/password` | Private | Update password |

---

## 🔐 Authentication Flow

1. **Login** → Receive `token` and `refreshToken`
2. **Use token** in `Authorization: Bearer <token>` header for protected routes
3. **Token expires** after 1 hour
4. **Refresh token** to get new access token (valid for 7 days)
5. **Logout** to invalidate session

---

## 🛡️ Security Features Implemented

✅ **Password Hashing** - bcrypt with salt rounds of 12
✅ **JWT Authentication** - Secure token-based auth
✅ **Token Expiration** - Access token: 1h, Refresh token: 7d
✅ **Role-Based Access** - Middleware for role checking
✅ **Protected Routes** - Auth middleware verification
✅ **Password Validation** - Minimum 8 characters
✅ **Email Validation** - Regex pattern matching
✅ **Active Status Check** - Deactivated accounts blocked
✅ **Last Login Tracking** - IP and timestamp recorded

---

## 🧩 Middleware Usage Examples

### Protect Route (Authentication Required)
```javascript
const { protect } = require('../middleware/authMiddleware');

router.get('/protected', protect, (req, res) => {
  // req.user is available here
  res.json({ user: req.user });
});
```

### Super Admin Only Route
```javascript
const { protect } = require('../middleware/authMiddleware');
const { superAdminOnly } = require('../middleware/roleMiddleware');

router.delete('/critical', protect, superAdminOnly, (req, res) => {
  // Only superadmin role can access
  res.json({ message: 'Critical operation' });
});
```

### Multiple Roles Allowed
```javascript
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/data', protect, authorize('superadmin', 'admin'), (req, res) => {
  // Both superadmin and admin can access
  res.json({ data: 'Some data' });
});
```

---

## 📊 Database Schema

### SuperAdmin Model
```javascript
{
  name: String (required, 2-255 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 8 chars),
  role: String (enum: ['superadmin', 'admin'], default: 'superadmin'),
  avatar: String (optional),
  company: String (default: 'FitZone Group'),
  phone: String (optional),
  isActive: Boolean (default: true),
  lastLogin: Date,
  lastLoginIp: String,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## ✅ Testing Checklist

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Super admin created via seed script
- [ ] Login with correct credentials works
- [ ] Login with wrong credentials fails
- [ ] Token is returned on successful login
- [ ] Protected route accessible with valid token
- [ ] Protected route blocked without token
- [ ] Protected route blocked with invalid token
- [ ] Get current admin profile works
- [ ] Password update works
- [ ] Token refresh works
- [ ] Logout works

---

## 🎯 Next Steps

**✅ Authentication Module Complete!**

Ready to implement the next module:
- **User Management Module**
- **Branch Management Module**
- **Financial Management Module**

**Waiting for confirmation to proceed! 🚀**

---

## 📝 Notes

- All passwords are hashed with bcrypt before saving
- Tokens are signed with JWT
- Protected routes require valid token
- Role middleware can restrict access by role
- Error handling is centralized
- Response format is standardized

---

**Last Updated:** May 7, 2026  
**Status:** ✅ Complete and Ready for Testing

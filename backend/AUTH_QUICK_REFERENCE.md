# 🔐 Authentication Module - Quick Reference

## 🚀 Quick Start (3 Steps)

### 1. Create Super Admin
```bash
cd backend
npm run seed:admin
```

### 2. Start Server
```bash
npm run dev
```

### 3. Test Login
```bash
curl -X POST http://localhost:5000/api/superadmin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fitzone.com","password":"Admin@123456"}'
```

---

## 📡 API Endpoints

### Login
```
POST /api/superadmin/auth/login
Body: { "email": "admin@fitzone.com", "password": "Admin@123456" }
```

### Get Profile
```
GET /api/superadmin/auth/me
Header: Authorization: Bearer <token>
```

### Update Password
```
PUT /api/superadmin/auth/password
Header: Authorization: Bearer <token>
Body: { "currentPassword": "old", "newPassword": "new" }
```

### Refresh Token
```
POST /api/superadmin/auth/refresh
Body: { "refreshToken": "<refresh_token>" }
```

### Logout
```
POST /api/superadmin/auth/logout
Header: Authorization: Bearer <token>
```

---

## 🔑 Test Credentials

```
Email:    admin@fitzone.com
Password: Admin@123456
Role:     superadmin
```

---

## 🧩 Using Middleware in Routes

### Protect Route (Auth Required)
```javascript
const { protect } = require('../middleware/authMiddleware');

router.get('/protected', protect, controller);
```

### Super Admin Only
```javascript
const { protect } = require('../middleware/authMiddleware');
const { superAdminOnly } = require('../middleware/roleMiddleware');

router.delete('/admin-only', protect, superAdminOnly, controller);
```

### Multiple Roles
```javascript
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/data', protect, authorize('superadmin', 'admin'), controller);
```

---

## 📦 Files Created

```
backend/
├── models/SuperAdmin.js           # User model with bcrypt
├── controllers/authController.js  # Auth logic
├── routes/authRoutes.js          # Auth routes
├── middleware/
│   ├── authMiddleware.js         # JWT verification
│   └── roleMiddleware.js         # Role checking
├── utils/generateToken.js        # Token generation
└── scripts/createSuperAdmin.js   # Seed script
```

---

## ✅ Features Implemented

- ✅ Super Admin model with bcrypt password hashing
- ✅ JWT authentication (access + refresh tokens)
- ✅ Login endpoint with credential validation
- ✅ Protected route middleware
- ✅ Role-based authorization middleware
- ✅ Get current admin profile
- ✅ Update password
- ✅ Token refresh
- ✅ Logout
- ✅ Last login tracking
- ✅ Active status checking

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/superadmin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fitzone.com","password":"Admin@123456"}'
```

### Get Profile (replace TOKEN)
```bash
curl -X GET http://localhost:5000/api/superadmin/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Password
```bash
curl -X PUT http://localhost:5000/api/superadmin/auth/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"currentPassword":"Admin@123456","newPassword":"NewPass@123"}'
```

---

## 📊 Response Format

### Success
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

---

## 🔐 Security Features

- Password hashing with bcrypt (12 rounds)
- JWT tokens with expiration
- Token verification middleware
- Role-based access control
- Active status checking
- Last login tracking
- Secure password validation

---

## 📝 Environment Variables Required

```env
JWT_SECRET=your_secret_key_min_32_characters
JWT_REFRESH_SECRET=your_refresh_secret_min_32_characters
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d
```

---

## ⏭️ Next Module

**User Management Module** - Coming next!

---

**Status:** ✅ Complete  
**Last Updated:** May 7, 2026

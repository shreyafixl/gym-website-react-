# 👥 User Management Module - Quick Reference

## 🚀 Quick Start

### 1. Create Sample Users
```bash
cd backend
npm run seed:users
```

### 2. Get Auth Token
```bash
curl -X POST http://localhost:5000/api/superadmin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fitzone.com","password":"Admin@123456"}'
```

### 3. Test User API
```bash
curl -X GET http://localhost:5000/api/superadmin/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📡 API Endpoints

### Get All Users
```
GET /api/superadmin/users
Query: ?page=1&limit=20&role=member&membershipStatus=active&search=john
```

### Get Single User
```
GET /api/superadmin/users/:id
```

### Create User
```
POST /api/superadmin/users
Body: {
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "Pass@123",
  "phone": "9876543210",
  "gender": "male",
  "age": 25,
  "membershipPlan": "monthly",
  "membershipStatus": "active",
  "role": "member"
}
```

### Update User
```
PUT /api/superadmin/users/:id
Body: { "fullName": "Updated Name", "age": 26 }
```

### Delete User
```
DELETE /api/superadmin/users/:id
```

### Update Membership
```
PATCH /api/superadmin/users/:id/membership-status
Body: {
  "membershipStatus": "active",
  "membershipStartDate": "2026-05-01",
  "membershipEndDate": "2027-05-01"
}
```

### Assign Trainer
```
PATCH /api/superadmin/users/:id/assign-trainer
Body: { "trainerId": "trainer_id_here" }
```

### Add Attendance
```
POST /api/superadmin/users/:id/attendance
Body: {
  "checkIn": "2026-05-07T06:00:00.000Z",
  "checkOut": "2026-05-07T08:00:00.000Z"
}
```

### Get Attendance
```
GET /api/superadmin/users/:id/attendance?limit=30
```

### Get Statistics
```
GET /api/superadmin/users/stats
```

---

## 📦 Required Fields for Create User

```javascript
{
  fullName: "string (2-255 chars)",
  email: "string (valid email, unique)",
  password: "string (min 8 chars)",
  phone: "string (10 digits)",
  gender: "male | female | other",
  age: "number (13-120)"
}
```

---

## 🔐 Authentication

All endpoints require:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

Only **superadmin** role can access these endpoints.

---

## 📊 User Model Fields

```javascript
{
  fullName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  gender: Enum,
  age: Number,
  membershipPlan: Enum,
  membershipStatus: Enum,
  membershipStartDate: Date,
  membershipEndDate: Date,
  assignedTrainer: ObjectId,
  role: Enum,
  attendance: Array,
  profileImage: String,
  address: String,
  emergencyContact: Object,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Enums

**Gender:** male, female, other

**Membership Plan:** monthly, quarterly, half-yearly, yearly, none

**Membership Status:** active, expired, pending

**Role:** member, trainer, staff

---

## 🧪 Test Credentials (After Seed)

```
Member: rahul@example.com / User@123456
Trainer: amit.trainer@example.com / Trainer@123456
Staff: rajesh.staff@example.com / Staff@123456
```

---

## 📝 Response Format

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
  "message": "Error message"
}
```

---

## ✅ Features

- ✅ Full CRUD operations
- ✅ Pagination & filtering
- ✅ Search by name/email
- ✅ Membership management
- ✅ Trainer assignment
- ✅ Attendance tracking
- ✅ User statistics
- ✅ Password hashing
- ✅ Role-based access

---

**Status:** ✅ Complete  
**Last Updated:** May 7, 2026

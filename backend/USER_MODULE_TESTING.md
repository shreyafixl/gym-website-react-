# 👥 User Management Module - Testing Guide

## ✅ Module Complete

The User Management Module has been successfully implemented with full CRUD operations, membership management, trainer assignment, and attendance tracking.

---

## 📦 Files Created

```
backend/
├── models/
│   └── User.js                    ✅ User model with bcrypt
├── controllers/
│   └── userController.js          ✅ User management logic
├── routes/
│   └── userRoutes.js             ✅ User API routes
└── scripts/
    └── createSampleUsers.js      ✅ Sample data seed script
```

---

## 🚀 Setup & Run

### Step 1: Create Sample Users (Optional)
```bash
cd backend
npm run seed:users
```

**Output:**
```
✅ Created: Rahul Sharma (member) - rahul@example.com
✅ Created: Priya Patel (member) - priya@example.com
✅ Created: Amit Kumar (trainer) - amit.trainer@example.com
✅ Created: Sneha Reddy (trainer) - sneha.trainer@example.com
```

### Step 2: Start Server
```bash
npm run dev
```

### Step 3: Login as Super Admin
First, get your authentication token:

```bash
curl -X POST http://localhost:5000/api/superadmin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fitzone.com","password":"Admin@123456"}'
```

**Copy the `token` from the response!**

---

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/superadmin/users
```

### Authentication Required
All endpoints require:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🧪 Testing with Postman / Thunder Client

### 1️⃣ Get All Users (GET)

**Endpoint:**
```
GET http://localhost:5000/api/superadmin/users
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters (Optional):**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `role` - Filter by role: member, trainer, staff, all
- `membershipStatus` - Filter by status: active, expired, pending, all
- `search` - Search by name or email
- `sortBy` - Sort field: createdAt, fullName, age
- `sortOrder` - Sort order: asc, desc

**Example with filters:**
```
GET http://localhost:5000/api/superadmin/users?role=member&membershipStatus=active&page=1&limit=10
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "663f8a1b2c4d5e6f7a8b9c0d",
        "fullName": "Rahul Sharma",
        "email": "rahul@example.com",
        "phone": "9876543210",
        "gender": "male",
        "age": 28,
        "membershipPlan": "yearly",
        "membershipStatus": "active",
        "membershipStartDate": "2026-01-01T00:00:00.000Z",
        "membershipEndDate": "2027-01-01T00:00:00.000Z",
        "assignedTrainer": null,
        "role": "member",
        "profileImage": null,
        "address": "Mumbai, Maharashtra",
        "isActive": true,
        "attendanceCount": 0,
        "createdAt": "2026-05-07T10:00:00.000Z",
        "updatedAt": "2026-05-07T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalCount": 7,
      "perPage": 20,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "stats": {
      "total": 7,
      "active": 5,
      "expired": 1,
      "pending": 1,
      "members": 4,
      "trainers": 2,
      "staff": 1
    }
  }
}
```

---

### 2️⃣ Get Single User (GET)

**Endpoint:**
```
GET http://localhost:5000/api/superadmin/users/:id
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
```
GET http://localhost:5000/api/superadmin/users/663f8a1b2c4d5e6f7a8b9c0d
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "fullName": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "9876543210",
      "gender": "male",
      "age": 28,
      "membershipPlan": "yearly",
      "membershipStatus": "active",
      "membershipStartDate": "2026-01-01T00:00:00.000Z",
      "membershipEndDate": "2027-01-01T00:00:00.000Z",
      "assignedTrainer": null,
      "role": "member",
      "profileImage": null,
      "address": "Mumbai, Maharashtra",
      "emergencyContact": {
        "name": "Priya Sharma",
        "phone": "9876543211",
        "relationship": "spouse"
      },
      "isActive": true,
      "attendanceCount": 0,
      "createdAt": "2026-05-07T10:00:00.000Z",
      "updatedAt": "2026-05-07T10:00:00.000Z"
    },
    "membershipDaysRemaining": 239,
    "recentAttendance": [],
    "totalAttendance": 0
  }
}
```

---

### 3️⃣ Create User (POST)

**Endpoint:**
```
POST http://localhost:5000/api/superadmin/users
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass@123",
  "phone": "9876543280",
  "gender": "male",
  "age": 30,
  "membershipPlan": "monthly",
  "membershipStatus": "active",
  "membershipStartDate": "2026-05-01",
  "membershipEndDate": "2026-06-01",
  "role": "member",
  "address": "123 Main Street, Mumbai",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "9876543281",
    "relationship": "spouse"
  }
}
```

**Required Fields:**
- `fullName` (string, 2-255 chars)
- `email` (string, valid email, unique)
- `password` (string, min 8 chars)
- `phone` (string, 10 digits)
- `gender` (enum: male, female, other)
- `age` (number, 13-120)

**Optional Fields:**
- `membershipPlan` (enum: monthly, quarterly, half-yearly, yearly, none)
- `membershipStatus` (enum: active, expired, pending)
- `membershipStartDate` (date)
- `membershipEndDate` (date)
- `assignedTrainer` (ObjectId)
- `role` (enum: member, trainer, staff)
- `address` (string)
- `emergencyContact` (object)

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "663f8a1b2c4d5e6f7a8b9c0e",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "9876543280",
      "gender": "male",
      "age": 30,
      "membershipPlan": "monthly",
      "membershipStatus": "active",
      "role": "member",
      "createdAt": "2026-05-07T11:00:00.000Z"
    }
  }
}
```

---

### 4️⃣ Update User (PUT)

**Endpoint:**
```
PUT http://localhost:5000/api/superadmin/users/:id
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body (all fields optional):**
```json
{
  "fullName": "John Doe Updated",
  "phone": "9876543299",
  "age": 31,
  "membershipPlan": "yearly",
  "membershipStatus": "active",
  "address": "New Address, Mumbai",
  "isActive": true
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "663f8a1b2c4d5e6f7a8b9c0e",
      "fullName": "John Doe Updated",
      "email": "john.doe@example.com",
      "phone": "9876543299",
      "age": 31,
      "membershipPlan": "yearly",
      "updatedAt": "2026-05-07T11:30:00.000Z"
    }
  }
}
```

---

### 5️⃣ Delete User (DELETE)

**Endpoint:**
```
DELETE http://localhost:5000/api/superadmin/users/:id
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null
}
```

---

### 6️⃣ Update Membership Status (PATCH)

**Endpoint:**
```
PATCH http://localhost:5000/api/superadmin/users/:id/membership-status
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "membershipStatus": "active",
  "membershipStartDate": "2026-05-01",
  "membershipEndDate": "2027-05-01"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Membership status updated successfully",
  "data": {
    "user": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "membershipStatus": "active",
      "membershipStartDate": "2026-05-01T00:00:00.000Z",
      "membershipEndDate": "2027-05-01T00:00:00.000Z"
    }
  }
}
```

---

### 7️⃣ Assign Trainer (PATCH)

**Endpoint:**
```
PATCH http://localhost:5000/api/superadmin/users/:id/assign-trainer
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "trainerId": "663f8a1b2c4d5e6f7a8b9c0f"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Trainer assigned successfully",
  "data": {
    "user": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "fullName": "Rahul Sharma",
      "assignedTrainer": {
        "id": "663f8a1b2c4d5e6f7a8b9c0f",
        "fullName": "Amit Kumar",
        "email": "amit.trainer@example.com",
        "role": "trainer"
      }
    }
  }
}
```

---

### 8️⃣ Add Attendance (POST)

**Endpoint:**
```
POST http://localhost:5000/api/superadmin/users/:id/attendance
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "checkIn": "2026-05-07T06:00:00.000Z",
  "checkOut": "2026-05-07T08:00:00.000Z"
}
```

**Note:** `checkOut` is optional

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Attendance added successfully",
  "data": {
    "user": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "fullName": "Rahul Sharma"
    },
    "totalAttendance": 1
  }
}
```

---

### 9️⃣ Get User Attendance (GET)

**Endpoint:**
```
GET http://localhost:5000/api/superadmin/users/:id/attendance
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters:**
- `limit` - Number of records (default: 30)

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Attendance history retrieved successfully",
  "data": {
    "user": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "fullName": "Rahul Sharma",
      "email": "rahul@example.com"
    },
    "attendance": [
      {
        "date": "2026-05-07T06:00:00.000Z",
        "checkIn": "2026-05-07T06:00:00.000Z",
        "checkOut": "2026-05-07T08:00:00.000Z",
        "duration": 120
      }
    ],
    "totalRecords": 1
  }
}
```

---

### 🔟 Get User Statistics (GET)

**Endpoint:**
```
GET http://localhost:5000/api/superadmin/users/stats
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User statistics retrieved successfully",
  "data": {
    "total": 7,
    "byStatus": {
      "active": 5,
      "expired": 1,
      "pending": 1
    },
    "byRole": {
      "members": 4,
      "trainers": 2,
      "staff": 1
    },
    "byPlan": {
      "monthly": 1,
      "quarterly": 1,
      "halfYearly": 1,
      "yearly": 1,
      "none": 3
    },
    "recentUsers": [
      {
        "id": "...",
        "fullName": "...",
        "email": "...",
        "role": "...",
        "membershipStatus": "...",
        "createdAt": "..."
      }
    ]
  }
}
```

---

## 🧪 Testing Error Cases

### Invalid User ID
**Request:** GET `/api/superadmin/users/invalid_id`

**Response (400):**
```json
{
  "success": false,
  "message": "Invalid ID format"
}
```

---

### User Not Found
**Request:** GET `/api/superadmin/users/663f8a1b2c4d5e6f7a8b9999`

**Response (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### Duplicate Email
**Request:** POST `/api/superadmin/users` with existing email

**Response (409):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### Missing Required Fields
**Request:** POST `/api/superadmin/users` without required fields

**Response (400):**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

---

### Invalid Trainer Assignment
**Request:** PATCH `/api/superadmin/users/:id/assign-trainer` with invalid trainer ID

**Response (400):**
```json
{
  "success": false,
  "message": "Invalid trainer ID or user is not a trainer"
}
```

---

## 📋 Complete API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superadmin/users` | Get all users with filters |
| GET | `/api/superadmin/users/stats` | Get user statistics |
| GET | `/api/superadmin/users/:id` | Get single user by ID |
| POST | `/api/superadmin/users` | Create new user |
| PUT | `/api/superadmin/users/:id` | Update user |
| DELETE | `/api/superadmin/users/:id` | Delete user |
| PATCH | `/api/superadmin/users/:id/membership-status` | Update membership |
| PATCH | `/api/superadmin/users/:id/assign-trainer` | Assign trainer |
| POST | `/api/superadmin/users/:id/attendance` | Add attendance |
| GET | `/api/superadmin/users/:id/attendance` | Get attendance history |

---

## 🔐 Security Features

✅ **All routes protected** - Require authentication
✅ **Super admin only** - Role-based authorization
✅ **Password hashing** - bcrypt with 12 rounds
✅ **Email validation** - Regex pattern matching
✅ **Phone validation** - 10-digit format
✅ **Unique email** - Database constraint
✅ **Input validation** - Required field checks

---

## 📊 Database Schema

### User Model Fields
```javascript
{
  fullName: String (required, 2-255 chars),
  email: String (required, unique, lowercase),
  password: String (required, hashed, min 8 chars),
  phone: String (required, 10 digits),
  gender: Enum (male, female, other),
  age: Number (13-120),
  membershipPlan: Enum (monthly, quarterly, half-yearly, yearly, none),
  membershipStatus: Enum (active, expired, pending),
  membershipStartDate: Date,
  membershipEndDate: Date,
  assignedTrainer: ObjectId (ref: User),
  role: Enum (member, trainer, staff),
  attendance: Array of { date, checkIn, checkOut },
  profileImage: String,
  address: String,
  emergencyContact: { name, phone, relationship },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## ✅ Testing Checklist

- [ ] Server running without errors
- [ ] Super admin token obtained
- [ ] Get all users works
- [ ] Get single user works
- [ ] Create user works
- [ ] Update user works
- [ ] Delete user works
- [ ] Update membership status works
- [ ] Assign trainer works
- [ ] Add attendance works
- [ ] Get attendance history works
- [ ] Get user statistics works
- [ ] Filters and pagination work
- [ ] Error handling works

---

## 🎯 Next Steps

**✅ User Management Module Complete!**

Ready to implement the next module:
- **Branch Management Module**
- **Financial Management Module**
- **Analytics & Reporting Module**

**Waiting for confirmation to proceed! 🚀**

---

**Last Updated:** May 7, 2026  
**Status:** ✅ Complete and Ready for Testing

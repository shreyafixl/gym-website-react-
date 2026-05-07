# Attendance Management Module - Complete Guide

## 📋 Overview

The Attendance Management Module provides comprehensive functionality for tracking member attendance at gym branches, including check-in/check-out, attendance history, and statistics.

## 🗂️ Module Structure

```
backend/
├── models/
│   └── Attendance.js           ✅ Complete
├── controllers/
│   └── attendanceController.js ✅ Complete
└── routes/
    └── attendanceRoutes.js     ✅ Complete
```

## 🔐 Authentication & Authorization

**All routes require:**
- JWT Authentication (Bearer token)

**Role-based access:**
- Super Admin: Full access to all endpoints
- Trainers: Can view and manage attendance
- Members: Can check-in/check-out and view own records

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 📊 API Endpoints

### Base URL: `http://localhost:5000/api/attendance`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/attendance` | Get all attendance records | Super Admin, Trainers |
| GET | `/attendance/:id` | Get single attendance record | Super Admin, Trainers |
| GET | `/attendance/member/:memberId` | Get member attendance history | All authenticated |
| GET | `/attendance/branch/:branchId` | Get branch attendance | Super Admin, Trainers |
| GET | `/attendance/today` | Get today's attendance | Super Admin, Trainers |
| GET | `/attendance/stats/overview` | Get attendance statistics | Super Admin, Trainers |
| POST | `/attendance` | Create attendance (Check-in) | All authenticated |
| PUT | `/attendance/:id` | Update attendance record | Super Admin, Trainers |
| PATCH | `/attendance/:id/checkout` | Check out member | All authenticated |
| DELETE | `/attendance/:id` | Delete attendance record | Super Admin only |

**Total: 10 Endpoints**

---

## 📝 API Documentation

### 1. Get All Attendance Records
**Endpoint:** `GET /api/attendance`

**Access:** Super Admin, Trainers

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `memberId` (optional) - Filter by member
- `trainerId` (optional) - Filter by trainer
- `branchId` (optional) - Filter by branch
- `status` (optional) - Filter by status: present, absent, late, leave
- `startDate` (optional) - Filter from date (YYYY-MM-DD)
- `endDate` (optional) - Filter to date (YYYY-MM-DD)
- `sortBy` (optional, default: attendanceDate)
- `sortOrder` (optional, default: desc)

**Example Request:**
```bash
GET /api/attendance?page=1&limit=10&branchId=6745abc123&startDate=2026-05-01&endDate=2026-05-07
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Attendance records retrieved successfully",
  "data": {
    "attendance": [
      {
        "id": "6745abc123def456",
        "memberId": {
          "id": "6745abc123",
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "branchId": {
          "id": "6745abc456",
          "branchName": "Downtown Branch",
          "branchCode": "DT001"
        },
        "attendanceDate": "2026-05-07T00:00:00.000Z",
        "checkInTime": "2026-05-07T08:30:00.000Z",
        "checkOutTime": "2026-05-07T10:30:00.000Z",
        "attendanceStatus": "present",
        "duration": 120,
        "notes": null,
        "createdAt": "2026-05-07T08:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50,
      "perPage": 10
    },
    "stats": {
      "total": 50,
      "present": 45,
      "absent": 2,
      "late": 3,
      "leave": 0
    }
  }
}
```

### 2. Get Single Attendance Record
**Endpoint:** `GET /api/attendance/:id`

**Access:** Super Admin, Trainers

**Example Request:**
```bash
GET /api/attendance/6745abc123def456
Authorization: Bearer <token>
```

### 3. Get Member Attendance History
**Endpoint:** `GET /api/attendance/member/:memberId`

**Access:** All authenticated users

**Query Parameters:**
- `limit` (optional, default: 30)
- `startDate` (optional)
- `endDate` (optional)

**Example Request:**
```bash
GET /api/attendance/member/6745abc123?limit=30&startDate=2026-04-01
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Member attendance history retrieved successfully",
  "data": {
    "member": {
      "id": "6745abc123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "membershipStatus": "active"
    },
    "attendance": [
      {
        "id": "6745abc123def456",
        "attendanceDate": "2026-05-07T00:00:00.000Z",
        "checkInTime": "2026-05-07T08:30:00.000Z",
        "checkOutTime": "2026-05-07T10:30:00.000Z",
        "duration": 120,
        "attendanceStatus": "present"
      }
    ],
    "stats": {
      "total": 30,
      "present": 28,
      "absent": 1,
      "late": 1,
      "leave": 0
    },
    "totalRecords": 30
  }
}
```

### 4. Get Branch Attendance
**Endpoint:** `GET /api/attendance/branch/:branchId`

**Access:** Super Admin, Trainers

**Query Parameters:**
- `date` (optional) - Specific date (YYYY-MM-DD)
- `status` (optional) - Filter by status

**Example Request:**
```bash
GET /api/attendance/branch/6745abc456?date=2026-05-07
Authorization: Bearer <token>
```

### 5. Get Today's Attendance
**Endpoint:** `GET /api/attendance/today`

**Access:** Super Admin, Trainers

**Query Parameters:**
- `branchId` (optional) - Filter by branch

**Example Request:**
```bash
GET /api/attendance/today?branchId=6745abc456
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Today's attendance retrieved successfully",
  "data": {
    "date": "2026-05-07T00:00:00.000Z",
    "attendance": [
      {
        "id": "6745abc123def456",
        "memberId": {
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "checkInTime": "2026-05-07T08:30:00.000Z",
        "checkOutTime": null,
        "attendanceStatus": "present"
      }
    ],
    "stats": {
      "total": 25,
      "present": 25,
      "absent": 0,
      "late": 0,
      "leave": 0
    },
    "totalRecords": 25
  }
}
```

### 6. Get Attendance Statistics
**Endpoint:** `GET /api/attendance/stats/overview`

**Access:** Super Admin, Trainers

**Query Parameters:**
- `branchId` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Example Request:**
```bash
GET /api/attendance/stats/overview?branchId=6745abc456&startDate=2026-05-01&endDate=2026-05-07
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Attendance statistics retrieved successfully",
  "data": {
    "stats": {
      "total": 150,
      "present": 140,
      "absent": 5,
      "late": 5,
      "leave": 0
    },
    "dailyTrend": [
      {
        "_id": "2026-05-01",
        "count": 25
      },
      {
        "_id": "2026-05-02",
        "count": 28
      }
    ],
    "branchWise": [
      {
        "branchName": "Downtown Branch",
        "branchCode": "DT001",
        "count": 80
      },
      {
        "branchName": "Uptown Branch",
        "branchCode": "UT001",
        "count": 70
      }
    ],
    "averageDuration": 95
  }
}
```

### 7. Create Attendance (Check-in)
**Endpoint:** `POST /api/attendance`

**Access:** All authenticated users

**Request Body:**
```json
{
  "memberId": "6745abc123",
  "branchId": "6745abc456",
  "trainerId": "6745abc789",
  "attendanceDate": "2026-05-07T00:00:00.000Z",
  "checkInTime": "2026-05-07T08:30:00.000Z",
  "attendanceStatus": "present",
  "notes": "Regular workout session"
}
```

**Required Fields:**
- `memberId` - Member ID
- `branchId` - Branch ID

**Optional Fields:**
- `trainerId` - Trainer ID (if assigned)
- `attendanceDate` - Date (defaults to current date)
- `checkInTime` - Check-in time (defaults to current time)
- `attendanceStatus` - Status (defaults to "present")
- `notes` - Additional notes

**Example Response:**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "attendance": {
      "id": "6745abc123def456",
      "memberId": "6745abc123",
      "branchId": "6745abc456",
      "trainerId": "6745abc789",
      "attendanceDate": "2026-05-07T00:00:00.000Z",
      "checkInTime": "2026-05-07T08:30:00.000Z",
      "checkOutTime": null,
      "attendanceStatus": "present",
      "duration": 0,
      "notes": "Regular workout session",
      "createdAt": "2026-05-07T08:30:00.000Z"
    }
  }
}
```

### 8. Update Attendance Record
**Endpoint:** `PUT /api/attendance/:id`

**Access:** Super Admin, Trainers

**Request Body:**
```json
{
  "checkOutTime": "2026-05-07T10:30:00.000Z",
  "attendanceStatus": "present",
  "notes": "Completed workout",
  "trainerId": "6745abc789"
}
```

**All fields are optional:**
- `checkOutTime` - Check-out time
- `attendanceStatus` - Update status
- `notes` - Update notes
- `trainerId` - Update assigned trainer

### 9. Check Out Member
**Endpoint:** `PATCH /api/attendance/:id/checkout`

**Access:** All authenticated users

**Request Body:**
```json
{
  "checkOutTime": "2026-05-07T10:30:00.000Z"
}
```

**Optional Fields:**
- `checkOutTime` - Check-out time (defaults to current time)

**Example Response:**
```json
{
  "success": true,
  "message": "Member checked out successfully",
  "data": {
    "attendance": {
      "id": "6745abc123def456",
      "checkInTime": "2026-05-07T08:30:00.000Z",
      "checkOutTime": "2026-05-07T10:30:00.000Z",
      "duration": 120,
      "attendanceStatus": "present"
    }
  }
}
```

### 10. Delete Attendance Record
**Endpoint:** `DELETE /api/attendance/:id`

**Access:** Super Admin only

**Example Request:**
```bash
DELETE /api/attendance/6745abc123def456
Authorization: Bearer <token>
```

---

## 🧪 Testing Guide

### Step 1: Login
```bash
POST http://localhost:5000/api/superadmin/auth/login
Content-Type: application/json

{
  "email": "superadmin@fitzone.com",
  "password": "your_password"
}
```

Save the token from the response.

### Step 2: Create Attendance (Check-in)
```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "<member_id>",
  "branchId": "<branch_id>",
  "attendanceStatus": "present"
}
```

### Step 3: Get Today's Attendance
```bash
GET http://localhost:5000/api/attendance/today
Authorization: Bearer <token>
```

### Step 4: Check Out Member
```bash
PATCH http://localhost:5000/api/attendance/<attendance_id>/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkOutTime": "2026-05-07T10:30:00.000Z"
}
```

### Step 5: Get Member History
```bash
GET http://localhost:5000/api/attendance/member/<member_id>?limit=30
Authorization: Bearer <token>
```

### Step 6: Get Statistics
```bash
GET http://localhost:5000/api/attendance/stats/overview
Authorization: Bearer <token>
```

---

## 🎯 Features

### ✅ Attendance Tracking
- Check-in members
- Check-out members
- Automatic duration calculation
- Attendance status tracking (present, absent, late, leave)
- Notes and comments

### ✅ History & Reports
- Member attendance history
- Branch attendance reports
- Today's attendance
- Date range filtering
- Attendance statistics

### ✅ Statistics & Analytics
- Overall attendance stats
- Daily attendance trends
- Branch-wise attendance
- Average session duration
- Status-wise breakdown

### ✅ Security
- JWT authentication
- Role-based authorization
- Protected routes
- Input validation

---

## 📋 Request Body Formats

### Create Attendance
```json
{
  "memberId": "string (required)",
  "branchId": "string (required)",
  "trainerId": "string (optional)",
  "attendanceDate": "ISO date string (optional)",
  "checkInTime": "ISO date string (optional)",
  "attendanceStatus": "present|absent|late|leave (optional)",
  "notes": "string (optional, max 500 chars)"
}
```

### Update Attendance
```json
{
  "checkOutTime": "ISO date string (optional)",
  "attendanceStatus": "present|absent|late|leave (optional)",
  "notes": "string (optional, max 500 chars)",
  "trainerId": "string (optional)"
}
```

### Check Out
```json
{
  "checkOutTime": "ISO date string (optional)"
}
```

---

## ⚠️ Error Handling

### Common Errors

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Member ID and Branch ID are required"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Role 'member' is not authorized to access this resource"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Attendance record not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "Member already checked in today at this branch"
}
```

---

## 📊 Database Schema

### Attendance Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| memberId | ObjectId | Yes | Reference to User |
| trainerId | ObjectId | No | Reference to User (trainer) |
| branchId | ObjectId | Yes | Reference to Branch |
| attendanceDate | Date | Yes | Date of attendance |
| checkInTime | Date | Yes | Check-in timestamp |
| checkOutTime | Date | No | Check-out timestamp |
| attendanceStatus | String | Yes | present, absent, late, leave |
| duration | Number | No | Duration in minutes |
| notes | String | No | Additional notes (max 500 chars) |
| isAutoCheckout | Boolean | No | Auto checkout flag |
| createdBy | ObjectId | No | Creator reference |
| createdByModel | String | No | User or SuperAdmin |

---

## ✅ Module Status

```
✅ Model: Complete
✅ Controller: Complete (10 endpoints)
✅ Routes: Complete
✅ Security: Complete (JWT + Role-based)
✅ Integration: Complete (Registered in server.js)
✅ No Errors: Verified
```

**The Attendance Management Module is 100% complete and ready for use!**

---

**Module Version:** 1.0.0  
**Last Updated:** May 7, 2026  
**Status:** ✅ PRODUCTION READY

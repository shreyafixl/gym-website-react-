# 🏢 Branch Management Module - Testing Guide

## ✅ Module Complete

The Branch Management Module has been successfully implemented with full CRUD operations, staff assignment, and facility management.

---

## 📦 Files Created

```
backend/
├── models/
│   └── Branch.js                  ✅ Branch model with validation
├── controllers/
│   └── branchController.js        ✅ 11 controller functions
├── routes/
│   └── branchRoutes.js           ✅ Branch API routes
└── scripts/
    └── createSampleBranches.js   ✅ Sample data seed script
```

---

## 🚀 Setup & Run

### Step 1: Create Sample Branches (Optional)
```bash
cd backend
npm run seed:branches
```

**Output:**
```
✅ Created: FitZone Main Branch (FZ-MAIN) - Mumbai
✅ Created: FitZone North Branch (FZ-NORTH) - Mumbai
✅ Created: FitZone South Branch (FZ-SOUTH) - Mumbai
✅ Created: FitZone West Branch (FZ-WEST) - Mumbai
✅ Created: FitZone Pune Branch (FZ-PUNE) - Pune
✅ Created: FitZone Express Thane (FZ-THANE) - Thane
✅ Created: FitZone Bangalore Branch (FZ-BLR) - Bangalore

📊 Database Statistics:
   Total Branches: 7
   Active: 6
   Under Maintenance: 1
   Total Members: 1517
   Total Capacity: 2900
   Occupancy Rate: 52.31%
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
http://localhost:5000/api/superadmin/branches
```

### Authentication Required
All endpoints require:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 🧪 Testing with Postman / Thunder Client

### 1️⃣ Get All Branches (GET)

**Endpoint:**
```
GET http://localhost:5000/api/superadmin/branches
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Query Parameters (Optional):**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `city` - Filter by city
- `branchStatus` - Filter by status: active, inactive, under-maintenance, all
- `search` - Search by branch name or code
- `sortBy` - Sort field: branchName, city, createdAt, totalMembers
- `sortOrder` - Sort order: asc, desc

**Example with filters:**
```
GET http://localhost:5000/api/superadmin/branches?city=Mumbai&branchStatus=active&page=1&limit=10
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Branches retrieved successfully",
  "data": {
    "branches": [
      {
        "id": "663f8a1b2c4d5e6f7a8b9c0d",
        "branchName": "FitZone Main Branch",
        "branchCode": "FZ-MAIN",
        "address": "123 MG Road, Andheri West",
        "city": "Mumbai",
        "state": "Maharashtra",
        "pincode": "400058",
        "contactNumber": "9876543210",
        "email": "main@fitzone.com",
        "branchManager": null,
        "assignedAdmins": [],
        "assignedTrainers": [],
        "totalMembers": 342,
        "capacity": 500,
        "openingTime": "05:00",
        "closingTime": "23:00",
        "facilities": ["Cardio Zone", "Weight Training", "Yoga Studio", "Steam Room", "Locker Rooms", "Parking"],
        "branchStatus": "active",
        "description": "Our flagship branch with state-of-the-art equipment and facilities",
        "occupancyRate": "68.40",
        "isActive": true,
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
      "active": 6,
      "inactive": 0,
      "underMaintenance": 1,
      "totalMembers": 1517,
      "avgOccupancy": "52.31"
    }
  }
}
```

---

### 2️⃣ Get Single Branch (GET)

**Endpoint:**
```
GET http://localhost:5000/api/superadmin/branches/:id
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Example:**
```
GET http://localhost:5000/api/superadmin/branches/663f8a1b2c4d5e6f7a8b9c0d
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Branch retrieved successfully",
  "data": {
    "branch": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "branchName": "FitZone Main Branch",
      "branchCode": "FZ-MAIN",
      "address": "123 MG Road, Andheri West",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400058",
      "contactNumber": "9876543210",
      "email": "main@fitzone.com",
      "branchManager": null,
      "assignedAdmins": [],
      "assignedTrainers": [],
      "totalMembers": 342,
      "capacity": 500,
      "openingTime": "05:00",
      "closingTime": "23:00",
      "facilities": ["Cardio Zone", "Weight Training", "Yoga Studio", "Steam Room", "Locker Rooms", "Parking"],
      "branchStatus": "active",
      "description": "Our flagship branch with state-of-the-art equipment and facilities",
      "occupancyRate": "68.40",
      "isActive": true,
      "createdAt": "2026-05-07T10:00:00.000Z",
      "updatedAt": "2026-05-07T10:00:00.000Z"
    },
    "occupancyRate": "68.40",
    "isAtCapacity": false,
    "stats": {
      "totalAdmins": 0,
      "totalTrainers": 0,
      "totalMembers": 342
    }
  }
}
```

---

### 3️⃣ Create Branch (POST)

**Endpoint:**
```
POST http://localhost:5000/api/superadmin/branches
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "branchName": "FitZone Test Branch",
  "branchCode": "FZ-TEST",
  "address": "123 Test Street, Test Area",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "contactNumber": "9876543280",
  "email": "test@fitzone.com",
  "capacity": 400,
  "openingTime": "06:00",
  "closingTime": "22:00",
  "facilities": ["Cardio Zone", "Weight Training", "Locker Rooms"],
  "branchStatus": "active",
  "description": "Test branch for demonstration"
}
```

**Required Fields:**
- `branchName` (string, 2-255 chars)
- `branchCode` (string, unique, uppercase, alphanumeric with hyphens)
- `address` (string)
- `city` (string)
- `state` (string)
- `pincode` (string, 6 digits)
- `contactNumber` (string, 10 digits)
- `email` (string, valid email)
- `openingTime` (string, HH:MM format)
- `closingTime` (string, HH:MM format)

**Optional Fields:**
- `branchManager` (ObjectId)
- `assignedAdmins` (array of ObjectIds)
- `assignedTrainers` (array of ObjectIds)
- `capacity` (number, default: 500)
- `facilities` (array of strings)
- `branchStatus` (enum: active, inactive, under-maintenance)
- `description` (string)
- `coordinates` (object: { latitude, longitude })

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Branch created successfully",
  "data": {
    "branch": {
      "id": "663f8a1b2c4d5e6f7a8b9c0e",
      "branchName": "FitZone Test Branch",
      "branchCode": "FZ-TEST",
      "city": "Delhi",
      "branchStatus": "active",
      "createdAt": "2026-05-07T11:00:00.000Z"
    }
  }
}
```

---

### 4️⃣ Update Branch (PUT)

**Endpoint:**
```
PUT http://localhost:5000/api/superadmin/branches/:id
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body (all fields optional):**
```json
{
  "branchName": "FitZone Test Branch Updated",
  "contactNumber": "9876543299",
  "capacity": 450,
  "branchStatus": "active",
  "description": "Updated description"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Branch updated successfully",
  "data": {
    "branch": {
      "id": "663f8a1b2c4d5e6f7a8b9c0e",
      "branchName": "FitZone Test Branch Updated",
      "branchCode": "FZ-TEST",
      "capacity": 450,
      "updatedAt": "2026-05-07T11:30:00.000Z"
    }
  }
}
```

---

### 5️⃣ Delete Branch (DELETE)

**Endpoint:**
```
DELETE http://localhost:5000/api/superadmin/branches/:id
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Branch deleted successfully",
  "data": null
}
```

**Note:** Cannot delete branch with active members (totalMembers > 0)

---

### 6️⃣ Update Branch Status (PATCH)

**Endpoint:**
```
PATCH http://localhost:5000/api/superadmin/branches/:id/status
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "branchStatus": "under-maintenance"
}
```

**Valid Status Values:**
- `active`
- `inactive`
- `under-maintenance`

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Branch status updated successfully",
  "data": {
    "branch": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "branchStatus": "under-maintenance"
    }
  }
}
```

---

### 7️⃣ Assign Manager (PATCH)

**Endpoint:**
```
PATCH http://localhost:5000/api/superadmin/branches/:id/assign-manager
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "managerId": "663f8a1b2c4d5e6f7a8b9c0f"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Manager assigned successfully",
  "data": {
    "branch": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "branchName": "FitZone Main Branch",
      "branchManager": {
        "id": "663f8a1b2c4d5e6f7a8b9c0f",
        "fullName": "John Manager",
        "email": "manager@fitzone.com",
        "role": "admin"
      }
    }
  }
}
```

---

### 8️⃣ Assign Admins (PATCH)

**Endpoint:**
```
PATCH http://localhost:5000/api/superadmin/branches/:id/assign-admins
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "adminIds": ["663f8a1b2c4d5e6f7a8b9c10", "663f8a1b2c4d5e6f7a8b9c11"]
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Admins assigned successfully",
  "data": {
    "branch": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "assignedAdmins": [
        {
          "id": "663f8a1b2c4d5e6f7a8b9c10",
          "fullName": "Admin One",
          "email": "admin1@fitzone.com",
          "role": "admin"
        },
        {
          "id": "663f8a1b2c4d5e6f7a8b9c11",
          "fullName": "Admin Two",
          "email": "admin2@fitzone.com",
          "role": "staff"
        }
      ]
    }
  }
}
```

---

### 9️⃣ Assign Trainers (PATCH)

**Endpoint:**
```
PATCH http://localhost:5000/api/superadmin/branches/:id/assign-trainers
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "trainerIds": ["663f8a1b2c4d5e6f7a8b9c12", "663f8a1b2c4d5e6f7a8b9c13"]
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Trainers assigned successfully",
  "data": {
    "branch": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "assignedTrainers": [
        {
          "id": "663f8a1b2c4d5e6f7a8b9c12",
          "fullName": "Trainer One",
          "email": "trainer1@fitzone.com",
          "role": "trainer"
        }
      ]
    }
  }
}
```

---

### 🔟 Update Facilities (PATCH)

**Endpoint:**
```
PATCH http://localhost:5000/api/superadmin/branches/:id/facilities
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

**Request Body:**
```json
{
  "facilities": [
    "Cardio Zone",
    "Weight Training",
    "Yoga Studio",
    "Swimming Pool",
    "Steam Room",
    "Locker Rooms",
    "Parking",
    "Cafe"
  ]
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Facilities updated successfully",
  "data": {
    "branch": {
      "id": "663f8a1b2c4d5e6f7a8b9c0d",
      "facilities": [
        "Cardio Zone",
        "Weight Training",
        "Yoga Studio",
        "Swimming Pool",
        "Steam Room",
        "Locker Rooms",
        "Parking",
        "Cafe"
      ]
    }
  }
}
```

---

### 1️⃣1️⃣ Get Branch Statistics (GET)

**Endpoint:**
```
GET http://localhost:5000/api/superadmin/branches/stats
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN_HERE
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Branch statistics retrieved successfully",
  "data": {
    "total": 7,
    "active": 6,
    "inactive": 0,
    "underMaintenance": 1,
    "totalMembers": 1517,
    "totalCapacity": 2900,
    "avgOccupancy": 52.31,
    "branchesByCity": [
      {
        "_id": "Mumbai",
        "count": 4,
        "totalMembers": 1227
      },
      {
        "_id": "Pune",
        "count": 1,
        "totalMembers": 156
      },
      {
        "_id": "Thane",
        "count": 1,
        "totalMembers": 89
      },
      {
        "_id": "Bangalore",
        "count": 1,
        "totalMembers": 45
      }
    ],
    "recentBranches": [
      {
        "_id": "...",
        "branchName": "...",
        "branchCode": "...",
        "city": "...",
        "branchStatus": "...",
        "createdAt": "..."
      }
    ]
  }
}
```

---

## 🧪 Testing Error Cases

### Invalid Branch ID
**Request:** GET `/api/superadmin/branches/invalid_id`

**Response (400):**
```json
{
  "success": false,
  "message": "Invalid ID format"
}
```

---

### Branch Not Found
**Request:** GET `/api/superadmin/branches/663f8a1b2c4d5e6f7a8b9999`

**Response (404):**
```json
{
  "success": false,
  "message": "Branch not found"
}
```

---

### Duplicate Branch Code
**Request:** POST `/api/superadmin/branches` with existing branch code

**Response (409):**
```json
{
  "success": false,
  "message": "Branch with this code already exists"
}
```

---

### Missing Required Fields
**Request:** POST `/api/superadmin/branches` without required fields

**Response (400):**
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

---

### Delete Branch with Members
**Request:** DELETE `/api/superadmin/branches/:id` (branch has members)

**Response (400):**
```json
{
  "success": false,
  "message": "Cannot delete branch with active members. Please transfer members first."
}
```

---

## 📋 Complete API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/superadmin/branches` | Get all branches with filters |
| GET | `/api/superadmin/branches/stats` | Get branch statistics |
| GET | `/api/superadmin/branches/:id` | Get single branch by ID |
| POST | `/api/superadmin/branches` | Create new branch |
| PUT | `/api/superadmin/branches/:id` | Update branch |
| DELETE | `/api/superadmin/branches/:id` | Delete branch |
| PATCH | `/api/superadmin/branches/:id/status` | Update branch status |
| PATCH | `/api/superadmin/branches/:id/assign-manager` | Assign manager |
| PATCH | `/api/superadmin/branches/:id/assign-admins` | Assign admins |
| PATCH | `/api/superadmin/branches/:id/assign-trainers` | Assign trainers |
| PATCH | `/api/superadmin/branches/:id/facilities` | Update facilities |

---

## 🔐 Security Features

✅ **All routes protected** - Require authentication
✅ **Super admin only** - Role-based authorization
✅ **Input validation** - Required field checks
✅ **Unique constraints** - Branch code uniqueness
✅ **Email validation** - Regex pattern matching
✅ **Phone validation** - 10-digit format
✅ **Pincode validation** - 6-digit format
✅ **Time validation** - HH:MM format

---

## 📊 Database Schema

### Branch Model Fields
```javascript
{
  branchName: String (required, 2-255 chars),
  branchCode: String (required, unique, uppercase),
  address: String (required),
  city: String (required),
  state: String (required),
  pincode: String (required, 6 digits),
  contactNumber: String (required, 10 digits),
  email: String (required, valid email),
  branchManager: ObjectId (ref: User),
  assignedAdmins: Array of ObjectIds (ref: User),
  assignedTrainers: Array of ObjectIds (ref: User),
  totalMembers: Number (default: 0),
  capacity: Number (default: 500),
  openingTime: String (HH:MM format),
  closingTime: String (HH:MM format),
  facilities: Array of Strings,
  branchStatus: Enum (active, inactive, under-maintenance),
  description: String,
  images: Array of Strings,
  coordinates: { latitude, longitude },
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

---

## ✅ Testing Checklist

- [ ] Server running without errors
- [ ] Super admin token obtained
- [ ] Get all branches works
- [ ] Get single branch works
- [ ] Create branch works
- [ ] Update branch works
- [ ] Delete branch works
- [ ] Update branch status works
- [ ] Assign manager works
- [ ] Assign admins works
- [ ] Assign trainers works
- [ ] Update facilities works
- [ ] Get statistics works
- [ ] Filters and pagination work
- [ ] Error handling works

---

## 🎯 Next Steps

**✅ Branch Management Module Complete!**

Ready to implement the next module:
- **Financial Management Module**
- **Analytics & Reporting Module**

**Waiting for confirmation to proceed! 🚀**

---

**Last Updated:** May 7, 2026  
**Status:** ✅ Complete and Ready for Testing

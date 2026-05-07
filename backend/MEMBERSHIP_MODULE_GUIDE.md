# Membership Management Module - Complete Guide

## 📋 Overview

The Membership Management Module provides comprehensive functionality for managing gym memberships, membership plans, renewals, and member subscriptions.

## 🗂️ Module Structure

```
backend/
├── models/
│   ├── Membership.js           ✅ Complete
│   └── MembershipPlan.js       ✅ Complete
├── controllers/
│   └── membershipController.js ✅ Complete
└── routes/
    └── membershipRoutes.js     ✅ Complete
```

## 🔐 Authentication & Authorization

**Membership Plans:**
- Public access for viewing plans
- Super Admin only for creating/updating/deleting plans

**Memberships:**
- All routes require JWT authentication
- Super Admin & Trainers: Full access
- Members: Can view own memberships

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 📊 API Endpoints

### Memberships: `/api/memberships`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/memberships` | Get all memberships | Super Admin, Trainers |
| GET | `/memberships/:id` | Get single membership | Super Admin, Trainers, Member (own) |
| GET | `/memberships/member/:memberId` | Get member's memberships | Super Admin, Trainers, Member (own) |
| GET | `/memberships/expiring` | Get expiring memberships | Super Admin, Trainers |
| POST | `/memberships` | Create membership | Super Admin, Trainers |
| PUT | `/memberships/:id` | Update membership | Super Admin, Trainers |
| POST | `/memberships/:id/renew` | Renew membership | Super Admin, Trainers |
| PATCH | `/memberships/:id/pause` | Pause membership | Super Admin, Trainers |
| PATCH | `/memberships/:id/resume` | Resume membership | Super Admin, Trainers |
| PATCH | `/memberships/:id/cancel` | Cancel membership | Super Admin, Trainers |
| DELETE | `/memberships/:id` | Delete membership | Super Admin only |

### Membership Plans: `/api/membership-plans`

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/membership-plans` | Get all plans | Public |
| GET | `/membership-plans/:id` | Get single plan | Public |
| POST | `/membership-plans` | Create plan | Super Admin only |
| PUT | `/membership-plans/:id` | Update plan | Super Admin only |
| DELETE | `/membership-plans/:id` | Delete plan | Super Admin only |

**Total: 16 Endpoints**

---

## 📝 API Documentation

### MEMBERSHIPS

#### 1. Get All Memberships
**Endpoint:** `GET /api/memberships`

**Access:** Super Admin, Trainers

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `memberId` (optional) - Filter by member
- `branchId` (optional) - Filter by branch
- `membershipStatus` (optional) - active, expired, paused, cancelled, all
- `paymentStatus` (optional) - paid, pending, failed, all
- `membershipPlan` (optional) - monthly, quarterly, half-yearly, yearly, custom, all
- `autoRenewal` (optional) - true, false
- `sortBy` (optional, default: createdAt)
- `sortOrder` (optional, default: desc)

**Example Request:**
```bash
GET /api/memberships?page=1&limit=10&membershipStatus=active&branchId=6745abc123
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "success": true,
  "message": "Memberships retrieved successfully",
  "data": {
    "memberships": [
      {
        "id": "6745abc123def456",
        "memberId": {
          "id": "6745abc123",
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "membershipPlan": "monthly",
        "membershipStartDate": "2026-05-01T00:00:00.000Z",
        "membershipEndDate": "2026-06-01T00:00:00.000Z",
        "membershipStatus": "active",
        "paymentStatus": "paid",
        "assignedBranch": {
          "id": "6745abc456",
          "branchName": "Downtown Branch"
        },
        "amount": 2000,
        "discount": 200,
        "finalAmount": 1800,
        "autoRenewal": true,
        "daysRemaining": 25,
        "isExpiringSoon": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50,
      "perPage": 10
    },
    "stats": {
      "total": 150,
      "active": 120,
      "expired": 15,
      "paused": 10,
      "cancelled": 5,
      "autoRenewalEnabled": 80
    }
  }
}
```

#### 2. Get Single Membership
**Endpoint:** `GET /api/memberships/:id`

**Access:** Super Admin, Trainers, Member (own)

#### 3. Get Member's Memberships
**Endpoint:** `GET /api/memberships/member/:memberId`

**Access:** Super Admin, Trainers, Member (own)

**Example Response:**
```json
{
  "success": true,
  "message": "Member memberships retrieved successfully",
  "data": {
    "member": {
      "id": "6745abc123",
      "fullName": "John Doe",
      "email": "john@example.com",
      "membershipStatus": "active"
    },
    "memberships": [
      {
        "id": "6745abc123def456",
        "membershipPlan": "monthly",
        "membershipStatus": "active",
        "daysRemaining": 25
      }
    ],
    "activeMembership": {
      "id": "6745abc123def456",
      "membershipPlan": "monthly",
      "membershipStatus": "active"
    },
    "totalMemberships": 3
  }
}
```

#### 4. Get Expiring Memberships
**Endpoint:** `GET /api/memberships/expiring`

**Access:** Super Admin, Trainers

**Query Parameters:**
- `days` (optional, default: 7) - Number of days to look ahead
- `branchId` (optional) - Filter by branch

**Example Request:**
```bash
GET /api/memberships/expiring?days=7&branchId=6745abc456
Authorization: Bearer <token>
```

#### 5. Create Membership
**Endpoint:** `POST /api/memberships`

**Access:** Super Admin, Trainers

**Request Body:**
```json
{
  "memberId": "6745abc123",
  "membershipPlan": "monthly",
  "membershipStartDate": "2026-05-07T00:00:00.000Z",
  "membershipEndDate": "2026-06-07T00:00:00.000Z",
  "assignedBranch": "6745abc456",
  "amount": 2000,
  "discount": 200,
  "paymentMethod": "card",
  "paymentStatus": "paid",
  "transactionId": "TXN123456",
  "autoRenewal": true,
  "notes": "New member registration"
}
```

**Required Fields:**
- `memberId` - Member ID
- `membershipPlan` - monthly, quarterly, half-yearly, yearly, custom
- `membershipStartDate` - Start date (ISO format)
- `membershipEndDate` - End date (ISO format)
- `assignedBranch` - Branch ID
- `amount` - Membership amount

**Optional Fields:**
- `discount` - Discount amount (default: 0)
- `paymentMethod` - cash, card, upi, net-banking, other (default: cash)
- `paymentStatus` - paid, pending, failed (default: pending)
- `transactionId` - Transaction reference
- `autoRenewal` - Enable auto-renewal (default: false)
- `notes` - Additional notes

#### 6. Update Membership
**Endpoint:** `PUT /api/memberships/:id`

**Access:** Super Admin, Trainers

**Request Body:**
```json
{
  "membershipPlan": "quarterly",
  "membershipEndDate": "2026-08-07T00:00:00.000Z",
  "membershipStatus": "active",
  "paymentStatus": "paid",
  "amount": 5000,
  "discount": 500,
  "autoRenewal": true,
  "notes": "Upgraded to quarterly plan"
}
```

**All fields are optional**

#### 7. Renew Membership
**Endpoint:** `POST /api/memberships/:id/renew`

**Access:** Super Admin, Trainers

**Request Body:**
```json
{
  "membershipEndDate": "2026-07-07T00:00:00.000Z",
  "amount": 2000,
  "paymentStatus": "paid",
  "paymentMethod": "card",
  "transactionId": "TXN789012"
}
```

**Required Fields:**
- `membershipEndDate` - New end date
- `amount` - Renewal amount

**Optional Fields:**
- `paymentStatus` - Payment status
- `paymentMethod` - Payment method
- `transactionId` - Transaction reference

#### 8. Pause Membership
**Endpoint:** `PATCH /api/memberships/:id/pause`

**Access:** Super Admin, Trainers

**Request Body:**
```json
{
  "pausedFrom": "2026-05-10T00:00:00.000Z",
  "pausedUntil": "2026-05-20T00:00:00.000Z"
}
```

**All fields are optional** (defaults to current date for pausedFrom)

#### 9. Resume Membership
**Endpoint:** `PATCH /api/memberships/:id/resume`

**Access:** Super Admin, Trainers

**No request body required**

#### 10. Cancel Membership
**Endpoint:** `PATCH /api/memberships/:id/cancel`

**Access:** Super Admin, Trainers

**Request Body:**
```json
{
  "cancellationReason": "Member requested cancellation"
}
```

**Optional Fields:**
- `cancellationReason` - Reason for cancellation

#### 11. Delete Membership
**Endpoint:** `DELETE /api/memberships/:id`

**Access:** Super Admin only

---

### MEMBERSHIP PLANS

#### 1. Get All Membership Plans
**Endpoint:** `GET /api/membership-plans`

**Access:** Public

**Query Parameters:**
- `isActive` (optional) - true, false
- `category` (optional) - basic, standard, premium, vip, all
- `sortBy` (optional, default: price)
- `sortOrder` (optional, default: asc)

**Example Request:**
```bash
GET /api/membership-plans?isActive=true&category=premium
```

**Example Response:**
```json
{
  "success": true,
  "message": "Membership plans retrieved successfully",
  "data": {
    "plans": [
      {
        "id": "6745abc123def456",
        "planName": "Premium Monthly",
        "planCode": "PREM-MONTH",
        "duration": 1,
        "durationType": "months",
        "price": 3000,
        "currency": "INR",
        "discount": 10,
        "finalPrice": 2700,
        "features": [
          "Access to all equipment",
          "Personal trainer sessions",
          "Nutrition consultation",
          "Free locker"
        ],
        "description": "Premium monthly membership with all benefits",
        "isPopular": true,
        "isActive": true,
        "category": "premium",
        "maxMembers": 100,
        "currentMembers": 45,
        "availableSlots": 55
      }
    ],
    "stats": {
      "total": 10,
      "active": 8,
      "inactive": 2
    }
  }
}
```

#### 2. Get Single Membership Plan
**Endpoint:** `GET /api/membership-plans/:id`

**Access:** Public

#### 3. Create Membership Plan
**Endpoint:** `POST /api/membership-plans`

**Access:** Super Admin only

**Request Body:**
```json
{
  "planName": "Premium Monthly",
  "planCode": "PREM-MONTH",
  "duration": 1,
  "durationType": "months",
  "price": 3000,
  "currency": "INR",
  "discount": 10,
  "features": [
    "Access to all equipment",
    "Personal trainer sessions",
    "Nutrition consultation",
    "Free locker"
  ],
  "description": "Premium monthly membership with all benefits",
  "isPopular": true,
  "isActive": true,
  "maxMembers": 100,
  "category": "premium"
}
```

**Required Fields:**
- `planName` - Plan name
- `planCode` - Unique plan code (uppercase, alphanumeric with hyphens)
- `duration` - Duration number
- `durationType` - days, months, years
- `price` - Plan price

**Optional Fields:**
- `currency` - Currency code (default: INR)
- `discount` - Discount percentage (0-100)
- `features` - Array of features
- `description` - Plan description
- `isPopular` - Mark as popular (default: false)
- `isActive` - Active status (default: true)
- `maxMembers` - Maximum members allowed
- `category` - basic, standard, premium, vip (default: standard)

#### 4. Update Membership Plan
**Endpoint:** `PUT /api/membership-plans/:id`

**Access:** Super Admin only

**All fields are optional**

#### 5. Delete Membership Plan
**Endpoint:** `DELETE /api/membership-plans/:id`

**Access:** Super Admin only

**Note:** Cannot delete plans with active memberships

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

### Step 2: Create Membership Plan
```bash
POST http://localhost:5000/api/membership-plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "planName": "Monthly Basic",
  "planCode": "BASIC-MONTH",
  "duration": 1,
  "durationType": "months",
  "price": 1500,
  "features": ["Gym access", "Locker facility"],
  "category": "basic"
}
```

### Step 3: Get All Plans
```bash
GET http://localhost:5000/api/membership-plans
```

### Step 4: Create Membership
```bash
POST http://localhost:5000/api/memberships
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "<member_id>",
  "membershipPlan": "monthly",
  "membershipStartDate": "2026-05-07T00:00:00.000Z",
  "membershipEndDate": "2026-06-07T00:00:00.000Z",
  "assignedBranch": "<branch_id>",
  "amount": 1500,
  "paymentStatus": "paid",
  "autoRenewal": true
}
```

### Step 5: Get All Memberships
```bash
GET http://localhost:5000/api/memberships?membershipStatus=active
Authorization: Bearer <token>
```

### Step 6: Get Expiring Memberships
```bash
GET http://localhost:5000/api/memberships/expiring?days=7
Authorization: Bearer <token>
```

### Step 7: Renew Membership
```bash
POST http://localhost:5000/api/memberships/<membership_id>/renew
Authorization: Bearer <token>
Content-Type: application/json

{
  "membershipEndDate": "2026-07-07T00:00:00.000Z",
  "amount": 1500,
  "paymentStatus": "paid"
}
```

---

## 🎯 Features

### ✅ Membership Management
- Create memberships
- Update memberships
- Renew memberships
- Pause/Resume memberships
- Cancel memberships
- Delete memberships
- Auto-renewal support
- Expiry tracking

### ✅ Membership Plans
- Create plans
- Update plans
- Delete plans
- Public plan viewing
- Plan categories
- Discount support
- Feature lists
- Member limits

### ✅ Tracking & Reports
- Member membership history
- Expiring memberships
- Active memberships
- Payment status tracking
- Statistics

### ✅ Security
- JWT authentication
- Role-based authorization
- Protected routes
- Input validation

---

## ✅ Module Status

```
✅ Models: Complete (2 files)
✅ Controller: Complete (16 endpoints)
✅ Routes: Complete
✅ Security: Complete (JWT + Role-based)
✅ Integration: Complete
✅ No Errors: Verified
```

**The Membership Management Module is 100% complete and ready for use!**

---

**Module Version:** 1.0.0  
**Last Updated:** May 7, 2026  
**Status:** ✅ PRODUCTION READY

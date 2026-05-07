# 📊 Analytics & Reporting Module - Testing Guide

## Quick Start

### 1. Prerequisites
- Backend server running on `http://localhost:5000`
- Super Admin account created (email: admin@fitzone.com, password: Admin@123456)
- Sample data seeded (users, branches, financial data)

### 2. Get Authentication Token

```bash
curl -X POST http://localhost:5000/api/superadmin/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fitzone.com",
    "password": "Admin@123456"
  }'
```

**Save the token from response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "superAdmin": { ... }
  }
}
```

---

## 📈 Dashboard Analytics APIs

### 1. Dashboard Overview Statistics

**Endpoint:** `GET /api/superadmin/analytics/dashboard`

**Description:** Get comprehensive dashboard statistics including users, memberships, subscriptions, and revenue.

**cURL:**
```bash
curl -X GET http://localhost:5000/api/superadmin/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalUsers": 15,
      "totalTrainers": 3,
      "totalMembers": 12,
      "totalBranches": 7,
      "totalPlans": 5
    },
    "memberships": {
      "active": 8,
      "expired": 2,
      "pending": 5,
      "total": 15,
      "activePercentage": "53.33"
    },
    "subscriptions": {
      "total": 10,
      "active": 7,
      "cancelled": 1
    },
    "revenue": {
      "total": 125000,
      "monthly": 35000,
      "yearly": 125000,
      "currency": "INR"
    },
    "recentActivity": {
      "newUsersLast30Days": 5,
      "newSubscriptionsLast30Days": 3
    }
  },
  "message": "Dashboard statistics retrieved successfully"
}
```

---

### 2. User Growth Analytics

**Endpoint:** `GET /api/superadmin/analytics/user-growth`

**Description:** Track user growth over time with period-based analysis.

**Query Parameters:**
- `period` (optional): daily, weekly, monthly (default: monthly)
- `year` (optional): Year to analyze (default: current year)

**cURL:**
```bash
# Monthly growth for 2026
curl -X GET "http://localhost:5000/api/superadmin/analytics/user-growth?period=monthly&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Weekly growth
curl -X GET "http://localhost:5000/api/superadmin/analytics/user-growth?period=weekly&year=2026" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "period": "monthly",
    "year": 2026,
    "growth": [
      { "_id": 1, "count": 5, "members": 4, "trainers": 1 },
      { "_id": 2, "count": 3, "members": 2, "trainers": 1 },
      { "_id": 5, "count": 1, "members": 1, "trainers": 0 }
    ],
    "totals": {
      "users": 15,
      "members": 12,
      "trainers": 3
    }
  },
  "message": "User growth analytics retrieved successfully"
}
```

---

### 3. Attendance Statistics

**Endpoint:** `GET /api/superadmin/analytics/attendance`

**Description:** Get attendance statistics with date range and branch filtering.

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `branchId` (optional): Filter by branch ID

**cURL:**
```bash
# All attendance
curl -X GET http://localhost:5000/api/superadmin/analytics/attendance \
  -H "Authorization: Bearer YOUR_TOKEN"

# Date range filter
curl -X GET "http://localhost:5000/api/superadmin/analytics/attendance?startDate=2026-05-01&endDate=2026-05-07" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Branch filter
curl -X GET "http://localhost:5000/api/superadmin/analytics/attendance?branchId=BRANCH_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalUsers": 50,
      "totalCheckIns": 350,
      "usersWithAttendance": 45,
      "averageAttendance": 7.00,
      "attendanceRate": 90.00
    },
    "users": [
      {
        "userId": "663f8a1b2c3d4e5f6a7b8c9f",
        "fullName": "Alice Johnson",
        "email": "alice@example.com",
        "totalCheckIns": 15
      }
    ]
  },
  "message": "Attendance statistics retrieved successfully"
}
```

---

### 4. Branch-wise Analytics

**Endpoint:** `GET /api/superadmin/analytics/branches`

**Description:** Get comprehensive analytics for all branches with performance metrics.

**cURL:**
```bash
curl -X GET http://localhost:5000/api/superadmin/analytics/branches \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "branches": [
      {
        "branchId": "663f8a1b2c3d4e5f6a7b8c9d",
        "branchName": "FitZone Downtown",
        "branchCode": "FZ-DT-001",
        "city": "Mumbai",
        "state": "Maharashtra",
        "status": "active",
        "metrics": {
          "totalUsers": 45,
          "activeMembers": 38,
          "capacity": 100,
          "occupancyRate": 45.00,
          "subscriptions": {
            "total": 40,
            "active": 35
          },
          "revenue": 450000
        }
      }
    ],
    "summary": {
      "totalBranches": 7,
      "totalRevenue": 1250000,
      "totalUsers": 150,
      "averageRevenuePerBranch": "178571.43"
    }
  },
  "message": "Branch analytics retrieved successfully"
}
```

---

### 5. Trainer Performance Analytics

**Endpoint:** `GET /api/superadmin/analytics/trainers`

**Description:** Get trainer performance metrics including assigned members and retention rates.

**cURL:**
```bash
curl -X GET http://localhost:5000/api/superadmin/analytics/trainers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "trainers": [
      {
        "trainerId": "663f8a1b2c3d4e5f6a7b8c9e",
        "fullName": "John Smith",
        "email": "john.trainer@fitzone.com",
        "phone": "+91-9876543210",
        "branch": {
          "id": "663f8a1b2c3d4e5f6a7b8c9d",
          "name": "FitZone Downtown",
          "code": "FZ-DT-001"
        },
        "metrics": {
          "assignedMembers": 25,
          "activeMembers": 22,
          "inactiveMembers": 3,
          "retentionRate": "88.00"
        }
      }
    ],
    "summary": {
      "totalTrainers": 8,
      "totalAssignedMembers": 120,
      "averageMembersPerTrainer": "15.00"
    }
  },
  "message": "Trainer performance analytics retrieved successfully"
}
```

---

## 📋 Reports APIs

### 1. Financial Report

**Endpoint:** `GET /api/superadmin/analytics/reports/financial`

**Description:** Generate comprehensive financial report with revenue breakdown.

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `branchId` (optional): Filter by branch ID
- `type` (optional): Transaction type (membership, renewal, upgrade, refund, other)

**cURL:**
```bash
# All transactions
curl -X GET http://localhost:5000/api/superadmin/analytics/reports/financial \
  -H "Authorization: Bearer YOUR_TOKEN"

# Date range
curl -X GET "http://localhost:5000/api/superadmin/analytics/reports/financial?startDate=2026-01-01&endDate=2026-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"

# By type
curl -X GET "http://localhost:5000/api/superadmin/analytics/reports/financial?type=membership" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTransactions": 45,
      "totalRevenue": 675000,
      "totalRefunds": 5000,
      "netRevenue": 670000,
      "currency": "INR"
    },
    "breakdown": {
      "byPaymentMethod": {
        "card": 250000,
        "upi": 200000,
        "cash": 150000,
        "netbanking": 75000
      },
      "byType": {
        "membership": 500000,
        "renewal": 150000,
        "upgrade": 25000
      }
    },
    "transactions": [ ... ]
  },
  "message": "Financial report generated successfully"
}
```

---

### 2. Attendance Report

**Endpoint:** `GET /api/superadmin/analytics/reports/attendance`

**Description:** Generate detailed attendance report for all users.

**Query Parameters:**
- `startDate` (optional): Start date (YYYY-MM-DD)
- `endDate` (optional): End date (YYYY-MM-DD)
- `branchId` (optional): Filter by branch ID

**cURL:**
```bash
# All attendance
curl -X GET http://localhost:5000/api/superadmin/analytics/reports/attendance \
  -H "Authorization: Bearer YOUR_TOKEN"

# Date range
curl -X GET "http://localhost:5000/api/superadmin/analytics/reports/attendance?startDate=2026-05-01&endDate=2026-05-07" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalUsers": 50,
      "totalCheckIns": 350,
      "averageCheckIns": "7.00"
    },
    "report": [
      {
        "userId": "663f8a1b2c3d4e5f6a7b8c9f",
        "fullName": "Alice Johnson",
        "email": "alice@example.com",
        "role": "user",
        "branch": {
          "id": "663f8a1b2c3d4e5f6a7b8c9d",
          "name": "FitZone Downtown",
          "code": "FZ-DT-001"
        },
        "totalCheckIns": 15,
        "lastCheckIn": "2026-05-07T10:30:00.000Z"
      }
    ]
  },
  "message": "Attendance report generated successfully"
}
```

---

### 3. Membership Report

**Endpoint:** `GET /api/superadmin/analytics/reports/membership`

**Description:** Generate membership report with subscription details.

**Query Parameters:**
- `status` (optional): Subscription status (active, expired, cancelled, pending)
- `planId` (optional): Filter by plan ID
- `branchId` (optional): Filter by branch ID

**cURL:**
```bash
# All subscriptions
curl -X GET http://localhost:5000/api/superadmin/analytics/reports/membership \
  -H "Authorization: Bearer YOUR_TOKEN"

# Active only
curl -X GET "http://localhost:5000/api/superadmin/analytics/reports/membership?status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalSubscriptions": 50,
      "totalRevenue": 750000,
      "expiringSoon": 5,
      "currency": "INR"
    },
    "breakdown": {
      "byStatus": {
        "active": 35,
        "expired": 10,
        "cancelled": 3,
        "pending": 2
      },
      "byPlan": {
        "Monthly Basic": 15,
        "Quarterly Standard": 20,
        "Yearly VIP": 10
      }
    },
    "subscriptions": [ ... ]
  },
  "message": "Membership report generated successfully"
}
```

---

### 4. Trainer Report

**Endpoint:** `GET /api/superadmin/analytics/reports/trainers`

**Description:** Generate detailed trainer report with assigned members.

**Query Parameters:**
- `branchId` (optional): Filter by branch ID

**cURL:**
```bash
# All trainers
curl -X GET http://localhost:5000/api/superadmin/analytics/reports/trainers \
  -H "Authorization: Bearer YOUR_TOKEN"

# By branch
curl -X GET "http://localhost:5000/api/superadmin/analytics/reports/trainers?branchId=BRANCH_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalTrainers": 8,
      "totalAssignedMembers": 120
    },
    "report": [
      {
        "trainerId": "663f8a1b2c3d4e5f6a7b8c9e",
        "fullName": "John Smith",
        "email": "john.trainer@fitzone.com",
        "phone": "+91-9876543210",
        "branch": {
          "id": "663f8a1b2c3d4e5f6a7b8c9d",
          "name": "FitZone Downtown",
          "code": "FZ-DT-001",
          "city": "Mumbai"
        },
        "joinedDate": "2026-01-15T00:00:00.000Z",
        "metrics": {
          "totalAssignedMembers": 25,
          "activeMembers": 22,
          "inactiveMembers": 3,
          "retentionRate": "88.00"
        },
        "members": [
          {
            "id": "663f8a1b2c3d4e5f6a7b8c9f",
            "fullName": "Alice Johnson",
            "email": "alice@example.com",
            "status": "active"
          }
        ]
      }
    ]
  },
  "message": "Trainer report generated successfully"
}
```

---

### 5. Branch Performance Report

**Endpoint:** `GET /api/superadmin/analytics/reports/branches`

**Description:** Generate comprehensive branch performance report.

**Query Parameters:**
- `status` (optional): Branch status (active, inactive, under-maintenance)

**cURL:**
```bash
# All branches
curl -X GET http://localhost:5000/api/superadmin/analytics/reports/branches \
  -H "Authorization: Bearer YOUR_TOKEN"

# Active only
curl -X GET "http://localhost:5000/api/superadmin/analytics/reports/branches?status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalBranches": 7,
      "totalRevenue": 1250000,
      "totalUsers": 150,
      "averageRevenuePerBranch": "178571.43"
    },
    "report": [
      {
        "branchId": "663f8a1b2c3d4e5f6a7b8c9d",
        "branchName": "FitZone Downtown",
        "branchCode": "FZ-DT-001",
        "location": {
          "address": "123 Main Street",
          "city": "Mumbai",
          "state": "Maharashtra",
          "pincode": "400001"
        },
        "contact": {
          "phone": "+91-22-12345678",
          "email": "downtown@fitzone.com"
        },
        "status": "active",
        "metrics": {
          "users": {
            "total": 45,
            "activeMembers": 38,
            "trainers": 3
          },
          "subscriptions": {
            "total": 40,
            "active": 35
          },
          "revenue": {
            "total": 450000,
            "monthly": 125000
          },
          "capacity": 100,
          "occupancyRate": "45.00"
        },
        "facilities": ["Gym", "Cardio", "Yoga Studio", "Swimming Pool"]
      }
    ]
  },
  "message": "Branch performance report generated successfully"
}
```

---

## 🧪 Testing with Postman/Thunder Client

### Import Collection
1. Open Postman or Thunder Client
2. Create a new collection: "FitZone Analytics"
3. Add environment variable: `token` (paste your auth token)
4. Add environment variable: `baseUrl` = `http://localhost:5000`

### Test Sequence
1. **Login** → Get token
2. **Dashboard Stats** → Verify overview
3. **User Growth** → Check growth trends
4. **Branch Analytics** → Compare branches
5. **Financial Report** → Verify revenue
6. **Attendance Report** → Check attendance

---

## ✅ Expected Results

All endpoints should return:
- ✅ Status code: 200
- ✅ `success: true`
- ✅ Proper data structure
- ✅ Relevant message

---

## 🚨 Common Issues

### 401 Unauthorized
- **Cause:** Missing or invalid token
- **Fix:** Login again and get fresh token

### 403 Forbidden
- **Cause:** Not super admin role
- **Fix:** Use super admin account

### 404 Not Found
- **Cause:** Wrong endpoint URL
- **Fix:** Check endpoint path

### Empty Data
- **Cause:** No sample data in database
- **Fix:** Run seed scripts first

---

## 📝 Notes

- All analytics are calculated in real-time from database
- Date filters use ISO 8601 format (YYYY-MM-DD)
- Revenue is in INR currency
- Reports return top 100 records for large datasets
- Percentages are rounded to 2 decimal places
- All routes require super admin authentication

---

**Happy Testing! 🎉**

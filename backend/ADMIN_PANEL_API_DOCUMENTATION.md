# 🎯 FitZone Admin Panel - Backend API Documentation

## 📋 Overview
Complete API documentation for the FitZone Admin Panel backend. This guide covers all available endpoints, request/response formats, authentication, and usage examples for admin operations.

---

## 🔐 Authentication

### Admin Login
```http
POST /api/superadmin/auth/login
Content-Type: application/json

{
  "email": "admin@fitzone.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "adminId123",
      "email": "admin@fitzone.com",
      "role": "admin"
    }
  }
}
```

### Using the Token
Include the token in all subsequent requests:
```http
Authorization: Bearer <your_token_here>
```

---

## 📊 Module 1: User Management

### Base Route: `/api/superadmin/users`

### 1.1 Get All Users
```http
GET /api/superadmin/users?page=1&limit=10&role=member&membershipStatus=active
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (member, admin, staff)
- `membershipStatus` (optional): Filter by status (active, expired, suspended)
- `search` (optional): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "_id": "userId123",
        "fullName": "John Doe",
        "email": "john@example.com",
        "phone": "9876543210",
        "role": "member",
        "membershipStatus": "active",
        "membershipPlan": "Gold",
        "joinDate": "2024-01-15",
        "isActive": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUsers": 50,
      "hasMore": true
    }
  }
}
```

### 1.2 Get User by ID
```http
GET /api/superadmin/users/:id
Authorization: Bearer <token>
```

### 1.3 Create New User
```http
POST /api/superadmin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePass@123",
  "phone": "9876543211",
  "gender": "female",
  "age": 28,
  "role": "member",
  "membershipPlan": "Silver"
}
```

### 1.4 Update User
```http
PUT /api/superadmin/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "Jane Smith Updated",
  "phone": "9876543212",
  "membershipStatus": "active"
}
```

### 1.5 Delete User
```http
DELETE /api/superadmin/users/:id
Authorization: Bearer <token>
```

### 1.6 Get User Statistics
```http
GET /api/superadmin/users/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 500,
    "activeMembers": 450,
    "expiredMembers": 30,
    "suspendedMembers": 20,
    "newThisMonth": 45,
    "membershipDistribution": {
      "Gold": 200,
      "Silver": 180,
      "Bronze": 120
    }
  }
}
```

---

## 🏢 Module 2: Branch Management

### Base Route: `/api/superadmin/branches`

### 2.1 Get All Branches
```http
GET /api/superadmin/branches?page=1&limit=10&status=active
Authorization: Bearer <token>
```

### 2.2 Create Branch
```http
POST /api/superadmin/branches
Authorization: Bearer <token>
Content-Type: application/json

{
  "branchName": "FitZone Downtown",
  "branchCode": "FZ-DT-001",
  "address": "123 Main Street, Downtown",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "phone": "555-0123",
  "email": "downtown@fitzone.com",
  "managerName": "Mike Johnson",
  "capacity": 200,
  "facilities": ["Gym", "Pool", "Sauna", "Yoga Studio"],
  "operatingHours": {
    "monday": { "open": "06:00", "close": "22:00" },
    "tuesday": { "open": "06:00", "close": "22:00" }
  }
}
```

### 2.3 Update Branch
```http
PUT /api/superadmin/branches/:id
Authorization: Bearer <token>
```

### 2.4 Delete Branch
```http
DELETE /api/superadmin/branches/:id
Authorization: Bearer <token>
```

### 2.5 Get Branch Statistics
```http
GET /api/superadmin/branches/:id/stats
Authorization: Bearer <token>
```

---

## 💰 Module 3: Financial Management

### Base Route: `/api/superadmin/financial`

### 3.1 Get All Transactions
```http
GET /api/superadmin/financial/transactions?page=1&limit=20&type=payment&status=completed
Authorization: Bearer <token>
```

**Query Parameters:**
- `type`: payment, refund, subscription
- `status`: completed, pending, failed
- `startDate`: Filter from date (YYYY-MM-DD)
- `endDate`: Filter to date (YYYY-MM-DD)
- `branchId`: Filter by branch

### 3.2 Get Revenue Report
```http
GET /api/superadmin/financial/revenue?period=monthly&year=2024
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 125000,
    "monthlyBreakdown": [
      { "month": "January", "revenue": 10500, "transactions": 45 },
      { "month": "February", "revenue": 11200, "transactions": 48 }
    ],
    "revenueByBranch": [
      { "branchName": "Downtown", "revenue": 45000 },
      { "branchName": "Uptown", "revenue": 38000 }
    ],
    "revenueByPlan": {
      "Gold": 60000,
      "Silver": 45000,
      "Bronze": 20000
    }
  }
}
```

### 3.3 Get Pending Payments
```http
GET /api/superadmin/financial/pending-payments
Authorization: Bearer <token>
```

### 3.4 Process Refund
```http
POST /api/superadmin/financial/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactionId": "txn123",
  "amount": 5000,
  "reason": "Service not satisfactory",
  "refundMethod": "original"
}
```

### 3.5 Get Financial Dashboard
```http
GET /api/superadmin/financial/dashboard
Authorization: Bearer <token>
```

---

## 📊 Module 4: Analytics

### Base Route: `/api/superadmin/analytics`

### 4.1 Get Dashboard Analytics
```http
GET /api/superadmin/analytics/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "totalMembers": 500,
      "activeMembers": 450,
      "totalRevenue": 125000,
      "monthlyGrowth": 12.5
    },
    "memberGrowth": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "data": [420, 435, 448, 465, 482, 500]
    },
    "revenueGrowth": {
      "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      "data": [95000, 102000, 108000, 115000, 120000, 125000]
    },
    "attendanceTrends": {
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "data": [180, 195, 210, 205, 220, 250, 200]
    }
  }
}
```

### 4.2 Get Member Analytics
```http
GET /api/superadmin/analytics/members?period=monthly
Authorization: Bearer <token>
```

### 4.3 Get Revenue Analytics
```http
GET /api/superadmin/analytics/revenue?period=yearly&year=2024
Authorization: Bearer <token>
```

### 4.4 Get Attendance Analytics
```http
GET /api/superadmin/analytics/attendance?branchId=branch123&period=weekly
Authorization: Bearer <token>
```

### 4.5 Get Class Performance
```http
GET /api/superadmin/analytics/classes/performance
Authorization: Bearer <token>
```

---

## 📅 Module 5: Attendance Management

### Base Route: `/api/attendance`

### 5.1 Mark Attendance
```http
POST /api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "userId123",
  "trainerId": "trainerId456",
  "branchId": "branchId789",
  "attendanceDate": "2024-12-20",
  "checkInTime": "2024-12-20T09:00:00Z",
  "attendanceStatus": "present"
}
```

### 5.2 Get Attendance Records
```http
GET /api/attendance?page=1&limit=20&startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer <token>
```

### 5.3 Update Attendance
```http
PUT /api/attendance/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkOutTime": "2024-12-20T10:30:00Z",
  "attendanceStatus": "present"
}
```

### 5.4 Get Attendance Statistics
```http
GET /api/attendance/stats?branchId=branch123&period=monthly
Authorization: Bearer <token>
```

### 5.5 Bulk Mark Attendance
```http
POST /api/attendance/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "attendanceRecords": [
    {
      "memberId": "user1",
      "attendanceDate": "2024-12-20",
      "attendanceStatus": "present"
    },
    {
      "memberId": "user2",
      "attendanceDate": "2024-12-20",
      "attendanceStatus": "present"
    }
  ]
}
```

---

## 🎫 Module 6: Membership Management

### Base Route: `/api/memberships` & `/api/membership-plans`

### 6.1 Get All Memberships
```http
GET /api/memberships?page=1&limit=20&status=active
Authorization: Bearer <token>
```

### 6.2 Create Membership
```http
POST /api/memberships
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "userId123",
  "planId": "planId456",
  "startDate": "2024-12-20",
  "paymentStatus": "paid",
  "paymentMethod": "card",
  "amount": 10000
}
```

### 6.3 Renew Membership
```http
POST /api/memberships/:id/renew
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "planId456",
  "paymentMethod": "card"
}
```

### 6.4 Get Membership Plans
```http
GET /api/membership-plans?status=active
Authorization: Bearer <token>
```

### 6.5 Create Membership Plan
```http
POST /api/membership-plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "planName": "Platinum",
  "planDescription": "Premium membership with all facilities",
  "planDuration": 365,
  "planPrice": 15000,
  "planFeatures": [
    "Unlimited Gym Access",
    "Personal Trainer",
    "Diet Plan",
    "Spa Access"
  ],
  "planStatus": "active"
}
```

### 6.6 Update Membership Plan
```http
PUT /api/membership-plans/:id
Authorization: Bearer <token>
```

### 6.7 Get Membership Statistics
```http
GET /api/memberships/stats
Authorization: Bearer <token>
```

---

## 🏋️ Module 7: Workout Management

### Base Route: `/api/workouts`

### 7.1 Get All Workout Plans
```http
GET /api/workouts?page=1&limit=20&difficulty=beginner
Authorization: Bearer <token>
```

### 7.2 Create Workout Plan
```http
POST /api/workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "planName": "Beginner Full Body",
  "description": "Complete workout for beginners",
  "difficultyLevel": "beginner",
  "durationWeeks": 8,
  "exercises": [
    {
      "exerciseName": "Push-ups",
      "sets": 3,
      "reps": 10,
      "restTime": 60,
      "instructions": "Keep back straight"
    },
    {
      "exerciseName": "Squats",
      "sets": 3,
      "reps": 15,
      "restTime": 60
    }
  ]
}
```

### 7.3 Assign Workout to Member
```http
POST /api/workouts/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "userId123",
  "startDate": "2024-12-20"
}
```

### 7.4 Get Workout Statistics
```http
GET /api/workouts/stats
Authorization: Bearer <token>
```

---

## 🥗 Module 8: Diet & Nutrition

### Base Route: `/api/diets`

### 8.1 Get All Diet Plans
```http
GET /api/diets?page=1&limit=20
Authorization: Bearer <token>
```

### 8.2 Create Diet Plan
```http
POST /api/diets
Authorization: Bearer <token>
Content-Type: application/json

{
  "planName": "Weight Loss Diet",
  "description": "Healthy diet for weight loss",
  "calorieTarget": 2000,
  "proteinTarget": 150,
  "carbsTarget": 200,
  "fatsTarget": 50,
  "meals": [
    {
      "mealType": "breakfast",
      "mealName": "Oatmeal with Fruits",
      "calories": 400,
      "protein": 15,
      "carbs": 60,
      "fats": 10,
      "ingredients": ["Oats", "Banana", "Honey"]
    }
  ]
}
```

### 8.3 Assign Diet to Member
```http
POST /api/diets/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "userId123",
  "startDate": "2024-12-20"
}
```

---

## 📅 Module 9: Schedule Management

### Base Route: `/api/schedules`

### 9.1 Get All Schedules
```http
GET /api/schedules?page=1&limit=20&date=2024-12-20
Authorization: Bearer <token>
```

### 9.2 Create Class Schedule
```http
POST /api/schedules
Authorization: Bearer <token>
Content-Type: application/json

{
  "className": "Morning Yoga",
  "classDescription": "Relaxing yoga session",
  "trainerId": "trainerId123",
  "branchId": "branchId456",
  "startTime": "2024-12-21T06:00:00Z",
  "endTime": "2024-12-21T07:00:00Z",
  "capacity": 20,
  "classType": "yoga"
}
```

### 9.3 Book Class
```http
POST /api/schedules/:id/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "userId123"
}
```

### 9.4 Cancel Booking
```http
DELETE /api/schedules/:id/bookings/:bookingId
Authorization: Bearer <token>
```

### 9.5 Check Availability
```http
GET /api/schedules/:id/availability
Authorization: Bearer <token>
```

---

## 👨‍🏫 Module 10: Trainer Management

### Base Route: `/api/trainers`

### 10.1 Get All Trainers
```http
GET /api/trainers?page=1&limit=20&status=active
Authorization: Bearer <token>
```

### 10.2 Create Trainer
```http
POST /api/trainers
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Trainer",
  "email": "john.trainer@fitzone.com",
  "password": "Trainer@123",
  "phone": "9876543210",
  "gender": "male",
  "specialization": ["strength-training", "cardio"],
  "certifications": ["ACE Certified", "NASM CPT"],
  "experience": 5,
  "salary": 50000,
  "trainerStatus": "active"
}
```

### 10.3 Assign Members to Trainer
```http
POST /api/trainers/:id/assign-members
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberIds": ["userId123", "userId456"]
}
```

### 10.4 Update Trainer Availability
```http
PUT /api/trainers/:id/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "availability": [
    {
      "day": "monday",
      "startTime": "09:00",
      "endTime": "17:00"
    }
  ]
}
```

---

## 🎫 Module 11: Support Management

### Base Route: `/api/support`

### 11.1 Get All Tickets
```http
GET /api/support?page=1&limit=20&status=open&priority=high
Authorization: Bearer <token>
```

### 11.2 Create Support Ticket
```http
POST /api/support
Authorization: Bearer <token>
Content-Type: application/json

{
  "ticketTitle": "Payment Issue",
  "ticketDescription": "Unable to process payment",
  "ticketCategory": "payment",
  "priorityLevel": "high"
}
```

### 11.3 Assign Ticket
```http
PUT /api/support/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedTo": "adminId123",
  "ticketStatus": "in-progress"
}
```

### 11.4 Add Resolution
```http
PUT /api/support/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "resolutionNotes": "Issue resolved successfully",
  "ticketStatus": "resolved"
}
```

---

## 📢 Module 12: Communication

### Base Route: `/api/superadmin/communication`

### 12.1 Create Notification
```http
POST /api/superadmin/communication/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Welcome to FitZone",
  "message": "Thank you for joining!",
  "type": "info",
  "priority": "normal",
  "recipients": ["userId123", "userId456"]
}
```

### 12.2 Get All Notifications
```http
GET /api/superadmin/communication/notifications?page=1&limit=20
Authorization: Bearer <token>
```

### 12.3 Create Announcement
```http
POST /api/superadmin/communication/announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Year Special",
  "content": "50% off on annual memberships!",
  "targetAudience": "all",
  "priority": "high",
  "publishDate": "2024-12-25T00:00:00Z"
}
```

### 12.4 Send Message
```http
POST /api/superadmin/communication/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "userId123",
  "subject": "Welcome Message",
  "messageBody": "Welcome to FitZone!"
}
```

### 12.5 Bulk Notifications
```http
POST /api/superadmin/communication/notifications/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "notifications": [
    {
      "title": "Reminder",
      "message": "Your membership expires soon",
      "recipients": ["user1", "user2"]
    }
  ]
}
```

---

## ⚙️ Module 13: System Settings

### Base Route: `/api/settings`

### 13.1 Get Settings
```http
GET /api/settings
Authorization: Bearer <token>
```

### 13.2 Update Settings
```http
PUT /api/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "applicationName": "FitZone Pro",
  "primaryTheme": "#FF6B6B",
  "secondaryTheme": "#4ECDC4",
  "sidebarStyle": "expanded",
  "dashboardLayout": "modern"
}
```

### 13.3 Get Theme Settings
```http
GET /api/settings/theme
Authorization: Bearer <token>
```

### 13.4 Update Theme
```http
PUT /api/settings/theme
Authorization: Bearer <token>
Content-Type: application/json

{
  "primaryTheme": "#3498db",
  "secondaryTheme": "#2ecc71"
}
```

---

## 🔌 Module 14: Integrations

### Base Route: `/api/integrations`

### 14.1 Get Integration Settings
```http
GET /api/integrations
Authorization: Bearer <token>
```

### 14.2 Update Email Integration
```http
PUT /api/integrations
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailProvider": "gmail",
  "emailConfig": {
    "apiKey": "your_api_key",
    "senderEmail": "noreply@fitzone.com"
  }
}
```

### 14.3 Test Email
```http
POST /api/integrations/test-email
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Test Email",
  "body": "This is a test"
}
```

### 14.4 Test SMS
```http
POST /api/integrations/test-sms
Authorization: Bearer <token>
Content-Type: application/json

{
  "to": "+919876543210",
  "message": "Test SMS"
}
```

---

## 💾 Module 15: Data Management

### Base Route: `/api/data`

### 15.1 Create Backup
```http
POST /api/data/backup
Authorization: Bearer <token>
Content-Type: application/json

{
  "backupType": "manual"
}
```

### 15.2 Get All Backups
```http
GET /api/data/backups?page=1&limit=10
Authorization: Bearer <token>
```

### 15.3 Export Data
```http
POST /api/data/export
Authorization: Bearer <token>
Content-Type: application/json

{
  "collection": "users",
  "format": "csv",
  "filters": {
    "membershipStatus": "active"
  }
}
```

### 15.4 Import Data
```http
POST /api/data/import
Authorization: Bearer <token>
Content-Type: application/json

{
  "collection": "users",
  "format": "csv",
  "filePath": "/path/to/file.csv"
}
```

### 15.5 Get Statistics
```http
GET /api/data/stats
Authorization: Bearer <token>
```

---

## 🔒 Security Module

### Base Route: `/api/security`

### Security Events
```http
GET /api/security/events?page=1&limit=20&severity=high
Authorization: Bearer <token>
```

### Audit Logs
```http
GET /api/security/audit-logs?page=1&limit=20&action=login
Authorization: Bearer <token>
```

---

## 📝 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "hasMore": true
    }
  }
}
```

---

## 🚨 Error Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | No token or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Internal server error |

---

## 🎯 Best Practices

### 1. Authentication
- Always include the Bearer token
- Refresh token before expiry
- Handle 401 errors by redirecting to login

### 2. Error Handling
- Check `success` field in response
- Display user-friendly error messages
- Log errors for debugging

### 3. Pagination
- Use pagination for large datasets
- Default: page=1, limit=10
- Check `hasMore` for infinite scroll

### 4. Filtering & Search
- Use query parameters for filtering
- Combine multiple filters
- Use search for text queries

### 5. Data Validation
- Validate data on frontend before sending
- Handle validation errors gracefully
- Show field-specific error messages

---

## 📊 Rate Limiting

- **Rate Limit:** 100 requests per minute per IP
- **Headers:**
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Time when limit resets

---

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database
MONGODB_URI=mongodb://localhost:27017/fitzone

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d

# CORS
CORS_ORIGIN=https://admin.fitzone.com

# Email
EMAIL_SERVICE=gmail
EMAIL_USER=noreply@fitzone.com
EMAIL_PASSWORD=your_password

# SMS
SMS_API_KEY=your_sms_api_key

# Payment
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 📞 Support

For API issues or questions:
- Check error messages in response
- Review request format and parameters
- Verify authentication token
- Check server logs for detailed errors

---

**API Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Production Ready ✅

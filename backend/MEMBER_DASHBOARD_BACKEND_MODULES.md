# 🏋️ FitZone Member Dashboard Backend Modules

## 📋 Complete API Documentation

This document provides comprehensive documentation for all Member Dashboard Backend Modules in the FitZone Gym Management System.

---

## 🔐 Module 1: Member Authentication & Authorization

### Overview
Complete authentication system for gym members with JWT tokens, refresh tokens, and profile management.

### Base URL
```
/api/auth
```

### Endpoints

#### 1. Member Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "member@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "member@example.com",
      "role": "member",
      "membershipStatus": "active",
      "membershipPlan": "monthly"
    },
    "token": "jwt_access_token",
    "refreshToken": "jwt_refresh_token",
    "expiresIn": 3600
  }
}
```

#### 2. Member Logout
```http
POST /api/auth/logout
```
**Headers:** `Authorization: Bearer {token}`

#### 3. Get Current Member Profile
```http
GET /api/auth/me
```
**Headers:** `Authorization: Bearer {token}`

#### 4. Update Member Profile
```http
PUT /api/auth/profile
```
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "1234567890",
  "address": "123 Main St",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "0987654321",
    "relationship": "Spouse"
  }
}
```

#### 5. Change Password
```http
PUT /api/auth/change-password
```
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!",
  "confirmPassword": "NewPass123!"
}
```

#### 6. Refresh Access Token
```http
POST /api/auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

---

## 📊 Module 2: Member Dashboard Overview

### Overview
Provides comprehensive dashboard statistics and overview for members.

### Base URL
```
/api/member/dashboard
```

### Endpoints

#### 1. Get Dashboard Overview
```http
GET /api/member/dashboard
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "member": {
      "id": "member_id",
      "fullName": "John Doe",
      "membershipStatus": "active",
      "membershipPlan": "monthly",
      "daysRemaining": 15
    },
    "statistics": {
      "totalAttendance": 45,
      "thisMonthAttendance": 12,
      "activeWorkouts": 3,
      "activeDiets": 1,
      "upcomingSessions": 2,
      "progressRecords": 8
    }
  }
}
```

---

## 💪 Module 3: Member Workout Plans

### Overview
View and track assigned workout plans.

### Base URL
```
/api/workouts
```

### Endpoints

#### 1. Get All Assigned Workouts
```http
GET /api/workouts
```
**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): active, completed, paused, cancelled

**Response:**
```json
{
  "success": true,
  "data": {
    "workouts": [
      {
        "id": "workout_id",
        "workoutTitle": "Strength Training Program",
        "workoutCategory": "strength",
        "difficultyLevel": "intermediate",
        "duration": 60,
        "exercises": [
          {
            "exerciseName": "Bench Press",
            "sets": 3,
            "reps": "10-12",
            "weight": "60kg",
            "restTime": 90
          }
        ],
        "status": "active",
        "progress": 65,
        "trainerId": {
          "fullName": "Trainer Name",
          "email": "trainer@example.com"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalWorkouts": 25,
      "limit": 10
    }
  }
}
```

#### 2. Get Workout by ID
```http
GET /api/workouts/:id
```
**Headers:** `Authorization: Bearer {token}`

#### 3. Update Workout Progress
```http
PUT /api/workouts/:id/progress
```
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "progress": 75
}
```

---

## 🥗 Module 4: Member Diet Plans

### Overview
View and track assigned diet plans.

### Base URL
```
/api/diets
```

### Endpoints

#### 1. Get All Assigned Diets
```http
GET /api/diets
```
**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`, `limit`, `status`

**Response:**
```json
{
  "success": true,
  "data": {
    "diets": [
      {
        "id": "diet_id",
        "dietTitle": "Weight Loss Plan",
        "dietType": "weight-loss",
        "calorieTarget": {
          "daily": 2000,
          "protein": 150,
          "carbs": 200,
          "fats": 65
        },
        "mealSchedule": [
          {
            "mealName": "breakfast",
            "time": "08:00 AM",
            "foods": [
              {
                "foodItem": "Oatmeal",
                "quantity": "1 cup",
                "calories": 150,
                "protein": 5,
                "carbs": 27,
                "fats": 3
              }
            ],
            "totalCalories": 400
          }
        ],
        "status": "active",
        "progress": 80,
        "adherenceRate": 85
      }
    ]
  }
}
```

#### 2. Get Diet by ID
```http
GET /api/diets/:id
```

#### 3. Update Diet Adherence
```http
PUT /api/diets/:id/adherence
```

**Request Body:**
```json
{
  "adherenceRate": 90
}
```

---

## 📅 Module 5: Member Attendance

### Overview
View attendance history and check-in/check-out.

### Base URL
```
/api/attendance
```

### Endpoints

#### 1. Get Attendance History
```http
GET /api/attendance
```
**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`, `limit`
- `startDate`, `endDate` (optional): Date range filter

**Response:**
```json
{
  "success": true,
  "data": {
    "attendance": [
      {
        "id": "attendance_id",
        "attendanceDate": "2024-01-15",
        "checkInTime": "2024-01-15T08:00:00Z",
        "checkOutTime": "2024-01-15T10:00:00Z",
        "duration": 120,
        "attendanceStatus": "present",
        "branchId": {
          "branchName": "Downtown Branch",
          "branchCode": "DT001"
        }
      }
    ],
    "statistics": {
      "totalVisits": 45,
      "totalDuration": 5400,
      "avgDuration": 120
    }
  }
}
```

#### 2. Get Attendance Statistics
```http
GET /api/attendance/stats
```
**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `startDate`, `endDate` (optional)

---

## 📈 Module 6: Member Progress Tracking

### Overview
Track body measurements, photos, and fitness progress.

### Base URL
```
/api/member/progress
```

### Endpoints

#### 1. Get Progress History
```http
GET /api/member/progress
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "id": "progress_id",
        "recordDate": "2024-01-15",
        "bodyMeasurements": {
          "weight": 75,
          "height": 175,
          "bmi": 24.5,
          "bodyFatPercentage": 18,
          "chest": 100,
          "waist": 85,
          "hips": 95
        },
        "strengthMetrics": [
          {
            "exerciseName": "Bench Press",
            "weight": 80,
            "reps": 10,
            "oneRepMax": 106.7
          }
        ],
        "progressPhotos": [
          {
            "photoUrl": "https://...",
            "photoType": "front",
            "uploadDate": "2024-01-15"
          }
        ]
      }
    ]
  }
}
```

#### 2. Get Latest Progress
```http
GET /api/member/progress/latest
```

#### 3. Get Progress Report
```http
GET /api/member/progress/report
```
**Returns:** Comparison between first and latest records with changes

#### 4. Get Weekly Analytics
```http
GET /api/member/progress/analytics/weekly
```
**Returns:** Chart-ready data for last 7 days

#### 5. Get Monthly Analytics
```http
GET /api/member/progress/analytics/monthly
```
**Returns:** Chart-ready data for last 30 days

---

## 🗓️ Module 7: Member Sessions & Bookings

### Overview
View and manage session bookings.

### Base URL
```
/api/schedules
```

### Endpoints

#### 1. Get Available Sessions
```http
GET /api/schedules/available
```
**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `startDate`, `endDate`
- `sessionType`: personal-training, group-class, consultation
- `trainerId` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "session_id",
        "sessionTitle": "HIIT Training",
        "sessionType": "group-class",
        "sessionDate": "2024-01-20",
        "startTime": "2024-01-20T10:00:00Z",
        "endTime": "2024-01-20T11:00:00Z",
        "duration": 60,
        "maxParticipants": 15,
        "availableSlots": 8,
        "trainerId": {
          "fullName": "Trainer Name",
          "specialization": ["hiit", "cardio"]
        },
        "price": 500
      }
    ]
  }
}
```

#### 2. Get My Bookings
```http
GET /api/schedules/my-bookings
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "bookings": [
      {
        "id": "session_id",
        "sessionTitle": "Personal Training",
        "sessionDate": "2024-01-20",
        "startTime": "2024-01-20T10:00:00Z",
        "bookingStatus": "confirmed",
        "attended": false,
        "trainer": {
          "fullName": "Trainer Name"
        }
      }
    ]
  }
}
```

#### 3. Book Session
```http
POST /api/schedules/:id/book
```
**Headers:** `Authorization: Bearer {token}`

**Request Body:**
```json
{
  "notes": "First time booking"
}
```

#### 4. Cancel Booking
```http
DELETE /api/schedules/:id/cancel-booking
```
**Headers:** `Authorization: Bearer {token}`

---

## 🔔 Module 8: Member Notifications

### Overview
View and manage notifications.

### Base URL
```
/api/member/notifications
```

### Endpoints

#### 1. Get All Notifications
```http
GET /api/member/notifications
```
**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
- `page`, `limit`
- `isRead`: true, false
- `notificationType`: workout-reminder, session-reminder, diet-reminder, etc.

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "notification_id",
        "title": "💪 Workout Reminder",
        "message": "Don't forget to complete your workout today!",
        "notificationType": "workout-reminder",
        "priority": "medium",
        "isRead": false,
        "sentAt": "2024-01-15T08:00:00Z",
        "actionUrl": "/workouts/workout_id",
        "actionLabel": "View Workout",
        "sender": {
          "fullName": "Trainer Name"
        }
      }
    ],
    "unreadCount": 5
  }
}
```

#### 2. Get Unread Count
```http
GET /api/member/notifications/unread-count
```

#### 3. Mark as Read
```http
PUT /api/member/notifications/:id/read
```

#### 4. Mark All as Read
```http
PUT /api/member/notifications/mark-all-read
```

#### 5. Delete Notification
```http
DELETE /api/member/notifications/:id
```

---

## 💳 Module 9: Member Membership Management

### Overview
View membership details and renewal.

### Base URL
```
/api/memberships
```

### Endpoints

#### 1. Get Current Membership
```http
GET /api/memberships/current
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "membership": {
      "id": "membership_id",
      "membershipPlan": "monthly",
      "membershipStartDate": "2024-01-01",
      "membershipEndDate": "2024-01-31",
      "membershipStatus": "active",
      "daysRemaining": 15,
      "isExpiringSoon": true,
      "amount": 1500,
      "paymentStatus": "paid",
      "autoRenewal": true
    }
  }
}
```

#### 2. Get Membership History
```http
GET /api/memberships/history
```

#### 3. Get Available Plans
```http
GET /api/membership-plans
```

**Response:**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "plan_id",
        "planName": "Monthly Plan",
        "duration": 30,
        "price": 1500,
        "features": [
          "Access to all equipment",
          "Group classes",
          "Locker facility"
        ],
        "isActive": true
      }
    ]
  }
}
```

#### 4. Request Renewal
```http
POST /api/memberships/renew
```

**Request Body:**
```json
{
  "planId": "plan_id",
  "paymentMethod": "card"
}
```

---

## 👤 Module 10: Member Profile Management

### Overview
Complete profile management for members.

### Base URL
```
/api/member/profile
```

### Endpoints

#### 1. Get Full Profile
```http
GET /api/member/profile
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "member_id",
      "fullName": "John Doe",
      "email": "member@example.com",
      "phone": "1234567890",
      "gender": "male",
      "age": 30,
      "height": 175,
      "weight": 75,
      "fitnessGoal": "muscle-gain",
      "membershipStatus": "active",
      "membershipPlan": "monthly",
      "assignedTrainer": {
        "fullName": "Trainer Name",
        "specialization": ["strength", "nutrition"]
      },
      "joinDate": "2023-06-15",
      "profileImage": "https://...",
      "address": "123 Main St",
      "emergencyContact": {
        "name": "Jane Doe",
        "phone": "0987654321",
        "relationship": "Spouse"
      }
    }
  }
}
```

#### 2. Update Profile
```http
PUT /api/member/profile
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "phone": "1234567890",
  "height": 175,
  "weight": 75,
  "fitnessGoal": "muscle-gain",
  "address": "123 Main St",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "0987654321",
    "relationship": "Spouse"
  }
}
```

#### 3. Upload Profile Image
```http
POST /api/member/profile/image
```

**Request Body:**
```json
{
  "imageUrl": "https://..."
}
```

---

## 🎯 Module 11: Member Goals & Achievements

### Overview
Track fitness goals and achievements.

### Base URL
```
/api/member/goals
```

### Endpoints

#### 1. Get All Goals
```http
GET /api/member/goals
```

**Response:**
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "id": "goal_id",
        "goalType": "weight-loss",
        "targetValue": 70,
        "currentValue": 75,
        "startDate": "2024-01-01",
        "targetDate": "2024-06-01",
        "status": "in-progress",
        "progress": 50
      }
    ]
  }
}
```

#### 2. Create Goal
```http
POST /api/member/goals
```

**Request Body:**
```json
{
  "goalType": "weight-loss",
  "targetValue": 70,
  "targetDate": "2024-06-01"
}
```

#### 3. Update Goal Progress
```http
PUT /api/member/goals/:id/progress
```

#### 4. Get Achievements
```http
GET /api/member/achievements
```

---

## 💬 Module 12: Member Support & Tickets

### Overview
Submit and track support tickets.

### Base URL
```
/api/support
```

### Endpoints

#### 1. Get My Tickets
```http
GET /api/support/my-tickets
```
**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "data": {
    "tickets": [
      {
        "id": "ticket_id",
        "subject": "Equipment Issue",
        "category": "equipment",
        "priority": "medium",
        "status": "open",
        "description": "Treadmill not working",
        "createdAt": "2024-01-15",
        "assignedTo": {
          "fullName": "Support Staff"
        }
      }
    ]
  }
}
```

#### 2. Create Ticket
```http
POST /api/support
```

**Request Body:**
```json
{
  "subject": "Equipment Issue",
  "category": "equipment",
  "priority": "medium",
  "description": "Treadmill not working"
}
```

#### 3. Get Ticket by ID
```http
GET /api/support/:id
```

#### 4. Add Comment
```http
POST /api/support/:id/comment
```

**Request Body:**
```json
{
  "comment": "Still waiting for resolution"
}
```

---

## 📊 Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": null
}
```

### Pagination Format
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "limit": 10,
    "hasMore": true
  }
}
```

---

## 🔒 Authentication

All protected endpoints require JWT authentication:

**Header:**
```
Authorization: Bearer {jwt_token}
```

**Token Expiry:**
- Access Token: 1 hour
- Refresh Token: 7 days

---

## 📝 Common Query Parameters

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Field to sort by
- `sortOrder`: asc or desc
- `search`: Search query
- `startDate`: Start date for filtering
- `endDate`: End date for filtering

---

## 🎨 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🚀 Quick Start Examples

### Login and Get Dashboard
```javascript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'member@example.com',
    password: 'password123'
  })
});
const { data } = await loginResponse.json();
const token = data.token;

// 2. Get Dashboard
const dashboardResponse = await fetch('/api/member/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const dashboard = await dashboardResponse.json();
```

### Book a Session
```javascript
const response = await fetch('/api/schedules/session_id/book', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    notes: 'First time booking'
  })
});
```

### Update Progress
```javascript
const response = await fetch('/api/workouts/workout_id/progress', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    progress: 75
  })
});
```

---

## 📚 Additional Resources

- **Postman Collection**: Available for testing all endpoints
- **API Versioning**: Current version is v1
- **Rate Limiting**: 100 requests per minute per user
- **CORS**: Enabled for configured origins

---

## 🆘 Support

For API support and questions:
- Email: api-support@fitzone.com
- Documentation: https://docs.fitzone.com
- Status Page: https://status.fitzone.com

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Maintained by:** FitZone Development Team

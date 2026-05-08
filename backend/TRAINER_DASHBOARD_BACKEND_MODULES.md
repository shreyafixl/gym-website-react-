# 🏋️ FitZone Trainer Dashboard - Backend Modules Documentation

## 📋 Overview

This document provides comprehensive documentation for all backend modules available for the Trainer Dashboard. These modules enable trainers to manage their clients, schedules, workouts, and track performance metrics.

**Last Updated:** May 7, 2026  
**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api`

---

## 🔐 Authentication

All Trainer Dashboard endpoints require JWT authentication. Trainers must login and include the JWT token in the Authorization header.

### Authentication Header
```
Authorization: Bearer <trainer_jwt_token>
```

### Trainer Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "trainer@fitzone.com",
  "password": "Trainer@123"
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
      "id": "trainer_id",
      "fullName": "John Trainer",
      "email": "trainer@fitzone.com",
      "role": "trainer"
    }
  }
}
```

---

## 📚 Available Modules

### 1. Trainer Profile Management
### 2. Assigned Members Management
### 3. Workout Plan Management
### 4. Schedule Management
### 5. Attendance Tracking
### 6. Performance Analytics
### 7. Communication System

---

## 1️⃣ Trainer Profile Management

### Get Trainer Profile
```http
GET /api/admin/trainers/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Trainer retrieved successfully",
  "data": {
    "trainer": {
      "id": "trainer_id",
      "fullName": "John Trainer",
      "email": "trainer@fitzone.com",
      "phone": "1234567890",
      "gender": "male",
      "specialization": ["strength-training", "cardio", "personal-training"],
      "certifications": [
        {
          "name": "Certified Personal Trainer",
          "issuingOrganization": "NASM",
          "issueDate": "2020-01-15",
          "expiryDate": "2025-01-15",
          "isVerified": true
        }
      ],
      "experience": 5,
      "assignedBranch": {
        "branchName": "FitZone Downtown",
        "branchCode": "FZ-DT-001"
      },
      "activeMembersCount": 15,
      "rating": {
        "average": 4.5,
        "count": 30
      },
      "sessionsCompleted": 250,
      "availability": {
        "monday": {
          "isAvailable": true,
          "slots": [
            { "startTime": "09:00", "endTime": "12:00" },
            { "startTime": "14:00", "endTime": "18:00" }
          ]
        }
      }
    }
  }
}
```

### Update Trainer Profile
```http
PUT /api/admin/trainers/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Experienced personal trainer specializing in strength training",
  "specialization": ["strength-training", "cardio", "hiit"],
  "phone": "1234567890"
}
```

### Update Availability
```http
PUT /api/admin/trainers/:id/availability
Authorization: Bearer <token>
Content-Type: application/json

{
  "availability": {
    "monday": {
      "isAvailable": true,
      "slots": [
        { "startTime": "09:00", "endTime": "12:00" },
        { "startTime": "14:00", "endTime": "18:00" }
      ]
    },
    "tuesday": {
      "isAvailable": true,
      "slots": [
        { "startTime": "10:00", "endTime": "17:00" }
      ]
    }
  }
}
```

---

## 2️⃣ Assigned Members Management

### Get Assigned Members
```http
GET /api/admin/trainers/:trainerId
Authorization: Bearer <token>
```

The trainer profile includes `assignedMembers` array with member details.

### Assign New Members
```http
POST /api/admin/trainers/:id/assign-members
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberIds": ["member_id_1", "member_id_2", "member_id_3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "3 members assigned successfully. 0 were already assigned.",
  "data": {
    "trainer": {
      "id": "trainer_id",
      "assignedMembers": [
        {
          "memberId": {
            "fullName": "John Doe",
            "email": "john@example.com",
            "membershipStatus": "active"
          },
          "assignedDate": "2024-01-15",
          "status": "active"
        }
      ]
    },
    "assigned": 3,
    "alreadyAssigned": 0
  }
}
```

### Get Member Details
```http
GET /api/admin/users/:memberId
Authorization: Bearer <token>
```

**Response includes:**
- Member profile
- Membership details
- Fitness goals
- Attendance history
- Assigned workout plans

---

## 3️⃣ Workout Plan Management

### Get All Workouts (Trainer's)
```http
GET /api/admin/workouts?trainerId=<trainer_id>&page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `trainerId` - Filter by trainer ID
- `memberId` - Filter by member ID
- `status` - Filter by status (active, completed, paused, cancelled)
- `workoutCategory` - Filter by category
- `difficultyLevel` - Filter by difficulty
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Workout plans retrieved successfully",
  "data": {
    "workouts": [
      {
        "id": "workout_id",
        "memberId": {
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "workoutTitle": "Strength Building Program",
        "workoutCategory": "strength",
        "exercises": [
          {
            "exerciseName": "Bench Press",
            "sets": 4,
            "reps": "8-10",
            "weight": "60kg",
            "restTime": 90,
            "notes": "Focus on form"
          }
        ],
        "duration": 60,
        "difficultyLevel": "intermediate",
        "targetMuscleGroups": ["chest", "arms"],
        "goals": ["muscle-gain", "strength"],
        "frequency": "3 times per week",
        "status": "active",
        "progress": 45,
        "exerciseCount": 8
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalWorkouts": 25,
      "limit": 10,
      "hasMore": true
    }
  }
}
```

### Create Workout Plan
```http
POST /api/admin/workouts
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "member_id",
  "trainerId": "trainer_id",
  "workoutTitle": "Beginner Strength Program",
  "workoutCategory": "strength",
  "exercises": [
    {
      "exerciseName": "Squats",
      "sets": 3,
      "reps": "10-12",
      "weight": "bodyweight",
      "restTime": 60,
      "notes": "Keep back straight",
      "order": 1
    },
    {
      "exerciseName": "Push-ups",
      "sets": 3,
      "reps": "12-15",
      "weight": "bodyweight",
      "restTime": 45,
      "order": 2
    }
  ],
  "duration": 45,
  "difficultyLevel": "beginner",
  "targetMuscleGroups": ["legs", "chest", "arms"],
  "goals": ["general-fitness", "strength"],
  "frequency": "3 times per week",
  "startDate": "2024-01-20",
  "notes": "Focus on proper form before adding weight"
}
```

### Update Workout Plan
```http
PUT /api/admin/workouts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "workoutTitle": "Updated Strength Program",
  "exercises": [...],
  "progress": 60,
  "status": "active"
}
```

### Assign Workout to Member
```http
POST /api/admin/workouts/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "member_id",
  "trainerId": "trainer_id"
}
```

### Get Workout Statistics
```http
GET /api/admin/workouts/stats?trainerId=<trainer_id>&period=month
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Workout statistics retrieved successfully",
  "data": {
    "period": "month",
    "summary": {
      "totalWorkouts": 50,
      "activeWorkouts": 35,
      "completedWorkouts": 12,
      "pausedWorkouts": 2,
      "cancelledWorkouts": 1,
      "newWorkouts": 8,
      "averageProgress": 65,
      "averageExercises": 8,
      "completionRate": 24.00
    },
    "engagement": {
      "membersWithWorkouts": 30,
      "totalMembers": 35,
      "engagementRate": 85.71
    },
    "byCategory": [
      { "category": "strength", "count": 20, "percentage": 57.14 },
      { "category": "cardio", "count": 10, "percentage": 28.57 }
    ],
    "byDifficulty": [
      { "difficulty": "beginner", "count": 15, "percentage": 42.86 },
      { "difficulty": "intermediate", "count": 18, "percentage": 51.43 }
    ]
  }
}
```

---

## 4️⃣ Schedule Management

### Get Trainer's Schedule
```http
GET /api/admin/schedules?assignedTo=<trainer_id>&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `assignedTo` - Trainer ID
- `branchId` - Filter by branch
- `scheduleType` - Filter by type
- `status` - Filter by status
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "message": "Schedules retrieved successfully",
  "data": {
    "schedules": [
      {
        "id": "schedule_id",
        "title": "Personal Training Session - John Doe",
        "description": "Strength training focus",
        "assignedTo": {
          "fullName": "Trainer Name",
          "email": "trainer@fitzone.com"
        },
        "scheduleType": "personal-training",
        "branchId": {
          "branchName": "FitZone Downtown",
          "branchCode": "FZ-DT-001"
        },
        "date": "2024-01-20",
        "startTime": "10:00",
        "endTime": "11:00",
        "duration": 60,
        "status": "scheduled",
        "participants": [
          {
            "userId": {
              "fullName": "John Doe",
              "email": "john@example.com"
            },
            "status": "confirmed"
          }
        ],
        "participantCount": 1,
        "maxParticipants": 1,
        "availableSlots": 0,
        "isFull": true,
        "location": "Training Area 1",
        "room": "Room A"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 2,
      "totalSchedules": 15,
      "limit": 10,
      "hasMore": true
    }
  }
}
```

### Create Schedule
```http
POST /api/admin/schedules
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Group Fitness Class - HIIT",
  "description": "High-intensity interval training",
  "assignedTo": "trainer_id",
  "scheduleType": "group-class",
  "branchId": "branch_id",
  "date": "2024-01-25",
  "startTime": "18:00",
  "endTime": "19:00",
  "maxParticipants": 15,
  "location": "Studio 1",
  "room": "Main Studio",
  "equipment": ["Dumbbells", "Mats", "Resistance Bands"],
  "notes": "Bring water bottle"
}
```

### Update Schedule
```http
PUT /api/admin/schedules/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Class Title",
  "startTime": "18:30",
  "endTime": "19:30",
  "status": "scheduled"
}
```

### Book Member to Schedule
```http
POST /api/admin/schedules/:id/book
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "member_id",
  "status": "confirmed"
}
```

### Check Schedule Availability
```http
GET /api/admin/schedules/:id/availability
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Schedule availability retrieved successfully",
  "data": {
    "schedule": {
      "id": "schedule_id",
      "title": "Group Fitness Class",
      "date": "2024-01-25",
      "startTime": "18:00",
      "endTime": "19:00"
    },
    "availability": {
      "maxParticipants": 15,
      "currentParticipants": 12,
      "availableSlots": 3,
      "isFull": false,
      "occupancyRate": 80.00,
      "isBookable": true
    },
    "participants": [...]
  }
}
```

---

## 5️⃣ Attendance Tracking

### Get Attendance Records
```http
GET /api/admin/attendance?trainerId=<trainer_id>&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Query Parameters:**
- `trainerId` - Filter by trainer
- `memberId` - Filter by member
- `branchId` - Filter by branch
- `attendanceStatus` - Filter by status
- `startDate` - Start date
- `endDate` - End date

**Response:**
```json
{
  "success": true,
  "message": "Attendance records retrieved successfully",
  "data": {
    "attendance": [
      {
        "id": "attendance_id",
        "memberId": {
          "fullName": "John Doe",
          "email": "john@example.com",
          "membershipStatus": "active"
        },
        "trainerId": {
          "fullName": "Trainer Name",
          "email": "trainer@fitzone.com"
        },
        "branchId": {
          "branchName": "FitZone Downtown",
          "branchCode": "FZ-DT-001"
        },
        "attendanceDate": "2024-01-20",
        "checkInTime": "2024-01-20T10:00:00Z",
        "checkOutTime": "2024-01-20T11:30:00Z",
        "attendanceStatus": "present",
        "duration": 90,
        "notes": "Great session"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalRecords": 45,
      "limit": 10,
      "hasMore": true
    }
  }
}
```

### Create Attendance Record
```http
POST /api/admin/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "member_id",
  "trainerId": "trainer_id",
  "branchId": "branch_id",
  "attendanceDate": "2024-01-20",
  "checkInTime": "2024-01-20T10:00:00Z",
  "checkOutTime": "2024-01-20T11:30:00Z",
  "attendanceStatus": "present",
  "notes": "Completed full workout"
}
```

### Update Attendance (Check-out)
```http
PUT /api/admin/attendance/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkOutTime": "2024-01-20T11:30:00Z",
  "attendanceStatus": "present",
  "notes": "Session completed successfully"
}
```

### Get Attendance Statistics
```http
GET /api/admin/attendance/stats?trainerId=<trainer_id>&period=month
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Attendance statistics retrieved successfully",
  "data": {
    "period": "month",
    "dateRange": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "summary": {
      "totalAttendance": 120,
      "uniqueMembers": 30,
      "todayAttendance": 8,
      "averagePerDay": 4,
      "averageDuration": 75,
      "maxDuration": 120,
      "minDuration": 30
    },
    "byStatus": {
      "present": 115,
      "absent": 3,
      "late": 2,
      "leave": 0
    },
    "topMembers": [
      {
        "memberId": "member_id",
        "memberName": "John Doe",
        "memberEmail": "john@example.com",
        "attendanceCount": 20
      }
    ],
    "trend": [
      { "date": "2024-01-01", "count": 5 },
      { "date": "2024-01-02", "count": 7 }
    ]
  }
}
```

---

## 6️⃣ Performance Analytics

### Get Trainer Statistics
```http
GET /api/admin/trainers/stats?branchId=<branch_id>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Trainer statistics retrieved successfully",
  "data": {
    "summary": {
      "totalTrainers": 10,
      "activeTrainers": 9,
      "inactiveTrainers": 1,
      "onLeaveTrainers": 0,
      "averageExperience": 5,
      "averageRating": 4.3,
      "totalAssignedMembers": 150,
      "averageMembersPerTrainer": 16.67
    },
    "bySpecialization": [
      { "specialization": "strength-training", "count": 8, "percentage": 80.00 },
      { "specialization": "cardio", "count": 6, "percentage": 60.00 }
    ],
    "topTrainers": [
      {
        "trainerId": "trainer_id",
        "fullName": "John Trainer",
        "email": "john@fitzone.com",
        "specialization": ["strength-training", "personal-training"],
        "activeMembersCount": 25,
        "rating": 4.8,
        "sessionsCompleted": 350
      }
    ]
  }
}
```

### Get Member Progress
```http
GET /api/admin/users/:memberId
Authorization: Bearer <token>
```

The response includes:
- Member profile
- Attendance count
- Assigned workouts
- Workout progress
- Membership status

---

## 7️⃣ Communication System

### Send Message to Member
```http
POST /api/admin/communication/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "member_id",
  "subject": "Workout Plan Update",
  "message": "Hi John, I've updated your workout plan. Please check it out!",
  "messageType": "text",
  "priority": "normal"
}
```

### Send Bulk Messages
```http
POST /api/admin/communication/messages/bulk
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipientType": "specific",
  "recipientIds": ["member_id_1", "member_id_2", "member_id_3"],
  "subject": "Weekly Check-in",
  "message": "Hi everyone! Don't forget to log your workouts this week.",
  "messageType": "text",
  "priority": "normal"
}
```

### Get Messages
```http
GET /api/admin/communication/messages?page=1&limit=10
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": {
    "messages": [
      {
        "id": "message_id",
        "receiverId": {
          "fullName": "John Doe",
          "email": "john@example.com"
        },
        "subject": "Workout Plan Update",
        "message": "Hi John, I've updated your workout plan...",
        "messageType": "text",
        "priority": "normal",
        "status": "sent",
        "readStatus": true,
        "readAt": "2024-01-20T15:30:00Z",
        "sentAt": "2024-01-20T10:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalMessages": 25,
      "limit": 10,
      "hasMore": true
    }
  }
}
```

### Create Notification
```http
POST /api/admin/communication/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Session Reminder",
  "message": "You have a training session tomorrow at 10:00 AM",
  "type": "info",
  "recipientType": "specific",
  "recipientIds": ["member_id"],
  "priority": "high",
  "actionUrl": "/schedule",
  "actionLabel": "View Schedule"
}
```

---

## 🔧 Common Use Cases

### Use Case 1: Daily Schedule Check
```javascript
// 1. Get today's schedule
GET /api/admin/schedules?assignedTo=<trainer_id>&startDate=2024-01-20&endDate=2024-01-20

// 2. Check each session's participants
GET /api/admin/schedules/:id/availability

// 3. Mark attendance for completed sessions
POST /api/admin/attendance
```

### Use Case 2: Create Workout for New Member
```javascript
// 1. Get member details
GET /api/admin/users/:memberId

// 2. Create personalized workout plan
POST /api/admin/workouts

// 3. Send notification to member
POST /api/admin/communication/messages
```

### Use Case 3: Weekly Performance Review
```javascript
// 1. Get attendance statistics
GET /api/admin/attendance/stats?trainerId=<trainer_id>&period=week

// 2. Get workout statistics
GET /api/admin/workouts/stats?trainerId=<trainer_id>&period=week

// 3. Review member progress
GET /api/admin/users/:memberId
```

### Use Case 4: Schedule Group Class
```javascript
// 1. Create schedule
POST /api/admin/schedules

// 2. Book members
POST /api/admin/schedules/:id/book (for each member)

// 3. Send notification to all participants
POST /api/admin/communication/notifications/bulk
```

---

## 📊 Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "error": "Detailed error information"
}
```

---

## ⚠️ Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid or missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |

---

## 🔒 Permissions

Trainers have access to:
- ✅ View and update their own profile
- ✅ View assigned members
- ✅ Create and manage workout plans for assigned members
- ✅ View and manage their schedule
- ✅ Mark attendance for their sessions
- ✅ Send messages to assigned members
- ✅ View their performance statistics

Trainers cannot:
- ❌ Access other trainers' data
- ❌ Modify branch settings
- ❌ Access financial data
- ❌ Delete users or critical records
- ❌ Manage system settings

---

## 📱 Integration Examples

### React/JavaScript Example
```javascript
// Get trainer's schedule
const getSchedule = async (trainerId, startDate, endDate) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `http://localhost:5000/api/admin/schedules?assignedTo=${trainerId}&startDate=${startDate}&endDate=${endDate}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.schedules;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching schedule:', error);
    throw error;
  }
};

// Create workout plan
const createWorkout = async (workoutData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      'http://localhost:5000/api/admin/workouts',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workoutData)
      }
    );
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.workout;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};
```

---

## 🚀 Quick Start Guide

### Step 1: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer@fitzone.com",
    "password": "Trainer@123"
  }'
```

### Step 2: Get Profile
```bash
curl -X GET http://localhost:5000/api/admin/trainers/TRAINER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 3: Get Assigned Members
```bash
curl -X GET http://localhost:5000/api/admin/trainers/TRAINER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 4: Create Workout
```bash
curl -X POST http://localhost:5000/api/admin/workouts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "MEMBER_ID",
    "trainerId": "TRAINER_ID",
    "workoutTitle": "Beginner Program",
    "workoutCategory": "strength",
    "exercises": [...],
    "duration": 45,
    "difficultyLevel": "beginner"
  }'
```

---

## 📞 Support

For technical support or questions:
- Check error messages for specific issues
- Verify JWT token is valid and not expired
- Ensure all required fields are provided
- Check server logs for detailed error information

---

## 📝 Notes

1. **Token Expiration:** JWT tokens expire after a certain period. Implement token refresh logic in your frontend.

2. **Pagination:** Most list endpoints support pagination. Always check `hasMore` field to determine if more data is available.

3. **Date Formats:** Use ISO 8601 format for dates (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ).

4. **Time Formats:** Use 24-hour format (HH:MM) for time fields.

5. **File Uploads:** For attachments, implement file upload separately and provide URLs in the request.

6. **Real-time Updates:** Consider implementing WebSocket connections for real-time schedule and message updates.

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | May 7, 2026 | Initial release with all trainer dashboard modules |

---

**End of Documentation**

For the latest updates and additional information, please refer to the main backend documentation or contact the development team.

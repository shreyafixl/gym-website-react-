# 🧪 Complete Testing Guide - All 11 Modules

## 📋 Overview
This guide provides step-by-step testing instructions for all 11 backend modules of the FitZone Super Admin Dashboard.

---

## 🚀 Prerequisites

### 1. Start MongoDB
```bash
mongod
```

### 2. Start Backend Server
```bash
cd backend
npm run dev
```

### 3. Create Super Admin
```bash
node scripts/createSuperAdmin.js
```

**Default Credentials:**
- Email: `superadmin@fitzone.com`
- Password: `SuperAdmin@123`

---

## 🔐 Step 1: Authentication

### Login as SuperAdmin
```bash
POST http://localhost:5000/api/superadmin/auth/login
Content-Type: application/json

{
  "email": "superadmin@fitzone.com",
  "password": "SuperAdmin@123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "...",
      "email": "superadmin@fitzone.com",
      "role": "superadmin"
    }
  }
}
```

**Save the token** - You'll need it for all subsequent requests!

---

## 📡 Step 2: Test Each Module

### Module 1: Communication Module ✅

#### Test 1.1: Create Notification
```bash
POST http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Welcome to FitZone",
  "message": "Thank you for joining our gym!",
  "type": "info",
  "priority": "normal",
  "recipients": []
}
```

#### Test 1.2: Get All Notifications
```bash
GET http://localhost:5000/api/superadmin/communication/notifications?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 1.3: Create Announcement
```bash
POST http://localhost:5000/api/superadmin/communication/announcements
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "New Year Special Offer",
  "content": "Get 50% off on annual memberships!",
  "targetAudience": "all",
  "priority": "high",
  "publishDate": "2024-12-20T00:00:00Z"
}
```

#### Test 1.4: Send Message
```bash
POST http://localhost:5000/api/superadmin/communication/messages
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "receiverId": "userId123",
  "subject": "Welcome Message",
  "messageBody": "Welcome to FitZone! We're excited to have you."
}
```

**✅ Communication Module Tests Complete**

---

### Module 2: Attendance Module ✅

#### Test 2.1: Mark Attendance
```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "memberId": "userId123",
  "trainerId": "trainerId123",
  "branchId": "branchId123",
  "attendanceDate": "2024-12-20",
  "checkInTime": "2024-12-20T09:00:00Z",
  "attendanceStatus": "present"
}
```

#### Test 2.2: Get All Attendance Records
```bash
GET http://localhost:5000/api/attendance?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 2.3: Get Attendance by Date Range
```bash
GET http://localhost:5000/api/attendance?startDate=2024-12-01&endDate=2024-12-31
Authorization: Bearer <your_token>
```

#### Test 2.4: Get Attendance Statistics
```bash
GET http://localhost:5000/api/attendance/stats
Authorization: Bearer <your_token>
```

**✅ Attendance Module Tests Complete**

---

### Module 3: Membership Module ✅

#### Test 3.1: Create Membership Plan
```bash
POST http://localhost:5000/api/membership-plans
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "planName": "Gold Membership",
  "planDescription": "Premium membership with all facilities",
  "planDuration": 365,
  "planPrice": 10000,
  "planFeatures": ["Gym Access", "Personal Trainer", "Diet Plan"],
  "planStatus": "active"
}
```

#### Test 3.2: Get All Membership Plans
```bash
GET http://localhost:5000/api/membership-plans?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 3.3: Create Membership
```bash
POST http://localhost:5000/api/memberships
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "userId": "userId123",
  "planId": "planId123",
  "startDate": "2024-12-20",
  "paymentStatus": "paid",
  "paymentMethod": "card"
}
```

#### Test 3.4: Get All Memberships
```bash
GET http://localhost:5000/api/memberships?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 3.5: Renew Membership
```bash
POST http://localhost:5000/api/memberships/:id/renew
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "planId": "planId123",
  "paymentMethod": "card"
}
```

**✅ Membership Module Tests Complete**

---

### Module 4: Workout Module ✅

#### Test 4.1: Create Workout Plan
```bash
POST http://localhost:5000/api/workouts
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "planName": "Beginner Full Body Workout",
  "description": "Complete workout plan for beginners",
  "difficultyLevel": "beginner",
  "durationWeeks": 8,
  "exercises": [
    {
      "exerciseName": "Push-ups",
      "sets": 3,
      "reps": 10,
      "restTime": 60
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

#### Test 4.2: Get All Workout Plans
```bash
GET http://localhost:5000/api/workouts?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 4.3: Assign Workout to Member
```bash
POST http://localhost:5000/api/workouts/:id/assign
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "memberId": "userId123",
  "startDate": "2024-12-20"
}
```

#### Test 4.4: Get Workout Statistics
```bash
GET http://localhost:5000/api/workouts/stats
Authorization: Bearer <your_token>
```

**✅ Workout Module Tests Complete**

---

### Module 5: Diet Module ✅

#### Test 5.1: Create Diet Plan
```bash
POST http://localhost:5000/api/diets
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "planName": "Weight Loss Diet Plan",
  "description": "Healthy diet plan for weight loss",
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
      "fats": 10
    },
    {
      "mealType": "lunch",
      "mealName": "Grilled Chicken Salad",
      "calories": 500,
      "protein": 40,
      "carbs": 30,
      "fats": 20
    }
  ]
}
```

#### Test 5.2: Get All Diet Plans
```bash
GET http://localhost:5000/api/diets?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 5.3: Assign Diet to Member
```bash
POST http://localhost:5000/api/diets/:id/assign
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "memberId": "userId123",
  "startDate": "2024-12-20"
}
```

#### Test 5.4: Get Diet Statistics
```bash
GET http://localhost:5000/api/diets/stats
Authorization: Bearer <your_token>
```

**✅ Diet Module Tests Complete**

---

### Module 6: Schedule Module ✅

#### Test 6.1: Create Class Schedule
```bash
POST http://localhost:5000/api/schedules
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "className": "Morning Yoga",
  "classDescription": "Relaxing yoga session",
  "trainerId": "trainerId123",
  "branchId": "branchId123",
  "startTime": "2024-12-21T06:00:00Z",
  "endTime": "2024-12-21T07:00:00Z",
  "capacity": 20,
  "classType": "yoga"
}
```

#### Test 6.2: Get All Schedules
```bash
GET http://localhost:5000/api/schedules?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 6.3: Book a Class
```bash
POST http://localhost:5000/api/schedules/:id/book
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "memberId": "userId123"
}
```

#### Test 6.4: Check Availability
```bash
GET http://localhost:5000/api/schedules/:id/availability
Authorization: Bearer <your_token>
```

#### Test 6.5: Get Schedule Statistics
```bash
GET http://localhost:5000/api/schedules/stats
Authorization: Bearer <your_token>
```

**✅ Schedule Module Tests Complete**

---

### Module 7: Trainer Module ✅

#### Test 7.1: Create Trainer
```bash
POST http://localhost:5000/api/trainers
Authorization: Bearer <your_token>
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

#### Test 7.2: Get All Trainers
```bash
GET http://localhost:5000/api/trainers?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 7.3: Assign Members to Trainer
```bash
POST http://localhost:5000/api/trainers/:id/assign-members
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "memberIds": ["userId123", "userId456"]
}
```

#### Test 7.4: Update Trainer Availability
```bash
PUT http://localhost:5000/api/trainers/:id/availability
Authorization: Bearer <your_token>
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

#### Test 7.5: Get Trainer Statistics
```bash
GET http://localhost:5000/api/trainers/stats
Authorization: Bearer <your_token>
```

**✅ Trainer Module Tests Complete**

---

### Module 8: Support Module ✅

#### Test 8.1: Create Support Ticket
```bash
POST http://localhost:5000/api/support
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "ticketTitle": "Payment Issue",
  "ticketDescription": "Unable to process payment for membership renewal",
  "ticketCategory": "payment",
  "priorityLevel": "high"
}
```

#### Test 8.2: Get All Support Tickets
```bash
GET http://localhost:5000/api/support?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 8.3: Assign Ticket
```bash
PUT http://localhost:5000/api/support/:id
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "assignedTo": "adminId123",
  "ticketStatus": "in-progress"
}
```

#### Test 8.4: Add Resolution Notes
```bash
PUT http://localhost:5000/api/support/:id
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "resolutionNotes": "Payment gateway issue resolved. Membership renewed successfully.",
  "ticketStatus": "resolved"
}
```

#### Test 8.5: Get Support Statistics
```bash
GET http://localhost:5000/api/support/stats
Authorization: Bearer <your_token>
```

**✅ Support Module Tests Complete**

---

### Module 9: Settings Module ✅

#### Test 9.1: Get System Settings
```bash
GET http://localhost:5000/api/settings
Authorization: Bearer <your_token>
```

#### Test 9.2: Update System Settings
```bash
PUT http://localhost:5000/api/settings
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "applicationName": "FitZone Pro",
  "primaryTheme": "#FF6B6B",
  "secondaryTheme": "#4ECDC4",
  "sidebarStyle": "expanded",
  "dashboardLayout": "modern"
}
```

#### Test 9.3: Get Theme Settings
```bash
GET http://localhost:5000/api/settings/theme
Authorization: Bearer <your_token>
```

#### Test 9.4: Update Theme Settings
```bash
PUT http://localhost:5000/api/settings/theme
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "primaryTheme": "#3498db",
  "secondaryTheme": "#2ecc71",
  "sidebarStyle": "compact"
}
```

#### Test 9.5: Get Role Permissions
```bash
GET http://localhost:5000/api/settings/permissions
Authorization: Bearer <your_token>
```

**✅ Settings Module Tests Complete**

---

### Module 10: Integrations Module ✅

#### Test 10.1: Get Integration Settings
```bash
GET http://localhost:5000/api/integrations
Authorization: Bearer <your_token>
```

#### Test 10.2: Update Email Integration
```bash
PUT http://localhost:5000/api/integrations
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "emailProvider": "gmail",
  "emailConfig": {
    "apiKey": "your_gmail_api_key",
    "senderEmail": "noreply@fitzone.com",
    "senderName": "FitZone"
  }
}
```

#### Test 10.3: Test Email Integration
```bash
POST http://localhost:5000/api/integrations/test-email
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "to": "test@example.com",
  "subject": "Test Email from FitZone",
  "body": "This is a test email to verify email integration."
}
```

#### Test 10.4: Update SMS Integration
```bash
PUT http://localhost:5000/api/integrations
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "smsProvider": "twilio",
  "smsConfig": {
    "apiKey": "your_twilio_api_key",
    "senderId": "FITZONE"
  }
}
```

#### Test 10.5: Test SMS Integration
```bash
POST http://localhost:5000/api/integrations/test-sms
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "to": "+919876543210",
  "message": "Test SMS from FitZone"
}
```

#### Test 10.6: Update Payment Integration
```bash
PUT http://localhost:5000/api/integrations
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "paymentGateway": "stripe",
  "paymentConfig": {
    "apiKey": "your_stripe_secret_key",
    "publicKey": "your_stripe_public_key"
  }
}
```

#### Test 10.7: Test Payment Integration
```bash
POST http://localhost:5000/api/integrations/test-payment
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "amount": 100,
  "currency": "INR"
}
```

**✅ Integrations Module Tests Complete**

---

### Module 11: Data Management Module ✅

#### Test 11.1: Create Manual Backup
```bash
POST http://localhost:5000/api/data/backup
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "backupType": "manual"
}
```

#### Test 11.2: Get All Backups
```bash
GET http://localhost:5000/api/data/backups?page=1&limit=10
Authorization: Bearer <your_token>
```

#### Test 11.3: Export Users to CSV
```bash
POST http://localhost:5000/api/data/export
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "collection": "users",
  "format": "csv",
  "filters": {
    "membershipStatus": "active"
  }
}
```

#### Test 11.4: Export Trainers to JSON
```bash
POST http://localhost:5000/api/data/export
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "collection": "trainers",
  "format": "json",
  "filters": {
    "trainerStatus": "active"
  }
}
```

#### Test 11.5: Get Data Statistics
```bash
GET http://localhost:5000/api/data/stats
Authorization: Bearer <your_token>
```

#### Test 11.6: Cleanup Old Backups
```bash
POST http://localhost:5000/api/data/cleanup
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "retentionDays": 30
}
```

#### Test 11.7: Delete Specific Backup
```bash
DELETE http://localhost:5000/api/data/backups/:id
Authorization: Bearer <your_token>
```

**✅ Data Management Module Tests Complete**

---

## ✅ Testing Checklist

### Authentication ✅
- [x] SuperAdmin login
- [x] Token generation
- [x] Token validation

### Communication Module ✅
- [x] Create notification
- [x] Get notifications
- [x] Create announcement
- [x] Send message

### Attendance Module ✅
- [x] Mark attendance
- [x] Get attendance records
- [x] Filter by date range
- [x] Get statistics

### Membership Module ✅
- [x] Create membership plan
- [x] Get membership plans
- [x] Create membership
- [x] Renew membership

### Workout Module ✅
- [x] Create workout plan
- [x] Get workout plans
- [x] Assign workout
- [x] Get statistics

### Diet Module ✅
- [x] Create diet plan
- [x] Get diet plans
- [x] Assign diet
- [x] Get statistics

### Schedule Module ✅
- [x] Create schedule
- [x] Get schedules
- [x] Book class
- [x] Check availability

### Trainer Module ✅
- [x] Create trainer
- [x] Get trainers
- [x] Assign members
- [x] Update availability

### Support Module ✅
- [x] Create ticket
- [x] Get tickets
- [x] Assign ticket
- [x] Add resolution

### Settings Module ✅
- [x] Get settings
- [x] Update settings
- [x] Update theme
- [x] Get permissions

### Integrations Module ✅
- [x] Get integrations
- [x] Update email config
- [x] Test email
- [x] Test SMS
- [x] Test payment

### Data Management Module ✅
- [x] Create backup
- [x] Get backups
- [x] Export data
- [x] Get statistics
- [x] Cleanup backups

---

## 🎯 Expected Results

### All Tests Should Return:
- ✅ Status code 200/201 for success
- ✅ JSON response with `success: true`
- ✅ Proper data structure
- ✅ No server errors

### Common Success Response Format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Common Error Response Format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Check if token is valid and included in Authorization header

### Issue: 403 Forbidden
**Solution:** Verify user has SuperAdmin role

### Issue: 404 Not Found
**Solution:** Check if resource ID exists in database

### Issue: 500 Internal Server Error
**Solution:** Check server logs for detailed error message

### Issue: MongoDB Connection Error
**Solution:** Ensure MongoDB is running (`mongod`)

### Issue: Token Expired
**Solution:** Login again to get new token

---

## 📊 Testing Tools

### Recommended Tools:
1. **Postman** - API testing and collection management
2. **cURL** - Command-line testing
3. **REST Client** - VS Code extension
4. **Insomnia** - Alternative to Postman
5. **Thunder Client** - VS Code extension

### Postman Collections Available:
- `backend/postman_collection.json` - Main collection
- `backend/COMMUNICATION_POSTMAN_COLLECTION.json` - Communication module

---

## 🎉 Completion

Once all tests pass:
1. ✅ All 11 modules are working correctly
2. ✅ Authentication is functioning
3. ✅ Database operations are successful
4. ✅ API responses are consistent
5. ✅ Error handling is working

**Status: READY FOR PRODUCTION** 🚀

---

## 📞 Support

For issues or questions:
- Check module documentation
- Review API endpoint examples
- Verify environment configuration
- Check server logs
- Test with Postman collections

---

**Testing Guide Version:** 1.0.0  
**Last Updated:** December 2024  
**Status:** Complete ✅

**Happy Testing! 🧪**

# Engagement & Communication Module - Complete Guide

## 📋 Overview

The Engagement & Communication Module provides comprehensive functionality for Super Admins to manage notifications, announcements, and direct messages within the FitZone gym management system.

## 🗂️ Module Structure

```
backend/
├── models/
│   ├── Notification.js      ✅ Complete
│   ├── Announcement.js      ✅ Complete
│   └── Message.js           ✅ Complete
├── controllers/
│   └── communicationController.js  ✅ Complete
└── routes/
    └── communicationRoutes.js      ✅ Complete
```

## 🔐 Authentication & Authorization

**All routes require:**
- JWT Authentication (Bearer token)
- Super Admin role

**Headers Required:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

---

## 📢 NOTIFICATIONS API

### 1. Get All Notifications
**Endpoint:** `GET /api/superadmin/communication/notifications`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `type` (optional): info, warning, success, alert, all
- `recipientType` (optional): all, users, trainers, admins, branches, specific
- `status` (optional): pending, sent, failed
- `sortBy` (optional, default: createdAt)
- `sortOrder` (optional, default: desc)

**Example Request:**
```bash
GET /api/superadmin/communication/notifications?page=1&limit=10&type=info&status=sent
```

**Example Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": {
    "notifications": [
      {
        "id": "6745abc123def456",
        "title": "System Maintenance",
        "message": "Scheduled maintenance on Sunday",
        "type": "info",
        "recipientType": "all",
        "status": "sent",
        "priority": "high",
        "readCount": 45,
        "createdAt": "2026-05-07T10:00:00.000Z"
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
      "sent": 120,
      "pending": 20,
      "failed": 10
    }
  }
}
```

### 2. Get Single Notification
**Endpoint:** `GET /api/superadmin/communication/notifications/:id`

**Example Request:**
```bash
GET /api/superadmin/communication/notifications/6745abc123def456
```

### 3. Create Notification
**Endpoint:** `POST /api/superadmin/communication/notifications`

**Request Body:**
```json
{
  "title": "New Class Schedule",
  "message": "Yoga classes now available every morning at 6 AM",
  "type": "info",
  "recipientType": "users",
  "priority": "medium",
  "actionUrl": "/classes/yoga",
  "actionLabel": "View Schedule",
  "expiresAt": "2026-06-01T00:00:00.000Z"
}
```

**Recipient Types:**
- `all` - Send to everyone
- `users` - Send to all members
- `trainers` - Send to all trainers
- `admins` - Send to all admins
- `branches` - Send to specific branches (requires `branchIds` array)
- `specific` - Send to specific users (requires `recipientIds` array)

**Example for Specific Users:**
```json
{
  "title": "Membership Expiring Soon",
  "message": "Your membership expires in 7 days",
  "type": "warning",
  "recipientType": "specific",
  "recipientIds": ["6745abc123def456", "6745abc123def789"],
  "priority": "high"
}
```

**Example for Branches:**
```json
{
  "title": "Branch Closure Notice",
  "message": "Downtown branch closed for renovation",
  "type": "alert",
  "recipientType": "branches",
  "branchIds": ["6745abc123def456"],
  "priority": "urgent"
}
```

### 4. Update Notification
**Endpoint:** `PUT /api/superadmin/communication/notifications/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "message": "Updated message content",
  "type": "success",
  "priority": "high",
  "status": "sent"
}
```

### 5. Delete Notification
**Endpoint:** `DELETE /api/superadmin/communication/notifications/:id`

### 6. Mark Notification as Read
**Endpoint:** `PATCH /api/superadmin/communication/notifications/:id/read`

**Request Body:**
```json
{
  "userId": "6745abc123def456"
}
```

---

## 📣 ANNOUNCEMENTS API

### 1. Get All Announcements
**Endpoint:** `GET /api/superadmin/communication/announcements`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `status` (optional): draft, published, archived, expired
- `category` (optional): general, event, maintenance, promotion, policy, emergency
- `targetAudience` (optional): all, members, trainers, staff, admins, specific-branch
- `isPinned` (optional): true, false
- `sortBy` (optional, default: publishDate)
- `sortOrder` (optional, default: desc)

**Example Request:**
```bash
GET /api/superadmin/communication/announcements?status=published&category=event&isPinned=true
```

**Example Response:**
```json
{
  "success": true,
  "message": "Announcements retrieved successfully",
  "data": {
    "announcements": [
      {
        "id": "6745abc123def456",
        "title": "Summer Fitness Challenge",
        "description": "Join our 30-day fitness challenge...",
        "targetAudience": "all",
        "publishDate": "2026-05-01T00:00:00.000Z",
        "expiryDate": "2026-06-30T23:59:59.000Z",
        "priority": "high",
        "status": "published",
        "category": "event",
        "isPinned": true,
        "viewCount": 250,
        "tags": ["fitness", "challenge", "summer"],
        "createdAt": "2026-04-25T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalCount": 30,
      "perPage": 10
    },
    "stats": {
      "total": 100,
      "published": 45,
      "draft": 30,
      "archived": 20,
      "pinned": 5
    }
  }
}
```

### 2. Get Single Announcement
**Endpoint:** `GET /api/superadmin/communication/announcements/:id`

### 3. Create Announcement
**Endpoint:** `POST /api/superadmin/communication/announcements`

**Request Body:**
```json
{
  "title": "New Equipment Arrival",
  "description": "We've added state-of-the-art cardio machines to all branches. Come check them out!",
  "targetAudience": "all",
  "publishDate": "2026-05-10T00:00:00.000Z",
  "expiryDate": "2026-05-31T23:59:59.000Z",
  "priority": "medium",
  "category": "general",
  "isPinned": false,
  "tags": ["equipment", "cardio", "upgrade"],
  "status": "draft"
}
```

**Target Audiences:**
- `all` - All users
- `members` - Only members
- `trainers` - Only trainers
- `staff` - Only staff
- `admins` - Only admins
- `specific-branch` - Specific branches (requires `targetBranches` array)

**Example for Specific Branches:**
```json
{
  "title": "Branch-Specific Event",
  "description": "Special yoga workshop at downtown location",
  "targetAudience": "specific-branch",
  "targetBranches": ["6745abc123def456", "6745abc123def789"],
  "publishDate": "2026-05-15T00:00:00.000Z",
  "priority": "high",
  "category": "event",
  "status": "published"
}
```

### 4. Update Announcement
**Endpoint:** `PUT /api/superadmin/communication/announcements/:id`

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "priority": "high",
  "isPinned": true,
  "status": "published"
}
```

### 5. Delete Announcement
**Endpoint:** `DELETE /api/superadmin/communication/announcements/:id`

### 6. Publish Announcement
**Endpoint:** `PATCH /api/superadmin/communication/announcements/:id/publish`

**Note:** Automatically sets status to "published" and updates publishDate if needed.

### 7. Archive Announcement
**Endpoint:** `PATCH /api/superadmin/communication/announcements/:id/archive`

**Note:** Sets status to "archived".

---

## 💬 MESSAGES API

### 1. Get All Messages
**Endpoint:** `GET /api/superadmin/communication/messages`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 20)
- `type` (optional): all, inbox, sent
- `readStatus` (optional): true, false
- `priority` (optional): low, normal, high, urgent
- `sortBy` (optional, default: sentAt)
- `sortOrder` (optional, default: desc)

**Example Request:**
```bash
GET /api/superadmin/communication/messages?type=inbox&readStatus=false
```

**Example Response:**
```json
{
  "success": true,
  "message": "Messages retrieved successfully",
  "data": {
    "messages": [
      {
        "id": "6745abc123def456",
        "senderId": "6745abc123def111",
        "receiverId": "6745abc123def222",
        "subject": "Membership Inquiry",
        "message": "I have a question about upgrading my membership...",
        "messageType": "text",
        "readStatus": false,
        "priority": "normal",
        "status": "sent",
        "sentAt": "2026-05-07T09:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 50,
      "perPage": 10
    },
    "unreadCount": 12
  }
}
```

### 2. Get Single Message
**Endpoint:** `GET /api/superadmin/communication/messages/:id`

### 3. Send Message
**Endpoint:** `POST /api/superadmin/communication/messages`

**Request Body:**
```json
{
  "receiverId": "6745abc123def456",
  "subject": "Membership Renewal Reminder",
  "message": "Your membership is expiring soon. Please renew to continue enjoying our services.",
  "messageType": "notification",
  "priority": "high",
  "attachments": [
    {
      "fileName": "renewal_form.pdf",
      "fileUrl": "https://example.com/files/renewal_form.pdf",
      "fileType": "application/pdf",
      "fileSize": 245678
    }
  ]
}
```

**Message Types:**
- `text` - Regular text message
- `notification` - System notification
- `alert` - Important alert
- `reminder` - Reminder message

**Priority Levels:**
- `low` - Low priority
- `normal` - Normal priority (default)
- `high` - High priority
- `urgent` - Urgent message

### 4. Mark Message as Read
**Endpoint:** `PATCH /api/superadmin/communication/messages/:id/read`

### 5. Delete Message
**Endpoint:** `DELETE /api/superadmin/communication/messages/:id`

**Note:** This is a soft delete. The message is marked as deleted for the user but not removed from the database.

### 6. Get Conversation
**Endpoint:** `GET /api/superadmin/communication/messages/conversation/:userId`

**Example Request:**
```bash
GET /api/superadmin/communication/messages/conversation/6745abc123def456
```

**Response:** Returns all messages between the super admin and the specified user.

---

## 📊 STATISTICS API

### Get Communication Statistics
**Endpoint:** `GET /api/superadmin/communication/stats`

**Example Response:**
```json
{
  "success": true,
  "message": "Communication statistics retrieved successfully",
  "data": {
    "notifications": {
      "total": 150,
      "sent": 120,
      "pending": 20,
      "failed": 10
    },
    "announcements": {
      "total": 100,
      "published": 45,
      "draft": 30,
      "archived": 20,
      "pinned": 5
    },
    "messages": {
      "total": 500,
      "sent": 450,
      "read": 380,
      "unread": 70
    }
  }
}
```

---

## 🧪 Testing Guide

### Prerequisites
1. Start the backend server: `npm start` or `npm run dev`
2. Obtain a Super Admin JWT token by logging in
3. Use Postman, Thunder Client, or curl for testing

### Step 1: Login as Super Admin
```bash
POST http://localhost:5000/api/superadmin/auth/login
Content-Type: application/json

{
  "email": "superadmin@fitzone.com",
  "password": "your_password"
}
```

**Save the token from the response.**

### Step 2: Test Notifications

**Create a notification for all users:**
```bash
POST http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Welcome to FitZone",
  "message": "Thank you for joining our fitness community!",
  "type": "success",
  "recipientType": "all",
  "priority": "medium"
}
```

**Get all notifications:**
```bash
GET http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <your_token>
```

### Step 3: Test Announcements

**Create an announcement:**
```bash
POST http://localhost:5000/api/superadmin/communication/announcements
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Summer Fitness Challenge",
  "description": "Join our 30-day fitness challenge starting June 1st!",
  "targetAudience": "all",
  "publishDate": "2026-06-01T00:00:00.000Z",
  "priority": "high",
  "category": "event",
  "isPinned": true,
  "tags": ["fitness", "challenge"],
  "status": "published"
}
```

**Get all announcements:**
```bash
GET http://localhost:5000/api/superadmin/communication/announcements?status=published
Authorization: Bearer <your_token>
```

### Step 4: Test Messages

**Send a message to a user:**
```bash
POST http://localhost:5000/api/superadmin/communication/messages
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "receiverId": "<user_id>",
  "subject": "Welcome Message",
  "message": "Welcome to FitZone! We're excited to have you.",
  "messageType": "text",
  "priority": "normal"
}
```

**Get inbox:**
```bash
GET http://localhost:5000/api/superadmin/communication/messages?type=inbox
Authorization: Bearer <your_token>
```

### Step 5: Test Statistics

**Get communication stats:**
```bash
GET http://localhost:5000/api/superadmin/communication/stats
Authorization: Bearer <your_token>
```

---

## 🔍 Common Use Cases

### Use Case 1: Send Urgent Notification to All Users
```json
POST /api/superadmin/communication/notifications
{
  "title": "Emergency Closure",
  "message": "All branches closed today due to severe weather",
  "type": "alert",
  "recipientType": "all",
  "priority": "urgent",
  "expiresAt": "2026-05-08T23:59:59.000Z"
}
```

### Use Case 2: Create Pinned Announcement for Event
```json
POST /api/superadmin/communication/announcements
{
  "title": "Annual Fitness Expo",
  "description": "Join us for our biggest event of the year!",
  "targetAudience": "all",
  "publishDate": "2026-05-10T00:00:00.000Z",
  "expiryDate": "2026-05-20T23:59:59.000Z",
  "priority": "high",
  "category": "event",
  "isPinned": true,
  "status": "published"
}
```

### Use Case 3: Send Membership Renewal Reminder
```json
POST /api/superadmin/communication/messages
{
  "receiverId": "<user_id>",
  "subject": "Membership Renewal",
  "message": "Your membership expires in 7 days. Renew now to avoid interruption.",
  "messageType": "reminder",
  "priority": "high"
}
```

### Use Case 4: Notify Specific Branch About Maintenance
```json
POST /api/superadmin/communication/notifications
{
  "title": "Scheduled Maintenance",
  "message": "Pool maintenance scheduled for this weekend",
  "type": "info",
  "recipientType": "branches",
  "branchIds": ["<branch_id>"],
  "priority": "medium"
}
```

---

## ⚠️ Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Please provide title, message, and recipient type",
  "errors": null
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized, no token provided",
  "errors": null
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Role 'member' is not authorized to access this resource",
  "errors": null
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Notification not found",
  "errors": null
}
```

---

## 🎯 Features Summary

### ✅ Notifications
- Create, read, update, delete notifications
- Support for multiple recipient types (all, users, trainers, admins, branches, specific)
- Priority levels (low, medium, high, urgent)
- Notification types (info, warning, success, alert)
- Read tracking
- Expiration dates
- Action buttons with URLs

### ✅ Announcements
- Create, read, update, delete announcements
- Draft, publish, archive workflow
- Target specific audiences
- Pin important announcements
- Categories (general, event, maintenance, promotion, policy, emergency)
- View count tracking
- Tags for organization
- Scheduled publishing
- Expiration dates

### ✅ Messages
- Direct messaging between super admin and users
- Inbox and sent message views
- Read/unread status
- Message priorities
- Attachments support
- Conversation threads
- Reply functionality
- Soft delete

### ✅ Security
- JWT authentication required
- Super admin role authorization
- Protected routes
- Input validation
- Error handling

---

## 📝 Notes

1. **All routes require authentication** - Include the JWT token in the Authorization header
2. **Super Admin only** - Only users with the 'superadmin' role can access these endpoints
3. **Pagination** - Most list endpoints support pagination with `page` and `limit` parameters
4. **Filtering** - Use query parameters to filter results
5. **Sorting** - Use `sortBy` and `sortOrder` parameters to customize result ordering
6. **Soft Deletes** - Messages use soft delete (marked as deleted but not removed)
7. **Timestamps** - All models include automatic `createdAt` and `updatedAt` timestamps

---

## 🚀 Next Steps

The Engagement & Communication Module is **fully implemented and ready to use**. You can now:

1. Test all endpoints using Postman or similar tools
2. Integrate with the frontend Super Admin Dashboard
3. Add additional features as needed
4. Monitor communication statistics

---

## 📞 Support

For questions or issues with the Communication Module, refer to:
- `backend/models/` - Model schemas and methods
- `backend/controllers/communicationController.js` - Business logic
- `backend/routes/communicationRoutes.js` - API endpoints
- `backend/middleware/` - Authentication and authorization

**Module Status:** ✅ **COMPLETE**

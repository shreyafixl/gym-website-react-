# Communication Module - Quick Test Reference

## 🔑 Authentication Setup

```bash
# 1. Login as Super Admin
POST http://localhost:5000/api/superadmin/auth/login
Content-Type: application/json

{
  "email": "superadmin@fitzone.com",
  "password": "your_password"
}

# Save the token from response
```

---

## 📢 NOTIFICATIONS - Quick Tests

### Create Notification (All Users)
```bash
POST http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "System Update",
  "message": "New features available now!",
  "type": "info",
  "recipientType": "all",
  "priority": "medium"
}
```

### Create Notification (Specific Users)
```bash
POST http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Membership Expiring",
  "message": "Your membership expires in 7 days",
  "type": "warning",
  "recipientType": "specific",
  "recipientIds": ["USER_ID_1", "USER_ID_2"],
  "priority": "high"
}
```

### Get All Notifications
```bash
GET http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <token>
```

### Get Notifications (Filtered)
```bash
GET http://localhost:5000/api/superadmin/communication/notifications?type=warning&status=sent&page=1&limit=10
Authorization: Bearer <token>
```

---

## 📣 ANNOUNCEMENTS - Quick Tests

### Create Announcement (Draft)
```bash
POST http://localhost:5000/api/superadmin/communication/announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Summer Fitness Challenge",
  "description": "Join our 30-day fitness challenge starting June 1st! Win amazing prizes.",
  "targetAudience": "all",
  "publishDate": "2026-06-01T00:00:00.000Z",
  "expiryDate": "2026-06-30T23:59:59.000Z",
  "priority": "high",
  "category": "event",
  "isPinned": false,
  "tags": ["fitness", "challenge", "summer"],
  "status": "draft"
}
```

### Publish Announcement
```bash
PATCH http://localhost:5000/api/superadmin/communication/announcements/ANNOUNCEMENT_ID/publish
Authorization: Bearer <token>
```

### Get All Announcements
```bash
GET http://localhost:5000/api/superadmin/communication/announcements
Authorization: Bearer <token>
```

### Get Published Announcements
```bash
GET http://localhost:5000/api/superadmin/communication/announcements?status=published&isPinned=true
Authorization: Bearer <token>
```

---

## 💬 MESSAGES - Quick Tests

### Send Message to User
```bash
POST http://localhost:5000/api/superadmin/communication/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "USER_ID",
  "subject": "Welcome to FitZone",
  "message": "Thank you for joining! We're excited to help you achieve your fitness goals.",
  "messageType": "text",
  "priority": "normal"
}
```

### Send Urgent Message with Attachment
```bash
POST http://localhost:5000/api/superadmin/communication/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "USER_ID",
  "subject": "Important: Membership Renewal",
  "message": "Please review the attached renewal form.",
  "messageType": "notification",
  "priority": "urgent",
  "attachments": [
    {
      "fileName": "renewal_form.pdf",
      "fileUrl": "https://example.com/files/renewal.pdf",
      "fileType": "application/pdf",
      "fileSize": 245678
    }
  ]
}
```

### Get Inbox
```bash
GET http://localhost:5000/api/superadmin/communication/messages?type=inbox
Authorization: Bearer <token>
```

### Get Unread Messages
```bash
GET http://localhost:5000/api/superadmin/communication/messages?type=inbox&readStatus=false
Authorization: Bearer <token>
```

### Get Conversation with User
```bash
GET http://localhost:5000/api/superadmin/communication/messages/conversation/USER_ID
Authorization: Bearer <token>
```

### Mark Message as Read
```bash
PATCH http://localhost:5000/api/superadmin/communication/messages/MESSAGE_ID/read
Authorization: Bearer <token>
```

---

## 📊 STATISTICS - Quick Test

### Get All Communication Stats
```bash
GET http://localhost:5000/api/superadmin/communication/stats
Authorization: Bearer <token>
```

---

## 🎯 Common Scenarios

### Scenario 1: Emergency Alert to All
```bash
POST http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "URGENT: Facility Closure",
  "message": "All branches closed today due to emergency maintenance",
  "type": "alert",
  "recipientType": "all",
  "priority": "urgent",
  "expiresAt": "2026-05-08T23:59:59.000Z"
}
```

### Scenario 2: Branch-Specific Announcement
```bash
POST http://localhost:5000/api/superadmin/communication/announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Equipment at Downtown Branch",
  "description": "Check out our new cardio machines!",
  "targetAudience": "specific-branch",
  "targetBranches": ["BRANCH_ID"],
  "publishDate": "2026-05-10T00:00:00.000Z",
  "priority": "medium",
  "category": "general",
  "status": "published"
}
```

### Scenario 3: Trainer-Only Notification
```bash
POST http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Trainer Meeting",
  "message": "Mandatory training session this Friday at 3 PM",
  "type": "info",
  "recipientType": "trainers",
  "priority": "high",
  "actionUrl": "/calendar/event/123",
  "actionLabel": "Add to Calendar"
}
```

---

## 🔍 Query Parameters Reference

### Notifications
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `type` - info, warning, success, alert, all
- `recipientType` - all, users, trainers, admins, branches, specific
- `status` - pending, sent, failed
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - asc, desc (default: desc)

### Announcements
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - draft, published, archived, expired, all
- `category` - general, event, maintenance, promotion, policy, emergency, all
- `targetAudience` - all, members, trainers, staff, admins, specific-branch
- `isPinned` - true, false
- `sortBy` - Field to sort by (default: publishDate)
- `sortOrder` - asc, desc (default: desc)

### Messages
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `type` - all, inbox, sent
- `readStatus` - true, false
- `priority` - low, normal, high, urgent, all
- `sortBy` - Field to sort by (default: sentAt)
- `sortOrder` - asc, desc (default: desc)

---

## ✅ Testing Checklist

### Notifications
- [ ] Create notification for all users
- [ ] Create notification for specific users
- [ ] Create notification for trainers only
- [ ] Create notification for specific branches
- [ ] Get all notifications
- [ ] Get single notification by ID
- [ ] Update notification
- [ ] Delete notification
- [ ] Mark notification as read
- [ ] Filter notifications by type
- [ ] Filter notifications by status

### Announcements
- [ ] Create draft announcement
- [ ] Create published announcement
- [ ] Get all announcements
- [ ] Get single announcement by ID
- [ ] Update announcement
- [ ] Delete announcement
- [ ] Publish announcement
- [ ] Archive announcement
- [ ] Create pinned announcement
- [ ] Filter announcements by status
- [ ] Filter announcements by category

### Messages
- [ ] Send message to user
- [ ] Send message with attachment
- [ ] Get inbox messages
- [ ] Get sent messages
- [ ] Get unread messages
- [ ] Get single message by ID
- [ ] Mark message as read
- [ ] Delete message
- [ ] Get conversation with user
- [ ] Send reply to message

### Statistics
- [ ] Get communication statistics
- [ ] Verify notification counts
- [ ] Verify announcement counts
- [ ] Verify message counts

---

## 🚨 Error Testing

### Test Invalid Token
```bash
GET http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer invalid_token
# Expected: 401 Unauthorized
```

### Test Missing Required Fields
```bash
POST http://localhost:5000/api/superadmin/communication/notifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Test"
  # Missing message and recipientType
}
# Expected: 400 Bad Request
```

### Test Non-Existent Resource
```bash
GET http://localhost:5000/api/superadmin/communication/notifications/invalid_id
Authorization: Bearer <token>
# Expected: 404 Not Found
```

---

## 📝 Notes

- Replace `<token>` with your actual JWT token
- Replace `USER_ID`, `BRANCH_ID`, `ANNOUNCEMENT_ID`, `MESSAGE_ID` with actual IDs
- Base URL: `http://localhost:5000` (adjust if different)
- All timestamps should be in ISO 8601 format
- File sizes in attachments should be in bytes

---

## ✅ Module Status: COMPLETE

All endpoints are implemented and ready for testing!

# Attendance Module - Quick Test Reference

## 🔑 Authentication Setup

```bash
# Login as Super Admin
POST http://localhost:5000/api/superadmin/auth/login
Content-Type: application/json

{
  "email": "superadmin@fitzone.com",
  "password": "your_password"
}

# Save the token from response
```

---

## 📝 Quick Test Commands

### 1. Check-in Member
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

### 2. Check-out Member
```bash
PATCH http://localhost:5000/api/attendance/<attendance_id>/checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "checkOutTime": "2026-05-07T10:30:00.000Z"
}
```

### 3. Get Today's Attendance
```bash
GET http://localhost:5000/api/attendance/today
Authorization: Bearer <token>
```

### 4. Get All Attendance (with filters)
```bash
GET http://localhost:5000/api/attendance?page=1&limit=10&startDate=2026-05-01&endDate=2026-05-07
Authorization: Bearer <token>
```

### 5. Get Member History
```bash
GET http://localhost:5000/api/attendance/member/<member_id>?limit=30
Authorization: Bearer <token>
```

### 6. Get Branch Attendance
```bash
GET http://localhost:5000/api/attendance/branch/<branch_id>?date=2026-05-07
Authorization: Bearer <token>
```

### 7. Get Statistics
```bash
GET http://localhost:5000/api/attendance/stats/overview
Authorization: Bearer <token>
```

### 8. Get Single Attendance
```bash
GET http://localhost:5000/api/attendance/<attendance_id>
Authorization: Bearer <token>
```

### 9. Update Attendance
```bash
PUT http://localhost:5000/api/attendance/<attendance_id>
Authorization: Bearer <token>
Content-Type: application/json

{
  "attendanceStatus": "late",
  "notes": "Arrived 15 minutes late"
}
```

### 10. Delete Attendance
```bash
DELETE http://localhost:5000/api/attendance/<attendance_id>
Authorization: Bearer <token>
```

---

## 🎯 Common Scenarios

### Scenario 1: Member Check-in at Branch
```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "6745abc123",
  "branchId": "6745def456",
  "trainerId": "6745ghi789",
  "attendanceStatus": "present",
  "notes": "Morning workout session"
}
```

### Scenario 2: Late Check-in
```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "6745abc123",
  "branchId": "6745def456",
  "attendanceStatus": "late",
  "notes": "Arrived 20 minutes late"
}
```

### Scenario 3: Mark Absence
```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "6745abc123",
  "branchId": "6745def456",
  "attendanceStatus": "absent",
  "notes": "Did not show up for scheduled session"
}
```

### Scenario 4: Get Weekly Attendance
```bash
GET http://localhost:5000/api/attendance?startDate=2026-05-01&endDate=2026-05-07&branchId=6745def456
Authorization: Bearer <token>
```

### Scenario 5: Get Member's Last 30 Days
```bash
GET http://localhost:5000/api/attendance/member/6745abc123?limit=30&startDate=2026-04-07
Authorization: Bearer <token>
```

---

## 🔍 Query Parameters Reference

### Get All Attendance
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `memberId` - Filter by member ID
- `trainerId` - Filter by trainer ID
- `branchId` - Filter by branch ID
- `status` - Filter by status: present, absent, late, leave, all
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)
- `sortBy` - Field to sort by (default: attendanceDate)
- `sortOrder` - asc or desc (default: desc)

### Get Member History
- `limit` - Number of records (default: 30)
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)

### Get Branch Attendance
- `date` - Specific date (YYYY-MM-DD)
- `status` - Filter by status

### Get Today's Attendance
- `branchId` - Filter by branch ID

### Get Statistics
- `branchId` - Filter by branch ID
- `startDate` - Filter from date (YYYY-MM-DD)
- `endDate` - Filter to date (YYYY-MM-DD)

---

## ✅ Testing Checklist

### Basic Operations
- [ ] Check-in member
- [ ] Check-out member
- [ ] Get single attendance record
- [ ] Update attendance record
- [ ] Delete attendance record

### Filtering & Search
- [ ] Get all attendance with pagination
- [ ] Filter by member ID
- [ ] Filter by branch ID
- [ ] Filter by trainer ID
- [ ] Filter by status
- [ ] Filter by date range

### History & Reports
- [ ] Get member attendance history
- [ ] Get branch attendance
- [ ] Get today's attendance
- [ ] Get attendance statistics

### Edge Cases
- [ ] Check-in same member twice (should fail)
- [ ] Check-out without check-in (should fail)
- [ ] Invalid member ID (should fail)
- [ ] Invalid branch ID (should fail)
- [ ] Unauthorized access (should fail)

### Statistics
- [ ] Get overall statistics
- [ ] Get daily trend
- [ ] Get branch-wise stats
- [ ] Get average duration

---

## 🚨 Error Testing

### Test Invalid Token
```bash
GET http://localhost:5000/api/attendance
Authorization: Bearer invalid_token
# Expected: 401 Unauthorized
```

### Test Missing Required Fields
```bash
POST http://localhost:5000/api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "6745abc123"
  # Missing branchId
}
# Expected: 400 Bad Request
```

### Test Duplicate Check-in
```bash
# First check-in
POST http://localhost:5000/api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "6745abc123",
  "branchId": "6745def456"
}

# Second check-in (same day, same branch)
POST http://localhost:5000/api/attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberId": "6745abc123",
  "branchId": "6745def456"
}
# Expected: 409 Conflict
```

### Test Non-Existent Resource
```bash
GET http://localhost:5000/api/attendance/invalid_id
Authorization: Bearer <token>
# Expected: 404 Not Found
```

---

## 📝 Notes

- Replace `<token>` with your actual JWT token
- Replace `<member_id>`, `<branch_id>`, `<trainer_id>`, `<attendance_id>` with actual IDs
- Base URL: `http://localhost:5000` (adjust if different)
- All timestamps should be in ISO 8601 format
- Duration is automatically calculated in minutes

---

## ✅ Module Status: COMPLETE

All endpoints are implemented and ready for testing!

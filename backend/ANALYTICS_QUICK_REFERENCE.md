# 📊 Analytics & Reporting Module - Quick Reference

## 🚀 Quick Start

### Get Auth Token
```bash
curl -X POST http://localhost:5000/api/superadmin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fitzone.com","password":"Admin@123456"}'
```

---

## 📈 Dashboard Analytics (5 Endpoints)

### 1. Dashboard Overview
```bash
GET /api/superadmin/analytics/dashboard
```
Returns: Total users, memberships, subscriptions, revenue, recent activity

### 2. User Growth
```bash
GET /api/superadmin/analytics/user-growth?period=monthly&year=2026
```
Query: `period` (daily/weekly/monthly), `year`

### 3. Attendance Stats
```bash
GET /api/superadmin/analytics/attendance?startDate=2026-05-01&endDate=2026-05-07
```
Query: `startDate`, `endDate`, `branchId`

### 4. Branch Analytics
```bash
GET /api/superadmin/analytics/branches
```
Returns: Branch-wise metrics, revenue, occupancy

### 5. Trainer Performance
```bash
GET /api/superadmin/analytics/trainers
```
Returns: Assigned members, retention rate, performance metrics

---

## 📋 Reports (5 Endpoints)

### 1. Financial Report
```bash
GET /api/superadmin/analytics/reports/financial?startDate=2026-01-01&endDate=2026-12-31
```
Query: `startDate`, `endDate`, `branchId`, `type`

### 2. Attendance Report
```bash
GET /api/superadmin/analytics/reports/attendance?branchId=BRANCH_ID
```
Query: `startDate`, `endDate`, `branchId`

### 3. Membership Report
```bash
GET /api/superadmin/analytics/reports/membership?status=active
```
Query: `status`, `planId`, `branchId`

### 4. Trainer Report
```bash
GET /api/superadmin/analytics/reports/trainers?branchId=BRANCH_ID
```
Query: `branchId`

### 5. Branch Performance Report
```bash
GET /api/superadmin/analytics/reports/branches?status=active
```
Query: `status`

---

## 🔑 Key Features

### Dashboard Analytics
- ✅ Real-time statistics
- ✅ Revenue tracking (total, monthly, yearly)
- ✅ Membership status breakdown
- ✅ User growth trends
- ✅ Attendance patterns
- ✅ Branch comparison
- ✅ Trainer performance

### Reports
- ✅ Financial breakdown by payment method and type
- ✅ Attendance tracking with date ranges
- ✅ Membership status and plan analysis
- ✅ Trainer effectiveness with member lists
- ✅ Branch performance with full metrics
- ✅ Export-ready JSON format
- ✅ Top 100 records for large datasets

---

## 📊 Response Structure

### Dashboard Stats Response
```json
{
  "success": true,
  "data": {
    "overview": { totalUsers, totalTrainers, totalMembers, totalBranches, totalPlans },
    "memberships": { active, expired, pending, total, activePercentage },
    "subscriptions": { total, active, cancelled },
    "revenue": { total, monthly, yearly, currency },
    "recentActivity": { newUsersLast30Days, newSubscriptionsLast30Days }
  }
}
```

### Report Response
```json
{
  "success": true,
  "data": {
    "summary": { ... },
    "breakdown": { ... },
    "report": [ ... ]
  }
}
```

---

## 🎯 Common Use Cases

### Get Dashboard Overview
```bash
curl -X GET http://localhost:5000/api/superadmin/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Track Monthly Revenue
```bash
curl -X GET "http://localhost:5000/api/superadmin/analytics/reports/financial?startDate=2026-05-01&endDate=2026-05-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Compare Branch Performance
```bash
curl -X GET http://localhost:5000/api/superadmin/analytics/branches \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Check Trainer Effectiveness
```bash
curl -X GET http://localhost:5000/api/superadmin/analytics/trainers \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Generate Attendance Report
```bash
curl -X GET "http://localhost:5000/api/superadmin/analytics/reports/attendance?startDate=2026-05-01&endDate=2026-05-07" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔒 Security

- ✅ All routes require JWT authentication
- ✅ Super admin role required
- ✅ Token in Authorization header: `Bearer YOUR_TOKEN`

---

## 📝 Query Parameters

### Date Filters
- `startDate`: YYYY-MM-DD format
- `endDate`: YYYY-MM-DD format

### Entity Filters
- `branchId`: MongoDB ObjectId
- `planId`: MongoDB ObjectId
- `userId`: MongoDB ObjectId

### Status Filters
- `status`: active, expired, cancelled, pending, all
- `type`: membership, renewal, upgrade, refund, other, all
- `period`: daily, weekly, monthly

---

## ✅ Testing Checklist

- [ ] Dashboard stats returns all metrics
- [ ] User growth shows trends
- [ ] Attendance stats calculates correctly
- [ ] Branch analytics compares all branches
- [ ] Trainer performance shows retention rates
- [ ] Financial report breaks down by payment method
- [ ] Attendance report filters by date range
- [ ] Membership report groups by status
- [ ] Trainer report lists assigned members
- [ ] Branch report shows full metrics

---

## 🚨 Common Errors

### 401 Unauthorized
- Missing or invalid token
- Token expired

### 403 Forbidden
- Not super admin role

### 500 Internal Server Error
- Database connection issue
- Invalid query parameters

---

**For detailed documentation, see:** `ANALYTICS_MODULE_COMPLETE.md`  
**For testing guide, see:** `ANALYTICS_TESTING_GUIDE.md`

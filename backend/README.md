# FitZone Super Admin Backend API

Backend API server for the FitZone Super Admin Dashboard built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   - Set `MONGODB_URI` to your MongoDB connection string
   - Set `JWT_SECRET` and `JWT_REFRESH_SECRET` to secure random strings
   - Configure other settings as needed

4. **Start the server:**
   
   **Development mode (with auto-reload):**
   ```bash
   npm run dev
   ```
   
   **Production mode:**
   ```bash
   npm start
   ```

5. **Verify server is running:**
   
   Open browser and visit: `http://localhost:5000/health`
   
   You should see:
   ```json
   {
     "success": true,
     "message": "FitZone Super Admin API is running",
     "timestamp": "2026-05-07T10:30:00.000Z",
     "environment": "development"
   }
   ```

## 📁 Project Structure

```
backend/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   └── constants.js     # Application constants
├── controllers/         # Route controllers (business logic)
├── middleware/          # Custom middleware
│   ├── errorHandler.js  # Global error handler
│   └── notFound.js      # 404 handler
├── models/              # Mongoose models (database schemas)
├── routes/              # API routes
├── services/            # Business logic services
├── utils/               # Utility functions
│   ├── ApiError.js      # Custom error class
│   ├── ApiResponse.js   # Response formatter
│   └── asyncHandler.js  # Async wrapper
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies and scripts
├── README.md           # This file
└── server.js           # Application entry point
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## 🌐 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Health Check
```
GET /health
```

### API Info
```
GET /api
```

### Module Endpoints (To be implemented)
- `/api/superadmin/auth` - Authentication & Authorization
- `/api/superadmin/users` - User Management
- `/api/superadmin/branches` - Branch Management
- `/api/superadmin/financial` - Financial Management
- `/api/superadmin/analytics` - Analytics & Reporting

## 🔐 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/fitzone_superadmin |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `JWT_EXPIRE` | Access token expiry | 1h |
| `JWT_REFRESH_EXPIRE` | Refresh token expiry | 7d |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |

## 📦 Dependencies

### Core Dependencies
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **helmet** - Security headers
- **morgan** - HTTP request logger
- **compression** - Response compression

### Dev Dependencies
- **nodemon** - Auto-reload during development

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt, helmet, cors
- **Validation:** express-validator

## 📝 Next Steps

The backend is now set up with the basic structure. The following modules will be implemented step-by-step:

1. ✅ **Initial Setup** (COMPLETED)
   - Folder structure
   - Express server
   - MongoDB connection
   - Middleware configuration

2. ⏳ **Authentication Module** (NEXT)
   - Super Admin model
   - Login/logout endpoints
   - JWT token generation
   - Session management
   - 2FA support

3. ⏳ **User Management Module**
4. ⏳ **Branch Management Module**
5. ⏳ **Financial Management Module**
6. ⏳ **Analytics & Reporting Module**

## 🤝 Contributing

This is a step-by-step implementation. Each module will be added incrementally with proper testing and documentation.

## 📄 License

ISC

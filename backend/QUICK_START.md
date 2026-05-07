# 🚀 Quick Start Guide

## Installation & Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

**Edit `.env` and set these required variables:**
```env
MONGODB_URI=mongodb://localhost:27017/fitzone_superadmin
JWT_SECRET=your_secret_key_min_32_characters_long
JWT_REFRESH_SECRET=your_refresh_secret_min_32_characters
```

### 3. Start MongoDB
```bash
# Make sure MongoDB is running
mongod
```

### 4. Start Server
```bash
npm run dev
```

### 5. Test
```bash
curl http://localhost:5000/health
```

---

## 📡 Available Endpoints

### Health Check
```bash
GET http://localhost:5000/health
```

### API Info
```bash
GET http://localhost:5000/api
```

---

## 🔧 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server (auto-reload) |

---

## 📂 Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
└── server.js        # Entry point
```

---

## 🐛 Troubleshooting

### Server won't start
- Check if MongoDB is running
- Verify `.env` file exists and is configured
- Check if port 5000 is available

### MongoDB connection error
- Ensure MongoDB service is running
- Verify `MONGODB_URI` in `.env`
- Check MongoDB is accessible

### Port already in use
- Change `PORT` in `.env` file
- Or kill process using port 5000

---

## ✅ Next Steps

1. ✅ Initial setup complete
2. ⏳ Implement Authentication module
3. ⏳ Implement User Management module
4. ⏳ Implement Branch Management module
5. ⏳ Implement Financial Management module

---

**Need help?** Check `README.md` or `SETUP_GUIDE.md` for detailed documentation.

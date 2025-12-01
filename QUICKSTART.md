# Quick Start Guide

## 🚀 Quick Setup

### 1. Backend Setup (Terminal 1)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend will run on: http://localhost:8000

### 2. Frontend Setup (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on: http://localhost:3000

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API Docs**: http://localhost:8000/docs
- **Backend Health Check**: http://localhost:8000/health

## 📋 What to Expect

1. **Landing Page** (`/`): Beautiful hero section with feature cards
2. **Dashboard** (`/dashboard`): KPIs, charts, and analytics
3. **Documents** (`/documents`): Browse and analyze compliance documents
4. **Alerts** (`/alerts`): Real-time safety alerts with severity indicators

## 🎯 Key Features to Try

- Click "Analyze" on any document to see AI-powered analysis
- Click "Generate Alerts" to create new alerts from operational logs
- Watch the animated counters on the dashboard
- Use search and filters on the documents page
- Observe pulsing animations on HIGH severity alerts

## ⚠️ Troubleshooting

### Backend Issues
- Ensure Python 3.11+ is installed: `python --version`
- If port 8000 is in use, change it: `--port 8001`

### Frontend Issues
- Ensure Node.js 18+ is installed: `node --version`
- Clear cache: `rm -rf node_modules .next && npm install`
- If port 3000 is in use, Next.js will automatically use 3001

### CORS Issues
- Ensure backend is running before frontend
- Check that backend CORS allows `http://localhost:3000`

## 📚 Next Steps

- Read the full [README.md](./README.md) for detailed documentation
- Explore the API at http://localhost:8000/docs
- Check out the code structure in the project folders


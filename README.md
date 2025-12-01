# AI Compliance Monitoring System

A complete, production-ready prototype demonstrating AI-powered regulatory compliance monitoring, safety analysis, and real-time alerts using NLP and analytics.

## 🎯 Overview

This project showcases an end-to-end solution for automated compliance monitoring with:
- **AI-driven document analysis** using NLP (mocked)
- **Real-time safety monitoring** with threshold detection
- **Intelligent alert generation** based on operational logs
- **Beautiful, animated dashboard** with comprehensive analytics
- **Modern, responsive UI** with glassmorphism effects and smooth animations

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.11+
- **Models**: Pydantic v2
- **Architecture**: Modular router structure with dependency injection
- **Data Storage**: In-memory JSON datasets
- **Services**: Mocked NLP and analytics services
- **Testing**: pytest with async support

### Frontend (Next.js 14)
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn/UI
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React

## 📁 Project Structure

```
demo/
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application entry point
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── documents.py    # Document analysis endpoints
│   │   │       ├── alerts.py       # Alert management endpoints
│   │   │       └── analytics.py    # Compliance analytics endpoints
│   │   ├── core/
│   │   │   └── config.py           # Application configuration
│   │   ├── models/
│   │   │   ├── document.py         # Document Pydantic models
│   │   │   └── alert.py            # Alert Pydantic models
│   │   ├── services/
│   │   │   ├── nlp_service.py      # Mock NLP service
│   │   │   └── analytics_service.py # Mock analytics service
│   │   └── data/
│   │       ├── sample_documents.json      # Sample compliance documents
│   │       └── operational_logs.json      # Sample operational metrics
│   ├── tests/
│   │   ├── test_documents.py       # Document API tests
│   │   └── test_alerts.py          # Alert API tests
│   └── requirements.txt            # Python dependencies
│
└── frontend/
    ├── app/
    │   ├── layout.tsx              # Root layout
    │   ├── page.tsx                # Landing page
    │   ├── dashboard/
    │   │   └── page.tsx            # Dashboard page
    │   ├── documents/
    │   │   └── page.tsx            # Documents page
    │   └── alerts/
    │       └── page.tsx            # Alerts page
    ├── components/
    │   ├── ui/                     # Shadcn/UI components
    │   ├── cards/                  # Custom card components
    │   └── charts/                 # Chart components
    ├── lib/
    │   ├── api.ts                  # API client
    │   ├── hooks.ts                # React Query hooks
    │   └── utils.ts                # Utility functions
    ├── styles/
    │   └── globals.css             # Global styles
    └── package.json                # Node dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** and npm/yarn
- **Git**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`
- Alternative docs: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`

### Running Tests

Backend tests:
```bash
cd backend
pytest
```

## 📡 API Endpoints

### Documents

- `GET /api/v1/documents/` - Get all documents
- `GET /api/v1/documents/{id}` - Get a specific document
- `POST /api/v1/documents/analyze?document_id={id}` - Analyze a document using AI

### Alerts

- `GET /api/v1/alerts/` - Get all alerts
- `POST /api/v1/alerts/generate` - Generate new alerts from operational logs

### Analytics

- `GET /api/v1/analytics/trends?days=30` - Get compliance trends and metrics

## 🎨 Features

### Landing Page
- Animated gradient hero section
- Feature cards with hover animations
- Smooth page transitions
- Modern glassmorphism design

### Dashboard
- **KPI Cards**: Animated counters showing key metrics
- **Compliance Trend Chart**: Line chart showing compliance percentage over time
- **Violations by Category**: Pie chart visualization
- **Violations Timeline**: Bar chart showing violations and inspections
- Real-time data refresh using React Query

### Documents Page
- Animated document grid
- Search functionality
- Category filtering
- AI-powered document analysis with:
  - Compliance score
  - Risk level assessment
  - Extracted rules
  - Detected inconsistencies
- Modal drawer for analysis results

### Alerts Page
- Real-time alerts timeline
- Severity-based color coding
- Pulsing animations for HIGH/CRITICAL alerts
- Auto-refresh every 30 seconds
- Manual alert generation

## 🧩 Reusable Components

### UI Components (Shadcn/UI)
- `Button` - Styled button with variants
- `Card` - Glassmorphism card component
- `Badge` - Status badges
- `Input` - Form input field
- `Skeleton` - Loading skeleton

### Custom Components
- `AnimatedNumber` - Animated counter with easing
- `AlertBadge` - Severity badge with icons and pulsing
- `ComplianceChart` - Multi-chart component (Line, Bar, Pie)
- `DashboardGrid` - KPI cards grid
- `LoadingSkeleton` - Full page loading state

## 📊 Data Models

### Document
```json
{
  "id": "DOC-1001",
  "title": "Environmental Compliance Standard 2024",
  "body": "All facilities must maintain emissions under 20 ppm...",
  "category": "Environmental",
  "published_at": "2024-02-01"
}
```

### Alert
```json
{
  "alert_id": "ALERT-52",
  "type": "ThresholdExceeded",
  "message": "Air emissions exceeded safe limits.",
  "severity": "HIGH",
  "timestamp": "2024-04-12T13:22:00Z"
}
```

### Operational Log
```json
{
  "id": "LOG-201",
  "metric": "Air Emissions",
  "value": 27,
  "threshold": 20,
  "timestamp": "2024-04-12T13:20:00Z",
  "facility": "Plant A",
  "unit": "ppm"
}
```

## 🧠 AI Services (Mocked)

### NLP Service
The `NLPService` provides mocked NLP functionality:
- **Rule Extraction**: Extracts compliance rules from document text
- **Inconsistency Detection**: Identifies potential issues in documents
- **Compliance Scoring**: Calculates a compliance score (0-100)
- **Risk Assessment**: Determines risk level (LOW, MEDIUM, HIGH)

### Analytics Service
The `AnalyticsService` provides mocked analytics:
- **Historical Averages**: Calculates metric averages over time
- **Threshold Detection**: Identifies threshold deviations
- **Trend Analysis**: Generates compliance trends
- **Safety Metrics**: Computes safety statistics

## 🎨 Design System

### Colors
- Primary: Blue (#3b82f6)
- Success: Green (#10b981)
- Warning: Orange/Yellow (#f59e0b)
- Danger: Red (#ef4444)
- Purple: (#8b5cf6)

### Animations
- Page transitions: Fade + slide
- Card hover: Scale + shadow
- Number counters: Eased animation
- Alert badges: Pulsing for high severity

### Glassmorphism
- Backdrop blur effects
- Semi-transparent backgrounds
- Subtle borders
- Applied to cards and navigation

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest tests/
```

Test coverage includes:
- Document API endpoints
- Alert generation
- Error handling

## 📝 Environment Variables

### Backend
Create a `.env` file in the `backend/` directory (optional):
```
DEBUG=true
API_V1_PREFIX=/api/v1
```

### Frontend
Create a `.env.local` file in the `frontend/` directory (optional):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Backend
1. Set up a Python environment on your server
2. Install dependencies: `pip install -r requirements.txt`
3. Run with a production ASGI server:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend
1. Build the production bundle:
```bash
npm run build
```
2. Start the production server:
```bash
npm start
```

## 🔧 Development

### Adding New Endpoints
1. Create a new router in `backend/app/api/v1/`
2. Add models in `backend/app/models/`
3. Create services in `backend/app/services/`
4. Register router in `backend/app/main.py`

### Adding New Components
1. Create component in `frontend/components/`
2. Add to appropriate page
3. Use React Query hooks from `frontend/lib/hooks.ts`

## 📚 Tech Stack

### Backend
- FastAPI 0.104.1
- Pydantic 2.5.0
- Uvicorn 0.24.0
- pytest 7.4.3

### Frontend
- Next.js 14.0.4
- React 18.2.0
- TypeScript 5.3.3
- TailwindCSS 3.4.0
- Framer Motion 10.16.16
- Recharts 2.10.3
- TanStack Query 5.12.2
- Lucide React 0.294.0

## 🎯 Future Enhancements

- [ ] Real NLP integration (spaCy, transformers)
- [ ] Database integration (PostgreSQL)
- [ ] Authentication & authorization
- [ ] Real-time WebSocket updates
- [ ] Advanced analytics dashboard
- [ ] Document upload functionality
- [ ] Export reports (PDF, CSV)
- [ ] Email notifications
- [ ] Mobile app

## 📄 License

This is a prototype/demo project for demonstration purposes.

## 👥 Contributing

This is a demonstration project. For production use, consider:
- Adding proper error handling
- Implementing authentication
- Connecting to a real database
- Integrating actual NLP services
- Adding comprehensive tests
- Setting up CI/CD pipelines

## 📸 Screenshots

*Note: Add screenshots of your application here*

- Landing page with animated hero
- Dashboard with KPIs and charts
- Documents page with search and filters
- Alerts page with timeline

---

Built with ❤️ using FastAPI and Next.js


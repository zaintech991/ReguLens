# ReguLens Application Workflow

## Overview
ReguLens is an AI-powered regulatory compliance monitoring system that automates document analysis, operational monitoring, and alert generation using synthetic data and real AI processing.

## Complete Workflow

### 1. **Data Generation Phase** (Synthetic Data Creation)

**Location**: `backend/app/services/synthetic_data_generator.py`

**Process**:
1. User clicks "Run AI Pipeline" or "Generate & Process Data" button
2. Frontend calls: `POST /api/v1/processing/generate-data`
3. Backend generates:
   - **Compliance Documents** (10 by default):
     - Uses category-specific templates (Environmental, Safety, Data Privacy, Financial, etc.)
     - Includes realistic thresholds, requirements, and dates
     - Example: "Air Quality Standards Compliance" with emission thresholds
   - **Operational Logs** (50 by default):
     - Sensor readings (Air Emissions, Water Quality, Temperature, Pressure, etc.)
     - Includes facility names, metrics, values, thresholds
     - Some logs intentionally exceed thresholds (15% chance) for realism
4. Data is saved to JSON files:
   - `backend/app/data/sample_documents.json`
   - `backend/app/data/operational_logs.json`

**Example Generated Document**:
```json
{
  "id": "DOC-1001",
  "title": "Air Quality Standards Compliance",
  "body": "All facilities must maintain air emissions below 20 ppm...",
  "category": "Environmental",
  "published_at": "2024-02-01"
}
```

**Example Generated Log**:
```json
{
  "id": "LOG-201",
  "facility": "Plant A",
  "metric": "Air Emissions",
  "value": 27.5,
  "unit": "ppm",
  "threshold": 20,
  "status": "EXCEEDED"
}
```

---

### 2. **Document Analysis Phase** (AI-Powered NLP)

**Location**: `backend/app/services/nlp_service.py`

**Process**:
1. User clicks "Analyze" on a document OR runs full pipeline
2. Frontend calls: `POST /api/v1/processing/analyze-documents` or `POST /api/v1/documents/analyze`
3. For each document, the NLP service:
   
   **Option A: With Groq AI (if API key configured)**
   - Sends document text to Groq LLM (Llama 3.1 model)
   - AI extracts compliance rules using natural language understanding
   - AI detects inconsistencies and ambiguities
   - Example AI prompt: "Extract all compliance rules from this Environmental document..."
   
   **Option B: Fallback Pattern Matching (if no Groq)**
   - Uses regex patterns to find compliance rules
   - Patterns like: "must maintain", "required to", "shall"
   - Basic inconsistency detection based on document structure

4. Calculates compliance score:
   - Base score: 90%
   - Deducts points for inconsistencies
   - Adds bonus for clear rules and document detail
   - Final score: 0-100%

5. Determines risk level:
   - HIGH: Score < 50 or > 3 inconsistencies
   - MEDIUM: Score < 75 or > 1 inconsistency
   - LOW: Otherwise

6. Returns analysis result:
```json
{
  "document_id": "DOC-1001",
  "extracted_rules": [
    "Maintain air emissions below 20 ppm",
    "Conduct weekly calibration of monitoring equipment"
  ],
  "inconsistencies": [
    "Mixed use of mandatory and advisory language"
  ],
  "compliance_score": 87.5,
  "risk_level": "LOW",
  "analyzed_at": "2024-04-15T10:30:00"
}
```

---

### 3. **Alert Generation Phase** (Threshold Monitoring)

**Location**: `backend/app/services/processing_pipeline.py` → `generate_alerts_from_logs()`

**Process**:
1. User clicks "Generate Alerts from Logs" or runs full pipeline
2. Frontend calls: `POST /api/v1/processing/generate-alerts`
3. Backend:
   - Loads operational logs from `operational_logs.json`
   - Filters logs where `value > threshold` or `status == "EXCEEDED"`
   - For each exceedance:
     - Calculates exceedance percentage: `((value - threshold) / threshold) * 100`
     - Determines severity:
       - HIGH: > 30% exceedance
       - MEDIUM: > 15% exceedance
       - LOW: ≤ 15% exceedance
   - Creates Alert objects with:
     - Alert ID (sequential)
     - Type: "ThresholdExceeded"
     - Message: Descriptive text with values
     - Severity, timestamp, facility, metric

4. Returns alerts array:
```json
{
  "alert_id": "ALERT-1",
  "type": "ThresholdExceeded",
  "message": "Air Emissions exceeded threshold at Plant A. Value: 27.5 ppm, Threshold: 20 ppm",
  "severity": "HIGH",
  "timestamp": "2024-04-15T10:30:00Z",
  "facility": "Plant A",
  "metric": "Air Emissions"
}
```

---

### 4. **Full Pipeline Execution** (Automated Workflow)

**Location**: `backend/app/api/v1/processing.py` → `run_full_pipeline()`

**Process**:
1. User clicks "Run AI Pipeline" button on dashboard
2. Frontend calls: `POST /api/v1/processing/run-pipeline?generate_new_data=true&document_count=10&log_count=50`
3. Backend executes in sequence:
   
   **Step 1: Generate Synthetic Data** (if `generate_new_data=true`)
   - Creates documents and logs
   - Saves to JSON files
   
   **Step 2: Analyze All Documents**
   - Loads all documents from JSON
   - Processes each through NLP service
   - Returns array of analyses
   
   **Step 3: Generate Alerts**
   - Loads operational logs
   - Creates alerts for threshold exceedances
   - Returns array of alerts

4. Returns comprehensive result:
```json
{
  "success": true,
  "message": "Pipeline completed successfully",
  "timestamp": "2024-04-15T10:30:00",
  "data_generation": {
    "documents_generated": 10,
    "logs_generated": 50
  },
  "documents_analyzed": 10,
  "alerts_generated": 8,
  "analyses": [...],
  "alerts": [...]
}
```

---

### 5. **Frontend Display & Interaction**

**Dashboard Page** (`frontend/app/dashboard/page.tsx`):
1. On load, fetches:
   - Documents: `GET /api/v1/documents/`
   - Alerts: `GET /api/v1/alerts/`
   - Compliance Trends: `GET /api/v1/analytics/trends?days=30`
2. Displays:
   - KPI cards (Average Compliance, Violations, Alerts, Documents)
   - Large charts (Compliance Trend, Violations by Category, Violations Over Time)
   - Widgets (Health Score Gauge, Risk Heatmap, Recent Activity)
3. User can click "Run AI Pipeline" to trigger full workflow
4. After processing, data refreshes automatically

**Documents Page** (`frontend/app/documents/page.tsx`):
1. Displays all documents in a grid
2. User can:
   - Search/filter documents
   - Click "Analyze" on individual documents
   - Click "Generate & Process Data" to create new documents
3. Analysis results shown in modal with:
   - Compliance score
   - Risk level
   - Extracted rules
   - Detected inconsistencies

**Alerts Page** (`frontend/app/alerts/page.tsx`):
1. Displays all alerts sorted by severity
2. Shows:
   - Alert message
   - Severity badge (with pulsing animation for HIGH)
   - Timestamp (relative time)
   - Facility and metric info
3. User can:
   - Refresh alerts
   - Generate new alerts from logs

---

### 6. **Data Flow Diagram**

```
User Action (Click Button)
    ↓
Frontend API Call
    ↓
Backend Endpoint
    ↓
Processing Pipeline
    ├──→ Synthetic Data Generator
    │       └──→ Creates Documents & Logs
    │       └──→ Saves to JSON files
    │
    ├──→ NLP Service
    │       ├──→ Groq AI (if available)
    │       │   └──→ Extracts rules
    │       │   └──→ Detects inconsistencies
    │       └──→ Pattern Matching (fallback)
    │           └──→ Regex-based extraction
    │
    └──→ Alert Generator
            └──→ Processes logs
            └──→ Creates alerts for exceedances
    ↓
Results Returned to Frontend
    ↓
UI Updates (Charts, Cards, Lists)
    ↓
User Views Real-time Data
```

---

### 7. **Key Features**

**Synthetic Data Generation**:
- Realistic compliance documents with category-specific templates
- Operational logs with realistic sensor readings
- Configurable counts (documents, logs)
- Some logs intentionally exceed thresholds for testing

**AI-Powered Analysis**:
- Uses Groq LLM for intelligent document understanding
- Falls back to pattern matching if AI unavailable
- Extracts compliance rules automatically
- Detects inconsistencies and ambiguities
- Calculates compliance scores

**Real-time Monitoring**:
- Processes operational logs continuously
- Generates alerts for threshold exceedances
- Severity classification based on exceedance percentage
- Links alerts to facilities and metrics

**Automated Pipeline**:
- Single-click processing
- Generates data → Analyzes documents → Creates alerts
- Updates all dashboards automatically
- Provides comprehensive results

---

### 8. **API Endpoints Summary**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/processing/generate-data` | POST | Generate synthetic documents & logs |
| `/api/v1/processing/analyze-documents` | POST | Analyze all documents with AI |
| `/api/v1/processing/generate-alerts` | POST | Create alerts from operational logs |
| `/api/v1/processing/run-pipeline` | POST | Execute full automated pipeline |
| `/api/v1/documents/` | GET | Get all documents |
| `/api/v1/documents/{id}` | GET | Get specific document |
| `/api/v1/documents/analyze` | POST | Analyze single document |
| `/api/v1/alerts/` | GET | Get all alerts |
| `/api/v1/analytics/trends` | GET | Get compliance trends & analytics |

---

### 9. **Technology Stack**

**Backend**:
- FastAPI (Python web framework)
- Groq API (LLM for document analysis)
- JSON files (data storage)
- Python dataclasses (data models)

**Frontend**:
- Next.js 14 (React framework)
- React Query (data fetching & caching)
- Recharts (data visualization)
- Framer Motion (animations)
- TailwindCSS (styling)

---

## Example User Journey

1. **User opens Dashboard**
   - Sees empty or existing data
   - Views KPI cards and charts

2. **User clicks "Run AI Pipeline"**
   - Button shows "Processing..." state
   - Backend generates 10 documents and 50 logs
   - Backend analyzes all documents with AI
   - Backend creates alerts from log exceedances
   - Frontend refreshes all data

3. **User views results**
   - Dashboard shows updated metrics
   - Charts display new compliance trends
   - Alerts page shows new threshold violations
   - Documents page shows analyzed documents

4. **User clicks "Analyze" on a document**
   - Modal opens with AI analysis results
   - Shows extracted rules, score, risk level
   - Highlights any inconsistencies found

This workflow demonstrates a complete AI-powered compliance monitoring system with synthetic data generation, intelligent analysis, and real-time alerting.


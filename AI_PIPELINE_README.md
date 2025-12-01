# AI-Powered Compliance Monitoring System

## Overview

This system now includes a complete synthetic data generation pipeline with AI-powered document analysis using Groq LLM.

## Features

### 1. Synthetic Data Generation
- **Realistic Compliance Documents**: Automatically generates compliance documents across multiple categories (Environmental, Safety, Data Privacy, Financial, etc.)
- **Operational Logs**: Creates realistic sensor readings and operational metrics with threshold exceedances
- **Configurable**: Control the number of documents and logs generated

### 2. AI-Powered Document Analysis
- **Groq Integration**: Uses Groq's LLM API for intelligent document analysis
- **Rule Extraction**: Automatically extracts compliance rules from documents
- **Inconsistency Detection**: Identifies potential compliance issues and ambiguities
- **Fallback Mode**: Works without API key using pattern matching

### 3. Processing Pipeline
- **Automated Workflow**: Single-click processing that:
  1. Generates synthetic data
  2. Analyzes all documents with AI
  3. Generates alerts from operational logs
  4. Updates all dashboards

### 4. Frontend Integration
- **Process Buttons**: Added to Dashboard, Documents, and Alerts pages
- **Real-time Updates**: Automatically refreshes data after processing
- **Loading States**: Visual feedback during processing

## API Endpoints

### Processing Endpoints

- `POST /api/v1/processing/generate-data?document_count=10&log_count=50`
  - Generates synthetic documents and operational logs

- `POST /api/v1/processing/analyze-documents`
  - Analyzes all documents using AI

- `POST /api/v1/processing/generate-alerts`
  - Generates alerts from operational logs

- `POST /api/v1/processing/run-pipeline?generate_new_data=true&document_count=10&log_count=50`
  - Runs the complete pipeline

## Setup Instructions

1. **Install Dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Groq API (Optional but Recommended):**
   - Get API key from https://console.groq.com/
   - Create `.env` file in `backend/` directory:
     ```
     GROQ_API_KEY=your_api_key_here
     GROQ_MODEL=llama-3.1-70b-versatile
     ```
   - See `ENV_SETUP.md` for detailed instructions

3. **Run Backend:**
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

4. **Run Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Usage

### Generate and Process Data

1. **From Dashboard:**
   - Click "Run AI Pipeline" button
   - This generates new data, analyzes documents, and creates alerts

2. **From Documents Page:**
   - Click "Generate & Process Data" to create new documents and analyze them

3. **From Alerts Page:**
   - Click "Generate Alerts from Logs" to create alerts from operational logs

### Individual Document Analysis

- Click "Analyze" on any document card to get AI-powered analysis
- Results show:
  - Compliance score
  - Risk level
  - Extracted rules
  - Detected inconsistencies

## How It Works

1. **Synthetic Data Generator** creates realistic compliance documents with:
   - Category-specific templates
   - Variable thresholds and requirements
   - Realistic dates and metadata

2. **NLP Service** uses Groq LLM to:
   - Extract compliance rules from document text
   - Detect inconsistencies and ambiguities
   - Calculate compliance scores

3. **Processing Pipeline** orchestrates:
   - Data generation
   - Document analysis
   - Alert generation
   - Data persistence

4. **Frontend** provides:
   - One-click processing
   - Real-time updates
   - Visual feedback

## Technical Details

- **Backend**: FastAPI with async processing
- **AI**: Groq LLM API (Llama 3.1 70B model)
- **Data Storage**: JSON files (can be upgraded to database)
- **Frontend**: Next.js 14 with React Query for data fetching

## Notes

- Without Groq API key, the system falls back to pattern-based analysis
- All processing is synchronous (can be made async for production)
- Data is stored in JSON files in `backend/app/data/`
- Processing time depends on number of documents and Groq API response time


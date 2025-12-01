# Troubleshooting: 404 Error on Processing Endpoints

## Issue
Getting `404 Not Found` when calling `/api/v1/processing/run-pipeline`

## Solution

### 1. Restart the FastAPI Server
The most common cause is that the server needs to be restarted after adding new modules.

**Stop the server** (Ctrl+C) and restart it:
```bash
cd backend
uvicorn app.main:app --reload
```

### 2. Verify the Route is Registered
After restarting, check the API docs at:
- http://localhost:8000/docs

You should see the `/api/v1/processing/` endpoints listed under the "processing" tag.

### 3. Check for Import Errors
If the route still doesn't appear, check the server logs for import errors. Common issues:

- **Missing dependencies**: Make sure all packages are installed:
  ```bash
  pip install -r requirements.txt
  ```

- **Import errors**: Check if there are any Python syntax errors in:
  - `backend/app/api/v1/processing.py`
  - `backend/app/services/processing_pipeline.py`
  - `backend/app/services/nlp_service.py`
  - `backend/app/services/synthetic_data_generator.py`

### 4. Test the Route Directly
You can test if the route exists by checking the OpenAPI schema:
```bash
curl http://localhost:8000/openapi.json | grep -i processing
```

### 5. Verify the Route Path
The correct full path should be:
```
POST /api/v1/processing/run-pipeline
```

With query parameters:
- `generate_new_data=true`
- `document_count=10`
- `log_count=50`

### 6. Check Server Logs
Look for any error messages when the server starts, especially:
- Import errors
- Module not found errors
- Syntax errors

If you see errors about missing modules (like `groq`), install them:
```bash
pip install groq python-dotenv
```

## Quick Fix Checklist

- [ ] Server restarted after adding processing module
- [ ] All dependencies installed (`pip install -r requirements.txt`)
- [ ] No import errors in server logs
- [ ] Route appears in `/docs` endpoint
- [ ] Using correct URL: `/api/v1/processing/run-pipeline`


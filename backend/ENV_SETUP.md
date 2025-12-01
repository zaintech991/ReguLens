# Environment Configuration

## Groq API Setup

To enable AI-powered document analysis, you need to set up a Groq API key.

### Steps:

1. **Get a Groq API Key:**
   - Visit https://console.groq.com/
   - Sign up or log in
   - Navigate to API Keys section
   - Create a new API key

2. **Configure Environment Variable:**
   
   Create a `.env` file in the `backend/` directory:
   
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   GROQ_MODEL=llama-3.1-70b-versatile
   ```
   
   Or export it in your shell:
   ```bash
   export GROQ_API_KEY=your_groq_api_key_here
   export GROQ_MODEL=llama-3.1-70b-versatile
   ```

3. **Optional Models:**
   - `llama-3.1-70b-versatile` (default, recommended)
   - `llama-3.1-8b-instant` (faster, less accurate)
   - `mixtral-8x7b-32768` (alternative)

### Note:
If no Groq API key is provided, the system will fall back to rule-based pattern matching for document analysis. The AI-powered analysis will only work when a valid API key is configured.


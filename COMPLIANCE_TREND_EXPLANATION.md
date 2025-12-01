# Compliance Trend Chart - Data Explanation

## What Information is Shown?

The **Compliance Trend** chart displays three key metrics over time:

### 1. **Compliance Percentage** (Area Chart - Purple Gradient)
- **What it shows**: Average compliance score across all analyzed documents for each date
- **How it's calculated**: 
  - Analyzes all uploaded documents using AI (Groq LLM or pattern matching)
  - Calculates compliance score for each document (0-100%)
  - Groups documents by their `published_at` date
  - Averages the compliance scores for each date
- **Example**: If 3 documents were published on "2024-04-15" with scores of 85%, 90%, and 88%, the chart shows 87.67% for that date
- **What it means**: Higher percentage = better compliance. Lower percentage = more issues found

### 2. **Violations** (Bar Chart - Red)
- **What it shows**: Number of compliance violations (inconsistencies) found per date
- **How it's calculated**:
  - Counts the number of inconsistencies detected in each document analysis
  - Groups by document publication date
  - Sums up all inconsistencies for each date
- **Example**: If 2 documents on "2024-04-15" had 2 and 3 inconsistencies respectively, the chart shows 5 violations
- **What it means**: Lower is better. Zero violations = perfect compliance

### 3. **Inspections** (Bar Chart - Green)
- **What it shows**: Number of documents analyzed (inspected) per date
- **How it's calculated**:
  - Counts how many documents were published/uploaded on each date
  - Each document = 1 inspection
- **Example**: If 3 documents were uploaded on "2024-04-15", the chart shows 3 inspections
- **What it means**: Shows activity level - how many compliance documents were reviewed

## How Data is Generated (Before vs After Fix)

### ❌ **BEFORE (Hardcoded)**:
```python
# Mock data with repeating patterns
compliance_percentage = 85 + (i % 10) - 5  # Just cycles 80-90%
violations = max(0, 3 - (i % 5))  # Pattern: 3, 2, 1, 0, 0, 3...
violations_by_category = {
    "Environmental": 12,  # Always the same
    "Safety": 8,  # Always the same
    ...
}
```

### ✅ **AFTER (Real Data)**:
```python
# 1. Load all uploaded documents
documents = load_documents()

# 2. Analyze each document with AI
for document in documents:
    analysis = nlp_service.analyze_document(
        document_id=doc.id,
        text=document.body,
        category=document.category
    )
    # Gets REAL compliance score, REAL inconsistencies

# 3. Group by date and calculate metrics
- compliance_percentage = average of all document scores for that date
- violations = sum of all inconsistencies found in documents for that date
- inspections = count of documents for that date
- violations_by_category = count inconsistencies grouped by document category
```

## Data Flow

```
User Uploads Document
    ↓
Document Saved to JSON
    ↓
User Views Dashboard
    ↓
Frontend calls: GET /api/v1/analytics/trends
    ↓
Backend: AnalyticsService.generate_compliance_trends()
    ├──→ Loads all documents
    ├──→ Analyzes each document with AI
    ├──→ Extracts: compliance_score, inconsistencies_count, category
    ├──→ Groups by published_at date
    ├──→ Calculates averages and sums
    └──→ Returns real trend data
    ↓
Frontend displays in charts
```

## What Each Chart Shows

### **Area Chart (Top Left)**: Compliance Trend Over Time
- X-axis: Dates (last 30 days by default)
- Y-axis: Compliance Percentage (0-100%)
- Shows: How compliance scores change over time
- Gradient fill: Purple area showing the trend

### **Pie Chart (Top Right)**: Violations by Category
- Shows: Distribution of violations across different compliance categories
- Based on: Actual document categories and their inconsistencies
- Example: If Environmental documents have more issues, they show larger slice

### **Bar Chart (Bottom)**: Violations & Inspections Over Time
- Red bars: Number of violations per date
- Green bars: Number of inspections (documents analyzed) per date
- Shows: Activity level and problem frequency

## Key Improvements

1. **Real Compliance Scores**: Based on actual AI analysis of document content
2. **Real Violations**: Counted from actual inconsistencies detected by AI
3. **Real Categories**: Based on actual document categories uploaded
4. **Dynamic Updates**: Changes when new documents are uploaded
5. **No Mock Data**: Everything is calculated from real document analyses

## Example Scenario

**Day 1**: User uploads 2 documents
- Document A (Environmental): Score 85%, 2 inconsistencies
- Document B (Safety): Score 92%, 0 inconsistencies
- **Chart shows**: 88.5% compliance, 2 violations, 2 inspections

**Day 2**: User uploads 1 document
- Document C (Environmental): Score 78%, 4 inconsistencies
- **Chart shows**: 78% compliance, 4 violations, 1 inspection

**Violations by Category**:
- Environmental: 6 (from Document A + C)
- Safety: 0 (from Document B)

The chart now reflects **real data** from your uploaded documents!


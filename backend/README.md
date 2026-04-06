
# Healthcare Report Analysis API

AI-powered backend for analyzing medical reports. Combines OCR, Google Gemini AI, and machine learning to extract insights from medical test results.

## Architecture Flow

```
Upload Report (PDF/Image)
    ↓
OCR Extract Text (Tesseract)
    ↓
Gemini → Structured JSON (medical parameters)
    ↓
ML Model → Risk Scores (prediction)
    ↓
Gemini → Summary + Diet + Remedies + Medicines
    ↓
Store EVERYTHING in PostgreSQL as JSON
    ↓
Return report_id + fetch via REST APIs
```

All data is stored efficiently in a single database table with JSON fields, making retrieval fast and clean.

---

## Setup & Installation

### Prerequisites

- Python 3.8+
- PostgreSQL 12+ (running locally)
- Tesseract OCR installed
- Google Gemini API key

### 1. Install Tesseract OCR

**Windows:**
```powershell
# Using Chocolatey
choco install tesseract

# Or download from: https://github.com/UB-Mannheim/tesseract/wiki
```

**macOS:**
```bash
brew install tesseract
```

**Linux:**
```bash
sudo apt-get install tesseract-ocr
```

### 2. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE healthcare_reports;
ALTER DATABASE healthcare_reports OWNER TO postgres;

# Exit
\q
```

### 3. Clone and Setup Project

```powershell
cd "Sem 6 Mini Project"

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

### 4. Configure Environment

Copy `.env.template` to `.env` and fill in your credentials:

```bash
cp .env.template .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/healthcare_reports
GEMINI_API_KEY=your_gemini_api_key_here
ML_MODEL_PATH=./models/trained_model.pkl
```

### 5. Initialize Database

```powershell
python init_db.py
```

Expected output:
```
INFO:__main__:Starting database initialization...
INFO:__main__:✓ Database initialization completed successfully
```

### 6. Start the Server

```powershell
python app.py
```

Expected output:
```
============================================================
Healthcare Report Analysis API
============================================================
Environment: development
Debug: True
Database: postgresql://postgres:...
Upload folder: ./uploads
============================================================
Starting Flask development server...
API available at: http://localhost:5000
============================================================
```

---

## API Endpoints

### 1. Upload & Process Report
```http
POST /api/reports/upload

Content-Type: multipart/form-data
- file: Medical report (PDF/JPG/PNG)
- user_id (optional): User identifier
```

**Response (200):**
```json
{
  "report_id": 12,
  "message": "Report processed successfully"
}
```

---

### 2. Get Overview
```http
GET /api/reports/{id}/overview
```

**Response (200):**
```json
{
  "overall_risk_score": 68,
  "risk_level": "Medium",
  "risks": {
    "overall": 68,
    "diabetes": 78,
    "heart_disease": 55,
    "anemia": 12,
    "infection": 35
  },
  "key_findings": [
    "Elevated Glucose",
    "High LDL Cholesterol",
    "Elevated HbA1c"
  ],
  "ai_summary": "Your results indicate pre-diabetic blood sugar levels..."
}
```

---

### 3. Get Medical Parameters
```http
GET /api/reports/{id}/parameters
```

**Response (200):**
```json
{
  "parameters": [
    {
      "name": "Hemoglobin",
      "value": 13.5,
      "unit": "g/dL",
      "normal_range": "12-15.5",
      "status": "Normal"
    },
    {
      "name": "WBC",
      "value": 11.2,
      "unit": "thousand/mcL",
      "normal_range": "4.5-11",
      "status": "High"
    }
  ]
}
```

---

### 4. Get AI Summary
```http
GET /api/reports/{id}/ai-summary
```

**Response (200):**
```json
{
  "summary": "Your results indicate pre-diabetic blood sugar levels...",
  "root_causes": [
    "High sugar intake",
    "Sedentary lifestyle"
  ],
  "recommendations": [
    "Exercise daily",
    "Reduce sugar intake"
  ]
}
```

---

### 5. Get Recommendations
```http
GET /api/reports/{id}/recommendations
```

**Response (200):**
```json
{
  "home_remedies": [
    {
      "name": "Cinnamon Tea",
      "priority": "High"
    },
    {
      "name": "Fenugreek Seeds",
      "priority": "Medium"
    }
  ],
  "medications": [
    {
      "name": "Metformin",
      "priority": "High"
    }
  ],
  "lifestyle_changes": [
    "30 min walk daily",
    "Increase fiber intake",
    "Reduce refined carbs"
  ]
}
```

---

### 6. Get Diet Plan
```http
GET /api/reports/{id}/diet-plan
```

**Response (200):**
```json
{
  "calories": 1880,
  "protein": 101,
  "carbs": 193,
  "fiber": 36,
  "meals": {
    "breakfast": "Oatmeal with berries",
    "lunch": "Brown rice with vegetables",
    "dinner": "Grilled paneer with salad"
  }
}
```

---

### 7. Get Complete Report
```http
GET /api/reports/{id}
```

**Response (200):** Full report with all JSON data combined

---

### 8. Get All Reports
```http
GET /api/reports?limit=100
```

**Response (200):**
```json
[
  {
    "id": 12,
    "created_at": "2024-01-15T10:30:00",
    "overall_risk_score": 68,
    "file_url": "uploads/..."
  },
  ...
]
```

---

## Database Schema

Single table: `reports`

```sql
id              INTEGER PRIMARY KEY
user_id         INTEGER (optional)
file_url        TEXT
ocr_text        TEXT
structured_data JSONB  -- Medical parameters
risk_scores     JSONB  -- ML predictions
parameters      JSONB  -- Formatted parameters array
key_findings    JSONB  -- List of key health findings
ai_summary      JSONB  -- Gemini-generated summary
recommendations JSONB  -- Home remedies, medicines, lifestyle
diet_plan       JSONB  -- Personalized nutrition plan
created_at      TIMESTAMP
```

---

## Project Structure

```
.
├── app.py                      # Main Flask application
├── config.py                   # Configuration settings
├── models.py                   # SQLAlchemy ORM models
├── schemas.py                  # Pydantic validation schemas
├── init_db.py                  # Database initialization script
├── requirements.txt            # Python dependencies
├── .env.template              # Environment template
├── .gitignore                 # Git ignore rules
│
├── services/
│   ├── ocr_service.py         # Tesseract OCR extraction
│   ├── gemini_service.py      # Google Gemini AI integration
│   ├── ml_service.py          # ML model predictions
│   ├── database_service.py    # PostgreSQL CRUD operations
│   ├── report_service.py      # Orchestrator (main pipeline)
│   └── __init__.py
│
├── routes/
│   ├── reports.py             # 6 API endpoints
│   └── __init__.py
│
├── utils/
│   ├── file_handler.py        # File upload validation
│   └── __init__.py
│
└── uploads/                   # Stores uploaded files
```

---

## Testing the API

### Test Upload

```bash
curl -X POST http://localhost:5000/api/reports/upload \
  -F "file=@sample_report.pdf" \
  -F "user_id=1"
```

### Test Overview

```bash
# Replace 1 with actual report_id from upload response
curl http://localhost:5000/api/reports/1/overview
```

### Full Test Sequence

```powershell
# 1. Upload a report
$report = curl -X POST http://localhost:5000/api/reports/upload `
  -F "file=@sample_report.pdf" -F "user_id=1"

# Extract report_id
$reportId = ($report | ConvertFrom-Json).report_id

# 2. Get overview
curl http://localhost:5000/api/reports/$reportId/overview

# 3. Get parameters
curl http://localhost:5000/api/reports/$reportId/parameters

# 4. Get AI summary
curl http://localhost:5000/api/reports/$reportId/ai-summary

# 5. Get recommendations
curl http://localhost:5000/api/reports/$reportId/recommendations

# 6. Get diet plan
curl http://localhost:5000/api/reports/$reportId/diet-plan
```

---

## Key Features

✅ **OCR Extraction** — Converts PDF/image → text  
✅ **AI Structuring** — Gemini converts text → JSON medical data  
✅ **ML Predictions** — Pre-trained model → risk scores  
✅ **AI Recommendations** — Gemini generates summary, diet, remedies  
✅ **JSON Storage** — All data as JSONB in single table  
✅ **REST APIs** — 6 endpoints for different data views  
✅ **Error Handling** — Graceful fallbacks on API failures  
✅ **Modular Design** — Easy to extend and test  
✅ **Production-Ready** — Logging, validation, pooling  

---

## Troubleshooting

### Database Connection Error
```
Error: Failed to initialize database
```

**Solution:**
- Verify PostgreSQL is running: `psql -U postgres -c "SELECT 1"`
- Check .env DATABASE_URL is correct
- Run `python init_db.py` again

### Tesseract Not Found
```
Error: /usr/bin/tesseract: No such file or directory
```

**Solution:**
- Install Tesseract: See Prerequisites
- Set Tesseract path in config if needed

### Gemini API Error
```
Error: Gemini API call failed
```

**Solution:**
- Generate new Gemini API key from Google AI Studio
- Update GEMINI_API_KEY in .env
- Check API rate limits

### ML Model Not Found
```
Error: Model file not found
```

**Solution:**
- Place trained model in `models/trained_model.pkl`
- Or update ML_MODEL_PATH in .env
- System will use default scores if model missing

---

## Performance Notes

- **OCR:** 5-30 seconds (depends on PDF pages/image quality)
- **Gemini:** 3-5 seconds per call (3 calls total)
- **ML Prediction:** < 100ms
- **Total Processing:** ~15-20 seconds per report
- **Database:** JSONB queries are fast (indexed)

---

## Future Enhancements

- [ ] User authentication (JWT)
- [ ] Rate limiting per user
- [ ] Redis caching for repeated queries
- [ ] Batch processing for multiple files
- [ ] Email notifications
- [ ] Report comparison over time
- [ ] Advanced filtering and search
- [ ] Analytics dashboard
- [ ] Deployment to AWS/GCP

---

## License

Proprietary - Urvashi's Semester 6 Mini Project

---

## Support

For issues or questions, check logs in `logs/` directory (if configured).


# Quick Setup Script
# Run this script to automatically set up the entire project

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Healthcare Report API - Quick Setup Script" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "`n"

# Check prerequisites
Write-Host "Step 1: Checking Prerequisites..." -ForegroundColor Yellow

$hasPhython = python --version 2>$null
if (!$hasPhython) {
    Write-Host "❌ Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Python found: $hasPhython" -ForegroundColor Green

$hasPostgres = psql --version 2>$null
if (!$hasPostgres) {
    Write-Host "❌ PostgreSQL not found! Please install PostgreSQL" -ForegroundColor Red
    exit 1
}
Write-Host "✓ PostgreSQL found: $hasPostgres" -ForegroundColor Green

# Virtual environment
Write-Host "`nStep 2: Setting Up Virtual Environment..." -ForegroundColor Yellow

if (Test-Path "venv") {
    Write-Host "✓ Virtual environment already exists" -ForegroundColor Green
} else {
    Write-Host "Creating virtual environment..."
    python -m venv venv
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Virtual environment created" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to create virtual environment" -ForegroundColor Red
        exit 1
    }
}

# Activate venv
Write-Host "Activating virtual environment..."
& .\venv\Scripts\Activate.ps1
Write-Host "✓ Virtual environment activated" -ForegroundColor Green

# Install dependencies
Write-Host "`nStep 3: Installing Dependencies..." -ForegroundColor Yellow

Write-Host "Upgrading pip..."
python -m pip install --upgrade pip --quiet

Write-Host "Installing requirements..."
pip install -r requirements.txt --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some warnings during installation, but continuing..." -ForegroundColor Yellow
}

# Create .env file
Write-Host "`nStep 4: Creating .env Configuration..." -ForegroundColor Yellow

if (Test-Path ".env") {
    Write-Host "✓ .env file already exists" -ForegroundColor Green
} else {
    Write-Host "Creating .env from template..."
    Copy-Item ".env.template" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
    Write-Host "⚠️  Please edit .env and add your credentials:" -ForegroundColor Yellow
    Write-Host "  - GEMINI_API_KEY (get from https://ai.google.dev/)" -ForegroundColor Cyan
    Write-Host "  - Database password" -ForegroundColor Cyan
}

# Create PostgreSQL database
Write-Host "`nStep 5: Creating PostgreSQL Database..." -ForegroundColor Yellow

# Check if database exists
$dbExists = psql -U postgres -t -c "SELECT 1 FROM pg_database WHERE datname = 'healthcare_reports';" 2>$null

if ($dbExists -eq "1") {
    Write-Host "✓ Database already exists" -ForegroundColor Green
} else {
    Write-Host "Creating healthcare_reports database..."
    psql -U postgres -c "CREATE DATABASE healthcare_reports;" 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Database created successfully" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Database might already exist or PostgreSQL not running" -ForegroundColor Yellow
    }
}

# Create models directory
Write-Host "`nStep 6: Setting Up Model Directory..." -ForegroundColor Yellow

if (Test-Path "models") {
    Write-Host "✓ Models directory already exists" -ForegroundColor Green
} else {
    New-Item -ItemType Directory -Path "models" | Out-Null
    Write-Host "✓ Models directory created" -ForegroundColor Green
}

# Check for trained model
if (Test-Path "models/model.pkl") {
    Write-Host "✓ Trained model found" -ForegroundColor Green
} else {
    Write-Host "⚠️  Trained model not found in ./models/model.pkl" -ForegroundColor Yellow
    Write-Host "    Creating a dummy model for testing..." -ForegroundColor Cyan
    
    # Create dummy model
    $dummyScript = @"
import pickle
import numpy as np

class DummyModel:
    def predict(self, X):
        return np.array([[np.random.randint(30, 80)]])

model = DummyModel()
with open("models/model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✓ Dummy model created")
"@
    
    $dummyScript | Out-File "create_dummy_model.py" -Encoding UTF8
    python create_dummy_model.py
    Remove-Item "create_dummy_model.py"
}

# Initialize database tables
Write-Host "`nStep 7: Initializing Database Tables..." -ForegroundColor Yellow

Write-Host "Creating reports table..."
python init_db.py

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database initialized successfully" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database initialization encountered issues" -ForegroundColor Yellow
    Write-Host "    Make sure PostgreSQL is running and .env is configured" -ForegroundColor Yellow
}

# Summary
Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

Write-Host "`nYou can now start the server:
`n  python app.py
`n" -ForegroundColor Cyan

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env and add your Gemini API key" -ForegroundColor Cyan
Write-Host "2. Start the server: python app.py" -ForegroundColor Cyan
Write-Host "3. Test in another terminal: python test_api.py" -ForegroundColor Cyan
Write-Host "4. For detailed testing guide, see TESTING_GUIDE.md" -ForegroundColor Cyan

Write-Host "`n"

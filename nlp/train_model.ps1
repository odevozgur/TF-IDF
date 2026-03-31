# TF-IDF Sentiment Model Training Script
Write-Host ">>> NLP Model Training Algorithm Starting..." -ForegroundColor Cyan

# Use absolute paths relative to current script
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $SCRIPT_DIR

# 1. Virtual Environment Check
if (-not (Test-Path "venv")) {
    Write-Host ">>> Virtual environment (venv) not found. Creating..." -ForegroundColor Yellow
    py -m venv venv
}

# 2. Activate Virtual Environment
Write-Host ">>> Activating virtual environment..." -ForegroundColor Green
$venvScript = ".\venv\Scripts\Activate.ps1"
& $venvScript

# 3. Dependency Check & Installation (Correcting common typos)
Write-Host ">>> Checking dependencies (pandas, scikit-learn)..." -ForegroundColor Green
# Using scikit-learn (modern name) instead of sklearn
pip install pandas scikit-learn --quiet

# 4. Training
Write-Host ">>> Training process started on dataset.csv..." -ForegroundColor Green
py train.py

Write-Host ">>> Done! Model and Vectorizer updated successfully." -ForegroundColor Cyan
Write-Host ">>> You can now use the new data in the frontend." -ForegroundColor Green

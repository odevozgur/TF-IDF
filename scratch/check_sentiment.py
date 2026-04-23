import pandas as pd
import os
import sys

# Ensure UTF-8 output for Windows console
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

# Use relative paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, "nlp", "data", "dataset.csv")

if os.path.exists(DATA_PATH):
    df = pd.read_csv(DATA_PATH, on_bad_lines='skip', encoding='utf-8')
    print("Sentiment label counts:")
    print(df['label'].value_counts().to_string())
else:
    print(f"File not found: {DATA_PATH}")

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import pickle
import os

from preprocess import clean_text

# Use absolute paths or relative to project root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "data", "dataset.csv")

def train_model():
    if not os.path.exists(DATA_PATH):
        print(f"Error: Dataset not found at {DATA_PATH}")
        return

    # Dataset yükle
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    
    # Ensure labels are clean
    df = df.dropna(subset=['text', 'label'])
    
    texts = df["text"].astype(str)
    labels = df["label"]

    # Temizleme
    print("Preprocessing texts...")
    texts = texts.apply(clean_text)

    # TF-IDF
    print("Vectorizing...")
    vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1, 2))
    X = vectorizer.fit_transform(texts)

    # Model - Logistic Regression with balanced class weights
    print("Training model...")
    model = LogisticRegression(max_iter=1000, class_weight='balanced')
    model.fit(X, labels)

    # Kaydet
    pickle.dump(model, open(os.path.join(BASE_DIR, "model.pkl"), "wb"))
    pickle.dump(vectorizer, open(os.path.join(BASE_DIR, "vectorizer.pkl"), "wb"))

    print(f"Model and Vectorizer saved in {BASE_DIR}")
    print(f"Classes: {model.classes_}")

if __name__ == "__main__":
    train_model()
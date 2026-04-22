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
    # on_bad_lines='skip' ensures we don't crash on slightly malformed CSV rows
    df = pd.read_csv(DATA_PATH, on_bad_lines='skip', encoding='utf-8')
    
    # Ensure labels are clean
    df = df.dropna(subset=['text', 'label', 'propaganda'])
    
    # Strip whitespace from labels and convert to string
    df['label'] = df['label'].astype(str).str.strip().str.lower()
    df['propaganda'] = df['propaganda'].astype(str).str.strip().str.lower()
    
    # Propaganda label normalization
    prop_map = {
        'abartma': 'abartma',
        'korku yayma': 'korku yayma',
        'korku': 'korku yayma',
        'çarpıtma': 'çarpıtma',
        'kutuplaştırma': 'kutuplaştırma',
        'hakaret': 'hakaret',
        'otoriteye dayandırma': 'otoriteye dayandırma',
        'otorite': 'otoriteye dayandırma'
    }
    
    df['propaganda'] = df['propaganda'].apply(lambda x: prop_map.get(x, 'diğer'))
    
    # Remove rows where label is the header itself or 'diğer' (to keep it focused)
    df = df[~df['label'].isin(['label', 'sentiment'])]
    df = df[df['propaganda'] != 'diğer']

    texts = df["text"].astype(str)
    sentiment_labels = df["label"]
    propaganda_labels = df["propaganda"]

    # Temizleme
    print("Preprocessing texts...")
    texts_cleaned = texts.apply(clean_text)

    # TF-IDF Vectorizer
    print("Vectorizing...")
    vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1, 2))
    X = vectorizer.fit_transform(texts_cleaned)

    # Save Vectorizer (Shared between models)
    pickle.dump(vectorizer, open(os.path.join(BASE_DIR, "vectorizer.pkl"), "wb"))

    # Model 1: Sentiment Analysis
    print("Training Sentiment model...")
    model_sentiment = LogisticRegression(max_iter=1000, class_weight='balanced')
    model_sentiment.fit(X, sentiment_labels)
    pickle.dump(model_sentiment, open(os.path.join(BASE_DIR, "model_sentiment.pkl"), "wb"))

    # Model 2: Propaganda Analysis
    print("Training Propaganda model...")
    model_propaganda = LogisticRegression(max_iter=1000, class_weight='balanced')
    model_propaganda.fit(X, propaganda_labels)
    pickle.dump(model_propaganda, open(os.path.join(BASE_DIR, "model_propaganda.pkl"), "wb"))

    print(f"Models and Vectorizer saved in {BASE_DIR}")
    # print(f"Sentiment Classes: {model_sentiment.classes_}")
    # print(f"Propaganda Classes: {model_propaganda.classes_}")

if __name__ == "__main__":
    train_model()
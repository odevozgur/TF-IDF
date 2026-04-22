import pickle
import json
import sys
import os
import argparse
from preprocess import clean_text

# Use absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_models():
    sentiment_model_path = os.path.join(BASE_DIR, "model_sentiment.pkl")
    propaganda_model_path = os.path.join(BASE_DIR, "model_propaganda.pkl")
    vec_path = os.path.join(BASE_DIR, "vectorizer.pkl")
    
    if not all(os.path.exists(p) for p in [sentiment_model_path, propaganda_model_path, vec_path]):
        return None, None, None
        
    m_sentiment = pickle.load(open(sentiment_model_path, "rb"))
    m_propaganda = pickle.load(open(propaganda_model_path, "rb"))
    vectorizer = pickle.load(open(vec_path, "rb"))
    return m_sentiment, m_propaganda, vectorizer

def predict(text):
    m_sent, m_prop, vectorizer = get_models()
    if not all([m_sent, m_prop, vectorizer]):
        return {"error": "Model files not found. Run train.py first."}

    cleaned_text = clean_text(text)
    vec = vectorizer.transform([cleaned_text])
    
    # Sentiment Probabilities
    sent_probs = m_sent.predict_proba(vec)[0]
    sent_classes = m_sent.classes_
    sent_results = {cls: float(prob) for cls, prob in zip(sent_classes, sent_probs)}
    
    # Propaganda Probabilities
    prop_probs = m_prop.predict_proba(vec)[0]
    prop_classes = m_prop.classes_
    prop_results = {cls: float(prob) for cls, prob in zip(prop_classes, prop_probs)}
    
    return {
        "sentiment": {
            "prediction": str(m_sent.predict(vec)[0]),
            "probabilities": sent_results
        },
        "propaganda": {
            "prediction": str(m_prop.predict(vec)[0]),
            "probabilities": prop_results
        }
    }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TF-IDF Sentiment Predictor")
    parser.add_argument("--text", type=str, required=True, help="Text to analyze")
    args = parser.parse_args()

    results = predict(args.text)
    print(json.dumps(results, ensure_ascii=False))
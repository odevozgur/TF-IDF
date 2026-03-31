import pickle
import json
import sys
import os
import argparse
from preprocess import clean_text

# Use absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_model():
    model_path = os.path.join(BASE_DIR, "model.pkl")
    vec_path = os.path.join(BASE_DIR, "vectorizer.pkl")
    
    if not os.path.exists(model_path) or not os.path.exists(vec_path):
        return None, None
        
    model = pickle.load(open(model_path, "rb"))
    vectorizer = pickle.load(open(vec_path, "rb"))
    return model, vectorizer

def predict(text):
    model, vectorizer = get_model()
    if not model or not vectorizer:
        return {"error": "Model files not found. Run train.py first."}

    cleaned_text = clean_text(text)
    vec = vectorizer.transform([cleaned_text])
    
    # Get probabilities
    probs = model.predict_proba(vec)[0]
    classes = model.classes_
    
    result = {cls: float(prob) for cls, prob in zip(classes, probs)}
    result["prediction"] = str(model.predict(vec)[0])
    
    return result

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="TF-IDF Sentiment Predictor")
    parser.add_argument("--text", type=str, required=True, help="Text to analyze")
    args = parser.parse_args()

    results = predict(args.text)
    print(json.dumps(results, ensure_ascii=False))
from http.server import BaseHTTPRequestHandler
import json
import pickle
import os
import re

# Simple clean_text inlined or imported
def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Load models at startup (global)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model = pickle.load(open(os.path.join(BASE_DIR, "model.pkl"), "rb"))
vectorizer = pickle.load(open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb"))

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data)

        text = data.get('text', '')
        if not text:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "No text provided"}).encode())
            return

        cleaned_text = clean_text(text)
        vec = vectorizer.transform([cleaned_text])
        prediction = model.predict(vec)[0]
        probs = model.predict_proba(vec)[0]
        classes = model.classes_
        
        result = {
            "prediction": str(prediction),
            "confidence": float(max(probs)),
            "stats": {cls: float(prob) for cls, prob in zip(classes, probs)}
        }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())
        return

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/plain')
        self.end_headers()
        self.wfile.write("Sentiment Analysis API is running.".encode())
        return

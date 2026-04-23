import pickle
import os
from preprocess import clean_text

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def test_samples():
    m_propaganda = pickle.load(open(os.path.join(BASE_DIR, "model_propaganda.pkl"), "rb"))
    vectorizer = pickle.load(open(os.path.join(BASE_DIR, "vectorizer.pkl"), "rb"))
    
    samples = [
        "Bilim insanları bu konuda çok net konuşuyorlar.",
        "Doktorların son açıklamaları halk için önemliydi.",
        "Uzmanlar bu virüsün çok tehlikeli olduğunu söylüyor.",
        "Dünya Sağlık Örgütü verilerine göre durum vahim.",
        "Profesör Doktor Mehmet Öz diyor ki bu meyve mucize."
    ]
    
    for text in samples:
        cleaned = clean_text(text)
        vec = vectorizer.transform([cleaned])
        pred = m_propaganda.predict(vec)[0]
        probs = m_propaganda.predict_proba(vec)[0]
        prob_dict = {cls: prob for cls, prob in zip(m_propaganda.classes_, probs)}
        print(f"Text: {text}")
        print(f"Prediction: {pred}")
        print(f"Probs: {prob_dict}")
        print("-" * 20)

if __name__ == "__main__":
    test_samples()

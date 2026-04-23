import pickle
import os
import sys
from preprocess import clean_text

# Ensure UTF-8 output for Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def test_models():
    sent_path = os.path.join(BASE_DIR, "model_sentiment.pkl")
    prop_path = os.path.join(BASE_DIR, "model_propaganda.pkl")
    vec_path = os.path.join(BASE_DIR, "vectorizer.pkl")
    
    if not all(os.path.exists(p) for p in [sent_path, prop_path, vec_path]):
        print("Error: Models not found yet.")
        return

    m_sentiment = pickle.load(open(sent_path, "rb"))
    m_propaganda = pickle.load(open(prop_path, "rb"))
    vectorizer = pickle.load(open(vec_path, "rb"))
    
    samples = [
        ("Bugün hava çok güzel.", "sentiment: positive, propaganda: yok"),
        ("Bilim insanları aşıların güvenli olduğunu kanıtladı.", "propaganda: otorite"),
        ("Sen tam bir aptalsın ve hiçbir şey bilmiyorsun.", "propaganda: hakaret"),
        ("Bu adamın dedikleri tamamen yalan ve çarpıtma.", "propaganda: carpitma"),
        ("Bize saldıracaklar, kendinizi korumalısınız!", "propaganda: korku"),
        ("Biz ve onlar arasındaki uçurum giderek büyüyor.", "propaganda: kutuplastirma")
    ]
    
    print(f"{'Text':<50} | {'Sentiment Prediction':<20} | {'Propaganda Prediction':<25}")
    print("-" * 100)
    
    for text, expected in samples:
        cleaned = clean_text(text)
        vec = vectorizer.transform([cleaned])
        
        s_pred = m_sentiment.predict(vec)[0]
        p_pred = m_propaganda.predict(vec)[0]
        
        print(f"{text:<50} | {s_pred:<20} | {p_pred:<25}")

if __name__ == "__main__":
    test_models()

import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def check_classes():
    m_sent = pickle.load(open(os.path.join(BASE_DIR, "model_sentiment.pkl"), "rb"))
    m_prop = pickle.load(open(os.path.join(BASE_DIR, "model_propaganda.pkl"), "rb"))
    
    print("Sentiment Classes:", m_sent.classes_)
    print("Propaganda Classes:", m_prop.classes_)

if __name__ == "__main__":
    check_classes()

import re

# Comprehensive Turkish Stopword List
stopwords = set([
    "acaba", "ama", "aslında", "az", "bazı", "belki", "biri", "birkaç", "birşey", "biz", "bu", "çok", "çünkü", "da", "daha", "de", "defa", "diye", "eğer", "en", "gibi", "hem", "hep", "hepsi", "her", "hiç", "için", "ile", "ise", "kez", "ki", "kim", "mı", "mu", "mü", "nasıl", "ne", "neden", "nerde", "nerede", "nereye", "niçin", "niye", "o", "sanki", "şey", "siz", "şu", "tüm", "ve", "veya", "ya", "yani", "bir"
])

def clean_text(text):
    if not isinstance(text, str):
        return ""
    
    # Lowercase & remove non-alphanumeric chars
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text) # Replace punctuations with space
    text = re.sub(r'\s+', ' ', text).strip() # Remove redundant spaces
    
    # Tokenize and remove stopwords
    words = text.split()
    words = [w for w in words if w not in stopwords and len(w) > 1]
    
    return " ".join(words)
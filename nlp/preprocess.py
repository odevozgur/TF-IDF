import re

# Comprehensive Turkish Stopword List
stopwords = set([
    "acaba", "ama", "aslında", "az", "bazı", "belki", "biri", "birkaç", "birşey", "biz", "bu", "çok", "çünkü", "da", "daha", "de", "defa", "diye", "eğer", "en", "gibi", "hem", "hep", "hepsi", "her", "hiç", "için", "ile", "ise", "kez", "ki", "kim", "mı", "mu", "mü", "nasıl", "ne", "neden", "nerde", "nerede", "nereye", "niçin", "niye", "o", "sanki", "şey", "siz", "şu", "tüm", "ve", "veya", "ya", "yani", "bir",
    "adeta", "altmış", "altı", "arada", "artık", "asla", "ayrıca", "bana", "bari", "başka", "beş", "bile", "bin", "birisi", "bize", "boyunca", "burada", "bütün", "daima", "dahi", "doksan", "dokuz", "dolayı", "dört", "edecek", "eden", "ederek", "edilecek", "ediliyor", "edilmesi", "ediyor", "eğer", "elli", "en", "etmesi", "etti", "ettiği", "ettiğini", "fakat", "göre", "halen", "hangi", "hatta", "henüz", "herkes", "herhangi", "iki", "illaki", "itibaren", "itibariyle", "kadardır", "kadar", "karşın", "katrilyon", "kendi", "kendilerine", "kendini", "kendisi", "kendisine", "kendisini", "kez", "ki", "kim", "kimden", "kime", "kimin", "kimisi", "kimse", "kırk", "milyar", "milyon", "mu", "mü", "mı", "nasıl", "ne", "neden", "nedenle", "nerde", "nerede", "nereye", "neyse", "niçin", "niye", "onlar", "onların", "onları", "onlardan", "onlara", "onun", "ona", "onda", "ondan", "otuz", "oysa", "öyle", "pek", "rağmen", "sadece", "sanki", "sekiz", "seksen", "sen", "sizin", "size", "sizi", "sizden", "sizlere", "sonra", "şayet", "şimdi", "şöyle", "şu", "şunlar", "şunu", "şunun", "şuna", "şunda", "şundan", "tarafından", "trilyon", "tüm", "üç", "üzere", "var", "vardı", "ve", "veya", "yahut", "yalnız", "yani", "yapılması", "yapıyor", "yapmak", "yapılan", "yapılsın", "yedi", "yerine", "yetmiş", "yine", "yoksa", "yüz", "zaten", "zira"
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
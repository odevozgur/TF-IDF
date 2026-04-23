# NLP Sentiment & Propaganda Analysis System

Bu proje, sosyal medya verileri üzerinde derinlemesine **Duygu Analizi** ve **Propaganda Teknikleri Tespiti** gerçekleştiren, makine öğrenmesi destekli bir web uygulamasıdır. Proje, güncel 20MB'lık genişletilmiş veri seti ile eğitilmiş modellerle en son haline getirilmiştir.

## 🚀 Proje Durumu ve Analizler

Uygulama, metin tabanlı verileri analiz ederek iki temel katmanda sonuç üretir:

1.  **Duygu Analizi (Sentiment Analysis):** Metnin genel tonunu (Pozitif, Nötr, Negatif) belirler. Sosyal medya etkileşimlerinin genel havasını anlamak için kullanılır.
2.  **Propaganda Analizi:** Metin içerisindeki manipülasyon ve propaganda tekniklerini tespit eder. Tespit edilen kategoriler:
    -   **Otoriteye Dayandırma:** Güç figürlerini kullanarak argümanı güçlendirme.
    -   **Kutuplaştırma:** "Biz ve Onlar" ayrımı yaratarak toplumu bölme.
    -   **Korku Yayma:** Tehdit ve korku unsurlarıyla manipülasyon.
    -   **Hakaret:** Karşı tarafı küçümseyerek değersizleştirme.
    -   **Abartma:** Gerçeği olduğundan çok daha büyük gösterme.
    -   **Çarpıtma:** Bilgileri bağlamından kopararak yanlış sunma.

## 🧠 Neden TF-IDF Kullandık?

**TF-IDF (Term Frequency-Inverse Document Frequency)**, metin madenciliğinde kelimelerin metin içindeki önemini matematiksel olarak hesaplayan bir istatistiksel yöntemdir.

-   **Term Frequency (TF):** Bir kelimenin metinde ne kadar sık geçtiğini ölçer.
-   **Inverse Document Frequency (IDF):** Bir kelimenin tüm veri setinde ne kadar nadir (ve dolayısıyla ne kadar ayırt edici) olduğunu ölçer.

**Neden Seçtik?**
Bu projede TF-IDF kullanarak, "ve", "bir", "bu" gibi her cümlede geçen anlamsız kelimelerin ağırlığını düşürdük; "saldırı", "güvenli", "yalan" gibi duygu ve propaganda belirten anahtar kelimelerin ağırlığını artırdık. Bu sayede modellerimiz (Logistic Regression), metnin sadece yüzeysel kelime sayısına değil, **semantik ağırlığına** bakarak karar verebilir hale geldi.

## 🛠 Kurulum ve Çalıştırma (Pipeline)

Proje, indirildiği anda çalışabilecek şekilde (Portable) tasarlanmıştır. Tüm modeller ve `.env` dosyaları repo içerisine dahil edilmiştir.

### 1. Backend Hazırlığı
```powershell
cd backend
npm install
npm run dev
```
*Backend `http://localhost:5000` adresinde ayağa kalkacaktır.*

### 2. Frontend Hazırlığı
```powershell
cd frontend
npm install
npm run dev
```
*Frontend `http://localhost:5173` adresinde açılacaktır.*

### 3. NLP Modelleri
Modeller `nlp/` klasöründe hazır durumdadır. Python ortamınızda `pandas` ve `scikit-learn` yüklü olması yeterlidir. İlk çalıştırmada `nlp/train_model.ps1` scriptini çalıştırarak ortamı doğrulayabilirsiniz.

---

## 🔐 Test Giriş Bilgileri

Projeyi hızlıca test etmek ve analizleri görmek için aşağıdaki hesabı kullanabilirsiniz:

-   **E-posta:** `yasinyumrutas0@gmail.com`
-   **Şifre:** `Y321654e.`

---

## 👨‍💻 Geliştirici Ekibi Notu
Proje, yüksek performanslı **Logistic Regression** modelleri ve modern **React + Framer Motion** arayüzü ile premium bir kullanıcı deneyimi sunar. 20MB'lık veri seti ile modellerin isabet oranını (accuracy) yükseltmek için çabalanmıştır bu datasetin tamamı 155bin satır olup herbiri ekibimiz tarafından etiketleri gözden geçirelerek yapılmıştır. Projenin ilk hali sadece duygu analizini kapsıyor olup kaggle (https://www.kaggle.com/datasets/winvoker/turkishsentimentanalysisdataset) linkinden bulmuştuk sonrasında ise verseti hem yetersiz geldiği için hemde propaganda ayıklama yapmak istediğimiz için kendi verisetimizi oluşturmaya çalıştık bunun yanı sıra projemizi VERCEL de live aldık son versiyon live a uygun olmadığı için yakın zamanda oradaki problemleri de fix edeceğiz fakat şuan ki haliyle localde çalıştırılmaya tamamen uygundur.

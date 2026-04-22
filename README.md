# TF-IDF Sentiment Analysis Projesi

Bu proje, sosyal medya yorumlarının duygu analizini (Pozitif, Nötr, Negatif) ve **Propaganda Tekniklerini** (Abartma, Korku Yayma, Çarpıtma, Kutuplaştırma, Hakaret, Otoriteye Dayandırma) TF-IDF ve Logistic Regression algoritmaları kullanarak gerçekleştiren tam kapsamlı bir web uygulamasıdır.

## Özellikler

- **Dual NLP Analizi:** Her yorum için hem duygu hem de propaganda türü tespiti.
- **Detaylı İstatistikler:** Post bazında yüzdelik dilimlerle analiz raporları.
- **Modern Dashboard:** Recharts ile görselleştirilmiş analiz verileri ve kullanıcı detayları.
- **Genişletilmiş Veri Seti:** Propaganda türlerine göre optimize edilmiş 110.000+ satırlık veri seti.

## Proje Yapısı

Proje üç ana bölümden oluşmaktadır:

1.  **NLP Core (Python):** TF-IDF vektörleştirme ve Makine Öğrenmesi modelini içeren çekirdek.
2.  **Backend (Node.js + TypeScript):** NLP çekirdeği ile haberleşen ve API hizmeti sağlayan sunucu.
3.  **Frontend (React + Vite):** Modern, premium tasarıma sahip kullanıcı arayüzü ve analiz dashboard'u.

---

## Nasıl Çalıştırılır?

Projenin çalışması için hem backend hem de frontend sunucularının aynı anda açık olması gerekmektedir.

### 1. Backend Sunucusunu Başlatma
Yeni bir terminal açın ve şu komutları sırasıyla çalıştırın:
```powershell
cd backend
npm run dev
```
*Backend şu adreste çalışacaktır: `http://localhost:5000`*

### 2. Frontend Sunucusunu Başlatma
Başka bir terminal açın ve şu komutları sırasıyla çalıştırın:
```powershell
cd frontend
npm run dev
```
*Frontend şu adreste çalışacaktır: `http://localhost:5173` (veya terminalde belirtilen adres)*

---

## Proje Gelişim Günlüğü (Progress Log)

- [x] **Adım 1:** Proje yapısı oluşturuldu.
- [x] **Adım 2:** Python tabanlı NLP modeli (TF-IDF + Logistic Regression) olasılık çıktıları verecek şekilde güncellendi.
- [x] **Adım 3:** Node.js (TypeScript) Backend kuruldu ve NLP köprüsü (child_process) tamamlandı.
- [x] **Adım 4:** React (Vite) Frontend eklendi. Premium UI, Framer Motion animasyonları ve Recharts grafikleri uygulandı.
- [x] **Adım 5:** Uçtan uca testler yapıldı ve sistem optimize edildi.

## Teknolojiler
- **NLP:** Python, Scikit-learn, Pandas, Pickle
- **Backend:** Node.js, TypeScript, Express, Child Process
- **Frontend:** React, Vite, Tailwind CSS 4, Framer Motion, Lucide Icons, Recharts, Axios

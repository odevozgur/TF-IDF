-- 1. Profiles Tablosu (Auth.Users ile bağlantılı)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Posts Tablosu
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Comments Tablosu (Sentiment Verileri Dahil)
CREATE TABLE public.comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  sentiment_prediction TEXT, -- positive, neutral, negative
  sentiment_positive FLOAT DEFAULT 0,
  sentiment_neutral FLOAT DEFAULT 0,
  sentiment_negative FLOAT DEFAULT 0,
  propaganda_prediction TEXT, -- abartma, korku yayma, etc.
  propaganda_abartma FLOAT DEFAULT 0,
  propaganda_korku FLOAT DEFAULT 0,
  propaganda_carpitma FLOAT DEFAULT 0,
  propaganda_kutuplastirma FLOAT DEFAULT 0,
  propaganda_hakaret FLOAT DEFAULT 0,
  propaganda_otorite FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) Ayarları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Güvenlik Politikaları (Herkes görebilir, sadece sahibi silebilir/düzenleyebilir)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Posts are viewable by everyone." ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts." ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Comments are viewable by everyone." ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create their own comments." ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Gerekli fonksiyon (Yeni User oluştuğunda otomatik profile oluşturma)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

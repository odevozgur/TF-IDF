import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { spawn } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';
import { supabase } from './supabaseClient';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
const PROPAGANDA_LABELS: Record<string, string> = {
    abartma: 'Abartma',
    korku: 'Korku Yayma',
    carpitma: 'Çarpıtma',
    kutuplastirma: 'Kutuplaştırma',
    hakaret: 'Hakaret',
    otorite: 'Otoriteye Dayandırma',
    yok: 'yok'
};

// Auth Middleware + Scoped Supabase Client
const authenticateUser = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        console.warn('>>> Auth Error: No token provided');
        return res.status(401).json({ error: 'Unauthorized' });
    }

    // Token doğrula
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
        console.error('>>> Auth Error:', error?.message || 'Invalid token');
        return res.status(401).json({ error: 'Invalid token' });
    }

    // RLS için kullanıcıya özel istemci (opsiyonel ama daha güvenli)
    const { createClient } = require('@supabase/supabase-js');
    const userSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // Profil kontrolü ve gerekirse oluşturma (Kullanıcı yetkisiyle)
    const { data: profile } = await userSupabase.from('profiles').select('id').eq('id', user.id).single();

    if (!profile) {
        console.log(`>>> Profile missing for ${user.id}, creating now...`);
        await userSupabase.from('profiles').insert([{
            id: user.id,
            username: user.user_metadata.username || user.email?.split('@')[0],
            full_name: user.user_metadata.full_name || 'Generic User',
            avatar_url: user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
        }]);
    }

    req.user = user;
    req.supabase = userSupabase; // İstek boyunca bu yetkili istemciyi kullan
    next();
};

// NLP Bridge Helper
const analyzeText = (text: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        // Detect OS and set correct Python command/path
        const isWindows = process.platform === 'win32';
        
        // Portable Python Path Logic
        const venvPythonPath = isWindows 
            ? path.resolve(__dirname, '../../nlp/venv/Scripts/python.exe')
            : path.resolve(__dirname, '../../nlp/venv/bin/python');

        const fs = require('fs');
        let pythonPath = 'python'; // Default fallback

        if (fs.existsSync(venvPythonPath)) {
            pythonPath = venvPythonPath;
        } else {
            console.warn(`>>> Warning: Virtual environment not found at ${venvPythonPath}. Falling back to global 'python' or 'py'.`);
            pythonPath = isWindows ? 'py' : 'python3';
        }

        const scriptPath = path.resolve(__dirname, '../../nlp/predict.py');

        console.log(`>>> Spawning Python: ${pythonPath} with script: ${scriptPath}`);
        
        const pythonProcess = spawn(pythonPath, [scriptPath, '--text', text]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', (data) => {
            result += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            error += data.toString();
        });

        // Handle spawn errors (like missing executable)
        pythonProcess.on('error', (err) => {
            console.error('>>> Python Spawn Error:', err.message);
            reject(new Error(`Failed to start Python process: ${err.message}. Please ensure Python is installed and added to PATH.`));
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`>>> Python Process Error (Code ${code}):`, error);
                reject(new Error(`Python process exited with code ${code}: ${error}`));
                return;
            }
            try {
                const jsonResult = JSON.parse(result.trim());
                resolve(jsonResult);
            } catch (e) {
                console.error('>>> JSON Parse Error from Python output:', result);
                reject(new Error(`Failed to parse Python output. Raw output: ${result}`));
            }
        });
    });
};

// 1. Post Paylaşma
app.post('/api/posts', authenticateUser, async (req: any, res: Response) => {
    const { content } = req.body;
    const { data, error } = await req.supabase
        .from('posts')
        .insert([{ user_id: req.user.id, content }])
        .select();

    if (error) {
        console.error('Supabase Post Error:', error);
        return res.status(400).json({ error, message: error.message });
    }
    res.json({ success: true, data: data[0] });
});

// 2. Tüm Postları Listeleme
app.get('/api/posts', async (req: any, res: Response) => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles:user_id (username, full_name, avatar_url),
            comments (
                id, 
                content, 
                sentiment_prediction, 
                created_at,
                profiles:user_id (username, avatar_url)
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Supabase Fetch Posts Error:', error);
        return res.status(400).json({ error, message: error.message });
    }
    res.json({ success: true, data });
});

// 3. Yorum Yapma + Otomatik NLP Analizi
app.post('/api/comments', authenticateUser, async (req: any, res: Response) => {
    const { post_id, content } = req.body;

    try {
        const analysis = await analyzeText(content);
        const { data, error } = await req.supabase
            .from('comments')
            .insert([{
                post_id,
                user_id: req.user.id,
                content,
                sentiment_prediction: analysis.sentiment.prediction,
                sentiment_positive: analysis.sentiment.probabilities.positive,
                sentiment_neutral: analysis.sentiment.probabilities.neutral,
                sentiment_negative: analysis.sentiment.probabilities.negative,
                propaganda_prediction: PROPAGANDA_LABELS[analysis.propaganda.prediction] || analysis.propaganda.prediction,
                propaganda_abartma: analysis.propaganda.probabilities.abartma,
                propaganda_korku: analysis.propaganda.probabilities.korku,
                propaganda_carpitma: analysis.propaganda.probabilities.carpitma,
                propaganda_kutuplastirma: analysis.propaganda.probabilities.kutuplastirma,
                propaganda_hakaret: analysis.propaganda.probabilities.hakaret,
                propaganda_otorite: analysis.propaganda.probabilities.otorite
            }])
            .select();

        if (error) {
            console.error('Supabase Comment Error:', error);
            return res.status(400).json({ error, message: error.message });
        }
        res.json({ success: true, data: data[0] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// 4. Bir Postun Tüm Yorum Analizini Getirme (Pasta Grafiği İçin)
app.get('/api/posts/:id/analysis', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('comments')
        .select(`
            content,
            sentiment_prediction, 
            sentiment_positive, 
            sentiment_neutral, 
            sentiment_negative,
            propaganda_prediction,
            propaganda_abartma,
            propaganda_korku,
            propaganda_carpitma,
            propaganda_kutuplastirma,
            propaganda_hakaret,
            propaganda_otorite,
            created_at,
            profiles:user_id (username, avatar_url)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });

    // Ortalama Hesaplama
    if (data.length === 0) return res.json({ success: true, stats: null, comments: [] });

    const stats = data.reduce((acc, curr) => ({
        positive: acc.positive + curr.sentiment_positive,
        neutral: acc.neutral + curr.sentiment_neutral,
        negative: acc.negative + curr.sentiment_negative,
        propaganda: {
            abartma: acc.propaganda.abartma + (curr.propaganda_abartma || 0),
            korku: acc.propaganda.korku + (curr.propaganda_korku || 0),
            carpitma: acc.propaganda.carpitma + (curr.propaganda_carpitma || 0),
            kutuplastirma: acc.propaganda.kutuplastirma + (curr.propaganda_kutuplastirma || 0),
            hakaret: acc.propaganda.hakaret + (curr.propaganda_hakaret || 0),
            otorite: acc.propaganda.otorite + (curr.propaganda_otorite || 0),
        }
    }), { 
        positive: 0, neutral: 0, negative: 0, 
        propaganda: { abartma: 0, korku: 0, carpitma: 0, kutuplastirma: 0, hakaret: 0, otorite: 0 } 
    });

    const count = data.length;
    res.json({
        success: true,
        stats: {
            positive: stats.positive / count,
            neutral: stats.neutral / count,
            negative: stats.negative / count,
            propaganda: {
                abartma: stats.propaganda.abartma / count,
                korku: stats.propaganda.korku / count,
                carpitma: stats.propaganda.carpitma / count,
                kutuplastirma: stats.propaganda.kutuplastirma / count,
                hakaret: stats.propaganda.hakaret / count,
                otorite: stats.propaganda.otorite / count,
                yok: 1 - ((stats.propaganda.abartma + stats.propaganda.korku + stats.propaganda.carpitma + stats.propaganda.kutuplastirma + stats.propaganda.hakaret + stats.propaganda.otorite) / count)
            },
            total_comments: count
        },
        comments: data // Ham yorum verilerini de gönderiyoruz
    });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

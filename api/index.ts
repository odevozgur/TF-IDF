import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { supabase } from './supabaseClient';

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Auth Middleware + Scoped Supabase Client
const authenticateUser = async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const { createClient } = require('@supabase/supabase-js');
    const userSupabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
        global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: { user }, error } = await userSupabase.auth.getUser();
    if (error || !user) return res.status(401).json({ error: 'Invalid token' });

    const { data: profile } = await userSupabase.from('profiles').select('id').eq('id', user.id).single();

    if (!profile) {
        await userSupabase.from('profiles').insert([{
            id: user.id,
            username: user.user_metadata.username || user.email?.split('@')[0],
            full_name: user.user_metadata.full_name || 'Generic User',
            avatar_url: user.user_metadata.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`
        }]);
    }

    req.user = user;
    req.supabase = userSupabase;
    next();
};

// NLP Bridge Helper (Internal Call to Python Function)
const analyzeSentiment = async (req: any, text: string): Promise<any> => {
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['host'];
    const url = `${protocol}://${host}/api/analyze`;
    
    console.log(`>>> Calling NLP API: ${url}`);
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            throw new Error(`NLP API failed with status ${response.status}`);
        }
        
        return await response.json();
    } catch (err) {
        console.error('NLP Bridge Error:', err);
        throw err;
    }
};

// Routes
app.post('/api/posts', authenticateUser, async (req: any, res: Response) => {
    const { content } = req.body;
    const { data, error } = await req.supabase
        .from('posts')
        .insert([{ user_id: req.user.id, content }])
        .select();

    if (error) return res.status(400).json({ error });
    res.json({ success: true, data: data[0] });
});

app.get('/api/posts', async (req: any, res: Response) => {
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            profiles:user_id (username, full_name, avatar_url),
            comments (
                id, content, sentiment_prediction, created_at,
                profiles:user_id (username, avatar_url)
            )
        `)
        .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error });
    res.json({ success: true, data });
});

app.post('/api/comments', authenticateUser, async (req: any, res: Response) => {
    const { post_id, content } = req.body;

    try {
        const sentiment = await analyzeSentiment(req, content);
        const { data, error } = await req.supabase
            .from('comments')
            .insert([{
                post_id,
                user_id: req.user.id,
                content,
                sentiment_prediction: sentiment.prediction,
                sentiment_positive: sentiment.stats.positive,
                sentiment_neutral: sentiment.stats.neutral,
                sentiment_negative: sentiment.stats.negative
            }])
            .select();

        if (error) return res.status(400).json({ error });
        res.json({ success: true, data: data[0] });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/posts/:id/analysis', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error });
    if (data.length === 0) return res.json({ success: true, stats: null, comments: [] });

    const stats = data.reduce((acc, curr) => ({
        positive: acc.positive + (curr.sentiment_positive || 0),
        neutral: acc.neutral + (curr.sentiment_neutral || 0),
        negative: acc.negative + (curr.sentiment_negative || 0),
    }), { positive: 0, neutral: 0, negative: 0 });

    const count = data.length;
    res.json({
        success: true,
        stats: {
            positive: stats.positive / count,
            neutral: stats.neutral / count,
            negative: stats.negative / count,
            total_comments: count
        },
        comments: data
    });
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Export for Vercel
export default app;

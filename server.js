require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '15mb' }));
app.use(rateLimit({ windowMs: 60000, max: 200, message: { error: 'Too many requests' } }));

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
});

// ── INIT DB ──────────────────────────────────────────────────
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      google_id VARCHAR(255) UNIQUE,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255),
      avatar VARCHAR(500),
      password_hash VARCHAR(255),
      native_lang VARCHAR(10) DEFAULT 'ru',
      learn_lang VARCHAR(10) DEFAULT 'en',
      role VARCHAR(20) DEFAULT 'student',
      daily_limit INTEGER DEFAULT 50,
      daily_used INTEGER DEFAULT 0,
      last_reset DATE DEFAULT CURRENT_DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      last_seen TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS words (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      word VARCHAR(255) NOT NULL,
      translation TEXT,
      transcription VARCHAR(255),
      level VARCHAR(5) DEFAULT 'B1',
      example_en TEXT,
      example_ru TEXT,
      grammar_note TEXT,
      hard BOOLEAN DEFAULT FALSE,
      times_practiced INTEGER DEFAULT 0,
      times_correct INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      last_practiced TIMESTAMP,
      UNIQUE(user_id, word)
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      current_streak INTEGER DEFAULT 0,
      longest_streak INTEGER DEFAULT 0,
      last_activity DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS history (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      words TEXT[],
      type VARCHAR(50),
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS groups (
      id SERIAL PRIMARY KEY,
      teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL,
      code VARCHAR(10) UNIQUE,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS group_members (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      joined_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(group_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS group_words (
      id SERIAL PRIMARY KEY,
      group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
      word VARCHAR(255),
      translation TEXT,
      transcription VARCHAR(255),
      level VARCHAR(5),
      grammar_note TEXT,
      added_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      mode VARCHAR(20),
      words_count INTEGER DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS word_cache (
      id SERIAL PRIMARY KEY,
      word VARCHAR(255) NOT NULL,
      learn_lang VARCHAR(10) NOT NULL DEFAULT 'en',
      native_lang VARCHAR(10) NOT NULL DEFAULT 'ru',
      translation TEXT,
      transcription VARCHAR(255),
      level VARCHAR(5),
      example_en TEXT,
      example_ru TEXT,
      grammar_note TEXT,
      synonyms JSONB,
      examples JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(word, learn_lang, native_lang)
    );

    CREATE INDEX IF NOT EXISTS idx_words_user ON words(user_id);
    CREATE INDEX IF NOT EXISTS idx_history_user ON history(user_id);
    CREATE INDEX IF NOT EXISTS idx_group_members ON group_members(group_id);
    CREATE INDEX IF NOT EXISTS idx_word_cache ON word_cache(word, learn_lang, native_lang);
  `);
  console.log('✅ DB ready');
}

// ── AUTH MIDDLEWARE ───────────────────────────────────────────
const auth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
const optAuth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch { req.user = null; }
  next();
};

// ── AI LIMIT MIDDLEWARE ───────────────────────────────────────
const checkLimit = async (req, res, next) => {
  try {
    const u = await pool.query('SELECT daily_used, daily_limit, last_reset FROM users WHERE id=$1', [req.user.id]);
    const user = u.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });
    const today = new Date().toISOString().split('T')[0];
    const lastReset = user.last_reset?.toISOString?.()?.split('T')[0];
    if (lastReset !== today) {
      await pool.query('UPDATE users SET daily_used=0, last_reset=CURRENT_DATE WHERE id=$1', [req.user.id]);
      user.daily_used = 0;
    }
    if (user.daily_used >= user.daily_limit) {
      return res.status(429).json({ error: `Daily AI limit reached (${user.daily_limit} requests). Try tomorrow!` });
    }
    await pool.query('UPDATE users SET daily_used=daily_used+1 WHERE id=$1', [req.user.id]);
    next();
  } catch (err) {
    next();
  }
};

// ── HELPERS ───────────────────────────────────────────────────
const LANGS = { ru:'Russian',es:'Spanish',fr:'French',de:'German',zh:'Chinese',ar:'Arabic',pt:'Portuguese',tr:'Turkish',it:'Italian',ko:'Korean',ja:'Japanese',pl:'Polish',uk:'Ukrainian',nl:'Dutch',hi:'Hindi' };
const LEARN = { en:'English',de:'German',fr:'French',es:'Spanish',it:'Italian',zh:'Chinese',ja:'Japanese',ko:'Korean' };

function hashPassword(pass) {
  return crypto.createHash('sha256').update(pass + process.env.JWT_SECRET).digest('hex');
}

function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });
}

function genGroupCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function callClaude(messages, system, maxTokens = 1000) {
  const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + process.env.GROQ_KEY },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages: [{ role: 'system', content: system }, ...messages],
      temperature: 0.3,
    }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return (d.choices?.[0]?.message?.content || '').replace(/```json|```/g, '').trim();
}

// If AI returned a letter (A/B/C/D) as correct instead of the full option text, resolve it
function normalizeQuestions(data) {
  if (!data?.questions) return data;
  data.questions = data.questions.map(q => {
    if (!q.options?.length) return q;
    const letterMap = { A: 0, B: 1, C: 2, D: 3 };
    if (/^[A-D]$/.test(q.correct?.trim())) {
      q.correct = q.options[letterMap[q.correct.trim()]] ?? q.correct;
    } else {
      const match = q.options.find(o => o.trim().toLowerCase() === q.correct?.trim().toLowerCase());
      if (match) q.correct = match;
    }
    return q;
  });
  return data;
}

function getSystemPrompt(userId, nativeLang, learnLang) {
  const nl = LANGS[nativeLang] || 'Russian';
  const ll = LEARN[learnLang] || 'English';
  return `You are an AI language tutor. Student is learning ${ll}. Their native language is ${nl}. IMPORTANT: All reading texts, stories, and sentences MUST be written in ${ll}. Translations, explanations, questions, and answer options must be in ${nl}. Respond with valid JSON only. No markdown fences, no extra text.`;
}

async function getUserLangs(userId) {
  const r = await pool.query('SELECT native_lang, learn_lang FROM users WHERE id=$1', [userId]);
  return r.rows[0] || { native_lang: 'ru', learn_lang: 'en' };
}

// ── HEALTH ────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ ok: true, time: new Date() }));

// ── STATIC FILES ──────────────────────────────────────────────
app.use((req, res, next) => {
  if (/\.(js|css|html)$/.test(req.path) || req.path === '/') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});
app.use(express.static(__dirname));

// ── ADMIN ROUTES ──────────────────────────────────────────────
const adminAuth = async (req, res, next) => {
  try {
    const token = (req.headers.authorization || '').split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const u = await pool.query('SELECT role FROM users WHERE id=$1', [decoded.id]);
    if (u.rows[0]?.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    req.user = decoded;
    next();
  } catch { res.status(401).json({ error: 'Unauthorized' }); }
};

app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const [users, words, sessions, cache, history, topWords, recentUsers] = await Promise.all([
      pool.query("SELECT COUNT(*) total, COUNT(*) FILTER(WHERE role='teacher') teachers, COUNT(*) FILTER(WHERE role='admin') admins, COUNT(*) FILTER(WHERE created_at > NOW()-INTERVAL '7 days') new_week, COUNT(*) FILTER(WHERE last_seen > NOW()-INTERVAL '1 day') active_today FROM users"),
      pool.query('SELECT COUNT(*) total, COUNT(*) FILTER(WHERE hard=true) hard FROM words'),
      pool.query('SELECT COUNT(*) total, SUM(correct_count) correct, SUM(words_count) words_total FROM sessions'),
      pool.query('SELECT COUNT(*) total FROM word_cache'),
      pool.query('SELECT COUNT(*) total FROM history'),
      pool.query('SELECT word, COUNT(*) cnt FROM words GROUP BY word ORDER BY cnt DESC LIMIT 10'),
      pool.query('SELECT id, name, email, role, created_at, last_seen FROM users ORDER BY created_at DESC LIMIT 20'),
    ]);
    res.json({ users: users.rows[0], words: words.rows[0], sessions: sessions.rows[0], cache: cache.rows[0], history: history.rows[0], top_words: topWords.rows, recent_users: recentUsers.rows });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/admin/user/:id', adminAuth, async (req, res) => {
  const { role, daily_limit } = req.body;
  await pool.query('UPDATE users SET role=COALESCE($1,role), daily_limit=COALESCE($2,daily_limit) WHERE id=$3', [role, daily_limit, req.params.id]);
  res.json({ ok: true });
});

app.delete('/api/admin/user/:id', adminAuth, async (req, res) => {
  try {
    if (String(req.params.id) === String(req.user.id)) return res.status(400).json({ error: "Can't delete yourself" });
    await pool.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const { q } = req.query;
    const r = await pool.query(
      `SELECT u.id, u.email, u.name, u.role, u.daily_limit, u.daily_used, u.native_lang, u.learn_lang, u.created_at, u.last_seen,
              (SELECT COUNT(*) FROM words w WHERE w.user_id=u.id) word_count
       FROM users u
       WHERE ($1::text IS NULL OR u.email ILIKE $1 OR u.name ILIKE $1)
       ORDER BY u.created_at DESC LIMIT 200`,
      [q ? `%${q}%` : null]
    );
    res.json(r.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/cache', adminAuth, async (req, res) => {
  const r = await pool.query('SELECT id, word, learn_lang, native_lang, translation, level, created_at FROM word_cache ORDER BY created_at DESC LIMIT 200');
  res.json(r.rows);
});

app.delete('/api/admin/cache/:id', adminAuth, async (req, res) => {
  await pool.query('DELETE FROM word_cache WHERE id=$1', [req.params.id]);
  res.json({ ok: true });
});

// ── AUTH ROUTES ───────────────────────────────────────────────

app.post('/api/auth/email', async (req, res) => {
  try {
    const { email, password, nativeLang, learnLang } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password too short (min 6 chars)' });
    const hash = hashPassword(password);
    const existing = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (existing.rows.length > 0) {
      const user = existing.rows[0];
      if (user.password_hash && user.password_hash !== hash) return res.status(401).json({ error: 'Wrong password' });
      if (!user.password_hash) await pool.query('UPDATE users SET password_hash=$1 WHERE id=$2', [hash, user.id]);
      // Auto-promote if ADMIN_EMAIL matches
      if (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() && user.role !== 'admin') {
        await pool.query('UPDATE users SET role=$1 WHERE id=$2', ['admin', user.id]);
        user.role = 'admin';
      }
      await pool.query('UPDATE users SET last_seen=NOW() WHERE id=$1', [user.id]);
      return res.json({ token: makeToken(user), user: formatUser(user) });
    } else {
      const name = email.split('@')[0];
      const result = await pool.query(
        `INSERT INTO users (email, name, password_hash, native_lang, learn_lang) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [email, name, hash, nativeLang || 'ru', learnLang || 'en']
      );
      const user = result.rows[0];
      await pool.query(`INSERT INTO streaks (user_id) VALUES ($1) ON CONFLICT DO NOTHING`, [user.id]);
      return res.json({ token: makeToken(user), user: formatUser(user) });
    }
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const r = await pool.query('SELECT u.*, s.current_streak FROM users u LEFT JOIN streaks s ON s.user_id=u.id WHERE u.id=$1', [req.user.id]);
    if (!r.rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(formatUser(r.rows[0]));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.patch('/api/auth/lang', auth, async (req, res) => {
  const { nativeLang, learnLang } = req.body;
  await pool.query('UPDATE users SET native_lang=COALESCE($1,native_lang), learn_lang=COALESCE($2,learn_lang) WHERE id=$3', [nativeLang, learnLang, req.user.id]);
  res.json({ ok: true });
});

function formatUser(u) {
  return { id: u.id, email: u.email, name: u.name, avatar: u.avatar, role: u.role, native_lang: u.native_lang, learn_lang: u.learn_lang, streak: u.current_streak || 0, daily_used: u.daily_used || 0, daily_limit: u.daily_limit || 50 };
}

// ── WORDS ─────────────────────────────────────────────────────
app.get('/api/words', auth, async (req, res) => {
  const r = await pool.query('SELECT * FROM words WHERE user_id=$1 ORDER BY created_at DESC', [req.user.id]);
  res.json(r.rows);
});

app.post('/api/words', auth, async (req, res) => {
  try {
    const { word, translation, transcription, level, example_en, example_ru, grammar_note, hard } = req.body;
    const r = await pool.query(
      `INSERT INTO words (user_id,word,translation,transcription,level,example_en,example_ru,grammar_note,hard)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (user_id,word) DO UPDATE SET translation=$3,transcription=$4,level=$5,example_en=$6,example_ru=$7,grammar_note=$8
       RETURNING *`,
      [req.user.id, (word||'').toLowerCase().trim(), translation, transcription, level||'B1', example_en, example_ru, grammar_note||'', hard||false]
    );
    res.json(r.rows[0]);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/words/bulk', auth, async (req, res) => {
  const { words } = req.body;
  const added = [];
  for (const w of (words || [])) {
    try {
      const r = await pool.query(
        `INSERT INTO words (user_id,word,translation,transcription,level,example_en,example_ru,grammar_note)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING RETURNING *`,
        [req.user.id, (w.word||'').toLowerCase().trim(), w.translation, w.transcription, w.level||'B1', w.example_en, w.example_ru, w.grammar_note||'']
      );
      if (r.rows[0]) added.push(r.rows[0]);
    } catch {}
  }
  res.json({ added: added.length, words: added });
});

app.patch('/api/words/:id', auth, async (req, res) => {
  const { hard, times_practiced, times_correct } = req.body;
  const r = await pool.query(
    'UPDATE words SET hard=COALESCE($1,hard), times_practiced=COALESCE($2,times_practiced), times_correct=COALESCE($3,times_correct), last_practiced=NOW() WHERE id=$4 AND user_id=$5 RETURNING *',
    [hard, times_practiced, times_correct, req.params.id, req.user.id]
  );
  res.json(r.rows[0]);
});

app.delete('/api/words/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM words WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ ok: true });
});

// ── STATS ─────────────────────────────────────────────────────
app.get('/api/stats', auth, async (req, res) => {
  const [w, s, u] = await Promise.all([
    pool.query('SELECT COUNT(*) total, COUNT(*) FILTER(WHERE hard) hard, COUNT(*) FILTER(WHERE times_practiced>0) practiced FROM words WHERE user_id=$1', [req.user.id]),
    pool.query('SELECT current_streak, longest_streak FROM streaks WHERE user_id=$1', [req.user.id]),
    pool.query('SELECT daily_used, daily_limit FROM users WHERE id=$1', [req.user.id]),
  ]);
  res.json({ words: w.rows[0], streak: s.rows[0] || { current_streak: 0 }, daily_used: u.rows[0]?.daily_used || 0, daily_limit: u.rows[0]?.daily_limit || 50 });
});

app.post('/api/stats/session', auth, async (req, res) => {
  const { mode, words_count, correct_count } = req.body;
  await pool.query('INSERT INTO sessions (user_id,mode,words_count,correct_count) VALUES ($1,$2,$3,$4)', [req.user.id, mode, words_count, correct_count]);
  const s = await pool.query('SELECT * FROM streaks WHERE user_id=$1', [req.user.id]);
  const streak = s.rows[0];
  const today = new Date().toISOString().split('T')[0];
  const last = streak?.last_activity?.toISOString?.()?.split('T')[0];
  if (last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = last === yesterday ? (streak?.current_streak || 0) + 1 : 1;
    await pool.query(`INSERT INTO streaks (user_id,current_streak,longest_streak,last_activity) VALUES ($1,$2,$3,CURRENT_DATE) ON CONFLICT (user_id) DO UPDATE SET current_streak=$2, longest_streak=GREATEST(streaks.longest_streak,$2), last_activity=CURRENT_DATE`, [req.user.id, newStreak, newStreak]);
  }
  res.json({ ok: true });
});

// ── HISTORY ───────────────────────────────────────────────────
app.get('/api/history', auth, async (req, res) => {
  const r = await pool.query('SELECT * FROM history WHERE user_id=$1 ORDER BY created_at DESC LIMIT 50', [req.user.id]);
  res.json(r.rows);
});

app.post('/api/history', auth, async (req, res) => {
  const { text, words, type } = req.body;
  const r = await pool.query('INSERT INTO history (user_id,text,words,type) VALUES ($1,$2,$3,$4) RETURNING *', [req.user.id, text, words || [], type || 'read']);
  res.json(r.rows[0]);
});

app.delete('/api/history/:id', auth, async (req, res) => {
  await pool.query('DELETE FROM history WHERE id=$1 AND user_id=$2', [req.params.id, req.user.id]);
  res.json({ ok: true });
});

// ── GROUPS ────────────────────────────────────────────────────
app.get('/api/groups', auth, async (req, res) => {
  const u = await pool.query('SELECT role FROM users WHERE id=$1', [req.user.id]);
  const isTeacher = u.rows[0]?.role === 'teacher' || u.rows[0]?.role === 'admin';
  let r;
  if (isTeacher) {
    r = await pool.query(`SELECT g.*, COUNT(gm.user_id) member_count FROM groups g LEFT JOIN group_members gm ON gm.group_id=g.id WHERE g.teacher_id=$1 GROUP BY g.id ORDER BY g.created_at DESC`, [req.user.id]);
  } else {
    r = await pool.query(`SELECT g.*, COUNT(gm2.user_id) member_count FROM groups g JOIN group_members gm ON gm.group_id=g.id AND gm.user_id=$1 LEFT JOIN group_members gm2 ON gm2.group_id=g.id GROUP BY g.id`, [req.user.id]);
  }
  res.json(r.rows);
});

app.post('/api/groups', auth, async (req, res) => {
  const { name } = req.body;
  let code;
  while (true) {
    code = genGroupCode();
    const exists = await pool.query('SELECT id FROM groups WHERE code=$1', [code]);
    if (!exists.rows.length) break;
  }
  const r = await pool.query('INSERT INTO groups (teacher_id,name,code) VALUES ($1,$2,$3) RETURNING *', [req.user.id, name, code]);
  await pool.query("UPDATE users SET role='teacher' WHERE id=$1 AND role='student'", [req.user.id]);
  res.json({ ...r.rows[0], member_count: 0 });
});

app.post('/api/groups/join', auth, async (req, res) => {
  const { code } = req.body;
  const g = await pool.query('SELECT * FROM groups WHERE code=$1', [code]);
  if (!g.rows.length) return res.status(404).json({ error: 'Group not found' });
  await pool.query('INSERT INTO group_members (group_id,user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING', [g.rows[0].id, req.user.id]);
  res.json({ ok: true, group: g.rows[0] });
});

app.get('/api/groups/:id/members', auth, async (req, res) => {
  const r = await pool.query(`SELECT u.id, u.name, u.email, u.avatar, (SELECT COUNT(*) FROM words WHERE user_id=u.id) word_count FROM users u JOIN group_members gm ON gm.user_id=u.id WHERE gm.group_id=$1`, [req.params.id]);
  res.json(r.rows);
});

app.post('/api/groups/:id/words', auth, async (req, res) => {
  const { words } = req.body;
  for (const w of (words || [])) {
    await pool.query('INSERT INTO group_words (group_id,word,translation,transcription,level,grammar_note) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING', [req.params.id, w.word, w.translation, w.transcription, w.level, w.grammar_note]);
  }
  res.json({ ok: true });
});

// ── AI ROUTES ─────────────────────────────────────────────────
const aiLimit = rateLimit({ windowMs: 60000, max: 30, message: { error: 'Too many AI requests' } });

app.post('/api/ai/word', optAuth, aiLimit, async (req, res) => {
  try {
    const { word, learnLang: bodyLL, nativeLang: bodyNL } = req.body;
    let ll_code, nl_code;
    if (req.user) {
      const langs = await getUserLangs(req.user.id);
      ll_code = langs.learn_lang;
      nl_code = langs.native_lang;
    } else {
      ll_code = bodyLL || 'en';
      nl_code = bodyNL || 'ru';
    }
    const ll = LEARN[ll_code] || 'English';
    const nl = LANGS[nl_code] || 'Russian';
    const wordLower = (word || '').toLowerCase().trim();
    const cached = await pool.query('SELECT * FROM word_cache WHERE word=$1 AND learn_lang=$2 AND native_lang=$3', [wordLower, ll_code, nl_code]);
    if (cached.rows.length > 0) {
      const c = cached.rows[0];
      return res.json({ translation: c.translation, transcription: c.transcription, level: c.level, example_en: c.example_en, example_ru: c.example_ru, grammar_note: c.grammar_note, synonyms: c.synonyms||[], from_cache: true });
    }
    if (req.user) {
      const u = await pool.query('SELECT daily_used, daily_limit, last_reset FROM users WHERE id=$1', [req.user.id]);
      const user = u.rows[0];
      const today = new Date().toISOString().split('T')[0];
      const lastReset = user.last_reset?.toISOString?.()?.split('T')[0];
      if (lastReset !== today) await pool.query('UPDATE users SET daily_used=0, last_reset=CURRENT_DATE WHERE id=$1', [req.user.id]);
      else if (user.daily_used >= user.daily_limit) return res.status(429).json({ error: `Daily limit reached (${user.daily_limit})` });
      await pool.query('UPDATE users SET daily_used=daily_used+1 WHERE id=$1', [req.user.id]);
    }
    const raw = await callClaude(
      [{ role: 'user', content: `Word/phrase in ${ll}: "${word}"\nIf it is an idiom or set phrase, translate the meaning (not word-for-word). Return ONLY JSON:\n{"translation":"${nl} idiomatic/semantic translation","transcription":"IPA phonetic in square brackets e.g. [ˈfriːdəm]","level":"A1/A2/B1/B2/C1/C2","example_en":"natural example sentence in ${ll}","example_ru":"translation of example in ${nl}","grammar_note":"e.g. countable noun / uncountable / transitive verb / adjective / idiom etc","synonyms":[{"word":"synonym1","translation":"${nl} translation"},{"word":"synonym2","translation":"${nl} translation"},{"word":"synonym3","translation":"${nl} translation"}]}` }],
      `You are an expert ${ll} language teacher. Native language: ${nl}. For idioms always give the idiomatic meaning in ${nl}. Transcription must be IPA of the ${ll} word, not ${nl}. Be concise and accurate.`
    );
    const d = JSON.parse(raw);
    await pool.query(
      `INSERT INTO word_cache (word, learn_lang, native_lang, translation, transcription, level, example_en, example_ru, grammar_note, synonyms)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (word, learn_lang, native_lang) DO NOTHING`,
      [wordLower, ll_code, nl_code, d.translation, d.transcription, d.level, d.example_en, d.example_ru, d.grammar_note, JSON.stringify(d.synonyms||[])]
    );
    res.json(d);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/ai/extras', auth, aiLimit, async (req, res) => {
  try {
    const { word } = req.body;
    const langs = await getUserLangs(req.user.id);
    const ll = LEARN[langs.learn_lang] || 'English';
    const raw = await callClaude(
      [{ role: 'user', content: `Word: "${word}" (${ll})\nAll text in native language.\nReturn ONLY JSON:\n{"examples":["s1","s2","s3"],"synonyms":[{"word":"w1","translation":"r1"},{"word":"w2","translation":"r2"},{"word":"w3","translation":"r3"}]}` }],
      getSystemPrompt(req.user.id, langs.native_lang, langs.learn_lang)
    );
    res.json(JSON.parse(raw));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/ai/exercise', auth, aiLimit, async (req, res) => {
  try {
    const { word, translation, grammarNote } = req.body;
    const langs = await getUserLangs(req.user.id);
    const ll = LEARN[langs.learn_lang] || 'English';
    const raw = await callClaude(
      [{ role: 'user', content: `Word: "${word}" (${ll}), meaning: "${translation}"${grammarNote ? ', grammar: ' + grammarNote : ''}\nCreate fill-in-the-blank exercise. Explanation in native language.\nReturn ONLY JSON:\n{"sentence":"The _______ was clear.","answer":"${word}","options":["${word}","wrong1","wrong2","wrong3"],"explanation":"why this word fits (in native language)"}` }],
      getSystemPrompt(req.user.id, langs.native_lang, langs.learn_lang)
    );
    const d = JSON.parse(raw);
    d.options = d.options.sort(() => Math.random() - 0.5);
    res.json(d);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/ai/text', auth, aiLimit, async (req, res) => {
  try {
    const { words } = req.body;
    const langs = await getUserLangs(req.user.id);
    const ll = LEARN[langs.learn_lang] || 'English';
    const raw = await callClaude(
      [{ role: 'user', content: `Words to use: ${words.join(', ')}\nWrite a reading text in ${ll} ONLY (100-130 words, B2 level) using ALL words naturally. The text field MUST be entirely in ${ll}.\nComprehension questions and answer options must also be in ${ll}.\nReturn ONLY JSON:\n{"text":"...","questions":[{"q":"What does X mean?","options":["first option","second option","third option","fourth option"],"correct":"first option"}]}` }],
      getSystemPrompt(req.user.id, langs.native_lang, langs.learn_lang),
      1500
    );
    res.json(normalizeQuestions(JSON.parse(raw)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/ai/generate', auth, aiLimit, async (req, res) => {
  try {
    const { words, type } = req.body;
    const langs = await getUserLangs(req.user.id);
    const ll = LEARN[langs.learn_lang] || 'English';
    const raw = await callClaude(
      [{ role: 'user', content: `Words: ${words.join(', ')}\nWrite a creative ${type || 'story'} in ${ll} ONLY (150-200 words) using ALL these words. The text field MUST be entirely in ${ll}. Make it engaging and educational.\nAdd 2 comprehension questions and answer options in ${ll}.\nReturn ONLY JSON:\n{"text":"...","wordsUsed":["w1","w2"],"questions":[{"q":"What did X do?","options":["first option","second option","third option","fourth option"],"correct":"first option"}]}` }],
      getSystemPrompt(req.user.id, langs.native_lang, langs.learn_lang),
      2000
    );
    res.json(normalizeQuestions(JSON.parse(raw)));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/ai/bulk', auth, aiLimit, async (req, res) => {
  try {
    const { words } = req.body;
    const langs = await getUserLangs(req.user.id);
    const ll = LEARN[langs.learn_lang] || 'English';
    const raw = await callClaude(
      [{ role: 'user', content: `Words in ${ll}: ${words.join(', ')}\nFor each word provide translation, transcription, level, example, grammar note (all in native language).\nReturn ONLY JSON:\n{"words":[{"word":"w1","translation":"t1","transcription":"IPA","level":"B1","example_en":"sentence","example_ru":"translation","grammar_note":"type"}]}` }],
      getSystemPrompt(req.user.id, langs.native_lang, langs.learn_lang),
      2000
    );
    res.json(JSON.parse(raw));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/ai/image', auth, aiLimit, async (req, res) => {
  // Groq does not support image input — return helpful error
  res.status(400).json({ error: 'Photo mode requires a vision-capable AI. Use Manual or List mode instead.' });
});

app.post('/api/ai/analyze', auth, aiLimit, async (req, res) => {
  try {
    const { text } = req.body;
    const langs = await getUserLangs(req.user.id);
    const ll = LEARN[langs.learn_lang] || 'English';
    const raw = await callClaude(
      [{ role: 'user', content: `Analyze this ${ll} text:\n"${text}"\n\nProvide: vocabulary analysis, grammar points, difficulty level, and key vocabulary with translations in native language.\nReturn ONLY JSON:\n{"level":"B2","summary":"brief summary in native language","vocabulary":[{"word":"w1","translation":"t1","grammar_note":"type"}],"grammar_points":["point1","point2"],"questions":[{"q":"?","options":["A","B","C","D"],"correct":"A"}]}` }],
      getSystemPrompt(req.user.id, langs.native_lang, langs.learn_lang),
      2000
    );
    res.json(JSON.parse(raw));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ── START ─────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server on port ${PORT}`);
  });
}).catch(err => {
  console.error('DB init failed:', err);
  process.exit(1);
});

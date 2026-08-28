require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db, DAYS } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const SESSION_COOKIE = 'arena_session';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me-123';

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- auth helpers ----------

function signSession(member) {
  return jwt.sign({ id: member.id, email: member.email, name: member.name }, JWT_SECRET, {
    expiresIn: '30d',
  });
}

function attachUser(req, res, next) {
  const token = req.cookies[SESSION_COOKIE];
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      req.user = null;
    }
  }
  next();
}

function requireUser(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Треба да сте најавени.' });
  next();
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme === 'Basic' && encoded) {
    const decoded = Buffer.from(encoded, 'base64').toString('utf8');
    const idx = decoded.indexOf(':');
    const user = decoded.slice(0, idx);
    const pass = decoded.slice(idx + 1);
    if (user === ADMIN_USER && pass === ADMIN_PASSWORD) return next();
  }
  res.set('WWW-Authenticate', 'Basic realm="Arena Fitness Admin"');
  return res.status(401).json({ error: 'Admin auth required' });
}

app.use(attachUser);

// ---------- public info ----------

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Arena Fitness Prilep',
    address: 'Катна гаража, приземје, Прилеп',
    phone: '075 307 690',
    instagram: 'https://www.instagram.com/arenafitnesprilep',
    hours: [
      { label: 'Понеделник – Петок', value: '09:00 – 22:00' },
      { label: 'Сабота', value: '09:00 – 21:00' },
      { label: 'Недела', value: 'Затворено' },
    ],
    days: DAYS,
  });
});

// ---------- plans ----------

app.get('/api/plans', (req, res) => {
  const rows = db.prepare('SELECT * FROM plans ORDER BY sort_order ASC').all();
  res.json(rows.map((r) => ({ ...r, features: JSON.parse(r.features), highlighted: !!r.highlighted })));
});

// ---------- schedule ----------

function nextOccurrence(dayOfWeek, timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const result = new Date(now);
  const jsDay = now.getDay(); // 0=Sun..6=Sat
  const targetJsDay = dayOfWeek === 6 ? 0 : dayOfWeek + 1; // our day_of_week: 0=Mon..6=Sun -> JS: 0=Sun..6=Sat
  let diff = (targetJsDay - jsDay + 7) % 7;
  result.setDate(now.getDate() + diff);
  result.setHours(h, m, 0, 0);
  if (diff === 0 && result < now) {
    result.setDate(result.getDate() + 7);
  }
  return result.toISOString().slice(0, 10);
}

app.get('/api/schedule', (req, res) => {
  const rows = db.prepare('SELECT * FROM schedule ORDER BY day_of_week ASC, time ASC').all();
  const countStmt = db.prepare(
    'SELECT COUNT(*) AS c FROM bookings WHERE schedule_id = ? AND class_date = ?'
  );
  const enriched = rows.map((r) => {
    const nextDate = nextOccurrence(r.day_of_week, r.time);
    const booked = countStmt.get(r.id, nextDate).c;
    return {
      ...r,
      day_label: DAYS[r.day_of_week],
      next_date: nextDate,
      spots_left: Math.max(0, r.capacity - booked),
    };
  });
  res.json(enriched);
});

// ---------- auth ----------

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Име, email и лозинка се задолжителни.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Лозинката мора да има барем 6 карактери.' });
  }
  const existing = db.prepare('SELECT id FROM members WHERE email = ?').get(email.toLowerCase());
  if (existing) return res.status(409).json({ error: 'Веќе постои сметка со овој email.' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO members (name, email, password_hash, phone) VALUES (?, ?, ?, ?)')
    .run(name, email.toLowerCase(), hash, phone || null);
  const member = { id: info.lastInsertRowid, name, email: email.toLowerCase() };
  const token = signSession(member);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.json({ user: member });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Внесете email и лозинка.' });
  const row = db.prepare('SELECT * FROM members WHERE email = ?').get(String(email).toLowerCase());
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Погрешен email или лозинка.' });
  }
  const member = { id: row.id, name: row.name, email: row.email };
  const token = signSession(member);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.json({ user: member });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie(SESSION_COOKIE);
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Не сте најавени.' });
  res.json({ user: req.user });
});

// ---------- member account: bookings ----------

app.get('/api/account/bookings', requireUser, (req, res) => {
  const rows = db
    .prepare(
      `SELECT b.id, b.class_date, s.class_name, s.time, s.room, s.duration_min, s.day_of_week
       FROM bookings b JOIN schedule s ON s.id = b.schedule_id
       WHERE b.member_id = ?
       ORDER BY b.class_date ASC, s.time ASC`
    )
    .all(req.user.id);
  res.json(rows.map((r) => ({ ...r, day_label: DAYS[r.day_of_week] })));
});

app.post('/api/bookings', requireUser, (req, res) => {
  const { schedule_id, class_date } = req.body || {};
  const cls = db.prepare('SELECT * FROM schedule WHERE id = ?').get(schedule_id);
  if (!cls) return res.status(404).json({ error: 'Часот не е пронајден.' });

  const booked = db
    .prepare('SELECT COUNT(*) AS c FROM bookings WHERE schedule_id = ? AND class_date = ?')
    .get(schedule_id, class_date).c;
  if (booked >= cls.capacity) {
    return res.status(409).json({ error: 'Нема слободни места за овој термин.' });
  }

  try {
    const info = db
      .prepare('INSERT INTO bookings (member_id, schedule_id, class_date) VALUES (?, ?, ?)')
      .run(req.user.id, schedule_id, class_date);
    res.status(201).json({ id: info.lastInsertRowid });
  } catch (e) {
    if (String(e.message).includes('UNIQUE')) {
      return res.status(409).json({ error: 'Веќе имате резервација за овој час.' });
    }
    res.status(500).json({ error: 'Настана грешка при резервацијата.' });
  }
});

app.delete('/api/bookings/:id', requireUser, (req, res) => {
  const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!row || row.member_id !== req.user.id) {
    return res.status(404).json({ error: 'Резервацијата не е пронајдена.' });
  }
  db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ---------- leads (contact / trial session requests) ----------

app.post('/api/leads', (req, res) => {
  const { name, email, phone, interest, message } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Име и email се задолжителни.' });
  const info = db
    .prepare(
      'INSERT INTO leads (name, email, phone, interest, message) VALUES (?, ?, ?, ?, ?)'
    )
    .run(name, email, phone || null, interest || null, message || null);
  res.status(201).json({ id: info.lastInsertRowid });
});

// ---------- admin ----------

app.get('/api/admin/leads', requireAdmin, (req, res) => {
  res.json(db.prepare('SELECT * FROM leads ORDER BY created_at DESC').all());
});

app.patch('/api/admin/leads/:id', requireAdmin, (req, res) => {
  const { status } = req.body || {};
  if (!status) return res.status(400).json({ error: 'Статус е задолжителен.' });
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ ok: true });
});

app.get('/api/admin/members', requireAdmin, (req, res) => {
  res.json(
    db
      .prepare(
        `SELECT m.id, m.name, m.email, m.phone, m.created_at,
                (SELECT COUNT(*) FROM bookings b WHERE b.member_id = m.id) AS booking_count
         FROM members m ORDER BY m.created_at DESC`
      )
      .all()
  );
});

app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  res.json(
    db
      .prepare(
        `SELECT b.id, b.class_date, b.created_at, s.class_name, s.time, m.name AS member_name, m.email AS member_email
         FROM bookings b
         JOIN schedule s ON s.id = b.schedule_id
         JOIN members m ON m.id = b.member_id
         ORDER BY b.class_date ASC, s.time ASC`
      )
      .all()
  );
});

app.post('/api/admin/plans', requireAdmin, (req, res) => {
  const { name, price, period, tagline, features, highlighted, sort_order } = req.body || {};
  if (!name || price == null || !period) {
    return res.status(400).json({ error: 'Име, цена и период се задолжителни.' });
  }
  const info = db
    .prepare(
      `INSERT INTO plans (name, price, period, tagline, features, highlighted, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      name,
      price,
      period,
      tagline || '',
      JSON.stringify(features || []),
      highlighted ? 1 : 0,
      sort_order || 0
    );
  res.status(201).json({ id: info.lastInsertRowid });
});

app.patch('/api/admin/plans/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM plans WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Планот не е пронајден.' });
  const { name, price, period, tagline, features, highlighted, sort_order } = req.body || {};
  db.prepare(
    `UPDATE plans SET name=?, price=?, period=?, tagline=?, features=?, highlighted=?, sort_order=? WHERE id=?`
  ).run(
    name ?? existing.name,
    price ?? existing.price,
    period ?? existing.period,
    tagline ?? existing.tagline,
    features ? JSON.stringify(features) : existing.features,
    highlighted != null ? (highlighted ? 1 : 0) : existing.highlighted,
    sort_order ?? existing.sort_order,
    req.params.id
  );
  res.json({ ok: true });
});

app.delete('/api/admin/plans/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM plans WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.post('/api/admin/schedule', requireAdmin, (req, res) => {
  const { day_of_week, time, class_name, room, duration_min, level, capacity } = req.body || {};
  if (day_of_week == null || !time || !class_name) {
    return res.status(400).json({ error: 'Ден, време и име на час се задолжителни.' });
  }
  const info = db
    .prepare(
      `INSERT INTO schedule (day_of_week, time, class_name, room, duration_min, level, capacity)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(day_of_week, time, class_name, room || '', duration_min || 50, level || 'Сите нивоа', capacity || 16);
  res.status(201).json({ id: info.lastInsertRowid });
});

app.patch('/api/admin/schedule/:id', requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM schedule WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Часот не е пронајден.' });
  const { day_of_week, time, class_name, room, duration_min, level, capacity } = req.body || {};
  db.prepare(
    `UPDATE schedule SET day_of_week=?, time=?, class_name=?, room=?, duration_min=?, level=?, capacity=? WHERE id=?`
  ).run(
    day_of_week ?? existing.day_of_week,
    time ?? existing.time,
    class_name ?? existing.class_name,
    room ?? existing.room,
    duration_min ?? existing.duration_min,
    level ?? existing.level,
    capacity ?? existing.capacity,
    req.params.id
  );
  res.json({ ok: true });
});

app.delete('/api/admin/schedule/:id', requireAdmin, (req, res) => {
  db.prepare('DELETE FROM schedule WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Arena Fitness Prilep server running on port ${PORT}`);
});

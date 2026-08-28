const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.join(__dirname, 'arena.db');
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const DAYS = ['Понеделник', 'Вторник', 'Среда', 'Четврток', 'Петок', 'Сабота', 'Недела'];

function tableHasColumn(table, column) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all();
  return cols.some((c) => c.name === column);
}

function needsRecreate() {
  const tbl = db
    .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='plans'")
    .get();
  if (!tbl) return false; // fresh DB, nothing to recreate
  return !tableHasColumn('plans', 'period');
}

if (needsRecreate()) {
  db.exec(`
    DROP TABLE IF EXISTS bookings;
    DROP TABLE IF EXISTS leads;
    DROP TABLE IF EXISTS members;
    DROP TABLE IF EXISTS schedule;
    DROP TABLE IF EXISTS plans;
  `);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL,
    period TEXT NOT NULL,
    tagline TEXT NOT NULL,
    features TEXT NOT NULL,
    highlighted INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week INTEGER NOT NULL,
    time TEXT NOT NULL,
    class_name TEXT NOT NULL,
    room TEXT NOT NULL,
    duration_min INTEGER NOT NULL,
    level TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 16
  );

  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    phone TEXT,
    plan_id INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (plan_id) REFERENCES plans(id)
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    interest TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'ново',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL,
    schedule_id INTEGER NOT NULL,
    class_date TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (member_id) REFERENCES members(id),
    FOREIGN KEY (schedule_id) REFERENCES schedule(id),
    UNIQUE(member_id, schedule_id, class_date)
  );
`);

const planCount = db.prepare('SELECT COUNT(*) AS c FROM plans').get().c;
if (planCount === 0) {
  const insertPlan = db.prepare(`
    INSERT INTO plans (name, price, period, tagline, features, highlighted, sort_order)
    VALUES (@name, @price, @period, @tagline, @features, @highlighted, @sort_order)
  `);
  const plans = [
    {
      name: 'Дневен влез',
      price: 200,
      period: 'по посета',
      tagline: 'Пробај ја сала без обврска.',
      features: JSON.stringify([
        'Целосен пристап до сала за фитнес',
        'Кардио и слободни тегови',
        'Свлекувалница и туширање',
      ]),
      highlighted: 0,
      sort_order: 1,
    },
    {
      name: 'Студентски',
      price: 1400,
      period: 'месечно',
      tagline: 'Намалена цена со студентска легитимација.',
      features: JSON.stringify([
        'Целосен пристап до сала',
        'Пристап до групни тренинзи',
        'Важи со валидна студентска легитимација',
      ]),
      highlighted: 0,
      sort_order: 2,
    },
    {
      name: 'Месечен',
      price: 1800,
      period: 'месечно',
      tagline: 'Најбаран пакет за редовни members.',
      features: JSON.stringify([
        'Целосен пристап до сала',
        'Неограничени групни тренинзи',
        'Бесплатна проценка на состојба',
      ]),
      highlighted: 1,
      sort_order: 3,
    },
    {
      name: '3 месеци',
      price: 4800,
      period: 'на 3 месеци',
      tagline: 'Заштеди наспроти месечно плаќање.',
      features: JSON.stringify([
        'Сè од месечниот пакет',
        'Заклучена цена за 3 месеци',
        'Приоритетна резервација за групни часови',
      ]),
      highlighted: 0,
      sort_order: 4,
    },
    {
      name: '6 месеци',
      price: 8700,
      period: 'на 6 месеци',
      tagline: 'Најдобра цена по месец за посветени members.',
      features: JSON.stringify([
        'Сè од месечниот пакет',
        '1 бесплатна сесија со тренер',
        'Приоритетна резервација за групни часови',
      ]),
      highlighted: 0,
      sort_order: 5,
    },
    {
      name: 'Годишен',
      price: 15600,
      period: 'годишно',
      tagline: 'Најниска месечна цена, за долгорочна посветеност.',
      features: JSON.stringify([
        'Сè од месечниот пакет',
        '2 бесплатни сесии со тренер годишно',
        'Замрзнување на членство до 30 дена',
      ]),
      highlighted: 0,
      sort_order: 6,
    },
  ];
  const insertMany = db.transaction((rows) => rows.forEach((r) => insertPlan.run(r)));
  insertMany(plans);
}

const scheduleCount = db.prepare('SELECT COUNT(*) AS c FROM schedule').get().c;
if (scheduleCount === 0) {
  const insertClass = db.prepare(`
    INSERT INTO schedule (day_of_week, time, class_name, room, duration_min, level, capacity)
    VALUES (@day_of_week, @time, @class_name, @room, @duration_min, @level, @capacity)
  `);
  const classes = [
    { day_of_week: 0, time: '08:00', class_name: 'Функционален тренинг', room: 'Сала 1', duration_min: 50, level: 'Сите нивоа', capacity: 14 },
    { day_of_week: 0, time: '18:00', class_name: 'Спининг', room: 'Спининг сала', duration_min: 45, level: 'Сите нивоа', capacity: 16 },
    { day_of_week: 0, time: '19:00', class_name: 'Јога', room: 'Сала 2', duration_min: 60, level: 'Почетници', capacity: 12 },
    { day_of_week: 1, time: '17:00', class_name: 'Зумба', room: 'Сала 1', duration_min: 50, level: 'Сите нивоа', capacity: 18 },
    { day_of_week: 1, time: '19:00', class_name: 'HIIT', room: 'Сала 1', duration_min: 40, level: 'Напредно', capacity: 14 },
    { day_of_week: 2, time: '08:00', class_name: 'Функционален тренинг', room: 'Сала 1', duration_min: 50, level: 'Сите нивоа', capacity: 14 },
    { day_of_week: 2, time: '18:00', class_name: 'Спининг', room: 'Спининг сала', duration_min: 45, level: 'Сите нивоа', capacity: 16 },
    { day_of_week: 2, time: '19:30', class_name: 'Пилатес', room: 'Сала 2', duration_min: 50, level: 'Почетници', capacity: 12 },
    { day_of_week: 3, time: '17:00', class_name: 'Зумба', room: 'Сала 1', duration_min: 50, level: 'Сите нивоа', capacity: 18 },
    { day_of_week: 3, time: '19:00', class_name: 'HIIT', room: 'Сала 1', duration_min: 40, level: 'Напредно', capacity: 14 },
    { day_of_week: 4, time: '08:00', class_name: 'Функционален тренинг', room: 'Сала 1', duration_min: 50, level: 'Сите нивоа', capacity: 14 },
    { day_of_week: 4, time: '18:00', class_name: 'Спининг', room: 'Спининг сала', duration_min: 45, level: 'Сите нивоа', capacity: 16 },
    { day_of_week: 4, time: '19:00', class_name: 'Јога', room: 'Сала 2', duration_min: 60, level: 'Почетници', capacity: 12 },
    { day_of_week: 5, time: '10:00', class_name: 'Функционален тренинг', room: 'Сала 1', duration_min: 50, level: 'Сите нивоа', capacity: 14 },
    { day_of_week: 5, time: '11:00', class_name: 'Зумба', room: 'Сала 1', duration_min: 50, level: 'Сите нивоа', capacity: 18 },
  ];
  const insertMany = db.transaction((rows) => rows.forEach((r) => insertClass.run(r)));
  insertMany(classes);
}

module.exports = { db, DAYS };

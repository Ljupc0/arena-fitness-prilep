# Arena Fitness Prilep — Full-Stack Website (демо/портфолио)

Комплетна full-stack веб-страница инспирирана од реалниот Instagram профил на
**Arena Fitness Prilep** (фитнес центар во Прилеп, Северна Македонија —
[@arenafitnesprilep](https://www.instagram.com/arenafitnesprilep)).

**Важно:** ова е демо/портфолио проект, направен со реалното име и јавно
достапни податоци за контакт на бизнисот (адреса, работно време, телефон), но
**не е нивна официјална веб-страница**. Сите графики се оригинални (не се
копирани фотографии од нивниот Instagram — тоа би било copyright проблем).
Секоја страница на сајтот има забелешка за ова во футерот.

## Технологии

- **Backend:** Node.js, Express, better-sqlite3
- **Frontend:** чист HTML/CSS/JavaScript (без framework)
- **Admin автентикација:** HTTP Basic Auth за `/admin.html`
- **Members автентикација:** email + лозинка, сесии преку signed JWT во httpOnly cookie

## Функции

- Почетна страница со hero, клучни придобивки, преглед на ценовник
- **Ценовник**: 6 пакети за членство (дневен, студентски, месечен, 3/6 месеци, годишен) со реални карактеристики
- **Распоред на групни тренинзи**: неделен распоред по денови (функционален тренинг, зумба, HIIT, спининг, јога, пилатес), со резервација на место во реално време (капацитет по термин)
- **Кориснички сметки**: регистрација/најава/одјава, резервација и откажување термини од профилот
- **Контакт/пробен термин форма**: се зачувува во база (не е фејк), видлива во admin панелот како "lead"
- **Admin панел**: барања (leads), резервации, members, распоред (додавање/бришење часови), планови (додавање/бришење пакети)
- Целосно responsive, light/dark mode

## Локално стартување

```bash
npm install
cp .env.example .env
# по желба измени ADMIN_USER / ADMIN_PASSWORD во .env
npm start
```

Отвори `http://localhost:3000` за страницата и `http://localhost:3000/admin.html`
за admin панелот (стандардна најава: `admin` / `change-me-123` — смени го ова
во `.env` пред јавен deploy). Постави и `JWT_SECRET` на долга случајна низа.

## API преглед

| Метод | Рута | Опис | Заштитено |
|---|---|---|---|
| GET | `/api/info` | Контакт/работно време | не |
| GET | `/api/plans` | Список пакети за членство | не |
| GET | `/api/schedule` | Неделен распоред + слободни места | не |
| POST | `/api/auth/register` | Регистрација | не |
| POST | `/api/auth/login` | Најава | не |
| POST | `/api/auth/logout` | Одјава | не |
| GET | `/api/auth/me` | Тековен member | не (401 ако не е најавен) |
| GET | `/api/account/bookings` | Резервации на member | member |
| POST | `/api/bookings` | Резервирај термин | member |
| DELETE | `/api/bookings/:id` | Откажи резервација | member |
| POST | `/api/leads` | Барање за пробен термин | не |
| GET/PATCH | `/api/admin/leads` | Управување со leads | admin |
| GET | `/api/admin/members` | Список members | admin |
| GET | `/api/admin/bookings` | Сите резервации | admin |
| GET/POST/PATCH/DELETE | `/api/admin/plans` | Управување со пакети | admin |
| GET/POST/PATCH/DELETE | `/api/admin/schedule` | Управување со распоред | admin |

## Deploy бесплатно (Render.com)

1. Push-ни ја оваа папка на GitHub репозиториум.
2. На [render.com](https://render.com) → **New → Web Service** → Public Git Repository → внеси го URL-то на репото.
3. **Build command:** `npm install` · **Start command:** `npm start` · **Instance type:** Free
4. Environment variables: `ADMIN_USER`, `ADMIN_PASSWORD`, `JWT_SECRET` (случаен string).
5. Node верзијата е веќе pin-ната на `22.x` во `package.json` (за да работи чисто со `better-sqlite3`).
6. По првиот deploy, Render дава URL како `https://arena-fitness-prilep.onrender.com`.

**Бесплатен tier:** сервисот "спие" по 15 мин неактивност, се буди за ~30-50 сек на следната посета.

## Идеи за проширување

- Реален email/SMS кога пристигнува ново барање или резервација
- Профили на тренери
- Плаќање на членство онлајн
- Галерија со реални фотографии од салата (со дозвола на сопствениците)

# ALAMAT — minimal Django API

Lightweight backend for **accounts + cloud save**. The playable game remains the HTML prototype (`alamat-prototype.html`).

## What this API does

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `GET /api/health/` | public | Liveness check |
| `POST /api/auth/register/` | public | `{ "username", "password" }` → token |
| `POST /api/auth/login/` | public | `{ "username", "password" }` → token |
| `POST /api/auth/logout/` | token | Invalidate token |
| `GET /api/save/` | token | Load cloud save JSON |
| `PUT /api/save/` | token | `{ "data": { ... } }` save progress |

Save payload matches the prototype’s localStorage shape (`party`, `selyo`, `herbs`, `f`, `mapId`, `x`, `y`, `dir`).

## Setup

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

API base: `http://127.0.0.1:8000/api/`

## Quick test with curl

```bash
curl http://127.0.0.1:8000/api/health/

curl -X POST http://127.0.0.1:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"traveler","password":"testpass123"}'

curl -X POST http://127.0.0.1:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"traveler","password":"testpass123"}'
```

## Architecture note

- **Client (now):** HTML prototype — rendering, input, combat UI  
- **Server (this):** auth + persistence only  
- **Later:** move battle resolution server-side when needed  

If Django feels heavy for day-to-day playtesting, keep using localStorage (F5/F9) and only run this API when you need cloud saves.

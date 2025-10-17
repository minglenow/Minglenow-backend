# MingleNow Backend

## Quickstart (development)

1. Copy .env.example to .env and set values.
2. Start services with docker-compose (from repo root): docker-compose up --build
3. Run DB migrations (use TypeORM CLI or apply SQL in migrations/).
4. Start backend in dev: cd backend && npm run dev

Endpoints:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/matches/candidates
- POST /api/matches/like
- POST /api/payments/create-checkout
- POST /api/payments/webhook

Socket.IO: connect to ws://<host>:4000 with auth token in handshake: io(url, { auth: { token } })
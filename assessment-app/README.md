# EduAssess

EduAssess is a Next.js assessment platform with:
- Groq-backed Genkit recommendations
- PostgreSQL + Prisma persistence
- Neo-brutalist visual design system

## 1. Setup

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Fill `.env`:

- `DATABASE_URL`: PostgreSQL connection string
- `GROQ_API_KEY`: Groq API key
- `JWT_SECRET`: random secret for signing auth cookies
- `ADMIN_EMAIL`: default admin login email
- `ADMIN_PASSWORD`: default admin login password (seeded if absent)

Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## 2. Run

```bash
npm run dev
```

App runs on `http://localhost:9002`.

## 3. Data Model

Prisma schema is in `prisma/schema.prisma`.

Main entities:
- `Assessment`
- `AssessmentResult`

On first load, predefined assessments from `src/lib/constants.ts` are seeded into PostgreSQL.

## 4. API Endpoints

- `GET /api/assessments`
- `POST /api/assessments`
- `GET /api/results?userId=<id>`
- `POST /api/results`
- `GET /api/admin/stats`
- `POST /api/recommendations`

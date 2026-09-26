# Porzz Control

Admin panel untuk SAMP script injector. Next.js 14 + Prisma + Supabase + JWT.

## Setup

1. Copy `.env.example` ke `.env.local`, isi dengan kredensial Supabase lo.

2. Install deps:
```bash
npm install
```

3. Push schema ke Supabase:
```bash
npx prisma db push
```

4. Jalankan dev:
```bash
npm run dev
```

5. Buat owner pertama — hit endpoint ini sekali:
```bash
curl -X POST http://localhost:3000/api/auth/setup
```
Setelah berhasil, **hapus** file `src/app/api/auth/setup/route.ts`.

6. Login di `/login` dengan `OWNER_USERNAME` dan `OWNER_PASSWORD` dari env.

## Deploy ke Vercel

```bash
vercel deploy
```

Tambahkan env vars di Vercel dashboard: `DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `OWNER_USERNAME`, `OWNER_PASSWORD`.

## Fitur

- Dashboard: statistik script, key, download, unique devices + trend chart
- Script Library: list semua script dengan key count
- Create Script: form buat script baru + upload .lua
- Create Access: buat/hapus akun admin (owner only)
- Logs Admin: audit trail semua aksi admin

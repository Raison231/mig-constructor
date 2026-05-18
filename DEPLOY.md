# MIG Constructor — Deploy Guide

## Vercel (production)

1. Импорт репо `Raison231/mig-constructor` на vercel.com
2. Framework: **Next.js** (определяется автоматически)
3. Root Directory: `./` (монорепо)
4. Build Command: `pnpm turbo run build --filter=web` (уже в `vercel.json`)
5. Output Directory: `apps/web/.next`
6. Install Command: `pnpm install --frozen-lockfile=false`

## Environment Variables

```bash
# Realtime cursors (опционально)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Аналитика (опционально)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=mig-constructor.app
```

## Custom Domain

1. В Vercel → Project Settings → Domains → Add `mig-constructor.app`
2. У регистратора (Namecheap / Cloudflare / Reg.ru) добавить:
   - `A` запись `@` → `76.76.21.21`
   - `CNAME` запись `www` → `cname.vercel-dns.com`
3. Подождать SSL (Vercel выпустит автоматически)
4. Включить «Always HTTPS» и HSTS preload

## AR Requirements

- HTTPS обязательно (WebXR не работает на HTTP, кроме localhost)
- Permissions-Policy уже выставлен в `vercel.json`
- Тест: открыть на Android Chrome 90+ / iOS Safari 17+ (через WebXR Viewer)

## Realtime Cursors (Supabase)

1. Создать проект на supabase.com
2. Включить Realtime в **Database → Replication**
3. Скопировать `Project URL` и `anon public key` в env
4. Без env переменных realtime просто выключен — приложение работает в одиночку

## Локальная разработка

```bash
pnpm install
pnpm dev
# open http://localhost:3000
```

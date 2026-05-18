# 🚀 MIG CONSTRUCTOR — Deploy Guide

Полный гайд по деплою на Vercel + подключение Supabase Realtime + кастомный домен.

## 1. Vercel Deploy (5 минут)

### Один клик

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Raison231/mig-constructor&project-name=mig-constructor&repository-name=mig-constructor)

### Вручную

```bash
npm i -g vercel
vercel login
vercel link
vercel --prod
```

Vercel сам подхватит `vercel.json` из корня, соберёт через Turborepo (`pnpm turbo run build --filter=web`) и задеплоит `apps/web`.

### Настройки проекта в Vercel UI

- **Framework Preset:** Next.js (определяется автоматически)
- **Root Directory:** оставить пустым (монорепо собирается через turbo)
- **Node Version:** 20.x
- **Install Command:** `pnpm install --frozen-lockfile=false`
- **Build Command:** `pnpm turbo run build --filter=web`
- **Output Directory:** `apps/web/.next`

## 2. Environment Variables

Добавь в Vercel → Settings → Environment Variables:

| Переменная | Значение | Обязательно |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Только для Realtime коллаборации |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Только для Realtime коллаборации |

Если переменные не заданы — приложение работает в offline-режиме без коллаборации (всё остальное продолжает пахать).

## 3. Supabase Realtime Setup

1. Создай проект на [supabase.com](https://supabase.com)
2. Project Settings → API → скопируй `Project URL` и `anon public key`
3. Database → Replication → включи Realtime для presence (по дефолту включено)
4. Вставь ключи в Vercel env
5. Передеплой — Realtime cursors заработают автоматически

## 4. Custom Domain

### Подключение домена в Vercel

1. Vercel Project → Settings → Domains → `Add`
2. Введи домен (например `mig-constructor.com` или `app.mig.studio`)
3. Vercel покажет DNS-записи

### DNS настройка у регистратора

**Для корневого домена** (`mig-constructor.com`):
```
Type: A
Name: @
Value: 76.76.21.21
```

**Для поддомена** (`app.mig.studio`):
```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

SSL-сертификат Vercel выпустит сам через Let's Encrypt — обычно за 5–60 минут после DNS-пропагации.

### Рекомендуемые домены

- `mig-constructor.com` — основной
- `constructor.mig.studio` — поддомен под зонтиком студии
- `build.mig.space` — связка с MIG SPACE

## 5. Production Checklist

- [ ] `vercel --prod` прошёл без ошибок
- [ ] Главная грузится, 3D-сцена рендерится
- [ ] Модули можно перетаскивать и собирать домик
- [ ] Templates Gallery открывается, пресеты подгружаются
- [ ] Compare View снимает A/B снапшоты
- [ ] Annotations добавляются и сохраняются в localStorage
- [ ] Physics drop работает (Rapier подгрузился)
- [ ] AR-кнопка показывается на мобильном Chrome (Android)
- [ ] Realtime cursors работают между двумя вкладками (если Supabase подключён)
- [ ] Cinematic режимы (walkthrough/drone) запускаются
- [ ] BOM PDF экспортируется
- [ ] Locale switching работает (RU/EN/KA)
- [ ] Lighthouse Performance ≥ 85

## 6. Troubleshooting

**Build падает на Rapier WASM** — добавь в `next.config.js`:
```js
experimental: { esmExternals: 'loose' }
```

**AR не работает на iOS** — это нормально, WebXR на iOS ограничен. Используй AR Quick Look через `.usdz` экспорт (роадмап Wave 9).

**Supabase Realtime не коннектится** — проверь что `NEXT_PUBLIC_*` переменные начинаются именно с `NEXT_PUBLIC_` (без него Next не пробросит их в браузер).

**Большой bundle** — основные тяжести: Three.js, R3F, drei, Rapier. Они уже в `optimizePackageImports`. Дополнительно можно вынести AR/Realtime в dynamic import.

## 7. Production URLs

- **Repo:** https://github.com/Raison231/mig-constructor
- **Preview deploys:** автоматически на каждый PR
- **Production:** `main` → автодеплой

---

🌊 Built with MIG Wave Pattern. Deploy = последняя волна перед штормом юзеров.

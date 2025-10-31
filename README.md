# Dev Fortune Cookie — Sidecar in Practice 🍪⚙️

<!--toc:start-->

- [Dev Fortune Cookie — Sidecar in Practice 🍪⚙️](#dev-fortune-cookie-sidecar-in-practice-🍪️)
  - [✨ Highlights](#highlights)
  - [🧱 Architecture](#🧱-architecture)
  - [📂 Repo Structure (high level)](#📂-repo-structure-high-level)
  - [🚀 Quick Start](#🚀-quick-start)
  - [🧪 Demo Scripts (optional)](#🧪-demo-scripts-optional)
  - [🔌 Endpoints (App)](#🔌-endpoints-app)
  - [🌐 Frontend (CORS‑free)](#🌐-frontend-corsfree)
  - [⚙️ Sidecar Nginx (key bits)](#️-sidecar-nginx-key-bits)
  - [🧩 Local Dev Tips](#🧩-local-dev-tips)
  - [🧰 Favorite TUIs (optional slide/demo)](#🧰-favorite-tuis-optional-slidedemo)
  - [🐞 Troubleshooting](#🐞-troubleshooting)
  - [📝 License](#📝-license)
  - [🙌 Credits](#🙌-credits) - [Appendix — Handy one‑liners](#appendix-handy-oneliners)
  <!--toc:end-->

Built for **DevDay**; ships with a slick UI (cookie crack + confetti), a deterministic endpoint for safe caching, and ready‑to‑run scripts.

## [Dev Presentation](https://gamma.app/docs/Sidecar-in-Practice-mslks37wmfj4x29)

## ✨ Highlights

- **Sidecar features**:
  - **Caching** for `/api/fortune` (TTL 30s)
  - **Rate limiting** 5 r/s (burst 10)
  - **Retries** for `/api/flaky` (up to 3 on timeouts/5xx)
  - **Rich logs**: `cache=HIT|MISS`, `rt`, `us_rt`, `upstream_status`, `X-Request-Id`

- **UI that explains itself**:
  - **Mode**: _Sidecar_ (via `/api`) vs _Direct_ (via `/direct`)
  - **Selection**: _Random_ vs **Pick N** (carousel + direct input with clamping)
  - **Metrics**: **Client‑measured Request Time (ms)**, server delay (secondary), **X‑Cache** chip
  - **Copy**: _“Danny's DevDay Fortune Cookie Demo - My Fortune is … \<fortune>”_

- **CORS‑free by design**: SPA calls **same‑origin** relative paths; the **frontend Nginx** proxies to the sidecar/app.

---

## 🧱 Architecture

    +----------------------------+          +-----------------------------+
    |        Frontend (3000)     |          |           Sidecar (8081)    |
    |  Nginx + React/Vite build  |  /api -> |  Nginx: cache/limits/retry  | -> app:8080
    |  - /api/*  -> sidecar:8081 |          |  Adds X-Cache, X-Request-Id |
    |  - /direct/* -> app:8080   | <- logs  |  Rich access logs           |
    +--------------+-------------+          +--------------+--------------+
                   |                                         |
                   |                                         v
                   |                           +-----------------------------+
                   |                           |           App (8080)        |
                   |                           | .NET Minimal API            |
                   |                           | /health                     |
                   |                           | /api/fortune                |
                   |                           | /api/fortune/{n} (determin.)|
                   |                           | /api/flaky (50% fail)       |
                   |                           +-----------------------------+

**Same‑origin routes (no CORS):**

- **Sidecar path:** `GET /api/...` → forwarded by frontend Nginx to `sidecar:8081`
- **Direct path:** `GET /direct/...` → forwarded by frontend Nginx to `app:8080` (adds `X‑Cache: N/A`)

---

## 📂 Repo Structure (high level)

    App/                     # .NET Minimal API
    Frontend/                # React app + frontend Nginx delivery
    sidecar/                 # sidecar nginx.conf (mounted into container)
    docker-compose.yml
    devday-demo-pack/        # nginx configs, scripts & docs (optional bundle)

---

## 🚀 Quick Start

> Requires **Docker** + **Docker Compose**.

```bash
# From repo root
docker compose up -d --build
```

Open the UI:

- **Sidecar:** <http://localhost:3000/>
- **Direct:** <http://localhost:3000/?mode=direct> _(depending on your UI toggle, you can also switch inside the app)_

**Sanity checks (CLI):**

```bash
# App health
curl -s http://localhost:8080/health

# Sidecar caching: MISS then HIT (within 30s)
curl -i -s http://localhost:3000/api/fortune | grep -i 'HTTP\|X-Cache'
curl -i -s http://localhost:3000/api/fortune | grep -i 'HTTP\|X-Cache'

# Deterministic cache (safe to cache)
curl -i -s http://localhost:3000/api/fortune/3 | grep -i 'HTTP\|X-Cache'
curl -i -s http://localhost:3000/api/fortune/3 | grep -i 'HTTP\|X-Cache'

# Direct path (no sidecar): always X-Cache: N/A
curl -i -s http://localhost:3000/direct/fortune/3 | grep -i 'HTTP\|X-Cache'
```

---

## 🧪 Demo Scripts (optional)

If you pulled in the `devday-demo-pack/` bundle:

```bash
chmod +x devday-demo-pack/scripts/*.sh

# Basic checks (MISS → HIT, direct N/A)
./devday-demo-pack/scripts/sanity.sh

# Rate limiting burst (expect some 503 via sidecar)
./devday-demo-pack/scripts/rate_limit_test.sh

# Compare flaky success: direct vs sidecar retries
./devday-demo-pack/scripts/flaky_compare.sh

# Deterministic cache for N=3 (MISS → HIT)
./devday-demo-pack/scripts/nth_cache_demo.sh 3
```

**Tail sidecar logs** (see cache status and timings live):

```bash
docker compose exec sidecar sh -c 'tail -f /var/log/nginx/access.log'
```

Each log line includes:

    client=... method=GET uri=/api/fortune/3 status=200 rt=0.003
    upstream=app:8080 us_status=200 us_rt=0.002 cache=HIT req_id=...

---

## 🔌 Endpoints (App)

- `GET /health` → `{ ok: true }`
- `GET /api/fortune` → random fortune (server introduces small delay)
- `GET /api/fortune/{n:int}` → **deterministic** fortune (safe to cache per `n`)
- `GET /api/flaky` → randomly fails (\~50%) to showcase retries

**Tip:** The UI emphasizes **client‑measured request time** so you can see the real UX benefit when the cache **HITs**.

---

## 🌐 Frontend (CORS‑free)

The SPA always calls **relative paths**:

- Sidecar: `/api/...`
- Direct: `/direct/...`

Frontend Nginx (inside the `frontend` container) proxies to the appropriate service, so the **browser origin is always `localhost:3000`**, avoiding CORS entirely.

---

## ⚙️ Sidecar Nginx (key bits)

- **Caching (30s)** for `/api/fortune` (and per‑`n` when using `/fortune/{n}`)
- **Rate limiting** `5r/s` with `burst=10`
- **Retries** for `/api/flaky` on `error timeout http_5xx` (up to 3 tries)
- **Access logs** include:
  - `cache=$upstream_cache_status`
  - `rt=$request_time` (end‑to‑end in sidecar)
  - `us_rt=$upstream_response_time` (time the app took)
  - `upstream=$upstream_addr`
  - `req_id=$request_id` (+ header `X‑Request‑Id` returned to clients)

---

## 🧩 Local Dev Tips

- **Vite** dev server? Add a proxy so `/api` and `/direct` work at `http://localhost:5173`:

  ```ts
  // vite.config.ts (snippet)
  server: {
    proxy: {
      '/api':   { target: 'http://localhost:8081', changeOrigin: false },
      '/direct': {
        target: 'http://localhost:8080',
        changeOrigin: false,
        rewrite: (p) => p.replace(/^\/direct/, '/api'),
      },
    },
  }
  ```

- Keep `fetch(..., { cache: 'no-store' })` in the UI to prevent the **browser** from masking **server‑side** caching behavior.

---

## 🧰 Favorite TUIs (optional slide/demo)

- **LazyVim** – fast Neovim IDE setup, pre‑tuned with `lazy.nvim`
- **LazyGit** – stage/commit/rebase/resolve with speed
- **LazyDocker** – one‑pane overview of containers/logs/stats

These speed up iteration and make live demos calm and fun.

---

## 🐞 Troubleshooting

- **No `HIT` after first call?**  
  Call the same path again within 30s; ensure you used the **same URL** (and same `n` when testing `/fortune/{n}`).

- **Rate limit not obvious?**  
  Increase concurrency in the provided script or click rapidly; look for **503** via the sidecar.

- **Retries not visible?**  
  Call `/flaky` 10× and compare success via sidecar vs direct.

- **CORS messages?**  
  Make sure the UI calls **relative** `/api` or `/direct` paths and that the frontend Nginx config is in place.

---

## 📝 License

N/A

---

## 🙌 Credits

Built by **Daniel Gordon** for **DevDay**.  
Sidecar proxy: **Nginx**. App: **.NET Minimal API**. UI: **React** served by **Nginx**.  
Scripts & configs included for a smooth, reliable demo.

---

### Appendix — Handy one‑liners

```bash
# Rebuild everything
docker compose up -d --build

# Stop everything
docker compose down

# Show only sidecar logs (follow)
docker compose exec sidecar sh -c 'tail -f /var/log/nginx/access.log'

# Quick cache probe
curl -i -s http://localhost:3000/api/fortune | grep -i 'HTTP\|X-Cache'
```

---

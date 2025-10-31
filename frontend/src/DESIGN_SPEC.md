# Developer Fortune Cookie — Design Specification

## Overview
Single-page demo UI showcasing the Sidecar pattern with fortune cookie interaction. Designed for live Dev Day presentations at 1280×720 projection.

---

## Layout Structure

### Container
- **Type:** Centered card layout
- **Max Width:** 672px (2xl)
- **Background:** Dark gradient `from-slate-950 via-slate-900 to-gray-900`
- **Card:** Semi-transparent dark panel with backdrop blur
  - Background: `bg-slate-800/50`
  - Border: `border-slate-700`
  - Shadow: `shadow-2xl`

### Components Hierarchy
```
Card (relative positioning)
├── Mode Badge (absolute, top-right)
├── Header
│   ├── Title: "Dev Fortune Cookie"
│   └── Subtitle (dynamic based on state)
├── Interactive Area
│   ├── Fortune Cookie (two halves)
│   ├── Paper Slip (revealed state)
│   ├── Confetti particles
│   └── Helper text
├── Metrics Display
│   ├── Latency indicator
│   └── Cache status badge
├── Controls (3 buttons)
│   ├── "Another Fortune"
│   ├── "Open Direct App"
│   └── "Open via Sidecar"
└── Footer microcopy
```

---

## Color Tokens

### Background Palette
- **Primary BG:** `#0f172a` (slate-950)
- **Secondary BG:** `#1f2937` (gray-900)
- **Card BG:** `rgba(30, 41, 59, 0.5)` (slate-800/50)

### Fortune Cookie
- **Gradient Start:** `#fbbf24` (amber-400)
- **Gradient End:** `#f59e0b` (amber-500)
- **Stroke/Texture:** `#d97706` (amber-600)

### Text
- **Primary (Title):** `#fbbf24` (amber-400)
- **Secondary:** `#e5e7eb` (gray-200)
- **Muted:** `#94a3b8` (slate-400)
- **Disabled:** `#4b5563` (gray-600)

### Status Badges
- **Cache HIT:** `#16a34a` (green-600)
- **Cache MISS:** `#f59e0b` (amber-600)
- **Cache N/A:** `#475569` (slate-600)
- **Sidecar Mode:** `#2563eb` (blue-600) with 20% opacity background
- **Direct Mode:** `#9333ea` (purple-600) with 20% opacity background

### Paper Slip
- **Background:** `#fffbeb` (amber-50)
- **Text:** `#1f2937` (gray-800)
- **Border:** `#d1d5db` (gray-300)

---

## Typography

### System
- **Font Stack:** Inter, Roboto, system-ui, sans-serif
- **Base Size:** Defined in `/styles/globals.css`

### Text Styles
| Element | Weight | Color | Notes |
|---------|--------|-------|-------|
| h1 (Title) | Bold | amber-400 | Projection-optimized |
| Subtitle | Normal | gray-400 | Dynamic text |
| Fortune Text | Medium, Italic | gray-800 | On paper slip |
| Helper Text | Normal | gray-500 | Small, `text-xs` |
| Footer | Normal | gray-600 | `text-xs` |

---

## SVG Assets

### Fortune Cookie Halves

#### Left Half
```svg
<svg viewBox="0 0 100 100">
  <defs>
    <radialGradient id="cookieGradientLeft" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </radialGradient>
  </defs>
  <path
    d="M 50 10 Q 20 30, 15 50 Q 20 70, 50 90 L 50 10"
    fill="url(#cookieGradientLeft)"
    stroke="#d97706"
    stroke-width="1"
  />
  <!-- Texture dots -->
  <circle cx="35" cy="35" r="2" fill="#d97706" opacity="0.6" />
  <circle cx="30" cy="50" r="1.5" fill="#d97706" opacity="0.6" />
  <circle cx="38" cy="60" r="2" fill="#d97706" opacity="0.6" />
  <circle cx="42" cy="45" r="1" fill="#d97706" opacity="0.6" />
</svg>
```

#### Right Half
```svg
<svg viewBox="0 0 100 100">
  <defs>
    <radialGradient id="cookieGradientRight" cx="50%" cy="50%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="100%" stop-color="#f59e0b" />
    </radialGradient>
  </defs>
  <path
    d="M 50 10 Q 80 30, 85 50 Q 80 70, 50 90 L 50 10"
    fill="url(#cookieGradientRight)"
    stroke="#d97706"
    stroke-width="1"
  />
  <!-- Texture dots -->
  <circle cx="65" cy="35" r="2" fill="#d97706" opacity="0.6" />
  <circle cx="70" cy="50" r="1.5" fill="#d97706" opacity="0.6" />
  <circle cx="62" cy="60" r="2" fill="#d97706" opacity="0.6" />
  <circle cx="58" cy="45" r="1" fill="#d97706" opacity="0.6" />
</svg>
```

#### Paper Slip
- **Shape:** Rounded rectangle
- **Classes:** `bg-amber-50 rounded-lg shadow-2xl px-8 py-6`
- **Max Width:** 384px (max-w-sm)

---

## Animation Specifications

### Cookie Crack (Normal Click)
| Property | Initial | Final | Duration | Easing |
|----------|---------|-------|----------|--------|
| Left Half X | 0 | -60px | 500ms | easeOut |
| Left Half Rotate | 0° | -15° | 500ms | easeOut |
| Right Half X | 0 | 60px | 500ms | easeOut |
| Right Half Rotate | 0° | 15° | 500ms | easeOut |
| Confetti Particles | 8 particles | — | 800ms | easeOut |

### Cookie Smash (Shift+Click)
| Property | Initial | Final | Duration | Easing |
|----------|---------|-------|----------|--------|
| Left Half X | 0 | -120px | 300ms | easeOut |
| Left Half Rotate | 0° | -45° | 300ms | easeOut |
| Left Half Opacity | 1 | 0 | 300ms | easeOut |
| Right Half X | 0 | 120px | 300ms | easeOut |
| Right Half Rotate | 0° | 45° | 300ms | easeOut |
| Right Half Opacity | 1 | 0 | 300ms | easeOut |
| Confetti Particles | 20 particles | — | 500ms | easeOut |

### Paper Slip Reveal
| Property | Initial | Final | Duration | Delay | Easing |
|----------|---------|-------|----------|-------|--------|
| Y Position | 50px | 0 | 500ms | 200ms | easeOut |
| Opacity | 0 | 1 | 500ms | 200ms | easeOut |
| Scale | 0.8 | 1 | 500ms | 200ms | easeOut |

### Confetti
- **Random spread:** X: ±150px, Y: ±150px (normal) / ±150px (smash)
- **Colors:** Amber-400, Amber-500, Amber-600, White (random)
- **Size:** 8px diameter circles
- **Fade out:** Opacity 1 → 0, Scale 1 → 0

### Hover Glow
- **Element:** Cookie container
- **Effect:** Amber blur
- **Opacity:** 0 → 0.3
- **Duration:** 300ms

---

## Interactive Behavior

### State Machine
```
IDLE (Cookie intact)
  ↓ [Click]
CRACKING (Animation in progress)
  ↓ [200ms delay]
REVEALED (Paper slip visible + metrics shown)
  ↓ [Click "Another Fortune"]
IDLE (Reset)
```

### API Integration
- **Endpoint:** `/api/fortune` (relative path)
- **Method:** GET
- **Response Expected:**
  ```json
  {
    "fortune": "Ship small, ship often."
  }
  ```
- **Headers Read:** `X-Cache` (values: `HIT` or `MISS`)
- **Latency Measurement:** `performance.now()` before/after fetch

### Error Handling
- **Fallback Fortune:** Randomly selected from local array
- **Cache Status:** Displays `N/A` if header missing or on error
- **UI State:** Still shows paper slip with fallback content

---

## Mode Detection

### Logic
```javascript
const port = window.location.port;
const mode = port === '8081' ? 'Sidecar' : 'Direct';
```

### Badge Display
- **Position:** Absolute top-right (16px margin)
- **Sidecar:** Blue accent with Zap icon
- **Direct:** Purple accent with Server icon

---

## Responsive Behavior

### Breakpoints
- **Desktop (>768px):** Full 3-column button layout
- **Tablet/Mobile (<768px):** Stacked button layout

### Scaling
- **Cookie:** 192px (w-48 h-48) — fixed size, centers
- **Card Padding:** 48px desktop, 32px mobile
- **Text:** Scales naturally via root typography

---

## Example Fortunes

1. Ship small, ship often.
2. Cache is a feature.
3. Delete code to add velocity.
4. Make it work, make it right, make it fast.
5. Logs are a feature, not an afterthought.

_(Server should provide more variety)_

---

## Tailwind Class Reference

### Key Utilities Used
- `bg-gradient-to-br` — Gradient backgrounds
- `backdrop-blur-sm` — Frosted glass effect
- `drop-shadow-xl` — Cookie depth
- `shadow-2xl` — Card and paper shadows
- `hover:bg-*` — Button/badge interactions
- `transition-*` — Smooth state changes (handled by Motion library)

### Motion Library
- `motion.div` — Animated wrappers
- `AnimatePresence` — Exit animations
- `initial`, `animate`, `exit` props — Animation states

---

## Non-Goals
- No client-side routing
- No form inputs
- No user authentication
- No persistent state (beyond single session)

---

## Developer Handoff Notes

### API Stub for Testing
If `/api/fortune` is unavailable during development, the app will:
1. Catch the fetch error
2. Return a random fallback fortune
3. Display `N/A` for cache status
4. Still measure latency

### Cross-Origin Restrictions
- **Important:** UI must be served from the same origin as the API
- The "Open Direct App" and "Open via Sidecar" buttons navigate to different origins in new tabs
- No in-page origin switching — relies on server routing

### Performance
- Target: <300ms total interaction time (crack animation + API call)
- Latency display helps visualize Sidecar benefits during demo

---

## File Structure
```
/
├── App.tsx                      # Main component
├── components/
│   ├── FortuneCookie.tsx        # Cookie + animations
│   ├── MetricsDisplay.tsx       # Latency + cache badges
│   └── ModeBadge.tsx            # Sidecar/Direct indicator
├── styles/
│   └── globals.css              # Typography tokens
└── DESIGN_SPEC.md               # This file
```

---

**Last Updated:** 2025-01-27  
**Design System:** Tailwind CSS v4 + Motion (Framer Motion)  
**Target Resolution:** 1280×720 (projector-optimized)

# Sanctus - Catholic Prayer Web App

A fast, minimal, offline-capable Catholic prayer app with daily Mass readings, interactive Rosary, and essential prayers.

## Features

- **Daily Mass Readings** - Auto-fetches from USCCB with intelligent 7-day caching
- **Interactive Rosary** - Bead-by-bead tracker with all four mystery sets
- **Essential Prayers** - Our Father, Hail Mary, Glory Be, Creed, and more
- **Offline-First** - Service Worker caches everything locally
- **Print-Friendly** - Beautiful print layouts for prayers and readings
- **Dark Mode** - Automatic system preference detection
- **Mobile Optimized** - PWA-ready, installable on iOS and Android
- **Zero Ads** - Just a simple Buy Me a Coffee button

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Styling:** Tailwind CSS with system fonts
- **Storage:** IndexedDB (Dexie.js) for local caching
- **PWA:** Custom Service Worker
- **Icons:** Lucide React
- **API:** USCCB Readings (gentle caching strategy)

## Getting Started

```bash
# Install dependencies
npm ci

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000)

### Local Redis Cache

`npm run dev` uses Redis when `REDIS_URL` is present in `.env.local`. To enable it locally:

```bash
cp .env.example .env.local
# Start Redis separately, then run:
npm run dev
```

For a default local Redis server, use `REDIS_URL=redis://localhost:6379`. Without `REDIS_URL`, API routes fall back to per-process memory tracking and direct USCCB fetches.

## Deployment to Vercel

### Option 1: CLI (Quick)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (zero config needed)

### Optional Environment Variables

- `REDIS_URL` enables the 30-day server-side readings cache.
- `CRON_SECRET` secures the scheduled readings prefetch route in `vercel.json`.

### Custom Domain

In Vercel dashboard:
- Settings → Domains → Add
- Recommended: `sanctus.app`, `praytoday.app`, or similar

## API Strategy (Be Gentle on USCCB)

Our caching approach minimizes API calls:

1. **Service Worker** caches readings for 24 hours
2. **IndexedDB** stores recent readings for offline use
3. **Redis** caches readings server-side for 30 days when configured
4. **Prefetch** warms tomorrow's readings in the background

**Result:** Most users make ZERO API calls (served from cache)

## Performance

- **First Load:** <1s (static generation)
- **Repeat Visits:** <100ms (cached)
- **Offline:** Fully functional
- **Bundle Size:** ~50KB gzipped

## Browser Support

- Chrome/Edge 90+
- Safari 14+
- Firefox 88+
- Mobile: iOS 14.5+, Android Chrome

## License

Free to use for Catholic communities and individuals.

## Support

Buy me a coffee: [buymeacoffee.com/davegutierrez0](https://buymeacoffee.com/davegutierrez0)

---

Made with prayer for the faithful 🙏

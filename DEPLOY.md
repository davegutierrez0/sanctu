# Deployment Guide for Sanctus

## Quick Deploy to Vercel (Recommended)

### Method 1: Vercel CLI (Fastest - 2 minutes)

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Navigate to project (if not already there)
# cd /path/to/sanctu

# 3. Deploy (will prompt for login on first use)
vercel

# 4. For production deployment
vercel --prod
```

The CLI will:
- Create a Vercel account if needed
- Link your project
- Deploy automatically
- Give you a live URL instantly

### Method 2: GitHub + Vercel Dashboard

```bash
# 1. Initialize git (if not already)
git init
git add .
git commit -m "Initial commit: Sanctus Catholic prayer app"

# 2. Create GitHub repo and push
gh repo create sanctus --public --source=. --push
# OR manually:
# - Create repo on GitHub
# - git remote add origin <your-repo-url>
# - git push -u origin main

# 3. Go to vercel.com/new
# 4. Import your GitHub repository
# 5. Click Deploy (zero configuration needed)
```

## Post-Deployment Checklist

### 1. Update Buy Me a Coffee Link
Edit these files to use your actual link:
- [app/page.tsx](app/page.tsx) - Line 70
- [README.md](README.md) - Line 99

Replace `https://buymeacoffee.com/sanctusapp` with your link.

### 2. Add Custom Domain (Optional)

In Vercel dashboard:
1. Go to Settings → Domains
2. Add your domain (e.g., `sanctus.app`)
3. Follow DNS configuration steps

**Domain Suggestions:**
- sanctus.app
- praytoday.app
- dailycatholic.app
- rosaryguide.app

### 3. Create App Icons

The manifest expects these icons in `/public`:
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)

**Quick Icon Creation:**
```bash
# Use a simple cross or rosary design
# Tools: Figma, Canva, or DALL-E
# Keep it monochrome for best results
```

### 4. Test PWA Installation

After deployment:
1. Visit your site on mobile
2. Look for "Add to Home Screen" prompt
3. Test offline functionality (turn off WiFi)
4. Verify readings cache works

### 5. Monitor USCCB API

Check Vercel Analytics to ensure:
- Most requests are served from cache
- API route `/api/readings` isn't called excessively
- Service Worker is working properly

## Environment Variables (None Required!)

This app has zero environment variables. Everything works out of the box.

## Performance Tips

### Enable Analytics (Optional)

```bash
npm install @vercel/analytics
```

Add to [app/layout.tsx](app/layout.tsx):
```tsx
import { Analytics } from '@vercel/analytics/react';

// In body:
<Analytics />
```

### Monitor Core Web Vitals

Vercel dashboard automatically shows:
- LCP (Largest Contentful Paint) - Target: <2.5s
- FID (First Input Delay) - Target: <100ms
- CLS (Cumulative Layout Shift) - Target: <0.1

## Troubleshooting

### Build Fails on Vercel

Check [next.config.ts](next.config.ts) - ensure it's using Turbopack:
```ts
const nextConfig: NextConfig = {
  turbopack: {},
};
```

### Service Worker Not Registering

1. Check browser console for errors
2. Ensure `public/sw.js` exists
3. Verify HTTPS (required for PWA)
4. Clear cache and hard reload

### Readings API Not Working

1. Check `/api/readings` route in browser
2. Verify USCCB is accessible
3. Check Vercel function logs
4. Ensure proper date format (YYYY-MM-DD)

## Cost

**Vercel Hobby Plan:**
- Free for personal projects
- 100GB bandwidth/month
- Serverless functions included
- HTTPS automatic
- Perfect for this use case

## Next Steps

1. Share with your parish/community
2. Gather feedback
3. Add more prayers/features
4. Consider translations

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Issues: Create GitHub issues in your repo

---

**Need help?** The app is designed to be zero-config. If something isn't working, check the browser console first.

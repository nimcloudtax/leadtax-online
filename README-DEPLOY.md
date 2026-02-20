# LeadTax Landing Pages — Deployment Guide

## File Tree

```
/lp/
  pre-a-first-in-line.html     ← Pre-NETFILE (Thu–Sun)
  pre-b-refund-path.html       ← Pre-NETFILE (Thu–Sun)
  post-c-netfile-open.html     ← Post-NETFILE (Mon+)
  post-d-fast-simple-19.html   ← Post-NETFILE (Mon+)
/assets/
  styles.css                   ← Shared CSS (all 4 pages)
  app.js                       ← Shared JS (all 4 pages)
robots.txt
sitemap.xml
SEO-INDEXING.md
ANALYTICS-EVENTS.md
README-DEPLOY.md               ← This file
```

## Phase Schedule

| Phase | Pages | Live Period | Google Ads |
|---|---|---|---|
| Pre-NETFILE | pre-a, pre-b | Thu Feb 19 → Sun Feb 22 11:59 PM ET | Campaigns A + B |
| Post-NETFILE | post-c, post-d | Mon Feb 23 6:00 AM ET onward | Campaigns C + D |

## Phase Switch Procedure (Feb 22 → Feb 23)

### Option A: Separate URLs (Recommended)
1. All 4 pages live at their own URLs at all times
2. Google Ads campaigns A/B scheduled to pause at midnight Feb 22
3. Google Ads campaigns C/D scheduled to start at 5:55 AM ET Feb 23
4. Pre-NETFILE pages auto-detect expired countdown and show "NETFILE is now open" message

### Option B: Single URL with Server-Side Swap
1. Use `/file-taxes` as the canonical URL
2. Server serves pre-a content until Feb 23 6:00 AM ET
3. Server switches to post-c content at 6:00 AM ET
4. 302 redirect pre-a → post-c after Feb 23

### Post-Switch Verification
- [ ] Load post-c in incognito at 6:05 AM ET Feb 23
- [ ] Verify "NETFILE is open" banner appears
- [ ] Verify countdown on pre-a shows "NETFILE is now open" (if still accessible)
- [ ] Verify Google Ads point to correct post-NETFILE URLs

## Pre-Deployment Checklist

- [ ] Replace `GTM-XXXXXXX` with real GTM container ID in all 4 HTML files
- [ ] Replace `og-default.jpg` with real OG image (1200×630px) at `/assets/og-default.jpg`
- [ ] Verify `app.leadtax.ca/start` accepts the `?plan=` parameter
- [ ] Test handoff email endpoint: `POST /api/handoff` (or accept graceful failure with copy-link fallback)
- [ ] Test all 4 pages on Chrome, Safari, Firefox (desktop + mobile)
- [ ] Run GTM Preview mode on each page
- [ ] Validate JSON-LD at https://search.google.com/test/rich-results
- [ ] Submit sitemap to Google Search Console
- [ ] Verify all CTA links work (no broken hrefs)

## Handoff API Stub

The handoff module expects:
```
POST /api/handoff
Content-Type: application/json

{
  "email": "user@example.com",
  "page_variant": "pre-netfile-a",
  "code": "123456",
  "utm_source": "google",
  "utm_medium": "cpc",
  "gclid": "abc123"
}
```

If endpoint is unavailable, the UI gracefully falls back to showing a "Copy Link" button. No user-facing errors.

## Performance Targets

- Largest Contentful Paint: < 2.5s on mobile 4G
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms
- Total page weight: < 150KB (excl. fonts)

## Accessibility

- Skip-to-content link on every page
- `aria-live="polite"` on countdown timer
- `aria-modal="true"` on audit defence modal
- `role="dialog"` on modal
- `focus-visible` styles on all interactive elements
- WCAG 2.1 AA color contrast (4.5:1 text, 3:1 large text)
- Keyboard navigable (tab order: header → start card → content → footer)

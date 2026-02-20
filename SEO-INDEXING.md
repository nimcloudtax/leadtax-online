# LeadTax Landing Pages — SEO Indexing Guide (v3 FINAL)

## Step 1: Submit Sitemap to Google Search Console

1. Go to https://search.google.com/search-console
2. Select `leadtax.ca` property (verify ownership if needed)
3. Navigate to **Sitemaps** in left menu
4. Enter: `sitemap.xml`
5. Click **Submit**

## Step 2: Request Indexing for Each Page

1. In Search Console, go to **URL Inspection**
2. Enter each URL one at a time:
   - `https://leadtax.ca/lp/pre-a-first-in-line.html`
   - `https://leadtax.ca/lp/pre-b-refund-path.html`
   - `https://leadtax.ca/lp/post-c-netfile-open.html`
   - `https://leadtax.ca/lp/post-d-fast-simple-19.html`
3. Click **Request Indexing** for each

## Step 3: Validate Structured Data

1. Go to https://search.google.com/test/rich-results
2. Test each URL — verify Organization, WebPage, FAQPage schemas pass
3. Fix any errors before launch

## Step 4: Phase Switching (Canonical Strategy)

### Pre-NETFILE phase (Feb 19–22):
- Pages pre-a and pre-b are the primary landing pages
- Canonical tags point to their own URLs (self-referencing)
- Post pages exist but are not linked from ads

### Post-NETFILE phase (Feb 23+):
- Switch Google Ads to post-c and post-d URLs
- Pre pages remain accessible (countdown auto-shows "NETFILE is open")
- Use 302 redirects (temporary) if you want pre → post forwarding
- Do NOT use 301 (permanent) — you may reuse pre-NETFILE pages next year

## Step 5: Verify OG Tags for Social Sharing

1. Facebook: https://developers.facebook.com/tools/debug/ — test each URL
2. Twitter: https://cards-dev.twitter.com/validator — test each URL
3. LinkedIn: https://www.linkedin.com/post-inspector/ — test each URL

## Technical Notes

- All pages return 200 status, no auth wall, no noindex
- Each page has unique title, description, canonical
- JSON-LD includes: Organization, WebSite, WebPage, FAQPage
- Internal links connect all 4 pages in footer
- robots.txt references sitemap

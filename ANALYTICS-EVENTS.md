# LeadTax Landing Pages — Analytics & Event Documentation

## Google Tag Manager Setup

**GTM Container ID:** `GTM-XXXXXXX` (replace with real ID)

GTM is loaded in `<head>` (script) and `<body>` (noscript) on all 4 pages.

---

## DataLayer Events (Fired from Landing Pages)

| Event Name | Trigger | Key Parameters |
|---|---|---|
| `view_landing` | Page load | `page_variant`, UTMs, `gclid` |
| `click_primary_cta` | Any CTA click to app.leadtax.ca | `cta_text`, `page_variant` |
| `preflight_ready_yes` | User clicks "Yes — start filing now" | `page_variant` |
| `preflight_ready_no` | User clicks "Not yet — send me a link" | `page_variant` |
| `handoff_email_submitted` | User sends handoff email | `method: email`, `page_variant` |
| `handoff_copy_link` | User copies the filing link | `page_variant` |
| `outbound_app_click` | Any link to app.leadtax.ca | `destination`, `cta_text` |
| `audit_modal_shown` | Audit Defence modal opens | `from_plan`, `from_price` |
| `audit_modal_upgrade` | User upgrades to Premier from modal | `to_plan: Premier`, `to_price: 69` |
| `audit_modal_continue` | User continues without upgrading | `page_variant` |
| `scroll_depth` | 25%, 50%, 75%, 100% scroll | `percent_scrolled` |
| `faq_expand` | User opens an FAQ | `faq_question` |

### UTM/GCLID Parameters

All events include UTMs and GCLID captured from URL parameters and stored in `sessionStorage`:
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`

---

## GA4 Events (Fired from App — Post-CTA)

These events fire within app.leadtax.ca after the user leaves the landing page.

| Event Name | Trigger | Parameters |
|---|---|---|
| `start_filing` | User begins return | `page_variant`, `plan_name`, `plan_price` |
| `create_account` | Account created | `page_variant` |
| `begin_checkout` | Payment step reached | `plan_name`, `plan_price`, `currency: CAD` |
| `purchase` | Payment completed | `transaction_id`, `value`, `currency: CAD`, `plan_name`, `province`, `device`, `coupon_used` |
| `netfile_submitted` | Return transmitted to CRA | `transaction_id`, `return_type`, `province` |

---

## Google Ads Conversion Mapping

| Conversion | GA4 Event | Attribution | Notes |
|---|---|---|---|
| **Primary:** Purchase | `purchase` | Last-click, 30-day | Include `value` + `currency: CAD` |
| **Secondary:** Start Filing | `start_filing` | First-click, 7-day | |
| **Micro:** Hero CTA Click | `click_primary_cta` | Observation only | Do NOT optimize for this |

### Enhanced Conversions

On the `purchase` event, include hashed user data if:
- User has consented to data sharing (privacy policy + consent banner)
- Lawful under PIPEDA

Implementation:
```js
window.dataLayer.push({
  event: 'purchase',
  user_data: {
    sha256_email_address: 'SHA256_HASH_HERE',
    sha256_phone_number: 'SHA256_HASH_HERE'
  },
  // ... other params
});
```

### Conversion Linker
- Ensure Google Ads conversion linker tag fires on all landing pages
- Enable auto-tagging (GCLID) in Google Ads account settings

---

## Page-Specific Tracking

| Page | Variant | Special Events |
|---|---|---|
| Pre-A: First In Line | `pre-netfile-a` | Countdown timer expired state, handoff usage |
| Pre-B: Refund Path | `pre-netfile-b` | Direct deposit callout interaction |
| Post-C: File Now | `post-netfile-c` | Live banner visibility |
| Post-D: Simple Filing | `post-netfile-d` | Anxiety-reduction CTA placement |

---

## GTM Tag Configuration (Recommended)

### Tags to Create
1. **GA4 Config** — Fires on all pages
2. **GA4 Event: view_landing** — Trigger: Page View
3. **GA4 Event: click_primary_cta** — Trigger: Custom Event
4. **GA4 Event: scroll_depth** — Trigger: Custom Event
5. **Google Ads Conversion: Purchase** — Trigger: purchase event
6. **Google Ads Conversion: Start Filing** — Trigger: start_filing event
7. **Conversion Linker** — Fires on all pages

### Variables to Create
- `DLV - page_variant` (Data Layer Variable)
- `DLV - utm_source` through `DLV - gclid`
- `DLV - plan_name`, `DLV - plan_price`
- `DLV - percent_scrolled`

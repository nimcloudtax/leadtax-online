/* ═══════════════════════════════════════════
   LeadTax Landing Pages — app.js v3.0 FINAL
   ═══════════════════════════════════════════ */

/* ── DATALAYER + UTM CAPTURE ── */
window.dataLayer = window.dataLayer || [];

(function captureParams() {
  var params = new URLSearchParams(window.location.search);
  var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid'];
  var captured = {};
  keys.forEach(function(k) {
    var v = params.get(k);
    if (v) { captured[k] = v; try { sessionStorage.setItem(k, v); } catch(e){} }
  });
  // Restore from session if not in URL
  keys.forEach(function(k) {
    if (!captured[k]) { try { var v = sessionStorage.getItem(k); if (v) captured[k] = v; } catch(e){} }
  });
  window.__lt_params = captured;
})();

function pushEvent(name, extra) {
  var data = { event: name, page_variant: document.body.dataset.variant || 'unknown' };
  if (window.__lt_params) {
    for (var k in window.__lt_params) data[k] = window.__lt_params[k];
  }
  if (extra) { for (var k in extra) data[k] = extra[k]; }
  window.dataLayer.push(data);
}

// Fire view_landing on load
pushEvent('view_landing');

/* ── COUNTDOWN TIMER ── */
function initCountdown() {
  var target = new Date('2026-02-23T11:00:00Z').getTime(); // 6am ET = 11am UTC
  var el = document.getElementById('countdown');
  if (!el) return;
  function pad(n) { return n < 10 ? '0' + n : n; }
  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      el.innerHTML = '<div class="countdown__live" role="status">✓ NETFILE is now open — File today!</div>';
      return;
    }
    var days = document.getElementById('cd-days');
    var hours = document.getElementById('cd-hours');
    var min = document.getElementById('cd-min');
    var sec = document.getElementById('cd-sec');
    if (days) days.textContent = Math.floor(diff / 864e5);
    if (hours) hours.textContent = pad(Math.floor(diff % 864e5 / 36e5));
    if (min) min.textContent = pad(Math.floor(diff % 36e5 / 6e4));
    if (sec) sec.textContent = pad(Math.floor(diff % 6e4 / 1e3));
  }
  tick();
  setInterval(tick, 1000);
}

/* ── PREFLIGHT / HANDOFF ── */
function initPreflight() {
  var yesBtn = document.getElementById('preflight-yes');
  var noBtn = document.getElementById('preflight-no');
  var preQ = document.getElementById('preflight-question');
  var handoff = document.getElementById('handoff-module');
  var anyway = document.getElementById('handoff-anyway');

  if (!yesBtn) return;

  yesBtn.addEventListener('click', function() {
    pushEvent('preflight_ready_yes');
    pushEvent('click_primary_cta', { cta_text: 'preflight_yes' });
    window.location.href = 'https://app.leadtax.ca/start';
  });

  noBtn.addEventListener('click', function() {
    preQ.style.display = 'none';
    handoff.classList.add('active');
    pushEvent('preflight_ready_no');
  });

  if (anyway) {
    anyway.addEventListener('click', function() {
      pushEvent('click_primary_cta', { cta_text: 'handoff_anyway' });
      window.location.href = 'https://app.leadtax.ca/start';
    });
  }
}

function sendHandoffEmail() {
  var input = document.getElementById('handoff-email');
  var errMsg = document.getElementById('handoff-error');
  var confirm = document.getElementById('handoff-confirm');
  var form = document.getElementById('handoff-form');
  var codeEl = document.getElementById('handoff-code');
  var copySection = document.getElementById('handoff-copy-section');
  var email = input ? input.value.trim() : '';

  // Validate
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    input.classList.add('handoff__input--error');
    if (errMsg) errMsg.classList.add('active');
    return;
  }
  input.classList.remove('handoff__input--error');
  if (errMsg) errMsg.classList.remove('active');

  // Generate 6-digit code
  var pin = Math.floor(100000 + Math.random() * 900000);

  // Try API call (graceful failure)
  var payload = {
    email: email,
    page_variant: document.body.dataset.variant || 'unknown',
    code: String(pin)
  };
  // Add UTMs
  if (window.__lt_params) {
    for (var k in window.__lt_params) payload[k] = window.__lt_params[k];
  }

  // POST to backend (stub — will fail gracefully)
  fetch('/api/handoff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(function() {
    // API unavailable — that's fine, show copy-link fallback
    console.info('[LeadTax] Handoff API unavailable — showing copy-link fallback');
  });

  // Always show confirmation UI (even if API fails)
  if (form) form.style.display = 'none';
  if (confirm) confirm.classList.add('active');
  if (codeEl) { codeEl.style.display = 'block'; codeEl.textContent = pin; }
  if (copySection) copySection.style.display = 'flex';

  pushEvent('handoff_email_submitted', { method: 'email' });
}

function resendHandoff() {
  var confirm = document.getElementById('handoff-confirm');
  var form = document.getElementById('handoff-form');
  if (confirm) confirm.classList.remove('active');
  if (form) form.style.display = 'flex';
}

function copyHandoffLink() {
  var copyInput = document.getElementById('handoff-copy-input');
  if (!copyInput) return;
  navigator.clipboard.writeText(copyInput.value).then(function() {
    var btn = document.getElementById('handoff-copy-btn');
    if (btn) { btn.textContent = '✓ Copied!'; setTimeout(function(){ btn.textContent = 'Copy Link'; }, 2000); }
  }).catch(function() {
    copyInput.select();
    document.execCommand('copy');
  });
  pushEvent('handoff_copy_link');
}

/* ── AUDIT DEFENCE MODAL ── */
function showAuditModal(plan, price) {
  document.getElementById('modalCurrentPlan').textContent = plan;
  document.getElementById('modalCurrentPrice').textContent = '$' + price;
  document.getElementById('modalContinuePlan').textContent = plan;
  document.getElementById('modalContinuePrice').textContent = '$' + price;
  document.getElementById('auditModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  pushEvent('audit_modal_shown', { from_plan: plan, from_price: price });
}
function closeAuditModal() {
  document.getElementById('auditModal').classList.remove('active');
  document.body.style.overflow = '';
}
function upgradeFromModal() {
  pushEvent('audit_modal_upgrade', { to_plan: 'Premier', to_price: 69 });
  closeAuditModal();
  window.location.href = 'https://app.leadtax.ca/start?plan=premier';
}
function continueFromModal() {
  pushEvent('audit_modal_continue');
  closeAuditModal();
}

/* ── MOBILE STICKY CTA ── */
function initMobileSticky() {
  var m = document.getElementById('stickyMobile');
  if (!m) return;
  var shown = false;
  window.addEventListener('scroll', function() {
    var shouldShow = window.innerWidth <= 640 && window.scrollY > 400;
    if (shouldShow !== shown) {
      m.style.display = shouldShow ? 'block' : 'none';
      shown = shouldShow;
    }
  }, { passive: true });
}

/* ── PLAN PILL SELECTION ── */
function initPlanPills() {
  document.querySelectorAll('.plan-pill').forEach(function(pill) {
    pill.addEventListener('click', function() {
      document.querySelectorAll('.plan-pill').forEach(function(p) { p.classList.remove('selected'); });
      pill.classList.add('selected');
    });
  });
}

/* ── MODAL BACKDROP ── */
function initModalBackdrop() {
  var overlay = document.getElementById('auditModal');
  if (!overlay) return;
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeAuditModal();
  });
}

/* ── SCROLL DEPTH TRACKING ── */
function initScrollTracking() {
  var thresholds = [25, 50, 75, 100];
  var fired = {};
  window.addEventListener('scroll', function() {
    var scrollPct = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
    thresholds.forEach(function(t) {
      if (scrollPct >= t && !fired[t]) {
        fired[t] = true;
        pushEvent('scroll_depth', { percent_scrolled: t });
      }
    });
  }, { passive: true });
}

/* ── OUTBOUND LINK TRACKING ── */
function initOutboundTracking() {
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href*="app.leadtax.ca"]');
    if (link) {
      pushEvent('outbound_app_click', { destination: link.href, cta_text: link.textContent.trim().substring(0, 50) });
    }
  });
}

/* ── FAQ TRACKING ── */
function initFaqTracking() {
  document.querySelectorAll('.faq-item summary').forEach(function(s) {
    s.addEventListener('click', function() {
      pushEvent('faq_expand', { faq_question: s.textContent.trim().substring(0, 80) });
    });
  });
}

/* ── INIT ALL ── */
document.addEventListener('DOMContentLoaded', function() {
  initCountdown();
  initPreflight();
  initMobileSticky();
  initPlanPills();
  initModalBackdrop();
  initScrollTracking();
  initOutboundTracking();
  initFaqTracking();
});

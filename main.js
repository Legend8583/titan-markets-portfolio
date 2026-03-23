// ================================================
// TITAN LI — TERMINAL PRO — JS
// ================================================

const LOGS = [
  {
    id: "TL-LOG-001",
    title: "Earnings Setup — NVDA Call Spread",
    badge: "Earnings",
    badgeClass: "badge-earn",
    summary: "Pre-earnings vertical call spread. Entry on consolidation break, 2% portfolio risk. Scaled exit at 25%/50% IV crush.",
    tags: ["earnings", "options", "vol", "tech"],
    returnPct: "+140%",
    catalyst: "Earnings Beat",
    holdTime: "72h",
    link: "./logs/TL-LOG-001.html"
  },
  {
    id: "TL-LOG-002",
    title: "SOXL Tactical Long — Post-Earnings Relief Bounce",
    badge: "Macro + Catalyst",
    badgeClass: "badge-macro",
    summary: "3x leveraged semi ETF for short-dated relief bounce after NVDA earnings. Entry $31.28 → exit $34.49.",
    tags: ["soxl", "semiconductors", "catalyst", "mean-reversion", "tactical"],
    returnPct: "+10.26%",
    catalyst: "NVDA Earnings",
    holdTime: "1d",
    link: "./logs/TL-LOG-002.html"
  },
  {
    id: "TL-LOG-003",
    title: "POP MART (9992.HK) Tactical Long — Oversold Bounce",
    badge: "Mean Reversion",
    badgeClass: "badge-mean",
    summary: "Oversold bounce after 40% drawdown. Entry HKD 176–189 on excessive pessimism. Buyback validation.",
    tags: ["9992.hk", "consumer", "oversold", "buyback", "tactical-long"],
    returnPct: "+27.5%",
    catalyst: "Sentiment Repair",
    holdTime: "~10d",
    link: "./logs/TL-LOG-003.html"
  }
];

// ---- DOM refs ----
let logBody, logCardsMobile, searchInput, filterSelect;

// ---- Utilities ----
function uniqueTags(items) {
  const s = new Set();
  items.forEach(i => i.tags.forEach(t => s.add(t)));
  return [...s].sort();
}

function matches(log, q, tag) {
  const text = `${log.id} ${log.title} ${log.summary} ${log.badge} ${log.tags.join(' ')}`.toLowerCase();
  return (!q || text.includes(q)) && (tag === 'all' || log.tags.includes(tag));
}

// ---- Render filter options ----
function renderFilterOptions() {
  uniqueTags(LOGS).forEach(tag => {
    const o = document.createElement('option');
    o.value = tag;
    o.textContent = tag.toUpperCase();
    filterSelect.appendChild(o);
  });
}

// ---- Render log TABLE (desktop) ----
function renderLogTable() {
  const q = (searchInput.value || '').trim().toLowerCase();
  const tag = filterSelect.value;
  const filtered = LOGS.filter(l => matches(l, q, tag));

  logBody.innerHTML = '';

  if (filtered.length === 0) {
    logBody.innerHTML = `<tr><td colspan="6" class="log-empty">No matching trade logs.</td></tr>`;
    return;
  }

  filtered.forEach(log => {
    const isPos = log.returnPct.startsWith('+');
    const tr = document.createElement('tr');
    tr.onclick = () => { if (log.link) window.location.href = log.link; };
    tr.innerHTML = `
      <td class="td-id">${log.id}</td>
      <td>
        <div class="td-title">${log.title}</div>
        <div class="td-summary">${log.summary}</div>
        <div class="td-tags">${log.tags.map(t => `<span class="td-tag">${t}</span>`).join('')}</div>
      </td>
      <td style="color:var(--fg-dim);font-size:11px;white-space:nowrap;">${log.catalyst || '—'}</td>
      <td class="td-ret ${isPos ? 'pos' : 'neg'}">${log.returnPct}</td>
      <td class="td-hold">${log.holdTime}</td>
      <td><span class="td-type ${log.badgeClass}">${log.badge}</span></td>
    `;
    logBody.appendChild(tr);
  });
}

// ---- Render log CARDS (mobile) ----
function renderLogCards() {
  const q = (searchInput.value || '').trim().toLowerCase();
  const tag = filterSelect.value;
  const filtered = LOGS.filter(l => matches(l, q, tag));

  logCardsMobile.innerHTML = '';

  if (filtered.length === 0) {
    logCardsMobile.innerHTML = `<div class="log-empty">No matching trade logs.</div>`;
    return;
  }

  filtered.forEach(log => {
    const isPos = log.returnPct.startsWith('+');
    const card = document.createElement('a');
    card.className = 'log-card-m';
    card.href = log.link || '#';
    card.innerHTML = `
      <div class="lcm-top">
        <span class="lcm-id">${log.id}</span>
        <span class="td-type ${log.badgeClass}">${log.badge}</span>
      </div>
      <div class="lcm-title">${log.title}</div>
      <div class="lcm-desc">${log.summary}</div>
      <div class="lcm-metrics">
        <div>
          <div class="lcm-metric-label">RETURN</div>
          <div class="lcm-metric-value" style="color:var(${isPos ? '--positive' : '--red'})">${log.returnPct}</div>
        </div>
        <div>
          <div class="lcm-metric-label">HOLD</div>
          <div class="lcm-metric-value" style="color:var(--fg-dim)">${log.holdTime}</div>
        </div>
        <div>
          <div class="lcm-metric-label">CATALYST</div>
          <div class="lcm-metric-value" style="color:var(--fg-dim);font-size:12px;">${log.catalyst || '—'}</div>
        </div>
      </div>
      <div class="lcm-tags">${log.tags.map(t => `<span class="td-tag">${t}</span>`).join('')}</div>
    `;
    logCardsMobile.appendChild(card);
  });
}

function renderLogs() {
  renderLogTable();
  renderLogCards();
}

// ---- Sidebar active state tracking ----
function setupScrollSpy() {
  const sections = document.querySelectorAll('.panel[id]');
  const links = document.querySelectorAll('.sid-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(l => {
          l.classList.toggle('active', l.dataset.section === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ---- Mobile nav ----
function setupMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('navOverlay');

  if (!hamburger || !sidebar) return;

  function toggle() {
    const isOpen = sidebar.classList.contains('open');
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  function close() {
    sidebar.classList.remove('open');
    hamburger.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggle);
  overlay.addEventListener('click', close);
  sidebar.querySelectorAll('.sid-link, .sid-action').forEach(a => {
    a.addEventListener('click', close);
  });
}

// ---- Smooth scroll for sidebar ----
function setupSmoothScroll() {
  document.querySelectorAll('.sid-link').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ---- Clock display ----
function updateClock() {
  const el = document.getElementById('clockDisplay');
  if (!el) return;
  const now = new Date();
  const opts = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  el.textContent = now.toLocaleDateString('en-US', opts);
}

// ---- Keyboard shortcuts ----
function setupKeyboard() {
  document.addEventListener('keydown', e => {
    // / to focus search
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
    }
    // 1-6 to jump sections
    if (!['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      const map = { '1': '#hero', '2': '#logs', '3': '#notes', '4': '#projects', '5': '#about', '6': '#contact' };
      if (map[e.key]) {
        e.preventDefault();
        document.querySelector(map[e.key])?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}

// ---- Init ----
function init() {
  logBody = document.getElementById('logBody');
  logCardsMobile = document.getElementById('logCardsMobile');
  searchInput = document.getElementById('q');
  filterSelect = document.getElementById('filter');

  if (!logBody || !searchInput || !filterSelect) {
    console.error('Missing DOM elements');
    return;
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  renderFilterOptions();
  renderLogs();

  searchInput.addEventListener('input', renderLogs);
  filterSelect.addEventListener('change', renderLogs);

  setupScrollSpy();
  setupMobileNav();
  setupSmoothScroll();
  setupKeyboard();

  updateClock();
  setInterval(updateClock, 1000);

  console.log('Terminal Pro initialized ✓');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

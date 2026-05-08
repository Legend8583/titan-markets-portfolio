// Titan Li | Professional Markets Portfolio

const LOGS = [
  {
    id: "TL-LOG-001",
    title: "NVDA Earnings Call Spread",
    badge: "Earnings",
    badgeClass: "badge-earn",
    summary: "Pre-earnings vertical call spread. Entry after consolidation break, defined downside, and staged exits after volatility compression.",
    tags: ["earnings", "options", "volatility", "technology"],
    returnPct: "+140%",
    catalyst: "Earnings Beat",
    holdTime: "72h",
    link: "./logs/TL-LOG-001.html"
  },
  {
    id: "TL-LOG-002",
    title: "SOXL Tactical Long",
    badge: "Macro + Catalyst",
    badgeClass: "badge-macro",
    summary: "Short-dated leveraged semiconductor exposure after NVDA earnings. Entry on relief bounce setup with clear stop and exit discipline.",
    tags: ["soxl", "semiconductors", "catalyst", "mean-reversion", "tactical"],
    returnPct: "+10.26%",
    catalyst: "NVDA Earnings",
    holdTime: "1d",
    link: "./logs/TL-LOG-002.html"
  },
  {
    id: "TL-LOG-003",
    title: "POP MART Tactical Long",
    badge: "Mean Reversion",
    badgeClass: "badge-mean",
    summary: "Oversold bounce after a sharp drawdown. Thesis built around excessive pessimism, buyback signal, and sentiment repair.",
    tags: ["9992.hk", "consumer", "oversold", "buyback", "tactical-long"],
    returnPct: "+27.5%",
    catalyst: "Sentiment Repair",
    holdTime: "~10d",
    link: "./logs/TL-LOG-003.html"
  }
];

let logBody;
let logCardsMobile;
let searchInput;
let filterSelect;

function uniqueTags(items) {
  const tags = new Set();
  items.forEach(item => item.tags.forEach(tag => tags.add(tag)));
  return [...tags].sort();
}

function matches(log, query, tag) {
  const searchable = `${log.id} ${log.title} ${log.summary} ${log.badge} ${log.catalyst} ${log.tags.join(" ")}`.toLowerCase();
  return (!query || searchable.includes(query)) && (tag === "all" || log.tags.includes(tag));
}

function renderFilterOptions() {
  uniqueTags(LOGS).forEach(tag => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag.replace(/-/g, " ");
    filterSelect.appendChild(option);
  });
}

function openLog(log) {
  if (log.link) window.location.href = log.link;
}

function renderLogTable() {
  const query = (searchInput.value || "").trim().toLowerCase();
  const tag = filterSelect.value;
  const filtered = LOGS.filter(log => matches(log, query, tag));

  logBody.innerHTML = "";

  if (!filtered.length) {
    logBody.innerHTML = `<tr><td colspan="6" class="log-empty">No matching trading cases.</td></tr>`;
    return;
  }

  filtered.forEach(log => {
    const isPositive = log.returnPct.startsWith("+");
    const row = document.createElement("tr");
    row.tabIndex = 0;
    row.setAttribute("role", "link");
    row.setAttribute("aria-label", `Open ${log.title}`);
    row.addEventListener("click", () => openLog(log));
    row.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLog(log);
      }
    });

    row.innerHTML = `
      <td class="td-id">${log.id}</td>
      <td>
        <div class="td-title">${log.title}</div>
        <div class="td-summary">${log.summary}</div>
        <div class="td-tags">${log.tags.map(tag => `<span class="td-tag">${tag}</span>`).join("")}</div>
      </td>
      <td class="td-hold">${log.catalyst || "—"}</td>
      <td class="td-ret ${isPositive ? "pos" : "neg"}">${log.returnPct}</td>
      <td class="td-hold">${log.holdTime}</td>
      <td><span class="td-type ${log.badgeClass}">${log.badge}</span></td>
    `;
    logBody.appendChild(row);
  });
}

function renderLogCards() {
  const query = (searchInput.value || "").trim().toLowerCase();
  const tag = filterSelect.value;
  const filtered = LOGS.filter(log => matches(log, query, tag));

  logCardsMobile.innerHTML = "";

  if (!filtered.length) {
    logCardsMobile.innerHTML = `<div class="log-empty">No matching trading cases.</div>`;
    return;
  }

  filtered.forEach(log => {
    const isPositive = log.returnPct.startsWith("+");
    const card = document.createElement("a");
    card.className = "project-card";
    card.href = log.link || "#";
    card.innerHTML = `
      <div>
        <div class="project-top">
          <span>${log.id}</span>
          <div><b>${log.badge}</b></div>
        </div>
        <h3>${log.title}</h3>
        <p>${log.summary}</p>
        <div class="td-tags">${log.tags.map(tag => `<span class="td-tag">${tag}</span>`).join("")}</div>
      </div>
      <div class="metric-strip" style="grid-template-columns:repeat(3,1fr);margin-top:18px;box-shadow:none;">
        <div><strong style="font-size:20px;color:var(${isPositive ? "--green" : "--red"});">${log.returnPct}</strong><span>Return</span></div>
        <div><strong style="font-size:20px;">${log.holdTime}</strong><span>Hold</span></div>
        <div><strong style="font-size:16px;">${log.catalyst || "—"}</strong><span>Catalyst</span></div>
      </div>
    `;
    logCardsMobile.appendChild(card);
  });
}

function renderLogs() {
  renderLogTable();
  renderLogCards();
}

function setupScrollSpy() {
  const sections = document.querySelectorAll(".section-block[id]");
  const links = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(link => link.classList.toggle("active", link.dataset.section === id));
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  sections.forEach(section => observer.observe(section));
}

function setupMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("navOverlay");

  if (!hamburger || !sidebar || !overlay) return;

  function setOpen(isOpen) {
    sidebar.classList.toggle("open", isOpen);
    hamburger.classList.toggle("active", isOpen);
    overlay.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  hamburger.addEventListener("click", () => setOpen(!sidebar.classList.contains("open")));
  overlay.addEventListener("click", () => setOpen(false));
  sidebar.querySelectorAll("a").forEach(link => link.addEventListener("click", () => setOpen(false)));
}

function setupSmoothScroll() {
  document.querySelectorAll(".nav-link[href^='#']").forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function updateClock() {
  const element = document.getElementById("clockDisplay");
  if (!element) return;
  const now = new Date();
  element.textContent = now.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener("keydown", event => {
    const activeTag = document.activeElement?.tagName;
    const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);

    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      searchInput?.focus();
      return;
    }

    if (isTyping) return;
    const destinations = { "1": "#hero", "2": "#logs", "3": "#notes", "4": "#projects", "5": "#about", "6": "#contact" };
    if (destinations[event.key]) {
      event.preventDefault();
      document.querySelector(destinations[event.key])?.scrollIntoView({ behavior: "smooth" });
    }
  });
}

function init() {
  logBody = document.getElementById("logBody");
  logCardsMobile = document.getElementById("logCardsMobile");
  searchInput = document.getElementById("q");
  filterSelect = document.getElementById("filter");

  if (!logBody || !logCardsMobile || !searchInput || !filterSelect) return;

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  renderFilterOptions();
  renderLogs();
  setupScrollSpy();
  setupMobileNav();
  setupSmoothScroll();
  setupKeyboardShortcuts();

  searchInput.addEventListener("input", renderLogs);
  filterSelect.addEventListener("change", renderLogs);

  updateClock();
  setInterval(updateClock, 60000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

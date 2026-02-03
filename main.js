// ===============================
// Professional Portfolio JavaScript
// ===============================

// Configuration - Edit these links
const LINKS = {
  resume: "./TitanLi_Resume.pdf",
  linkedin: "https://www.linkedin.com/in/titannli/",
  github: "https://github.com/Legend8583"
};

// Trading log data (no timestamps)
// Add new entries by copying an object
const LOGS = [
  {
    id: "TL-LOG-001",
    title: "Earnings Setup — NVDA Call Spread",
    badge: "Earnings",
    summary: "Pre-earnings vertical call spread positioned for moderate upside. Entry triggered on consolidation break with defined risk at 2% portfolio. Exit targets set at 25% and 50% IV crush levels.",
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
    summary: "Tactical long in 3x leveraged semiconductor ETF to capture short-dated relief bounce after NVDA earnings. Entry at $31.28 on positioning reset, exited at $34.49 into strength after relief move played out.",
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
    summary: "Oversold bounce trade on POP MART following 40% drawdown from peak. Entry at HKD 176-189 on excessive pessimism despite intact IP engine and international expansion. Buyback provided ex-post validation and tailwind for sentiment repair.",
    tags: ["9992.hk", "consumer", "oversold", "buyback", "tactical-long"],
    returnPct: "+27.5%",
    catalyst: "Sentiment Repair",
    holdTime: "~10d",
    link: "./logs/TL-LOG-003.html"
  }
];

// ===============================
// DOM Elements
// ===============================
let grid, searchInput, filterSelect;

// ===============================
// Utility Functions
// ===============================

function uniqueTags(items) {
  const set = new Set();
  items.forEach(item => item.tags.forEach(tag => set.add(tag)));
  return [...set].sort((a, b) => a.localeCompare(b));
}

function matches(log, query, tag) {
  const searchText = `${log.id} ${log.title} ${log.summary} ${log.badge} ${log.tags.join(' ')}`.toLowerCase();
  const queryMatch = !query || searchText.includes(query);
  const tagMatch = tag === 'all' || log.tags.includes(tag);
  return queryMatch && tagMatch;
}

// ===============================
// Rendering Functions
// ===============================

function renderFilterOptions() {
  const tags = uniqueTags(LOGS);
  tags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    filterSelect.appendChild(option);
  });
}

function renderLogGrid() {
  const query = (searchInput.value || '').trim().toLowerCase();
  const selectedTag = filterSelect.value;
  
  const filteredLogs = LOGS
    .slice()
    .sort((a, b) => b.id.localeCompare(a.id))
    .filter(log => matches(log, query, selectedTag));

  grid.innerHTML = '';

  if (filteredLogs.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'card empty-state';
    emptyState.style.gridColumn = '1 / -1';
    emptyState.innerHTML = `
      <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">📊</div>
      <div style="font-size: 15px; font-weight: 600; margin-bottom: 8px;">No trading logs found</div>
      <div style="font-size: 13px; color: var(--muted);">Try adjusting your search or filter criteria</div>
    `;
    grid.appendChild(emptyState);
    return;
  }

  filteredLogs.forEach((log, index) => {
    const card = document.createElement('a');
    card.className = 'card logCard loading';
    card.href = log.link || '#';
    card.setAttribute('aria-label', `${log.id}: ${log.title}`);
    card.style.animationDelay = `${index * 0.05}s`;

    const top = document.createElement('div');
    top.className = 'logTop';
    top.innerHTML = `
      <span class="tradeId">${log.id}</span>
      <span class="badge">${log.badge}</span>
    `;

    const title = document.createElement('h3');
    title.textContent = log.title;

    card.appendChild(top);
    card.appendChild(title);

    // Catalyst subtitle (if available)
    if (log.catalyst) {
      const catalystLine = document.createElement('div');
      catalystLine.style.cssText = 'font-size: 12px; color: var(--muted); margin: 4px 0 8px; font-family: JetBrains Mono, monospace;';
      catalystLine.textContent = `Catalyst: ${log.catalyst}`;
      card.appendChild(catalystLine);
    }

    // Return and metrics display (if available)
    if (log.returnPct || log.holdTime) {
      const metricsContainer = document.createElement('div');
      metricsContainer.className = 'risk-metrics';
      
      if (log.returnPct) {
        const isPositive = log.returnPct.startsWith('+');
        const isNegative = log.returnPct.startsWith('-');
        const returnMetric = document.createElement('div');
        returnMetric.className = `metric ${isPositive ? 'positive' : isNegative ? 'negative' : ''}`;
        returnMetric.innerHTML = `<span class="label">Return</span><span class="value" style="font-size: 16px; font-weight: 700;">${log.returnPct}</span>`;
        metricsContainer.appendChild(returnMetric);
      }
      
      if (log.holdTime) {
        const holdMetric = document.createElement('div');
        holdMetric.className = 'metric';
        holdMetric.innerHTML = `<span class="label">Hold</span><span class="value">${log.holdTime}</span>`;
        metricsContainer.appendChild(holdMetric);
      }
      
      card.appendChild(metricsContainer);
    }

    const summary = document.createElement('p');
    summary.textContent = log.summary;

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'tags';
    log.tags.forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.textContent = tag;
      tagsContainer.appendChild(tagSpan);
    });

    card.appendChild(summary);
    card.appendChild(tagsContainer);
    grid.appendChild(card);
  });
}

// ===============================
// Link Setup
// ===============================

function setupLinks() {
  const elements = {
    resumeLink: document.getElementById('resumeLink'),
    resumeBtn: document.getElementById('resumeBtn'),
    linkedinLink: document.getElementById('linkedinLink'),
    linkedinBtn: document.getElementById('linkedinBtn'),
    githubLink: document.getElementById('githubLink'),
    githubBtn: document.getElementById('githubBtn')
  };

  if (elements.resumeLink) elements.resumeLink.href = LINKS.resume;
  if (elements.resumeBtn) elements.resumeBtn.href = LINKS.resume;
  
  if (elements.linkedinLink) {
    elements.linkedinLink.href = LINKS.linkedin;
    elements.linkedinLink.target = '_blank';
    elements.linkedinLink.rel = 'noopener noreferrer';
  }
  if (elements.linkedinBtn) {
    elements.linkedinBtn.href = LINKS.linkedin;
    elements.linkedinBtn.target = '_blank';
    elements.linkedinBtn.rel = 'noopener noreferrer';
  }
  
  if (elements.githubLink) {
    elements.githubLink.href = LINKS.github;
    elements.githubLink.target = '_blank';
    elements.githubLink.rel = 'noopener noreferrer';
  }
  if (elements.githubBtn) {
    elements.githubBtn.href = LINKS.github;
    elements.githubBtn.target = '_blank';
    elements.githubBtn.rel = 'noopener noreferrer';
  }
}

// ===============================
// Event Listeners
// ===============================

function setupEventListeners() {
  searchInput.addEventListener('input', renderLogGrid);
  filterSelect.addEventListener('change', renderLogGrid);

  // Smooth scroll for navigation links
  document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add keyboard navigation for accessibility
  document.addEventListener('keydown', function(e) {
    // Pressing '/' focuses the search input
    if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      e.preventDefault();
      searchInput.focus();
    }
  });
}

// ===============================
// Additional Features
// ===============================

function setCurrentYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Add scroll-based header shadow
function handleHeaderScroll() {
  const topbar = document.querySelector('.topbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      topbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
      topbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
}

// Intersection Observer for scroll animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}

// ===============================
// Initialization
// ===============================

function init() {
  // Get DOM elements
  grid = document.getElementById('logGrid');
  searchInput = document.getElementById('q');
  filterSelect = document.getElementById('filter');

  // Check if required elements exist
  if (!grid || !searchInput || !filterSelect) {
    console.error('Required DOM elements not found');
    return;
  }

  // Setup
  setCurrentYear();
  setupLinks();
  renderFilterOptions();
  renderLogGrid();
  setupEventListeners();
  handleHeaderScroll();
  setupScrollAnimations();

  // Add loading class removal after a short delay
  setTimeout(() => {
    document.body.classList.add('loaded');
  }, 100);

  console.log('Portfolio initialized successfully ✓');
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// ===============================
// Export for potential module usage
// ===============================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LOGS, LINKS };
}

/* THEME */
const html = document.documentElement;
const tBtn = document.getElementById('themeToggle');
const saved = localStorage.getItem('apps-theme');
html.setAttribute('data-theme', saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
tBtn.addEventListener('click', () => {
  const n = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', n);
  localStorage.setItem('apps-theme', n);
});

/* PAGE SWITCHER */
let currentPage = 'hub';
const appStoreLinks = {
  tip: 'https://apps.apple.com/us/app/tip-tracker/id6755640399',
  pro: 'https://apps.apple.com/us/app/prolaunch/id6748700523'
};

const navConfigs = {
  hub: {
    logo: `<div class="nav-logo-icon icon-hub"><span style="background:#FFD60A;border-radius:5px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:.7rem">⭐</span><span style="background:linear-gradient(135deg,#4A8FFF,#7B5FFF);border-radius:5px;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:.7rem">🚀</span></div> Our Apps`,
    links: '',
    dlText: null
  },
  tip: {
    logo: `<div class="nav-logo-icon icon-tip">⭐</div> Tip Tracker`,
    links: `
      <li><button class="nav-back" onclick="showPage('hub')">← All Apps</button></li>
      <li><button onclick="document.getElementById('tip-features').scrollIntoView({behavior:'smooth'})">Features</button></li>
      <li><button onclick="document.getElementById('tip-calc').scrollIntoView({behavior:'smooth'})">Calculator</button></li>
      <li><button onclick="document.getElementById('tip-pricing').scrollIntoView({behavior:'smooth'})">Pricing</button></li>
      <li><button onclick="document.getElementById('tip-privacy').scrollIntoView({behavior:'smooth'})">Privacy</button></li>`,
    dlText: 'Download'
  },
  pro: {
    logo: `<div class="nav-logo-icon icon-pro">🚀</div> ProLaunch`,
    links: `
      <li><button class="nav-back" onclick="showPage('hub')">← All Apps</button></li>
      <li><button onclick="document.getElementById('pro-features').scrollIntoView({behavior:'smooth'})">Features</button></li>
      <li><button onclick="document.getElementById('pro-how').scrollIntoView({behavior:'smooth'})">How It Works</button></li>
      <li><button onclick="document.getElementById('pro-pricing').scrollIntoView({behavior:'smooth'})">Pricing</button></li>
      <li><div class="nav-dd" id="proDD">
        <button class="nav-dd-btn" id="proddBtn">ProLaunch <span class="chevron">▼</span></button>
        <div class="dd-menu" id="proddMenu">
          <button class="dd-item" onclick="document.getElementById('pro-privacy').scrollIntoView({behavior:'smooth'});closeDD()">🔒 Privacy Policy</button>
          <div class="dd-div"></div>
          <button class="dd-item" onclick="document.getElementById('pro-disclaimer').scrollIntoView({behavior:'smooth'});closeDD()">⚠️ Disclaimer</button>
        </div>
      </div></li>`,
    dlText: 'Download'
  }
};

function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  window.scrollTo({ top: 0, behavior: 'instant' });
  currentPage = name;

  const cfg = navConfigs[name];
  document.getElementById('navLogo').innerHTML = cfg.logo;
  document.getElementById('navLogo').onclick = name === 'hub' ? null : () => showPage('hub');
  document.getElementById('navLinks').innerHTML = cfg.links;
  const dl = document.getElementById('navDl');
  if (cfg.dlText) {
    dl.style.display = 'block';
    dl.textContent = cfg.dlText;
    dl.onclick = () => window.open(appStoreLinks[name], '_blank', 'noopener');
  } else {
    dl.style.display = 'none';
  }

  // re-wire ProLaunch dropdown if needed
  if (name === 'pro') {
    setTimeout(() => {
      const btn = document.getElementById('proddBtn');
      const menu = document.getElementById('proddMenu');
      if (btn && menu) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const open = menu.classList.toggle('open');
          btn.classList.toggle('open', open);
        });
      }
    }, 0);
  }

  // re-run reveal observer
  revealAll();
}

function closeDD() {
  const m = document.getElementById('proddMenu');
  const b = document.getElementById('proddBtn');
  if (m) { m.classList.remove('open'); }
  if (b) { b.classList.remove('open'); }
}
document.addEventListener('click', closeDD);

/* REVEAL */
let revealObserver;
function revealAll() {
  if (revealObserver) revealObserver.disconnect();
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('#page-' + currentPage + ' .reveal').forEach(el => {
    el.classList.remove('visible');
    revealObserver.observe(el);
  });
}
revealAll();

/* CALCULATOR */
const billInput = document.getElementById('billInput');
const tipRange  = document.getElementById('tipRange');
const pctBadge  = document.getElementById('pctBadge');
const billOut   = document.getElementById('billOut');
const tipOut    = document.getElementById('tipOut');
const totalOut  = document.getElementById('totalOut');
function calc() {
  const b = parseFloat(billInput.value) || 0;
  const p = parseInt(tipRange.value);
  const t = b * p / 100;
  pctBadge.textContent = p + '%';
  billOut.textContent  = '$' + b.toFixed(2);
  tipOut.textContent   = '$' + t.toFixed(2);
  totalOut.textContent = '$' + (b + t).toFixed(2);
}
billInput.addEventListener('input', calc);
tipRange.addEventListener('input', calc);

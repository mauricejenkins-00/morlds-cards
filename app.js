const catalogUrl = './morlds-catalog.json';
const ORBIT_RADIUS_PX = 160;

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function getAccent(morld) {
  const tags = (morld.tags || []).map(t => t.toLowerCase());
  if (tags.some(t => t.includes('pisces') || t.includes('fish') || t.includes('water'))) return 'pisces';
  return 'void';
}

async function loadMorlds() {
  try {
    const res = await fetch(catalogUrl);
    const data = await res.json();
    const morlds = data.morlds || [];
    renderSolarSystem(morlds);
  } catch (err) {
    console.error('Failed to load Morlds:', err);
    document.getElementById('morld-orbs').innerHTML = '';
    document.getElementById('solar-empty').hidden = false;
    document.getElementById('solar-empty').textContent = 'Could not load morlds-catalog.json.';
  }
}

function renderSolarSystem(morlds) {
  const container = document.getElementById('morld-orbs');
  const empty = document.getElementById('solar-empty');

  if (!morlds.length) {
    container.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;
  const n = morlds.length;

  container.innerHTML = morlds
    .map((m, i) => {
      const angle = (2 * Math.PI * i) / n - Math.PI / 2;
      const tx = Math.cos(angle) * ORBIT_RADIUS_PX;
      const ty = Math.sin(angle) * ORBIT_RADIUS_PX;
      const path = m.path || '#';
      const accent = getAccent(m);
      return `
    <button type="button" class="morld-orb" data-morld-index="${i}"
      style="--tx: ${tx}px; --ty: ${ty}px;"
      data-morld='${JSON.stringify(m).replace(/'/g, "\\'")}'
      data-path="${escapeHtml(path)}"
      data-accent="${accent}"
      aria-label="Explore ${escapeHtml(m.name)}">
      <span class="morld-orb-inner morld-orb-inner--${accent}"></span>
      <span class="morld-orb-label">${escapeHtml(m.name)}</span>
    </button>
  `;
    })
    .join('');

  container.querySelectorAll('.morld-orb').forEach((orb) => {
    orb.addEventListener('click', () => openDetails(JSON.parse(orb.dataset.morld)));
  });
}

function openDetails(morld) {
  const panel = document.getElementById('details-panel');
  const content = document.getElementById('details-content');
  const path = morld.path || '#';

  document.querySelectorAll('.morld-orb').forEach((o) => o.classList.remove('selected'));
  const orbs = document.querySelectorAll('.morld-orb');
  orbs.forEach((o) => {
    try {
      const d = JSON.parse(o.dataset.morld);
      if (d.id === morld.id) o.classList.add('selected');
    } catch (_) {}
  });

  const planet = morld.planet || {};
  const bg = morld.background || {};

  content.innerHTML = `
    <div class="details-preview-wrap">
      <iframe src="${escapeHtml(path)}" title="${escapeHtml(morld.name)}"></iframe>
    </div>
    <h2 class="details-title">${escapeHtml(morld.name)}</h2>
    ${morld.mood ? `<p class="details-mood">${escapeHtml(morld.mood)}</p>` : ''}
    <div class="details-meta">
      ${morld.seed ? `<div class="details-meta-row"><span class="details-meta-label">Seed</span><span>${escapeHtml(morld.seed)}</span></div>` : ''}
      ${planet.name ? `<div class="details-meta-row"><span class="details-meta-label">Planet</span><span>${escapeHtml(planet.name)}</span></div>` : ''}
      ${planet.atmosphere ? `<div class="details-meta-row"><span class="details-meta-label">Atmosphere</span><span>${escapeHtml(planet.atmosphere)}</span></div>` : ''}
      ${bg.description ? `<div class="details-meta-row"><span class="details-meta-label">Background</span><span>${escapeHtml(bg.description)}</span></div>` : ''}
    </div>
    ${(morld.tags && morld.tags.length) ? `<div class="details-tags">${morld.tags.map((t) => `<span class="details-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    <a href="${escapeHtml(path)}" class="details-enter-btn" target="_blank" rel="noopener">Enter Morld →</a>
  `;

  panel.classList.add('open');
}

function closeDetails() {
  document.getElementById('details-panel').classList.remove('open');
  document.querySelectorAll('.morld-orb').forEach((o) => o.classList.remove('selected'));
}

function init() {
  loadMorlds();

  document.getElementById('details-close').addEventListener('click', closeDetails);

  document.getElementById('details-panel').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetails();
  });
}

init();

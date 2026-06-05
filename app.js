const data = window.PHRASE_APP_DATA;
const app = document.querySelector('#app');

const state = {
  placeId: null,
  templateId: null,
  selected: {},
  view: 'home',
  recent: loadStore('recentPhrases', []),
  favorites: loadStore('favoritePhrases', [])
};

function loadStore(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveStore(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function byId(list, id) { return list.find(item => item.id === id); }
function templatesByPlace(placeId) { return data.phraseTemplates.filter(t => t.place === placeId); }
function uniqueSituations(placeId) { return [...new Set(templatesByPlace(placeId).map(t => t.situation))]; }
function optionObj(raw) { return { ko: raw[0], ja: raw[1], pron: raw[2] }; }
function selectedTemplate() { return byId(data.phraseTemplates, state.templateId); }
function selectedPlace() { return byId(data.places, state.placeId); }

function fillTemplate(template) {
  let ko = template.koTemplate;
  let ja = template.jaTemplate;
  let pron = template.pronunciationTemplate;
  template.slots.forEach(slot => {
    const selected = state.selected[slot.key];
    if (!selected) return;
    ko = ko.replaceAll(`{${slot.key}}`, selected.ko);
    ja = ja.replaceAll(`{${slot.key}}`, selected.ja);
    pron = pron.replaceAll(`{${slot.key}Pron}`, selected.pron);
  });
  return { ko, ja, pron };
}

function isComplete(template) {
  return template.slots.every(slot => state.selected[slot.key]);
}

function phraseKey(phrase) { return `${phrase.ko}|${phrase.ja}`; }
function addRecent(phrase) {
  const item = { ...phrase, ts: Date.now() };
  state.recent = [item, ...state.recent.filter(p => phraseKey(p) !== phraseKey(item))].slice(0, 12);
  saveStore('recentPhrases', state.recent);
}
function toggleFavorite(phrase) {
  const key = phraseKey(phrase);
  const exists = state.favorites.some(p => phraseKey(p) === key);
  state.favorites = exists ? state.favorites.filter(p => phraseKey(p) !== key) : [{ ...phrase, ts: Date.now() }, ...state.favorites].slice(0, 30);
  saveStore('favoritePhrases', state.favorites);
  render();
}
function isFavorite(phrase) { return state.favorites.some(p => phraseKey(p) === phraseKey(phrase)); }

function goHome() {
  state.view = 'home'; state.placeId = null; state.templateId = null; state.selected = {}; render();
}
function choosePlace(placeId) {
  state.placeId = placeId; state.templateId = null; state.selected = {}; state.view = 'place'; render();
}
function chooseTemplate(templateId) {
  state.templateId = templateId; state.selected = {}; state.view = 'builder'; render();
}
function showResult() {
  const phrase = fillTemplate(selectedTemplate());
  addRecent({ ...phrase, place: selectedPlace()?.ko, title: selectedTemplate().title });
  state.view = 'result'; render();
}
function showBig() { state.view = 'big'; render(); }
function showSaved(kind) { state.view = kind; render(); }
function back() {
  if (state.view === 'big') state.view = 'result';
  else if (state.view === 'result') state.view = 'builder';
  else if (state.view === 'builder') state.view = 'place';
  else if (state.view === 'place' || state.view === 'recent' || state.view === 'favorites') goHome();
  render();
}

function copyText(text) {
  navigator.clipboard?.writeText(text);
  toast('복사했어');
}
function speakJapanese(text) {
  if (!('speechSynthesis' in window)) return toast('이 브라우저는 음성 읽기를 지원하지 않아');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ja-JP';
  u.rate = 0.82;
  speechSynthesis.speak(u);
}
function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast'; el.textContent = message; document.body.appendChild(el);
  setTimeout(() => el.remove(), 1600);
}

function shell(content, options = {}) {
  const showBack = options.back ?? state.view !== 'home';
  return `
    <header class="topbar">
      ${showBack ? '<button class="icon-btn" data-action="back">‹</button>' : '<div class="brand-dot">日</div>'}
      <div>
        <h1>${options.title || '바로일본어'}</h1>
        <p>${options.subtitle || '일본 현장용 선택형 통역 도우미'}</p>
      </div>
    </header>
    ${content}
  `;
}

function renderHome() {
  return shell(`
    <section class="hero">
      <div class="hero-copy">
        <span class="pill">워크샵·여행 MVP</span>
        <h2>단어 몇 개만 누르면<br/>바로 일본어 문장 완성</h2>
        <p>가게, 음식점, 술집, 택시에서 자주 쓰는 표현을 빠르게 보여줘.</p>
      </div>
    </section>
    <section class="grid">
      ${data.places.map(place => `
        <button class="place-card" data-place="${place.id}">
          <span class="emoji">${place.icon}</span>
          <strong>${place.ko}</strong>
          <small>${place.description}</small>
        </button>
      `).join('')}
    </section>
    <section class="quick-row">
      <button class="secondary" data-view="favorites">⭐ 즐겨찾기 ${state.favorites.length}</button>
      <button class="secondary" data-view="recent">🕘 최근 사용 ${state.recent.length}</button>
    </section>
  `, { back: false });
}

function renderPlace() {
  const place = selectedPlace();
  const situations = uniqueSituations(place.id);
  return shell(`
    <section class="section-title"><span>${place.icon}</span><h2>${place.ko}</h2><p>${place.description}</p></section>
    ${situations.map(s => `
      <div class="situation">
        <h3>${s}</h3>
        <div class="template-list">
          ${templatesByPlace(place.id).filter(t => t.situation === s).map(t => `
            <button class="template-card" data-template="${t.id}">
              <strong>${t.title}</strong>
              <span>${t.koTemplate.replaceAll('{', '').replaceAll('}', '')}</span>
            </button>
          `).join('')}
        </div>
      </div>
    `).join('')}
  `, { title: place.ko, subtitle: '상황을 선택해줘' });
}

function renderBuilder() {
  const template = selectedTemplate();
  const complete = isComplete(template);
  const phrase = fillTemplate(template);
  return shell(`
    <section class="builder-head">
      <span class="pill">${selectedPlace().ko} · ${template.situation}</span>
      <h2>${template.title}</h2>
      <p>필요한 단어를 선택하면 문장이 완성돼.</p>
    </section>
    ${template.slots.map(slot => `
      <section class="slot">
        <h3>${slot.label}</h3>
        <div class="option-grid">
          ${slot.options.map(raw => {
            const opt = optionObj(raw);
            const active = state.selected[slot.key]?.ko === opt.ko;
            return `<button class="option ${active ? 'active' : ''}" data-slot="${slot.key}" data-ko="${opt.ko}" data-ja="${opt.ja}" data-pron="${opt.pron}">
              <strong>${opt.ko}</strong><small>${opt.ja}</small>
            </button>`;
          }).join('')}
        </div>
      </section>
    `).join('')}
    <section class="preview ${complete ? 'ready' : ''}">
      <small>미리보기</small>
      <p>${complete ? phrase.ko : '선택을 완료하면 문장이 보여.'}</p>
      <b>${complete ? phrase.ja : ''}</b>
      <button class="primary" data-action="result" ${complete ? '' : 'disabled'}>문장 크게 보기</button>
    </section>
  `, { title: template.title, subtitle: '문장 만들기' });
}

function phraseCard(p, index, from) {
  return `<article class="phrase-card">
    <small>${p.place || ''} ${p.title ? '· ' + p.title : ''}</small>
    <h2>${p.ja}</h2>
    <p>${p.ko}</p>
    <em>${p.pron}</em>
    <div class="actions">
      <button class="secondary small" data-copy-index="${index}" data-from="${from}">복사</button>
      <button class="secondary small" data-speak-index="${index}" data-from="${from}">읽기</button>
    </div>
  </article>`;
}

function renderResult() {
  const phrase = fillTemplate(selectedTemplate());
  const full = `${phrase.ja}\n${phrase.pron}\n${phrase.ko}`;
  return shell(`
    <section class="result-card">
      <small>${selectedPlace().ko} · ${selectedTemplate().title}</small>
      <h2>${phrase.ja}</h2>
      <p>${phrase.ko}</p>
      <em>${phrase.pron}</em>
    </section>
    <section class="actions vertical">
      <button class="primary" data-action="big">직원에게 크게 보여주기</button>
      <button class="secondary" data-copy-text="${encodeURIComponent(full)}">복사</button>
      <button class="secondary" data-speak-text="${encodeURIComponent(phrase.ja)}">일본어 읽기</button>
      <button class="secondary" data-favorite-current>${isFavorite({...phrase}) ? '⭐ 즐겨찾기 해제' : '☆ 즐겨찾기 추가'}</button>
    </section>
  `, { title: '완성 문장', subtitle: '보여주거나 읽어줘' });
}

function renderBig() {
  const phrase = fillTemplate(selectedTemplate());
  return `
    <main class="big-screen" data-action="back">
      <div>
        <h1>${phrase.ja}</h1>
        <p>${phrase.ko}</p>
        <em>${phrase.pron}</em>
      </div>
      <small>화면을 누르면 돌아가</small>
    </main>
  `;
}

function renderSaved(kind) {
  const list = kind === 'favorites' ? state.favorites : state.recent;
  return shell(`
    <section class="saved-list">
      ${list.length ? list.map((p, i) => phraseCard(p, i, kind)).join('') : `<div class="empty">아직 ${kind === 'favorites' ? '즐겨찾기' : '최근 사용'} 문장이 없어.</div>`}
    </section>
  `, { title: kind === 'favorites' ? '즐겨찾기' : '최근 사용', subtitle: '자주 쓰는 문장' });
}

function render() {
  const html = state.view === 'home' ? renderHome()
    : state.view === 'place' ? renderPlace()
    : state.view === 'builder' ? renderBuilder()
    : state.view === 'result' ? renderResult()
    : state.view === 'big' ? renderBig()
    : state.view === 'favorites' ? renderSaved('favorites')
    : renderSaved('recent');
  app.innerHTML = html;
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('button, main.big-screen');
  if (!target) return;
  if (target.dataset.action === 'back') return back();
  if (target.dataset.place) return choosePlace(target.dataset.place);
  if (target.dataset.template) return chooseTemplate(target.dataset.template);
  if (target.dataset.view) return showSaved(target.dataset.view);
  if (target.dataset.slot) {
    state.selected[target.dataset.slot] = { ko: target.dataset.ko, ja: target.dataset.ja, pron: target.dataset.pron };
    return render();
  }
  if (target.dataset.action === 'result') return showResult();
  if (target.dataset.action === 'big') return showBig();
  if (target.dataset.copyText) return copyText(decodeURIComponent(target.dataset.copyText));
  if (target.dataset.speakText) return speakJapanese(decodeURIComponent(target.dataset.speakText));
  if (target.hasAttribute('data-favorite-current')) return toggleFavorite({ ...fillTemplate(selectedTemplate()), place: selectedPlace().ko, title: selectedTemplate().title });
  if (target.dataset.copyIndex) {
    const p = state[target.dataset.from][Number(target.dataset.copyIndex)];
    return copyText(`${p.ja}\n${p.pron}\n${p.ko}`);
  }
  if (target.dataset.speakIndex) {
    const p = state[target.dataset.from][Number(target.dataset.speakIndex)];
    return speakJapanese(p.ja);
  }
});

render();

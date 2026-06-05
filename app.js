const data = window.PHRASE_APP_DATA;
const app = document.querySelector('#app');

const state = {
  placeId: null,
  templateId: null,
  selected: {},
  view: 'home',
  recent: loadStore('recentPhrases', []),
  favorites: loadStore('favoritePhrases', []),
  shoppingList: loadStore('shoppingList', []),
  searchQuery: '',
  searchResult: null,
  searchLoading: false
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

// ── 쇼핑 검색 ──────────────────────────────────────────────
async function translateToJapanese(text) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ko|ja`;
  const res = await fetch(url);
  const json = await res.json();
  return json.responseData?.translatedText || null;
}

const SHOPPING_PHRASES = [
  { ko: '어디 있어요?', ja: '{item}はどこにありますか？', pron: '{item} 와 도코니 아리마스카' },
  { ko: '이거 있어요?', ja: '{item}はありますか？', pron: '{item} 와 아리마스카' },
  { ko: '이거 주세요.', ja: '{item}をください。', pron: '{item} 오 쿠다사이' },
  { ko: '다른 색상 있어요?', ja: '{item}の他の色はありますか？', pron: '{item} 노 호카노 이로와 아리마스카' },
];

async function doSearch(query) {
  if (!query.trim()) return;
  state.searchLoading = true;
  state.searchResult = null;
  render();
  try {
    const ja = await translateToJapanese(query);
    if (ja) {
      state.searchResult = { ko: query, ja, pron: '' };
    }
  } catch (e) {
    toast('번역에 실패했어. 인터넷 연결을 확인해줘.');
  }
  state.searchLoading = false;
  render();
}

function addToShoppingList(item) {
  const exists = state.shoppingList.some(s => s.ja === item.ja);
  if (exists) return toast('이미 목록에 있어!');
  state.shoppingList = [{ ...item, done: false, id: Date.now() }, ...state.shoppingList];
  saveStore('shoppingList', state.shoppingList);
  toast('쇼핑 목록에 추가했어 ✓');
  render();
}

function toggleShopDone(id) {
  state.shoppingList = state.shoppingList.map(s => s.id === id ? { ...s, done: !s.done } : s);
  saveStore('shoppingList', state.shoppingList);
  render();
}

function removeShopItem(id) {
  state.shoppingList = state.shoppingList.filter(s => s.id !== id);
  saveStore('shoppingList', state.shoppingList);
  render();
}
// ───────────────────────────────────────────────────────────

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
function showShopping() { state.view = 'shopping'; render(); }
function back() {
  if (state.view === 'big') state.view = 'result';
  else if (state.view === 'result') state.view = 'builder';
  else if (state.view === 'builder') state.view = 'place';
  else if (state.view === 'place' || state.view === 'recent' || state.view === 'favorites' || state.view === 'shopping') goHome();
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
    <section class="quick-row" style="margin-top:10px">
      <button class="primary" data-view="shopping" style="grid-column:1/-1">🛒 쇼핑 목록 검색 ${state.shoppingList.length ? '· ' + state.shoppingList.length + '개' : ''}</button>
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

function renderShopping() {
  const r = state.searchResult;
  return shell(`
    <section class="search-box">
      <h2>🛒 쇼핑 검색</h2>
      <p style="color:var(--muted);font-size:13px;margin:0 0 14px">한국어로 상품명을 입력하면 일본어로 보여줄게.<br>예: 키스미 아이라이너, 카네보 파운데이션</p>
      <div class="search-row">
        <input class="search-input" id="shopSearch" type="text" placeholder="상품명 입력..." value="${state.searchQuery}" />
        <button class="search-btn" data-action="search">검색</button>
      </div>
    </section>

    ${state.searchLoading ? `<div class="search-spinner">번역 중...</div>` : ''}

    ${r ? `
      <section class="search-result">
        <small>검색 결과</small>
        <div class="ja-big">${r.ja}</div>
        <div class="pron">${r.ko}</div>
        <button class="primary" data-action="add-shop" style="margin-bottom:14px">+ 쇼핑 목록에 추가</button>
        <div style="font-size:13px;font-weight:800;color:var(--muted);margin-bottom:8px">직원에게 쓸 수 있는 문장</div>
        <div class="phrase-list">
          ${SHOPPING_PHRASES.map((p, i) => `
            <div class="phrase-row" data-phrase-idx="${i}">
              <strong>${p.ja.replace('{item}', r.ja)}</strong>
              <small>${p.ko}</small>
            </div>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <section>
      <div style="font-size:16px;font-weight:800;letter-spacing:-0.04em;margin:18px 0 12px">
        쇼핑 목록 ${state.shoppingList.length ? `<span style="color:var(--brand)">${state.shoppingList.length}개</span>` : ''}
      </div>
      ${state.shoppingList.length ? `
        <div class="shopping-list">
          ${state.shoppingList.map(item => `
            <div class="shop-item-card ${item.done ? 'check-done' : ''}">
              <div class="item-info">
                <div class="item-ja">${item.ja}</div>
                <div class="item-ko">${item.ko}</div>
              </div>
              <div class="item-actions">
                <button class="icon-sm" data-shop-speak="${item.id}" title="읽기">🔊</button>
                <button class="icon-sm" data-shop-copy="${item.id}" title="복사">📋</button>
                <button class="icon-sm" data-shop-done="${item.id}" title="완료">${item.done ? '↩️' : '✓'}</button>
                <button class="icon-sm" data-shop-del="${item.id}" title="삭제">🗑</button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `<div class="empty">검색 후 목록에 추가해봐.<br>찾은 상품을 여기에 모아둘 수 있어.</div>`}
    </section>
  `, { title: '쇼핑 검색', subtitle: '상품명을 일본어로 바꿔줘' });
}

function render() {
  const html = state.view === 'home' ? renderHome()
    : state.view === 'place' ? renderPlace()
    : state.view === 'builder' ? renderBuilder()
    : state.view === 'result' ? renderResult()
    : state.view === 'big' ? renderBig()
    : state.view === 'favorites' ? renderSaved('favorites')
    : state.view === 'shopping' ? renderShopping()
    : renderSaved('recent');
  app.innerHTML = html;
  if (state.view === 'shopping') {
    const input = document.querySelector('#shopSearch');
    if (input) {
      input.addEventListener('input', e => { state.searchQuery = e.target.value; });
      input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(state.searchQuery); });
    }
  }
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('button, main.big-screen');
  if (!target) return;
  if (target.dataset.action === 'back') return back();
  if (target.dataset.place) return choosePlace(target.dataset.place);
  if (target.dataset.template) return chooseTemplate(target.dataset.template);
  if (target.dataset.view === 'shopping') return showShopping();
  if (target.dataset.view) return showSaved(target.dataset.view);
  if (target.dataset.slot) {
    state.selected[target.dataset.slot] = { ko: target.dataset.ko, ja: target.dataset.ja, pron: target.dataset.pron };
    return render();
  }
  if (target.dataset.action === 'result') return showResult();
  if (target.dataset.action === 'big') return showBig();
  if (target.dataset.action === 'search') return doSearch(state.searchQuery);
  if (target.dataset.action === 'add-shop' && state.searchResult) return addToShoppingList(state.searchResult);
  if (target.dataset.phraseIdx != null && state.searchResult) {
    const p = SHOPPING_PHRASES[Number(target.dataset.phraseIdx)];
    const ja = p.ja.replace('{item}', state.searchResult.ja);
    return speakJapanese(ja);
  }
  if (target.dataset.shopDone) return toggleShopDone(Number(target.dataset.shopDone));
  if (target.dataset.shopDel) return removeShopItem(Number(target.dataset.shopDel));
  if (target.dataset.shopSpeak) {
    const item = state.shoppingList.find(s => s.id === Number(target.dataset.shopSpeak));
    if (item) return speakJapanese(item.ja);
  }
  if (target.dataset.shopCopy) {
    const item = state.shoppingList.find(s => s.id === Number(target.dataset.shopCopy));
    if (item) return copyText(item.ja);
  }
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

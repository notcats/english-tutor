(function () {
  if (window.__aiDictLoaded) return;
  window.__aiDictLoaded = true;

  const API = 'https://7b0b.up.railway.app';

  let tip = null;
  let tipWord = '';

  /* ── Storage helpers ───────────────────────────────── */
  function getToken() {
    return new Promise(r => chrome.storage.local.get('tok', d => r(d.tok || '')));
  }

  /* ── Show tooltip ──────────────────────────────────── */
  function showTip(word, x, y) {
    removeTip();
    tipWord = word;

    tip = document.createElement('div');
    tip.id = '__aidtip';
    tip.innerHTML =
      '<div class="adt-word">' + word + '</div>' +
      '<div class="adt-body"><span class="adt-spin">⟳</span> translating…</div>' +
      '<div class="adt-actions" style="display:none">' +
        '<button class="adt-tts" title="Listen">🔊</button>' +
        '<button class="adt-add">＋ Add</button>' +
      '</div>';
    document.body.appendChild(tip);

    // Position near cursor
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let lx = x + window.scrollX + 12;
    let ly = y + window.scrollY + 18;
    if (lx + tw > window.scrollX + window.innerWidth - 8) lx = x + window.scrollX - tw - 12;
    if (ly + th > window.scrollY + window.innerHeight - 8) ly = y + window.scrollY - th - 18;
    tip.style.left = lx + 'px';
    tip.style.top  = ly + 'px';

    fetchWord(word).then(data => {
      if (!tip || tipWord !== word) return;
      const body    = tip.querySelector('.adt-body');
      const actions = tip.querySelector('.adt-actions');
      if (!data) { body.textContent = '—'; return; }

      body.innerHTML =
        '<span class="adt-tr">' + (data.translation || '—') + '</span>' +
        (data.transcription ? ' <span class="adt-ts">[' + data.transcription + ']</span>' : '') +
        (data.level ? ' <span class="adt-lv">' + data.level + '</span>' : '');

      actions.style.display = 'flex';

      tip.querySelector('.adt-tts').onclick = () => {
        const u = new SpeechSynthesisUtterance(word);
        u.lang = 'en-US';
        speechSynthesis.speak(u);
      };

      tip.querySelector('.adt-add').onclick = () => addWord(word, data);
    });
  }

  function removeTip() {
    if (tip) { tip.remove(); tip = null; }
    tipWord = '';
  }

  /* ── API calls ─────────────────────────────────────── */
  async function fetchWord(word) {
    try {
      const tok = await getToken();
      const r = await fetch(API + '/api/ai/word', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tok ? { 'Authorization': 'Bearer ' + tok } : {})
        },
        body: JSON.stringify({ word, learnLang: 'en', nativeLang: 'ru' })
      });
      if (!r.ok) return null;
      return r.json();
    } catch { return null; }
  }

  async function addWord(word, data) {
    const tok = await getToken();
    if (!tok) {
      showSignInHint();
      return;
    }
    const addBtn = tip && tip.querySelector('.adt-add');
    if (addBtn) { addBtn.disabled = true; addBtn.textContent = '…'; }
    try {
      const r = await fetch(API + '/api/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + tok
        },
        body: JSON.stringify({
          word,
          translation:   data.translation  || '',
          transcription: data.transcription || '',
          level:         data.level         || 'B1',
          example_en:    data.example_en    || '',
          example_ru:    data.example_ru    || '',
          grammar_note:  data.grammar_note  || '',
          hard: false
        })
      });
      if (r.ok && addBtn) {
        addBtn.textContent = '✓ Added';
        addBtn.style.background = '#3ffdb6';
      } else if (addBtn) {
        addBtn.textContent = 'Error';
        addBtn.disabled = false;
      }
    } catch {
      if (addBtn) { addBtn.textContent = 'Error'; addBtn.disabled = false; }
    }
  }

  function showSignInHint() {
    if (!tip) return;
    const body = tip.querySelector('.adt-body');
    if (body) body.innerHTML = '<span style="color:#ffb547">Sign in via extension icon</span>';
  }

  /* ── Text selection listener ───────────────────────── */
  document.addEventListener('mouseup', (e) => {
    if (tip && tip.contains(e.target)) return;

    const sel  = window.getSelection();
    const text = sel ? sel.toString().trim() : '';

    // Only single words, Latin letters only, 2–30 chars
    if (!text || text.length < 2 || text.length > 30 || /\s/.test(text) || /[^\w'\-]/.test(text)) {
      return;
    }
    const word = text.replace(/[^a-zA-Z'\-]/g, '').toLowerCase();
    if (!word || word.length < 2) return;

    showTip(word, e.clientX, e.clientY);
  });

  document.addEventListener('mousedown', (e) => {
    if (tip && !tip.contains(e.target)) removeTip();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') removeTip();
  });
})();

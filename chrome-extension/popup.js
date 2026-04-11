const API = 'https://7b0b.up.railway.app';

function getToken() {
  return new Promise(r => chrome.storage.local.get('tok', d => r(d.tok || '')));
}
function setToken(tok) {
  return new Promise(r => chrome.storage.local.set({ tok }, r));
}

async function init() {
  const tok = await getToken();
  if (tok) {
    try {
      const r = await fetch(API + '/api/auth/me', {
        headers: { 'Authorization': 'Bearer ' + tok }
      });
      if (r.ok) {
        showLoggedIn(await r.json());
        return;
      }
    } catch {}
    await setToken('');
  }
  showLogin();
}

function showLogin() {
  document.getElementById('root').innerHTML =
    '<div class="lbl">Sign in to sync your words</div>' +
    '<input class="inp" id="em" type="email" placeholder="Email" autocomplete="email">' +
    '<input class="inp" id="pw" type="password" placeholder="Password">' +
    '<button class="btn" id="loginBtn">Sign in</button>' +
    '<div class="err" id="err"></div>';

  const loginBtn = document.getElementById('loginBtn');
  loginBtn.onclick = doLogin;
  document.getElementById('pw').addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
}

async function doLogin() {
  const email = document.getElementById('em').value.trim();
  const pass  = document.getElementById('pw').value;
  const errEl = document.getElementById('err');
  errEl.textContent = '';

  if (!email || !pass) { errEl.textContent = 'Fill in all fields'; return; }

  const btn = document.getElementById('loginBtn');
  btn.textContent = 'Signing in…';
  btn.disabled = true;

  try {
    const r = await fetch(API + '/api/auth/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || 'Authentication failed');
    await setToken(d.token);
    showLoggedIn(d.user);
  } catch (e) {
    errEl.textContent = e.message;
    btn.textContent = 'Sign in';
    btn.disabled = false;
  }
}

function showLoggedIn(user) {
  const initial = (user.name || user.email || '?')[0].toUpperCase();
  document.getElementById('root').innerHTML =
    '<div class="profile">' +
      '<div class="ava">' + initial + '</div>' +
      '<div class="uname">' + (user.name || user.email) + '</div>' +
      '<div class="hint">Select any word on a page —<br>translate & add to dictionary</div>' +
      '<button class="open-btn" id="openBtn">📖 Open AI Dictionary</button>' +
      '<button class="logout-btn" id="logoutBtn">Sign out</button>' +
    '</div>';

  document.getElementById('openBtn').onclick = () => {
    chrome.tabs.create({ url: API });
  };
  document.getElementById('logoutBtn').onclick = async () => {
    await setToken('');
    showLogin();
  };
}

init();

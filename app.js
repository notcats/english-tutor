// ── CONFIG ──────────────────────────────────────────────
(()=>{const th=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',th);})();
const LANGS=[{code:"ru",flag:"🇷🇺",name:"Русский",nameEn:"Russian"},{code:"es",flag:"🇪🇸",name:"Español",nameEn:"Spanish"},{code:"fr",flag:"🇫🇷",name:"Français",nameEn:"French"},{code:"de",flag:"🇩🇪",name:"Deutsch",nameEn:"German"},{code:"zh",flag:"🇨🇳",name:"中文",nameEn:"Chinese"},{code:"ar",flag:"🇸🇦",name:"العربية",nameEn:"Arabic"},{code:"pt",flag:"🇧🇷",name:"Português",nameEn:"Portuguese"},{code:"tr",flag:"🇹🇷",name:"Türkçe",nameEn:"Turkish"},{code:"it",flag:"🇮🇹",name:"Italiano",nameEn:"Italian"},{code:"ko",flag:"🇰🇷",name:"한국어",nameEn:"Korean"},{code:"ja",flag:"🇯🇵",name:"日本語",nameEn:"Japanese"},{code:"pl",flag:"🇵🇱",name:"Polski",nameEn:"Polish"},{code:"uk",flag:"🇺🇦",name:"Українська",nameEn:"Ukrainian"},{code:"nl",flag:"🇳🇱",name:"Nederlands",nameEn:"Dutch"},{code:"hi",flag:"🇮🇳",name:"हिन्दी",nameEn:"Hindi"}];
const LLANGS=[{code:"en",flag:"🇬🇧",name:"English"},{code:"de",flag:"🇩🇪",name:"Deutsch"},{code:"fr",flag:"🇫🇷",name:"Français"},{code:"es",flag:"🇪🇸",name:"Español"},{code:"it",flag:"🇮🇹",name:"Italiano"},{code:"zh",flag:"🇨🇳",name:"中文"},{code:"ja",flag:"🇯🇵",name:"日本語"},{code:"ko",flag:"🇰🇷",name:"한국어"}];
const LEVELS = ['A1','A2','B1','B2','C1','C2'];

// ── I18N ────────────────────────────────────────────────
const UI_LANG=(navigator.language||'en').slice(0,2).toLowerCase();
const I18N={
  en:{nativeQ:'What is your native language?',learnQ:'What will you learn?',step1:'Step 1 of 3 — Your native language',step2:'Step 2 of 3 — Language to learn',step3:'Step 3 of 3',cont:'Continue →',back:'← Back',search:'Search…',chooseLang:'Choose language to learn',addWord:'Add a word',noAccount:'No account needed',signInBtn:'Sign in',signInSub:'Save & sync progress',saveTitle:'Save your progress!',saveDesc:'Create a free account to keep your words safe.',register:'Create account',skip:'Skip for now',wordAdded:'Word added!',tabWords:'Words',tabPractice:'Practice',tabHistory:'History',tabStats:'Stats',tabGroups:'Groups'},
  ru:{nativeQ:'Какой ваш родной язык?',learnQ:'Какой язык вы учите?',step1:'Шаг 1 из 3 — Родной язык',step2:'Шаг 2 из 3 — Язык для изучения',step3:'Шаг 3 из 3',cont:'Продолжить →',back:'← Назад',search:'Поиск…',chooseLang:'Выберите язык',addWord:'Добавить слово',noAccount:'Без регистрации',signInBtn:'Войти',signInSub:'Синхронизация прогресса',saveTitle:'Сохраните прогресс!',saveDesc:'Создайте бесплатный аккаунт, чтобы слова не потерялись.',register:'Создать аккаунт',skip:'Пропустить',wordAdded:'Слово добавлено!',tabWords:'Слова',tabPractice:'Практика',tabHistory:'История',tabStats:'Статус',tabGroups:'Группы'},
  es:{nativeQ:'¿Cuál es tu idioma nativo?',learnQ:'¿Qué idioma aprenderás?',step1:'Paso 1/3 — Tu idioma nativo',step2:'Paso 2/3 — Idioma a aprender',step3:'Paso 3/3',cont:'Continuar →',back:'← Atrás',search:'Buscar…',chooseLang:'Elige idioma',addWord:'Añadir palabra',noAccount:'Sin cuenta',signInBtn:'Iniciar sesión',signInSub:'Guardar progreso',saveTitle:'¡Guarda tu progreso!',saveDesc:'Crea una cuenta gratuita para guardar tus palabras.',register:'Crear cuenta',skip:'Omitir',wordAdded:'¡Palabra añadida!',tabWords:'Palabras',tabPractice:'Práctica',tabHistory:'Historial',tabStats:'Stats',tabGroups:'Grupos'},
  fr:{nativeQ:'Quelle est votre langue maternelle?',learnQ:'Quelle langue apprendrez-vous?',step1:'Étape 1/3 — Langue maternelle',step2:'Étape 2/3 — Langue à apprendre',step3:'Étape 3/3',cont:'Continuer →',back:'← Retour',search:'Rechercher…',chooseLang:'Choisissez une langue',addWord:'Ajouter un mot',noAccount:'Sans compte',signInBtn:'Se connecter',signInSub:'Sauvegarder la progression',saveTitle:'Sauvegardez vos progrès!',saveDesc:'Créez un compte gratuit pour ne pas perdre vos mots.',register:'Créer un compte',skip:'Passer',wordAdded:'Mot ajouté!',tabWords:'Mots',tabPractice:'Pratique',tabHistory:'Historique',tabStats:'Stats',tabGroups:'Groupes'},
  de:{nativeQ:'Was ist Ihre Muttersprache?',learnQ:'Welche Sprache lernen Sie?',step1:'Schritt 1/3 — Muttersprache',step2:'Schritt 2/3 — Lernsprache',step3:'Schritt 3/3',cont:'Weiter →',back:'← Zurück',search:'Suchen…',chooseLang:'Lernsprache wählen',addWord:'Wort hinzufügen',noAccount:'Ohne Konto',signInBtn:'Anmelden',signInSub:'Fortschritt synchronisieren',saveTitle:'Fortschritt speichern!',saveDesc:'Erstellen Sie ein kostenloses Konto für Ihre Wörter.',register:'Konto erstellen',skip:'Überspringen',wordAdded:'Wort hinzugefügt!',tabWords:'Wörter',tabPractice:'Übung',tabHistory:'Verlauf',tabStats:'Stats',tabGroups:'Gruppen'},
  zh:{nativeQ:'您的母语是什么?',learnQ:'您要学习哪种语言?',step1:'第1/3步 — 您的母语',step2:'第2/3步 — 学习语言',step3:'第3/3步',cont:'继续 →',back:'← 返回',search:'搜索…',chooseLang:'选择学习语言',addWord:'添加单词',noAccount:'无需账户',signInBtn:'登录',signInSub:'同步进度',saveTitle:'保存您的进度！',saveDesc:'创建免费账户以保留您的单词。',register:'创建账户',skip:'跳过',wordAdded:'单词已添加！',tabWords:'单词',tabPractice:'练习',tabHistory:'历史',tabStats:'统计',tabGroups:'小组'},
  ja:{nativeQ:'母語は何ですか？',learnQ:'学ぶ言語は何ですか？',step1:'ステップ1/3 — 母語',step2:'ステップ2/3 — 学習言語',step3:'ステップ3/3',cont:'続ける →',back:'← 戻る',search:'検索…',chooseLang:'学習言語を選択',addWord:'単語を追加',noAccount:'アカウント不要',signInBtn:'サインイン',signInSub:'進捗を同期',saveTitle:'進捗を保存！',saveDesc:'無料アカウントを作成して単語を保存しましょう。',register:'アカウント作成',skip:'後で',wordAdded:'単語が追加されました！',tabWords:'単語',tabPractice:'練習',tabHistory:'履歴',tabStats:'統計',tabGroups:'グループ'},
  ko:{nativeQ:'모국어가 무엇인가요?',learnQ:'어떤 언어를 배울 건가요?',step1:'1/3단계 — 모국어',step2:'2/3단계 — 학습 언어',step3:'3/3단계',cont:'계속 →',back:'← 뒤로',search:'검색…',chooseLang:'학습 언어 선택',addWord:'단어 추가',noAccount:'계정 불필요',signInBtn:'로그인',signInSub:'진행 상황 동기화',saveTitle:'진행 상황을 저장하세요!',saveDesc:'무료 계정을 만들어 단어를 보관하세요.',register:'계정 만들기',skip:'나중에',wordAdded:'단어가 추가되었습니다!',tabWords:'단어',tabPractice:'연습',tabHistory:'기록',tabStats:'통계',tabGroups:'그룹'},
  uk:{nativeQ:'Яка ваша рідна мова?',learnQ:'Яку мову ви вивчаєте?',step1:'Крок 1/3 — Рідна мова',step2:'Крок 2/3 — Мова для вивчення',step3:'Крок 3/3',cont:'Продовжити →',back:'← Назад',search:'Пошук…',chooseLang:'Оберіть мову',addWord:'Додати слово',noAccount:'Без реєстрації',signInBtn:'Увійти',signInSub:'Синхронізація прогресу',saveTitle:'Збережіть прогрес!',saveDesc:'Створіть безкоштовний акаунт, щоб не втратити слова.',register:'Створити акаунт',skip:'Пропустити',wordAdded:'Слово додано!',tabWords:'Слова',tabPractice:'Практика',tabHistory:'Історія',tabStats:'Статус',tabGroups:'Групи'},
  pt:{nativeQ:'Qual é a sua língua materna?',learnQ:'Qual idioma vai aprender?',step1:'Passo 1/3 — Idioma nativo',step2:'Passo 2/3 — Idioma a aprender',step3:'Passo 3/3',cont:'Continuar →',back:'← Voltar',search:'Pesquisar…',chooseLang:'Escolha o idioma',addWord:'Adicionar palavra',noAccount:'Sem conta',signInBtn:'Entrar',signInSub:'Salvar progresso',saveTitle:'Salve seu progresso!',saveDesc:'Crie uma conta gratuita para guardar suas palavras.',register:'Criar conta',skip:'Pular',wordAdded:'Palavra adicionada!',tabWords:'Palavras',tabPractice:'Prática',tabHistory:'Histórico',tabStats:'Stats',tabGroups:'Grupos'},
  tr:{nativeQ:'Ana diliniz nedir?',learnQ:'Hangi dili öğreneceksiniz?',step1:'Adım 1/3 — Ana dil',step2:'Adım 2/3 — Öğrenilecek dil',step3:'Adım 3/3',cont:'Devam →',back:'← Geri',search:'Ara…',chooseLang:'Dil seçin',addWord:'Kelime ekle',noAccount:'Hesap gerekmez',signInBtn:'Giriş yap',signInSub:'İlerlemeyi kaydet',saveTitle:'İlerlemenizi kaydedin!',saveDesc:'Kelimelerinizi korumak için ücretsiz hesap oluşturun.',register:'Hesap oluştur',skip:'Atla',wordAdded:'Kelime eklendi!',tabWords:'Kelimeler',tabPractice:'Pratik',tabHistory:'Geçmiş',tabStats:'İstatistik',tabGroups:'Gruplar'},
  it:{nativeQ:'Qual è la tua lingua madre?',learnQ:'Quale lingua stai imparando?',step1:'Passo 1/3 — Lingua madre',step2:'Passo 2/3 — Lingua da imparare',step3:'Passo 3/3',cont:'Continua →',back:'← Indietro',search:'Cerca…',chooseLang:'Scegli la lingua',addWord:'Aggiungi parola',noAccount:'Senza account',signInBtn:'Accedi',signInSub:'Salva i progressi',saveTitle:'Salva i tuoi progressi!',saveDesc:'Crea un account gratuito per non perdere le parole.',register:'Crea account',skip:'Salta',wordAdded:'Parola aggiunta!',tabWords:'Parole',tabPractice:'Pratica',tabHistory:'Cronologia',tabStats:'Stats',tabGroups:'Gruppi'},
  pl:{nativeQ:'Jaki jest twój ojczysty język?',learnQ:'Jakiego języka się uczysz?',step1:'Krok 1/3 — Ojczysty język',step2:'Krok 2/3 — Język do nauki',step3:'Krok 3/3',cont:'Kontynuuj →',back:'← Wstecz',search:'Szukaj…',chooseLang:'Wybierz język',addWord:'Dodaj słowo',noAccount:'Bez konta',signInBtn:'Zaloguj się',signInSub:'Synchronizuj postępy',saveTitle:'Zapisz swoje postępy!',saveDesc:'Utwórz darmowe konto dla swoich słów.',register:'Utwórz konto',skip:'Pomiń',wordAdded:'Słowo dodane!',tabWords:'Słowa',tabPractice:'Ćwiczenia',tabHistory:'Historia',tabStats:'Statystyki',tabGroups:'Grupy'},
  ar:{nativeQ:'ما هي لغتك الأم؟',learnQ:'ما اللغة التي ستتعلمها؟',step1:'الخطوة 1/3 — لغتك الأم',step2:'الخطوة 2/3 — اللغة التي تتعلمها',step3:'الخطوة 3/3',cont:'متابعة →',back:'→ رجوع',search:'بحث…',chooseLang:'اختر اللغة',addWord:'إضافة كلمة',noAccount:'بدون حساب',signInBtn:'تسجيل الدخول',signInSub:'مزامنة التقدم',saveTitle:'احفظ تقدمك!',saveDesc:'أنشئ حسابًا مجانيًا للحفاظ على كلماتك.',register:'إنشاء حساب',skip:'تخطي',wordAdded:'تمت إضافة الكلمة!',tabWords:'كلمات',tabPractice:'تدريب',tabHistory:'السجل',tabStats:'إحصاء',tabGroups:'مجموعات'},
  hi:{nativeQ:'आपकी मातृभाषा क्या है?',learnQ:'आप कौन सी भाषा सीखेंगे?',step1:'चरण 1/3 — आपकी मातृभाषा',step2:'चरण 2/3 — सीखने की भाषा',step3:'चरण 3/3',cont:'जारी रखें →',back:'← वापस',search:'खोजें…',chooseLang:'भाषा चुनें',addWord:'शब्द जोड़ें',noAccount:'खाते की ज़रूरत नहीं',signInBtn:'साइन इन',signInSub:'प्रगति सिंक करें',saveTitle:'अपनी प्रगति बचाएं!',saveDesc:'अपने शब्दों को सुरक्षित रखने के लिए मुफ़्त खाता बनाएं।',register:'खाता बनाएं',skip:'छोड़ें',wordAdded:'शब्द जोड़ा गया!',tabWords:'शब्द',tabPractice:'अभ्यास',tabHistory:'इतिहास',tabStats:'आँकड़े',tabGroups:'समूह'},
};
function t(k){return(I18N[UI_LANG]||I18N.en)[k]||I18N.en[k]||k;}

// ── STATE & BOOTSTRAP ───────────────────────────────────
function dLang(){const b=(navigator.language||'ru').slice(0,2).toLowerCase();return LANGS.find(l=>l.code===b)?.code||'ru';}
let S={scr:'ob',step:1,nl:dLang(),ll:'en',obs:'',user:null,tok:localStorage.getItem('tok')||'',tab:'dict',words:[],filt:'All',srch:'',add:false,addTab:'manual',det:null,pm:null,sess:null,ho:false,prof:false,lp:false,hist:[],grps:[],guest:false,guestStep:'add',adm:{tab:'stats',data:null,users:[],cache:[],uSrch:'',loading:false},grpM:null};

// ── API ─────────────────────────────────────────────────
async function api(path,o={}){
  const r=await fetch(path,{...o,headers:{'Content-Type':'application/json',...(S.tok?{'Authorization':'Bearer '+S.tok}:{}),...(o.headers||{})},body:o.body?JSON.stringify(o.body):undefined});
  if(!r.ok){const e=await r.json().catch(()=>({error:r.statusText}));throw new Error(e.error||r.statusText);}
  return r.json();
}
async function ai(type,data){return api('/api/ai/'+type,{method:'POST',body:{learnLang:S.ll,nativeLang:S.nl,...data}});}
function mw(w){return{id:w.id,word:w.word,tr:w.translation||'',ts:w.transcription||'',lv:w.level||'B1',ex:w.example_en||'',exr:w.example_ru||'',gr:w.grammar_note||'',hard:w.hard||false,tp:w.times_practiced||0,tc:w.times_correct||0};}
function saveWord(s) {
  S.words = [mw(s), ...S.words.filter(x => x.word !== s.word)];
}
async function loadData(){
  const isTA=S.user?.role==='teacher'||S.user?.role==='admin';
  const [wR,stR,hR,gR]=await Promise.allSettled([
    api('/api/words'),
    api('/api/stats'),
    api('/api/history'),
    isTA?api('/api/groups'):Promise.resolve([]),
  ]);
  if(wR.status==='fulfilled')S.words=wR.value.map(mw);
  if(stR.status==='fulfilled'){const st=stR.value;if(S.user){S.user.streak=st.streak?.current_streak||0;S.user.du=st.daily_used||0;S.user.dl=st.daily_limit||50;}}
  if(hR.status==='fulfilled')S.hist=hR.value||[];
  if(isTA&&gR.status==='fulfilled')S.grps=gR.value||[];
}
function fmtU(u){return{id:u.id,email:u.email,name:u.name,avatar:u.avatar,role:u.role||'student',nl:u.native_lang||'ru',ll:u.learn_lang||'en',streak:u.streak||0,du:u.daily_used||0,dl:u.daily_limit||50};}
(async()=>{
  if(S.tok){
    try{const d=await api('/api/auth/me');S.user=fmtU(d);S.nl=S.user.nl;S.ll=S.user.ll;await loadData();ss({scr:'main',tab:'dict'});return;}
    catch{S.tok='';localStorage.removeItem('tok');}
  }
  render();
})();

// ── SPEECH ──────────────────────────────────────────────
const LC={en:'en-US',de:'de-DE',fr:'fr-FR',es:'es-ES',it:'it-IT',zh:'zh-CN',ja:'ja-JP',ko:'ko-KR'};
function speak(w,slow){
  if(!window.speechSynthesis)return;speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(w);u.lang=LC[S.ll]||'en-US';u.rate=slow?0.6:0.9;
  const vs=speechSynthesis.getVoices();const v=vs.find(v=>v.lang.startsWith(u.lang.slice(0,2))&&v.name.includes('Google'))||vs.find(v=>v.lang.startsWith(u.lang.slice(0,2)));
  if(v)u.voice=v;speechSynthesis.speak(u);
}
let _r=null,_ir=false;
function mic(tid,bid){
  if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){alert('Voice not supported');return;}
  if(_ir){if(_r)_r.stop();_ir=false;const b=ge(bid);if(b)b.classList.remove('rec');return;}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;_r=new SR();_r.lang=LC[S.ll]||'en-US';_r.continuous=false;_r.interimResults=false;
  _r.onresult=(e)=>{const t=e.results[0][0].transcript;const el=ge(tid);if(el){el.value=t;el.dispatchEvent(new Event('input'));}};
  _r.onend=()=>{_ir=false;const b=ge(bid);if(b)b.classList.remove('rec');};
  _r.onerror=()=>{_ir=false;const b=ge(bid);if(b)b.classList.remove('rec');};
  _r.start();_ir=true;const b=ge(bid);if(b)b.classList.add('rec');
}

// ── UI HELPERS ──────────────────────────────────────────
function lvl(l){const c=l?.startsWith('C')?'bpk':l?.startsWith('B')?'bv':'bgr';return '<span class="badge '+c+'">'+(l||'?')+'</span>';}
function ld(t){return '<div class="ail"><div class="dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>'+(t||'AI…')+'</div>';}
function tts(w){const e=(w||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");return '<button class="ttsb" onclick="speak(\''+e+'\')">🔊</button> <button class="ttsb" onclick="speak(\''+e+'\',true)">🐢</button>';}
function ge(id){return document.getElementById(id);}
function ss(p){Object.assign(S,p);render();}
function modal(content, closeAction) {
  return '<div class="ovl" onclick="if(event.target.classList.contains(\'ovl\'))' + closeAction + '">'
    + '<div class="modal" onclick="event.stopPropagation()"><div class="mh"></div>'
    + content
    + '</div></div>';
}
function progressBar(pct, color, height) {
  const c = color || (pct > 80 ? 'var(--danger)' : pct > 50 ? 'var(--warn)' : 'var(--ac)');
  const h = height ? 'height:' + height + ';' : '';
  return '<div class="limw" style="' + h + '"><div class="limf" style="width:' + pct + '%;background:' + c + '"></div></div>';
}

// ── AUTH ────────────────────────────────────────────────
function showErr(m){const e=ge('aerr');if(e){e.textContent=m;e.style.display='block';}}
function logout(){S.tok='';S.user=null;S.words=[];S.hist=[];S.grps=[];localStorage.removeItem('tok');ss({scr:'ob',step:1,guest:false,guestStep:'add'});}
async function selLang(code){
  const isN=S.lp==='n';if(isN)S.nl=code;else S.ll=code;
  try{await api('/api/auth/lang',{method:'PATCH',body:{nativeLang:S.nl,learnLang:S.ll}});}catch{}
  ss({lp:false});
}
async function emailAuth(){
  const em=ge('ob-em')?.value?.trim();const pw=ge('ob-pw')?.value;
  if(!em||!pw){showErr('Fill in email and password');return;}
  if(pw.length<6){showErr('Password min 6 chars');return;}
  try{
    const guestWords=S.words.filter(w=>w.local);
    const d=await api('/api/auth/email',{method:'POST',body:{email:em,password:pw,nativeLang:S.nl,learnLang:S.ll}});
    S.tok=d.token;localStorage.setItem('tok',d.token);S.user=fmtU(d.user);S.nl=S.user.nl;S.ll=S.user.ll;
    await loadData();
    for(const w of guestWords){try{const s=await api('/api/words',{method:'POST',body:{word:w.word,translation:w.tr,transcription:w.ts,level:w.lv,example_en:w.ex,example_ru:w.exr,grammar_note:w.gr,hard:w.hard}});saveWord(s);}catch{}}
    ss({scr:'main',tab:'dict',guest:false,guestStep:'add'});
  }catch(err){showErr(err.message);}
}
function enterGuest(){ss({scr:'main',tab:'dict',guest:true,guestStep:'add'});}
function toggleTheme(){const t=document.documentElement.getAttribute('data-theme')==='light'?'dark':'light';document.documentElement.setAttribute('data-theme',t);localStorage.setItem('theme',t);render();}

// ── RENDER: SHELL ───────────────────────────────────────
function render(){
  const app=document.getElementById('app');
  if(S.scr==='ob'){app.innerHTML=rOb();return;}
  const isT=S.user?.role==='teacher'||S.user?.role==='admin';
  const isA=S.user?.role==='admin';
  const tabs=isA
    ?[{id:'dict',i:'📖',l:t('tabWords')},{id:'groups',i:'👥',l:t('tabGroups')},{id:'practice',i:'🏋️',l:t('tabPractice')},{id:'progress',i:'📊',l:t('tabStats')},{id:'admin',i:'⚙️',l:'Admin'}]
    :isT?[{id:'dict',i:'📖',l:t('tabWords')},{id:'groups',i:'👥',l:t('tabGroups')},{id:'practice',i:'🏋️',l:t('tabPractice')},{id:'progress',i:'📊',l:t('tabStats')}]
    :[{id:'dict',i:'📖',l:t('tabWords')},{id:'practice',i:'🏋️',l:t('tabPractice')},{id:'history',i:'📜',l:t('tabHistory')},{id:'progress',i:'📊',l:t('tabStats')}];
  const u=S.user;const un=(u?.name||'?')[0].toUpperCase();
  const av=S.guest?'<button class="btn bp bsm" style="font-size:12px;padding:6px 12px" onclick="ss({scr:\'ob\',step:4})">'+t('signInBtn')+'</button>'
    :u?.avatar?'<div class="ava" onclick="ss({prof:true})"><img src="'+u.avatar+'"></div>':'<div class="ava" onclick="ss({prof:true})">'+un+'</div>';
  const ln=LLANGS.find(l=>l.code===S.ll)?.name||'English';
  const isDark=document.documentElement.getAttribute('data-theme')!=='light';
  app.innerHTML='<header class="hdr"><div class="logo">AI <em>Dictionary</em></div><div class="hdr-r"><button class="ib" style="font-size:17px;opacity:.7" onclick="toggleTheme()">'+(isDark?'☀️':'🌙')+'</button>'+(S.guest?'':('<div class="streak">🔥 '+(u?.streak||0)+'</div>'))+av+'</div></header>'
    +'<main class="content" id="mc">'+rMain()+'</main>'
    +'<nav class="nav">'+tabs.map(tb=>'<button class="nb'+(S.tab===tb.id&&!S.add?' on':'')+'" onclick="swT(\''+tb.id+'\')"><span class="ni">'+tb.i+'</span>'+tb.l+'</button>').join('')+'</nav>'
    +(S.tab==='dict'&&!S.add?'<button class="fab" onclick="ss({add:true,addTab:\'manual\'})">＋</button>':'')
    +(S.prof?rProf():'')+(S.lp?rLP():'')+(S.det?rWM():'');
}
function rMain(){if(S.add)return rAdd();if(S.tab==='dict')return rDict();if(S.tab==='practice')return rPrac();if(S.tab==='progress')return rProg();if(S.tab==='history')return rHist();if(S.tab==='groups')return rGrps();if(S.tab==='admin')return rAdmin();return rDict();}
function swT(t){ss({tab:t,add:false,pm:null,sess:null,det:null});if(t==='admin')admLoad(S.adm.tab);}

// ── RENDER: ONBOARDING ──────────────────────────────────
function rOb(){if(S.step===1)return ob1();if(S.step===2)return ob2();if(S.step===3)return ob3();if(S.step===4)return ob4();return ob5();}
function ob1(){
  const list=LANGS.filter(l=>l.name.toLowerCase().includes((S.obs||'').toLowerCase())||l.nameEn.toLowerCase().includes((S.obs||'').toLowerCase()));
  return '<div class="ob"><div class="obh"><div style="font-size:52px;margin-bottom:14px;filter:drop-shadow(0 0 20px rgba(94,255,196,.3))">🌍</div><div class="obl">AI Language <em>Tutor</em></div><div class="obs" style="color:var(--t3);font-size:12px">'+t('step1')+'</div></div>'
    +'<div class="obs2 mb3"><div class="oblbl">'+t('nativeQ')+'</div>'
    +'<div class="obsw"><span class="obsico">🔍</span><input class="obsinp" placeholder="'+t('search')+'" value="'+(S.obs||'')+'" oninput="S.obs=this.value;render()"></div>'
    +'<div class="lg">'+list.map(l=>'<div class="lc'+(S.nl===l.code?' sel':'')+'" onclick="S.nl=\''+l.code+'\';render()"><div class="lcf">'+l.flag+'</div><div class="lcn">'+l.name+'</div>'+(S.nl===l.code?'<div style="font-size:9px;color:var(--ac)">✓</div>':'')+'</div>').join('')+'</div></div>'
    +'<div style="width:100%;position:relative;z-index:1;margin-top:14px"><button class="btn bp bfu" style="padding:13px;font-size:14px;border-radius:13px" onclick="ss({step:2,obs:\'\'})">'+t('cont')+'</button></div></div>';
}
function ob2(){
  return '<div class="ob"><div class="obh"><div style="font-size:52px;margin-bottom:14px">📚</div><div class="obl">'+t('learnQ').replace(/\?/,'? <em>🎯</em>')+'</div><div class="obs" style="color:var(--t3);font-size:12px">'+t('step2')+'</div></div>'
    +'<div class="obs2 mb3"><div class="oblbl">'+t('chooseLang')+'</div>'
    +'<div class="lg">'+LLANGS.map(l=>'<div class="lc'+(S.ll===l.code?' sel':'')+'" onclick="S.ll=\''+l.code+'\';render()"><div class="lcf">'+l.flag+'</div><div class="lcn">'+l.name+'</div>'+(S.ll===l.code?'<div style="font-size:9px;color:var(--ac)">✓</div>':'')+'</div>').join('')+'</div></div>'
    +'<div style="width:100%;position:relative;z-index:1;margin-top:14px;display:flex;gap:9px"><button class="btn bg_ bfu" onclick="ss({step:1})">'+t('back')+'</button><button class="btn bp bfu" style="padding:13px;font-size:14px;border-radius:13px" onclick="ss({step:3})">'+t('cont')+'</button></div></div>';
}
function ob3(){
  const c=LANGS.find(l=>l.code===S.nl);const ln=LLANGS.find(l=>l.code===S.ll);
  const pair=(c?c.flag+' '+c.name:'')+(ln?' → '+ln.flag+' '+ln.name:'');
  return '<div class="ob"><div class="obh"><div style="font-size:52px;margin-bottom:14px">🚀</div><div class="obl" style="font-size:20px">'+pair+'</div><div class="obs" style="color:var(--t3);font-size:12px">'+t('step3')+'</div></div>'
    +'<div class="obs2" style="position:relative;z-index:1;display:flex;flex-direction:column;gap:12px">'
    +'<button class="btn bp bfu" style="padding:20px 16px;font-size:15px;border-radius:16px;display:flex;align-items:center;gap:14px;text-align:left" onclick="ss({step:5,guestStep:\'add\'})">'
    +'<span style="font-size:30px">📝</span><div><div style="font-weight:700;margin-bottom:3px">'+t('addWord')+'</div><div style="font-size:11px;opacity:.7">'+t('noAccount')+'</div></div></button>'
    +'<button class="btn bg_ bfu" style="padding:20px 16px;font-size:15px;border-radius:16px;display:flex;align-items:center;gap:14px;text-align:left" onclick="ss({step:4})">'
    +'<span style="font-size:30px">🔑</span><div><div style="font-weight:700;margin-bottom:3px">'+t('signInBtn')+'</div><div style="font-size:11px;opacity:.7">'+t('signInSub')+'</div></div></button>'
    +'<button class="btn bg_ bfu" style="padding:11px" onclick="ss({step:2})">'+t('back')+'</button></div></div>';
}
function ob4(){
  const c=LANGS.find(l=>l.code===S.nl);const ln=LLANGS.find(l=>l.code===S.ll);
  return '<div class="ob"><div class="obh"><div style="font-size:52px;margin-bottom:14px">🔑</div><div class="obl">'+t('signInBtn')+'</div><div class="obs">'+(c?c.flag+' '+c.name:'')+(ln?' → '+ln.flag+' '+ln.name:'')+'<br><span style="color:var(--t3);font-size:12px">'+t('step3')+'</span></div></div>'
    +'<div class="obs2" style="position:relative;z-index:1">'
    +'<input id="ob-em" class="inp" type="email" placeholder="Email" style="margin-bottom:10px">'
    +'<input id="ob-pw" class="inp" type="password" placeholder="Password (min 6 chars)" style="margin-bottom:12px">'
    +'<div id="aerr" style="color:var(--danger);font-size:12px;margin-bottom:8px;display:none"></div>'
    +'<button class="btn bp bfu mb2" style="padding:12px" onclick="emailAuth()">Sign in / Register</button>'
    +'<button class="btn bg_ bfu" onclick="ss({step:3})">'+t('back')+'</button></div></div>';
}
function ob5(){
  if(S.guestStep==='prompt')return ob5Prompt();
  return '<div class="ob"><div class="obh"><div style="font-size:52px;margin-bottom:14px">📝</div><div class="obl">'+t('addWord')+'</div><div class="obs" style="color:var(--t3);font-size:12px">'+t('step3')+'</div></div>'
    +'<div class="obs2" style="position:relative;z-index:1">'+rAddM()
    +'<button class="btn bg_ bfu" style="margin-top:10px" onclick="ss({step:3})">'+t('back')+'</button></div></div>';
}
function ob5Prompt(){
  const w=S.words[0];
  return '<div class="ob"><div class="obh"><div style="font-size:52px;margin-bottom:14px">🎉</div><div class="obl">'+t('saveTitle')+'</div><div class="obs">'+t('saveDesc')+'</div></div>'
    +(w?'<div class="obs2 mb3" style="position:relative;z-index:1"><div class="card csm"><div class="rb2"><span class="syn fw7 f13">'+w.word+'</span>'+lvl(w.lv)+'</div><div class="f12 c2">'+w.tr+'</div></div></div>':'')
    +'<div class="obs2" style="position:relative;z-index:1;display:flex;flex-direction:column;gap:10px">'
    +'<input id="ob-em" class="inp" type="email" placeholder="Email" style="margin-bottom:6px">'
    +'<input id="ob-pw" class="inp" type="password" placeholder="Password (min 6 chars)" style="margin-bottom:8px">'
    +'<div id="aerr" style="color:var(--danger);font-size:12px;margin-bottom:4px;display:none"></div>'
    +'<button class="btn bp bfu" style="padding:13px" onclick="emailAuth()">'+t('register')+'</button>'
    +'<button class="btn bg_ bfu" style="padding:11px" onclick="enterGuest()">'+t('skip')+'</button></div></div>';
}

// ── RENDER: MODALS ──────────────────────────────────────
function rProf(){
  const u=S.user;const isT=u?.role==='teacher';const lim=u?.dl||50;const used=u?.du||0;const pct=Math.min(100,Math.round(used/lim*100));
  const cl=LANGS.find(l=>l.code===S.nl);const ll=LLANGS.find(l=>l.code===S.ll);
  const innerContent=
    '<div class="pav">'+(u?.avatar?'<img src="'+u.avatar+'">': (u?.name||'?')[0])+'</div>'
    +'<div style="text-align:center;margin-bottom:4px"><div class="syn fw7 f13">'+(u?.name||'User')+'</div><div class="f12 c3">'+(u?.email||'')+'</div>'
    +'<div class="mt1"><span class="badge '+(isT?'byw':'bgr')+'">'+(isT?'👨‍🏫 Teacher':'🎓 Student')+'</span></div></div>'
    +'<div class="divl"></div>'
    +'<div class="card csm mb2"><div class="rb2 mb1"><span class="f12 fw6">AI requests today</span><span class="f12 c3">'+used+'/'+lim+'</span></div>'
    +'<div style="display:flex;align-items:center;gap:8px">' + progressBar(pct) + '</div></div>'
    +'<div class="card csm mb2"><div class="f12 fw6 mb2">Learning settings</div>'
    +'<div class="rb2 mb2"><span class="f12 c2">Native language</span><button class="btn bg_ bsm" onclick="ss({prof:false,lp:\'n\'})">'+(cl?cl.flag+' '+cl.name:'Select')+'</button></div>'
    +'<div class="rb2"><span class="f12 c2">Learning</span><button class="btn bg_ bsm" onclick="ss({prof:false,lp:\'l\'})">'+(ll?ll.flag+' '+ll.name:'Select')+'</button></div></div>'
    +(isT?'<button class="btn bs bfu bsm mb2" onclick="ss({prof:false,tab:\'groups\'})">👥 Manage groups</button>':'')
    +'<button class="btn bd bfu" onclick="logout()">Sign out</button>';
  return modal(innerContent, 'ss({prof:false})');
}
function rLP(){
  const isN=S.lp==='n';const list=isN?LANGS:LLANGS;const cur=isN?S.nl:S.ll;
  const innerContent=
    '<div class="rb2 mb3"><div class="syn fw7" style="font-size:17px">'+(isN?'Native language':'Learning language')+'</div><button class="btn bg_ bsm" onclick="ss({lp:false})">✕</button></div>'
    +'<div class="lg" style="max-height:320px;overflow-y:auto;gap:6px">'+list.map(l=>'<div class="lc'+(cur===l.code?' sel':'')+'" onclick="selLang(\''+l.code+'\')"><div class="lcf">'+l.flag+'</div><div class="lcn">'+l.name+'</div>'+(cur===l.code?'<div style="font-size:9px;color:var(--ac)">✓</div>':'')+'</div>').join('')+'</div>';
  return modal(innerContent, 'ss({lp:false})');
}
function rWM(){
  const w=S.det;if(!w)return '';
  const innerContent=
    '<div class="rb2 mb2"><div><div class="syn fw7" style="font-size:24px">'+w.word+'</div><div class="f12 c3">'+w.ts+'</div></div>'+lvl(w.lv)+'</div>'
    +'<div class="row mb2">'+tts(w.word)+'</div>'
    +'<div class="card csm mb2"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:3px">Translation</div>'
    +'<div class="fw6 f13">'+w.tr+'</div>'
    +(w.gr?'<div style="margin-top:5px;padding:4px 8px;background:var(--acD);border-radius:7px;font-size:11px;color:var(--ac)">📝 '+w.gr+'</div>':'')+'</div>'
    +'<div class="card csm mb3"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.7px;margin-bottom:3px">Example</div>'
    +'<div class="f12 c2 ita" style="line-height:1.7">'+w.ex+'</div><div class="f11 c3 mt1">'+w.exr+'</div>'
    +(w.ex?'<div class="mt1">'+tts(w.ex)+'</div>':'')+'</div>'
    +'<button class="btn bs bfu mb2" onclick="fetchEx('+w.id+')">✨ Synonyms & more examples</button>'
    +'<div id="ext"></div><div class="divl"></div>'
    +'<div class="row" style="flex-wrap:wrap;gap:6px">'
    +'<button class="btn bg_ bsm" onclick="togHM('+w.id+')">'+(w.hard?'⭐ Hard':'☆ Mark hard')+'</button>'
    +'<button class="btn bd bsm" onclick="delWM('+w.id+')">🗑 Delete</button>'
    +'<button class="btn bg_ bsm" style="margin-left:auto" onclick="ss({det:null})">Close</button>'
    +'</div>';
  return modal(innerContent, 'ss({det:null})');
}

// ── RENDER: DICTIONARY ──────────────────────────────────
function rDict(){
  const list=S.words.filter(w=>{
    const m=w.word.toLowerCase().includes(S.srch.toLowerCase())||w.tr.toLowerCase().includes(S.srch.toLowerCase());
    if(S.filt==='All')return m;if(S.filt==='⭐')return m&&w.hard;return m&&w.lv===S.filt;
  });
  const guestBanner=S.guest?'<div class="rb" style="background:var(--acD);border-color:var(--ac);margin-bottom:12px;display:flex;align-items:center;gap:10px"><span style="font-size:20px">💾</span><div style="flex:1"><div class="fw6 f12">'+t('saveTitle')+'</div><div class="f11 c2 mt1">'+t('saveDesc')+'</div></div><button class="btn bp bsm" style="font-size:11px;white-space:nowrap" onclick="ss({scr:\'ob\',step:4})">'+t('register')+'</button></div>':'';
  return '<div class="sc">'+guestBanner
    +'<div class="sw"><span class="sico">🔍</span><input class="inp sinp" placeholder="Search words…" value="'+S.srch+'" oninput="S.srch=this.value;render()"></div>'
    +'<div class="pills">'+['All','⭐',...LEVELS].map(f=>'<button class="pill'+(S.filt===f?' on':'')+'" onclick="S.filt=\''+f+'\';render()">'+(f==='⭐'?'⭐ Hard':f)+'</button>').join('')+'</div>'
    +(list.length===0?'<div class="empty"><div style="font-size:44px;margin-bottom:10px">📭</div><div class="syn fw7 f13 mb1">No words found</div><div class="f12 c3">Add words with the + button</div></div>'
    :list.map(w=>'<div class="wli" onclick="ss({det:S.words.find(x=>x.id==='+w.id+')})">'
      +'<div style="flex:1;min-width:0"><div class="row mb1"><span class="wen">'+w.word+'</span>'+lvl(w.lv)+'</div>'
      +'<div class="wru">'+w.tr+'</div>'
      +(w.gr?'<div class="wgr">📝 '+w.gr+'</div>':'')
      +(w.ex?'<div class="wex">"'+w.ex.slice(0,50)+'…"</div>':'')+'</div>'
      +'<div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0">'
      +'<button class="ib" onclick="event.stopPropagation();speak(\''+w.word.replace(/'/g,"\\'")+'\')">🔊</button>'
      +'<button class="ib" onclick="event.stopPropagation();togH('+w.id+')">'+(w.hard?'⭐':'☆')+'</button>'
      +'<button class="ib" onclick="event.stopPropagation();delW('+w.id+')">🗑</button>'
      +'</div></div>').join(''))
    +'</div>';
}
function togH(id){S.words=S.words.map(w=>w.id===id?{...w,hard:!w.hard}:w);api('/api/words/'+id,{method:'PATCH',body:{hard:S.words.find(w=>w.id===id).hard}}).catch(()=>{});render();}
function delW(id){if(!confirm('Delete?'))return;S.words=S.words.filter(w=>w.id!==id);api('/api/words/'+id,{method:'DELETE'}).catch(()=>{});render();}
function togHM(id){S.words=S.words.map(w=>w.id===id?{...w,hard:!w.hard}:w);S.det={...S.det,hard:!S.det.hard};api('/api/words/'+id,{method:'PATCH',body:{hard:S.det.hard}}).catch(()=>{});render();}
function delWM(id){if(!confirm('Delete?'))return;S.words=S.words.filter(w=>w.id!==id);api('/api/words/'+id,{method:'DELETE'}).catch(()=>{});ss({det:null});}
async function fetchEx(id){
  const w=S.words.find(x=>x.id===id);if(!w)return;const area=ge('ext');if(!area)return;
  area.innerHTML=ld('AI finding synonyms…');
  try{
    const d=await ai('extras',{word:w.word});
    area.innerHTML='<div class="sc"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:7px">More examples</div>'
      +(d.examples||[]).map(ex=>'<div style="padding:6px 0;border-bottom:1px solid var(--brd);font-size:12px;color:var(--t2);font-style:italic;line-height:1.6">'+ex+' <button class="ttsb" style="font-size:9px;padding:2px 6px" onclick="speak(\''+ex.replace(/'/g,"\\'")+'\')">🔊</button></div>').join('')
      +'<div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin:10px 0 7px">Synonyms</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:6px">'+(d.synonyms||[]).map(s=>'<div style="background:var(--sur2);border:1px solid var(--brd);border-radius:8px;padding:5px 10px;cursor:pointer" onclick="speak(\''+s.word+'\')"><div class="fw6 f12">'+s.word+' 🔊</div><div class="f11 c3">'+s.translation+'</div></div>').join('')+'</div></div>';
  }catch(e){area.innerHTML='<div class="rb err f12">'+e.message+'</div>';}
}

// ── RENDER: ADD WORD ────────────────────────────────────
let _ad=null;
function rAdd(){
  return '<div class="sc"><div class="rb2 mb3"><div class="syn fw7" style="font-size:19px">Add word</div><button class="btn bg_ bsm" onclick="ss({add:false})">✕</button></div>'
    +'<div class="pills mb3">'
    +'<button class="pill'+(S.addTab==='manual'?' on':'')+'" onclick="S.addTab=\'manual\';render()">✏️ Manual</button>'
    +'<button class="pill'+(S.addTab==='list'?' on':'')+'" onclick="S.addTab=\'list\';render()">📋 List</button>'
    +'</div>'+(S.addTab==='list'?rAddL():rAddM())+'</div>';
}
function rAddM(){
  return '<div><div style="margin-bottom:12px"><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.7px">Word or phrase</label>'
    +'<div class="row"><input id="nw" class="inp" style="flex:1" placeholder="Enter word…" onkeydown="if(event.key===\'Enter\')fwAI()">'
    +'<button class="micb" id="mic1" onclick="mic(\'nw\',\'mic1\')" style="margin-left:7px;white-space:nowrap">🎤 Voice</button>'
    +'<button class="btn bp bsm" style="margin-left:6px" onclick="fwAI()">✨ AI</button></div></div>'
    +'<div id="ar"></div></div>';
}
function rAddP(){
  return '<div><input type="file" id="pf" accept="image/*" style="display:none" onchange="hPhoto(this)">'
    +'<label for="pf" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:16px;background:var(--sur2);border:2px dashed var(--brd2);border-radius:13px;color:var(--t2);font-size:13px;font-weight:500;cursor:pointer;margin-bottom:12px"><span style="font-size:26px">📷</span> Choose screenshot or photo</label>'
    +'<div id="pr"></div></div>';
}
function rAddL(){
  return '<div><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.7px">Word list (one per line or comma-separated)</label>'
    +'<textarea id="wl" class="inp" rows="6" placeholder="apple\nbeautiful\npersevere\n\nor: apple, beautiful, persevere" style="resize:vertical;margin-bottom:10px"></textarea>'
    +'<button class="btn bp bfu" onclick="procList()">✨ Process with AI</button>'
    +'<div id="lr" style="margin-top:12px"></div></div>';
}
async function fwAI(){
  const w=ge('nw')?.value?.trim();if(!w)return;const a=ge('ar');if(!a)return;
  a.innerHTML=ld('AI getting data…');
  try{const d=await ai('word',{word:w});_ad={translation:d.translation||'',transcription:d.transcription||'',level:d.level||'B1',example_en:d.example_en||'',example_ru:d.example_ru||'',grammar_note:d.grammar_note||'',synonyms:d.synonyms||[]};rAddForm(w);}
  catch(e){_ad={translation:'',transcription:'',level:'B1',example_en:'',example_ru:'',grammar_note:'',synonyms:[]};a.innerHTML='<div class="rb err f12 mb2">'+e.message+'</div>';rAddForm(w);}
}
function rAddForm(word){
  const a=ge('ar');if(!a||!_ad)return;const d=_ad;
  const syn=d.synonyms||[];
  a.innerHTML='<div class="sc">'
    +'<div style="margin-bottom:10px"><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:3px;text-transform:uppercase;letter-spacing:.7px">Translation</label><input id="f-tr" class="inp" value="'+(d.translation||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;')+'"></div>'
    +'<div style="margin-bottom:10px"><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:3px;text-transform:uppercase;letter-spacing:.7px">Transcription</label><input id="f-ts" class="inp" value="'+(d.transcription||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;')+'"></div>'
    +'<div style="margin-bottom:10px"><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.7px">Example</label>'
    +'<div class="card csm" style="padding:10px 12px">'
    +'<input id="f-ex" class="inp" style="background:transparent;border:none;padding:0;font-style:italic;color:var(--t1);font-size:13px;margin-bottom:6px" value="'+(d.example_en||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;')+'">'
    +'<div style="height:1px;background:var(--brd);margin-bottom:6px"></div>'
    +'<input id="f-exr" class="inp" style="background:transparent;border:none;padding:0;color:var(--t3);font-size:12px" value="'+(d.example_ru||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;')+'">'
    +'</div></div>'
    +(syn.length?'<div style="margin-bottom:10px"><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:6px;text-transform:uppercase;letter-spacing:.7px">Synonyms</label>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px">'+syn.map(s=>'<div style="background:var(--sur2);border:1px solid var(--brd2);border-radius:9px;padding:5px 10px;cursor:pointer" onclick="speak(\''+s.word.replace(/'/g,"\\'")+'\')" title="'+s.translation+'"><div class="fw6 f12">'+s.word+' 🔊</div><div class="f11 c3">'+s.translation+'</div></div>').join('')+'</div></div>':'')
    +'<div style="margin-bottom:10px"><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:3px;text-transform:uppercase;letter-spacing:.7px">📝 Grammar note</label><input id="f-gr" class="inp" placeholder="e.g. countable noun / uncountable / transitive verb" value="'+(d.grammar_note||'').replace(/"/g,'&quot;').replace(/'/g,'&#39;')+'"></div>'
    +'<div style="margin-bottom:10px"><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:3px;text-transform:uppercase;letter-spacing:.7px">Level</label><select id="f-lv" class="inp">'+LEVELS.map(l=>'<option'+(l===d.level?' selected':'')+'>'+l+'</option>').join('')+'</select></div>'
    +'<div class="row mb2">'+tts(word)+'</div>'
    +'<button class="btn bp bfu" onclick="saveW(\''+word.replace(/'/g,"\\'")+'\')">💾 Save word</button></div>';
}
async function saveW(word){
  const body={word,translation:ge('f-tr')?.value||'',transcription:ge('f-ts')?.value||'',level:ge('f-lv')?.value||'B1',example_en:ge('f-ex')?.value||'',example_ru:ge('f-exr')?.value||'',grammar_note:ge('f-gr')?.value||'',hard:false};
  if(!S.user){
    S.words=[{id:Date.now(),word:body.word,tr:body.translation,ts:body.transcription,lv:body.level,ex:body.example_en,exr:body.example_ru,gr:body.grammar_note,hard:false,tp:0,tc:0,local:true},...S.words];
    if(S.scr==='ob'){ss({guestStep:'prompt'});}
    else ss({add:false});
    return;
  }
  try{const s=await api('/api/words',{method:'POST',body});S.words=[mw(s),...S.words];}
  catch{S.words=[{id:Date.now(),word:body.word,tr:body.translation,ts:body.transcription,lv:body.level,ex:body.example_en,exr:body.example_ru,gr:body.grammar_note,hard:false,tp:0,tc:0},...S.words];}
  ss({add:false});
}
async function procList(){
  const raw=ge('wl')?.value?.trim();if(!raw)return;
  const words=raw.split(/[\n,]+/).map(w=>w.trim()).filter(Boolean);if(!words.length)return;
  const a=ge('lr');if(!a)return;a.innerHTML=ld('Processing '+words.length+' words…');
  try{
    const d=await ai('bulk',{words});
    for(const w of(d.words||[])){try{const s=await api('/api/words',{method:'POST',body:w});saveWord(s);}catch{}}
    a.innerHTML='<div class="rb" style="text-align:center"><div class="sv ca">'+(d.words||[]).length+'</div><div class="f12 c3">words added!</div><button class="btn bs bsm mt2" onclick="ss({add:false})">Done ✓</button></div>';
  }catch(e){a.innerHTML='<div class="rb err f12">'+e.message+'</div>';}
}
let _pw=[],_ps=new Set();
async function hPhoto(input){
  const file=input.files[0];if(!file)return;const a=ge('pr');if(!a)return;
  const reader=new FileReader();
  reader.onload=async(ev)=>{
    const b64=ev.target.result.split(',')[1];const mt=file.type||'image/jpeg';
    a.innerHTML='<img src="'+ev.target.result+'" style="width:100%;max-height:160px;object-fit:cover;border-radius:11px;margin-bottom:12px;border:1px solid var(--brd)">'+ld('AI reading image…');
    try{const r=await ai('image',{imageBase64:b64,mimeType:mt});rPhW(r.words||[],ev.target.result);}
    catch(e){a.innerHTML='<div class="rb err f12">'+e.message+'</div>';}
  };
  reader.readAsDataURL(file);
}
function rPhW(words,img){
  _pw=words;_ps=new Set(words.map((_,i)=>i));const a=ge('pr');if(!a)return;
  if(!words.length){a.innerHTML='<div class="rb err f12">No words found. Try another image.</div>';return;}
  a.innerHTML='<img src="'+img+'" style="width:100%;max-height:140px;object-fit:cover;border-radius:11px;margin-bottom:10px;border:1px solid var(--brd)">'
    +'<div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:8px">Found '+words.length+' words:</div>'
    +'<div style="display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px" id="wch">'+words.map((w,i)=>'<div class="pill on" id="ch'+i+'" onclick="tCh('+i+')" style="cursor:pointer">'+w.word+'</div>').join('')+'</div>'
    +'<div style="display:flex;gap:7px;margin-bottom:10px"><button class="btn bg_ bsm" onclick="sAllCh()">All</button><button class="btn bg_ bsm" onclick="sNoneCh()">None</button></div>'
    +'<button class="btn bp bfu" onclick="savePh()">💾 Add selected</button>';
}
function tCh(i){if(_ps.has(i))_ps.delete(i);else _ps.add(i);const c=ge('ch'+i);if(c)c.classList.toggle('on',_ps.has(i));}
function sAllCh(){_pw.forEach((_,i)=>_ps.add(i));document.querySelectorAll('[id^="ch"]').forEach(c=>c.classList.add('on'));}
function sNoneCh(){_ps.clear();document.querySelectorAll('[id^="ch"]').forEach(c=>c.classList.remove('on'));}
async function savePh(){
  for(const w of _pw.filter((_,i)=>_ps.has(i))){try{const s=await api('/api/words',{method:'POST',body:w});saveWord(s);}catch{}}
  ss({add:false});
}

// ── RENDER: PRACTICE ────────────────────────────────────
function rPrac(){
  if(S.pm==='flash')return rFlash();if(S.pm==='fill')return rFill();if(S.pm==='read')return rRead();if(S.pm==='text')return rTxt();
  const av=S.ho?S.words.filter(w=>w.hard):S.words;
  return '<div class="sc"><div class="sht">Practice</div><div class="shs" style="margin-bottom:12px">Choose training mode</div>'
    +'<div style="display:flex;align-items:center;justify-content:space-between;background:var(--sur);border:1px solid var(--brd);border-radius:13px;padding:11px 12px;margin-bottom:12px">'
    +'<div><div class="fw6 f13">Hard words only</div><div class="f11 c3">'+S.words.filter(w=>w.hard).length+' words ⭐</div></div>'
    +'<button class="tog" style="background:'+(S.ho?'var(--ac)':'var(--brd2)')+'" onclick="S.ho=!S.ho;render()"><div class="togk" style="left:'+(S.ho?22:3)+'px"></div></button></div>'
    +(av.length<2?'<div class="empty"><div style="font-size:40px;margin-bottom:10px">📚</div><div class="syn fw7 f13 mb1">Not enough words</div><div class="f12 c3">Add at least 2 words'+(S.ho?' or disable Hard only':'')+'</div></div>'
    :'<div class="mc" onclick="stM(\'flash\')"><div class="mci">🃏</div><div style="flex:1"><div class="syn fw7 f13">Flashcards</div><div class="f12 c2 mt1">Cards — remember translation</div></div><span class="c3" style="font-size:17px">›</span></div>'
    +'<div class="mc" onclick="stM(\'fill\')"><div class="mci">✏️</div><div style="flex:1"><div class="syn fw7 f13">Fill the blank</div><div class="f12 c2 mt1">Missing word in sentence</div></div><span class="c3" style="font-size:17px">›</span></div>'
    +'<div class="mc" onclick="stM(\'read\')"><div class="mci">📖</div><div style="flex:1"><div class="syn fw7 f13">AI Reading</div><div class="f12 c2 mt1">Read AI text, tap words</div></div><span class="c3" style="font-size:17px">›</span></div>'
    +'<div class="mc" onclick="stM(\'text\')"><div class="mci">✍️</div><div style="flex:1"><div class="syn fw7 f13">Generate story</div><div class="f12 c2 mt1">AI story with your words</div></div><span class="c3" style="font-size:17px">›</span></div>')
    +'</div>';
}
function stM(m){
  const av=S.ho?S.words.filter(w=>w.hard):S.words;
  S.pm=m;S.sess={words:[...av].sort(()=>Math.random()-.5).slice(0,Math.min(10,av.length)),idx:0,score:0,done:false,extra:[],ex:null,load:false,sel:null,flip:false,rt:null,rl:false,ra:{},rc:false,tip:null,gt:null,gl:false};
  render();if(m==='fill')lFill();if(m==='read')lRead();if(m==='text')lTxt();
}
function rFlash(){
  const s=S.sess;if(s.done)return rEnd();const all=[...s.words,...s.extra];const w=all[s.idx];
  return '<div class="sc"><div class="rb2 mb2"><button class="btn bg_ bsm" onclick="ss({pm:null,sess:null})">← Back</button><span class="f12 c3">'+(s.idx+1)+'/'+all.length+' · ✅'+s.score+'</span></div>'
    +'<div class="pbw"><div class="pbf" style="width:'+(s.idx/all.length*100)+'%"></div></div>'
    +'<div class="fcw" onclick="flipC()"><div class="fc'+(s.flip?' flip':'')+'"><div class="fcf">'
    +'<div class="f11 c3" style="text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Tap to flip</div>'
    +'<div class="syn fw7" style="font-size:32px;letter-spacing:-.5px;margin-bottom:5px">'+(w?.word||'')+'</div>'
    +'<div class="f13 c2">'+(w?.ts||'')+'</div>'
    +(w?.gr?'<div style="margin-top:8px;font-size:11px;color:var(--ac)">📝 '+w.gr+'</div>':'')
    +'</div><div class="fcf fcb">'
    +'<div class="f11 c3" style="text-transform:uppercase;letter-spacing:1px;margin-bottom:10px">Translation</div>'
    +'<div class="syn fw7 ca" style="font-size:22px;margin-bottom:7px">'+(w?.tr||'')+'</div>'
    +'<div class="f12 c2 ita" style="line-height:1.6">"'+(w?.ex||'')+'"</div>'
    +'</div></div></div>'
    +'<div class="row mb2">'+tts(w?.word||'')+'</div>'
    +(s.flip?'<div class="row" style="gap:8px"><button class="btn bd bfu" onclick="ansF(\'no\')">❌ Don\'t know</button><button class="btn bp bfu" onclick="ansF(\'yes\')">✅ Know it</button></div>'
    :'<button class="btn bs bfu" onclick="flipC()">Show translation 👁</button>')
    +'</div>';
}
function flipC(){S.sess.flip=!S.sess.flip;render();}
function ansF(r){
  const s=S.sess;if(r==='yes')s.score++;else s.extra.push([...s.words,...s.extra][s.idx]);
  s.flip=false;const all=[...s.words,...s.extra];if(s.idx+1>=all.length)s.done=true;else s.idx++;render();
}
function rFill(){
  const s=S.sess;if(s.done)return rEnd();const w=s.words[s.idx];const ex=s.ex;
  let sh='';if(ex?.sentence?.includes('_______')){const[b,a]=ex.sentence.split('_______');sh=b+'<span class="blnk">'+(s.sel||'_______')+'</span>'+a;}else if(ex)sh=ex.sentence;
  return '<div class="sc"><div class="rb2 mb2"><button class="btn bg_ bsm" onclick="ss({pm:null,sess:null})">← Back</button><span class="f12 c3">'+(s.idx+1)+'/'+s.words.length+' · ✅'+s.score+'</span></div>'
    +'<div class="pbw"><div class="pbf" style="width:'+(s.idx/s.words.length*100)+'%"></div></div>'
    +'<div class="card mb3"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:7px">Fill in: <span class="ca">'+(w?.tr||'')+'</span>'+(w?.gr?' <span style="color:var(--t3);font-weight:400">· '+w.gr+'</span>':'')+'</div>'
    +(s.load?ld('AI generating…'):ex?'<div class="syn fw7" style="font-size:16px;line-height:1.8">'+sh+'</div>':'')+'</div>'
    +(!s.load&&ex?'<div class="opts">'+ex.options.map(opt=>'<button class="opt'+(s.sel?(opt===ex.answer?' cor':opt===s.sel?' wrg':''):'')+'" onclick="chF(\''+opt.replace(/'/g,"\\'")+'\')" > '+opt+'</button>').join('')+'</div>'
    +(s.sel?'<div class="'+(s.sel===ex.answer?'rb':'rb err')+'" style="margin-bottom:0"><div class="fw7 mb1">'+(s.sel===ex.answer?'✅ Correct!':'❌ Answer: "'+ex.answer+'"')+'</div><div class="f12 c2">'+(ex.explanation||'')+'</div><div class="row mt2">'+tts(ex.answer||'')+'</div></div><button class="btn bp bfu mt2" onclick="nxF()">'+(s.idx+1>=s.words.length?'Finish':'Next →')+'</button>':''):'')
    +'</div>';
}
async function lFill(){
  const s=S.sess;const w=s.words[s.idx];if(!w)return;
  s.load=true;s.ex=null;s.sel=null;render();
  try{const d=await ai('exercise',{word:w.word,translation:w.tr,grammarNote:w.gr});d.options=d.options.sort(()=>Math.random()-.5);s.ex=d;}
  catch{s.ex={sentence:'She showed _______ throughout the process.',answer:w.word,options:[w.word,'courage','silence','effort'].sort(()=>Math.random()-.5),explanation:'"'+w.word+'" — '+w.tr};}
  s.load=false;render();
}
function chF(opt){const s=S.sess;if(s.sel)return;s.sel=opt;if(opt===s.ex.answer)s.score++;render();}
function nxF(){const s=S.sess;s.idx++;if(s.idx>=s.words.length){s.done=true;render();return;}s.ex=null;s.sel=null;render();lFill();}
function rRead(){
  const s=S.sess;
  return '<div class="sc"><div class="rb2 mb2"><button class="btn bg_ bsm" onclick="ss({pm:null,sess:null})">← Back</button><button class="btn bs bsm" onclick="lRead()" '+(s.rl?'disabled':'')+'>🔄 New</button></div>'
    +rTip()
    +'<div class="card mb2"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:9px">📄 Tap any word for translation</div>'+(s.rl?ld('AI writing…'):'<div class="rt">'+(s.rt?tappableText(s.rt.text):'')+'</div>')+'</div>'
    +(s.rt?.questions&&!s.rl?'<div class="syn fw7 f13 mb2">Questions</div>'
    +s.rt.questions.map((q,qi)=>'<div class="card mb2"><div class="fw6 f13 mb2">'+q.q+'</div><div style="display:flex;flex-direction:column;gap:6px">'
    +q.options.map(opt=>'<button class="opt'+(s.rc?(opt===q.correct?' cor':s.ra[qi]===opt?' wrg':''):'')+'" style="'+((!s.rc&&s.ra[qi]===opt)?'border-color:var(--ac2);color:var(--ac2)':'')+'" onclick="pickR('+qi+',\''+opt.replace(/'/g,"\\'")+'\')"> '+opt+'</button>').join('')
    +'</div></div>').join('')
    +(!s.rc?'<button class="btn bp bfu" onclick="chkR()" '+(Object.keys(s.ra).length<s.rt.questions.length?'disabled':'')+'>Check answers</button>'
    :'<div class="rb" style="text-align:center"><div class="sv ca" style="font-size:44px">'+s.rt.questions.filter((_,i)=>s.ra[i]===s.rt.questions[i].correct).length+'/'+s.rt.questions.length+'</div><div class="f12 c3 mt1">correct</div><div class="row mt2" style="justify-content:center;gap:8px"><button class="btn bs bsm" onclick="saveTH()">💾 Save</button><button class="btn bs bsm" onclick="lRead()">🔄 New</button></div></div>'):'')
    +'</div>';
}
function tappableText(text){
  return text.split(/(\s+)/).map(tk=>{
    const cl=tk.replace(/[.,!?;:'"()\-]/g,'').toLowerCase().trim();
    if(!cl||cl.length<2)return tk;
    const inDict=S.words.some(w=>w.word.toLowerCase()===cl);
    return '<span style="cursor:pointer;'+(inDict?'color:var(--ac);font-weight:600;border-bottom:1px solid rgba(94,255,196,.35)':'border-bottom:1px dashed var(--brd2)')+'" onclick="tapWord(\''+cl.replace(/'/g,"\\'")+'\')">'+tk+'</span>';
  }).join('');
}
async function tapWord(word){
  if(!word||word.length<2)return;
  const ex=S.words.find(w=>w.word.toLowerCase()===word.toLowerCase());
  if(ex){S.sess.tip={w:ex.word,t:ex.tr,ts:ex.ts,lv:ex.lv,gr:ex.gr,known:true};render();return;}
  S.sess.tip={w:word,t:'',ts:'',loading:true,known:false};render();
  try{const d=await ai('word',{word});S.sess.tip={w:word,t:d.translation,ts:d.transcription,lv:d.level,gr:d.grammar_note,ex:d.example_en,loading:false,known:false};}
  catch{S.sess.tip={w:word,t:'?',ts:'',loading:false,known:false};}
  render();
}
async function addTipWord(){
  const tip=S.sess.tip;if(!tip||tip.known||tip.loading)return;
  const body={word:tip.w,translation:tip.t,transcription:tip.ts||'',level:tip.lv||'B1',example_en:tip.ex||'',example_ru:'',grammar_note:tip.gr||'',hard:false};
  try{const s=await api('/api/words',{method:'POST',body});saveWord(s);}
  catch{S.words=[{id:Date.now(),word:body.word,tr:body.translation,ts:body.transcription,lv:body.level,ex:body.example_en,exr:'',gr:body.grammar_note,hard:false,tp:0,tc:0},...S.words];}
  if(S.sess.tip)S.sess.tip.known=true;render();
}
function rTip(){
  const s=S.sess;if(!s?.tip)return '';
  return '<div class="card csm mb2" style="border-color:var(--ac)">'
    +'<div class="rb2 mb1"><div class="row" style="gap:6px"><span class="syn fw7 f13">'+s.tip.w+'</span>'+(s.tip.lv?lvl(s.tip.lv):'')+'</div><button class="ib" onclick="S.sess.tip=null;render()">✕</button></div>'
    +(s.tip.loading?ld('Translating…')
    :'<div class="f13 fw6 ca mb1">'+s.tip.t+'</div>'
    +(s.tip.ts?'<div class="f11 c3 mb2">'+s.tip.ts+'</div>':'')
    +'<div class="row" style="gap:7px">'+tts(s.tip.w)
    +(s.tip.known?'<span class="f11 c3" style="margin-left:auto">✓ In dictionary</span>':'<button class="btn bp bsm" style="margin-left:auto" onclick="addTipWord()">+ Add</button>')
    +'</div>')+'</div>';
}
function pickR(qi,opt){if(S.sess.rc)return;S.sess.ra[qi]=opt;render();}
function chkR(){S.sess.rc=true;render();}
async function lRead(){
  const s=S.sess;s.rl=true;s.rt=null;s.ra={};s.rc=false;s.tip=null;render();
  try{const d=await ai('text',{words:s.words.slice(0,5).map(w=>w.word)});s.rt=d;}
  catch{s.rt={text:'Learning takes dedication. Every word you study brings you closer to fluency.',questions:[{q:'What does learning require?',options:['Dedication','Speed','Money','Luck'],correct:'Dedication'}]};}
  s.rl=false;render();
  autoSaveHistory(s.rt.text,s.words.map(w=>w.word),'read');
}
function rTxt(){
  const s=S.sess;
  return '<div class="sc"><div class="rb2 mb2"><button class="btn bg_ bsm" onclick="ss({pm:null,sess:null})">← Back</button><button class="btn bs bsm" onclick="lTxt()" '+(s.gl?'disabled':'')+'>🔄 New story</button></div>'
    +(s.gl?'<div class="card">'+ld('AI writing story with your words…')+'</div>':'')
    +(s.gt&&!s.gl?rTip()+'<div class="card mb2"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:9px">✍️ Story · Tap any word for translation</div><div class="rt">'+tappableText(s.gt.text)+'</div></div>'
    +((s.gt.questions||[]).length?'<div class="card mb2"><div class="f12 fw6 mb2">Questions</div>'+(s.gt.questions||[]).map((q,i)=>'<div style="margin-bottom:10px"><div class="f12 fw6 mb1">'+(i+1)+'. '+q.q+'</div><div style="color:var(--t2);font-size:12px">'+q.options.map((o,j)=>String.fromCharCode(65+j)+') '+o).join(' · ')+'</div><div style="font-size:11px;color:var(--ac);margin-top:3px">✓ '+q.correct+'</div></div>').join('')+'</div>':'')
    :'')+'</div>';
}
async function lTxt(){
  const s=S.sess;s.gl=true;s.gt=null;render();
  try{const d=await ai('generate',{words:s.words.map(w=>w.word),type:'story'});s.gt=d;}
  catch{s.gt={text:'Once upon a time, our hero decided to study every day. It was not easy, but they continued to practice.',wordsUsed:s.words.slice(0,3).map(w=>w.word),questions:[{q:'What did the hero do?',options:['Give up','Study hard','Sleep','Run'],correct:'Study hard'}]};}
  s.gl=false;render();
  autoSaveHistory(s.gt.text,s.words.map(w=>w.word),'text');
}
async function autoSaveHistory(text,words,type){
  try{const r=await api('/api/history',{method:'POST',body:{text,words,type}});S.hist=[r,...S.hist];}catch{}
}
function rEnd(){
  const s=S.sess;
  return '<div class="sc"><button class="btn bg_ bsm mb3" onclick="ss({pm:null,sess:null})">← Back</button>'
    +'<div class="se"><div class="syn fw7" style="font-size:68px;color:var(--ac);line-height:1">'+s.score+'</div>'
    +'<div class="syn fw7 f13 mt1">words learned!</div><div class="f12 c3 mt1">of '+s.words.length+' cards</div>'
    +'<div class="row mt3" style="justify-content:center;gap:9px"><button class="btn bp" onclick="stM(\''+S.pm+'\')">🔄 Again</button><button class="btn bs" onclick="ss({pm:null,sess:null})">← Menu</button></div></div></div>';
}

// ── RENDER: HISTORY ─────────────────────────────────────
function rHist(){
  return '<div class="sc"><div class="sht">History</div><div class="shs">Saved texts and exercises</div>'
    +(S.hist.length===0?'<div class="empty"><div style="font-size:40px;margin-bottom:10px">📜</div><div class="syn fw7 f13 mb1">No history yet</div><div class="f12 c3">Complete AI reading or generate stories</div></div>'
    :S.hist.map(h=>'<div class="hcard" onclick="opH('+h.id+')"><div class="rb2 mb1"><div class="f11 c3">'+new Date(h.created_at||Date.now()).toLocaleDateString()+'</div><div style="display:flex;gap:4px">'+(h.words||[]).slice(0,3).map(w=>'<span class="badge bgr" style="font-size:9px">'+w+'</span>').join('')+'</div></div><div class="f12 c2" style="line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">'+h.text+'</div></div>').join(''))
    +'</div>';
}
function opH(id){
  const h=S.hist.find(x=>x.id===id);if(!h)return;
  document.body.insertAdjacentHTML('beforeend','<div class="ovl" id="hm" onclick="if(event.target.id===\'hm\')this.remove()"><div class="modal" onclick="event.stopPropagation()"><div class="mh"></div><div class="rb2 mb2"><div class="f11 c3">'+new Date(h.created_at||Date.now()).toLocaleDateString()+'</div><button class="btn bg_ bsm" onclick="ge(\'hm\').remove()">✕</button></div><div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px">'+(h.words||[]).map(w=>'<span class="badge bgr">'+w+'</span>').join('')+'</div><div class="rt mb3">'+h.text+'</div><button class="btn bd bsm" onclick="delH('+h.id+')">🗑 Delete</button></div></div>');
}
async function delH(id){S.hist=S.hist.filter(h=>h.id!==id);try{await api('/api/history/'+id,{method:'DELETE'});}catch{}ge('hm')?.remove();render();}

// ── RENDER: GROUPS ──────────────────────────────────────
function rGrps(){
  const isT=S.user?.role==='teacher'||S.user?.role==='admin';
  const m=S.grpM;
  const modal=m?'<div class="ovl" onclick="if(event.target===this)ss({grpM:null})">'+rGrpModal(m)+'</div>':'';
  return '<div class="sc"><div class="sht">Groups</div><div class="shs">'+(isT?'Your student groups':'My groups')+'</div>'
    +(isT?'<button class="btn bp bfu mb3" onclick="ss({grpM:{t:\'create\',name:\'\',err:\'\'}})">＋ Create group</button>':'<button class="btn bs bfu mb3" onclick="ss({grpM:{t:\'join\',code:\'\',err:\'\'}})">🔗 Join group by code</button>')
    +(S.grps.length===0?'<div class="empty"><div style="font-size:40px;margin-bottom:10px">👥</div><div class="syn fw7 f13 mb1">No groups yet</div><div class="f12 c3">'+(isT?'Create a group and invite students':'Ask your teacher for the group code')+'</div></div>'
    :S.grps.map(g=>'<div class="gcard" onclick="opGrp('+g.id+')"><div class="rb2 mb1"><div class="syn fw7 f13">'+g.name+'</div><span class="badge bv">'+(g.member_count||0)+' students</span></div><div class="f12 c3">Invite code: <strong style="color:var(--ac);letter-spacing:2px">'+(g.code||'—')+'</strong></div></div>').join(''))
    +'</div>'+modal;
}
function rGrpModal(m){
  if(m.t==='create')return '<div class="modal"><div class="mh"></div><div class="sht mb2">New group</div>'
    +'<input class="inp mb2" id="grpName" placeholder="Group name" value="'+(m.name||'')+'">'
    +(m.err?'<div class="f12" style="color:var(--danger);margin-bottom:8px">'+m.err+'</div>':'')
    +'<button class="btn bp bfu" onclick="crGrp()">'+(m.loading?'Creating…':'Create')+'</button></div>';
  if(m.t==='join')return '<div class="modal"><div class="mh"></div><div class="sht mb2">Join group</div>'
    +'<input class="inp mb2" id="joinCode" placeholder="Enter invite code" style="text-transform:uppercase;letter-spacing:2px" value="'+(m.code||'')+'" maxlength="10">'
    +(m.err?'<div class="f12" style="color:var(--danger);margin-bottom:8px">'+m.err+'</div>':'')
    +'<button class="btn bp bfu" onclick="joinGrp()">'+(m.loading?'Joining…':'Join')+'</button></div>';
  if(m.t==='view')return '<div class="modal"><div class="mh"></div>'
    +'<div class="rb2 mb3"><div class="sht">'+m.g.name+'</div></div>'
    +'<div class="card mb3" style="text-align:center">'
    +'<div class="f12 c3 mb1">Invite code — share with students</div>'
    +'<div style="font-size:32px;font-weight:800;letter-spacing:6px;color:var(--ac);font-family:\'Syne\',sans-serif">'+m.g.code+'</div>'
    +'<button class="btn bs bsm mt2" onclick="navigator.clipboard.writeText(\''+m.g.code+'\').then(()=>{this.textContent=\'✓ Copied!\';setTimeout(()=>this.textContent=\'📋 Copy code\',1500)})">📋 Copy code</button>'
    +'</div>'
    +(m.loading?'<div class="ail">'+ld('Loading members…')+'</div>'
    :m.members?.length?'<div class="fw6 f13 mb2">👥 Members ('+m.members.length+')</div>'
      +m.members.map(u=>'<div class="wli" style="cursor:default"><div class="syn fw7 f12">'+(u.name||u.email)+'</div><span class="badge bgr">'+u.word_count+' words</span></div>').join('')
    :'<div class="f12 c3 mb2">No members yet</div>')
    +'<button class="btn bg_ bfu mt2" onclick="ss({grpM:null})">Close</button></div>';
  return '';
}
async function crGrp(){
  const name=(document.getElementById('grpName')?.value||'').trim();
  if(!name){ss({grpM:{...S.grpM,err:'Enter group name'}});return;}
  ss({grpM:{...S.grpM,loading:true,err:''}});
  try{
    const g=await api('/api/groups',{method:'POST',body:{name}});
    S.grps=[g,...S.grps];
    ss({grpM:{t:'view',g,members:[],loading:false}});
  }catch(e){ss({grpM:{...S.grpM,loading:false,err:e.message}});}
}
async function joinGrp(){
  const code=(document.getElementById('joinCode')?.value||'').trim().toUpperCase();
  if(!code){ss({grpM:{...S.grpM,err:'Enter invite code'}});return;}
  ss({grpM:{...S.grpM,loading:true,err:''}});
  try{
    const r=await api('/api/groups/join',{method:'POST',body:{code}});
    S.grps=[r.group,...S.grps];
    ss({grpM:null});
  }catch(e){ss({grpM:{...S.grpM,loading:false,err:e.message}});}
}
async function opGrp(id){
  const g=S.grps.find(x=>x.id===id);if(!g)return;
  ss({grpM:{t:'view',g,members:[],loading:true}});
  try{const m=await api('/api/groups/'+id+'/members');ss({grpM:{...S.grpM,members:m,loading:false}});}
  catch{ss({grpM:{...S.grpM,loading:false}});}
}

// ── RENDER: PROGRESS ────────────────────────────────────
function rProg(){
  let hardN=0,prac=0;const byLv={};const hardWords=[];
  for(const w of S.words){if(w.hard){hardN++;hardWords.push(w);}if(w.tp>0)prac++;byLv[w.lv]=(byLv[w.lv]||0)+1;}
  const total=S.words.length;const hard=hardN;
  const byL=LEVELS.map(l=>({l,n:byLv[l]||0})).filter(x=>x.n>0);
  const lim=S.user?.dl||50,used=S.user?.du||0,pct=Math.min(100,Math.round(used/lim*100));
  return '<div class="sc"><div class="sht">Progress</div><div class="shs">Learning statistics</div>'
    +'<div class="sg"><div class="sc2"><div class="sv ca">'+total+'</div><div class="sl">Words</div></div><div class="sc2"><div class="sv" style="color:var(--warn)">'+hard+'</div><div class="sl">Hard</div></div><div class="sc2"><div class="sv" style="color:var(--ac3)">🔥'+(S.user?.streak||0)+'</div><div class="sl">Streak</div></div><div class="sc2"><div class="sv" style="color:var(--ac2)">'+prac+'</div><div class="sl">Practiced</div></div></div>'
    +'<div class="card mb2"><div class="rb2 mb2"><div class="fw6 f13">AI requests today</div><span class="f12 c3">'+used+'/'+lim+'</span></div><div style="display:flex;align-items:center;gap:8px">' + progressBar(pct, null, '8px') + '<span class="f11 c3">'+pct+'%</span></div></div>'
    +(byL.length?'<div class="card mb2"><div class="fw6 f13 mb3">📊 By level</div>'+byL.map(({l,n})=>'<div class="mb2"><div class="rb2 mb1"><div class="row">'+lvl(l)+'<span class="f11 c3">'+n+' words</span></div><span class="f11 c3">'+Math.round(n/total*100)+'%</span></div><div class="pbw" style="height:4px"><div class="pbf" style="width:'+n/total*100+'%;background:'+(l.startsWith('C')?'var(--ac3)':l.startsWith('B')?'var(--ac2)':'var(--ac)')+'"></div></div></div>').join('')+'</div>':'')
    +(hard?'<div class="card mb2"><div class="fw6 f13 mb2">⭐ Hard words</div>'+hardWords.map(w=>'<div class="rb2" style="padding:7px 0;border-bottom:1px solid var(--brd)"><div class="row"><span class="fw6 f13">'+w.word+'</span><span class="c3 f12">'+w.tr+'</span></div><div class="row" style="gap:4px">'+lvl(w.lv)+'<button class="ib" style="font-size:12px" onclick="speak(\''+w.word.replace(/'/g,"\\'")+'\')">🔊</button></div></div>').join('')+'</div>':'')
    +'<div class="card"><div class="fw6 f13 mb2">🏆 Achievements</div>'
    +[{i:'📖',l:'First word added',d:total>=1},{i:'📚',l:'10 words',d:total>=10},{i:'💯',l:'50 words',d:total>=50},{i:'🔥',l:'3-day streak',d:(S.user?.streak||0)>=3},{i:'⭐',l:'First hard word',d:hard>=1},{i:'🎯',l:'First practice',d:prac>=1}].map(a=>'<div class="row" style="padding:7px 0;border-bottom:1px solid var(--brd);gap:10px"><span style="font-size:19px;filter:'+(a.d?'none':'grayscale(1) opacity(.3)')+'">'+a.i+'</span><span class="f12" style="color:'+(a.d?'var(--t)':'var(--t3)')+'">'+a.l+'</span>'+(a.d?'<span style="margin-left:auto;font-size:11px;color:var(--ac)">✓</span>':'')+'</div>').join('')
    +'</div></div>';
}

// ── RENDER: ADMIN ────────────────────────────────────────
function rAdmin(){
  const a=S.adm;
  const admTabs=[['stats','📊 Stats'],['users','👤 Users'],['cache','🗂 Cache']];
  const nav='<div class="pills mb3">'+admTabs.map(([tb,lb])=>'<button class="pill'+(a.tab===tb?' on':'')+'" onclick="S.adm.tab=\''+tb+'\';render();admLoad(\''+tb+'\')">'+lb+'</button>').join('')+'</div>';
  const body=a.tab==='stats'?rAdmStats():a.tab==='users'?rAdmUsers():rAdmCache();
  return '<div class="sc">'+nav+body+'</div>';
}

function rAdmStats(){
  const d=S.adm.data;
  if(!d)return ld('Loading…');
  const u=d.users,w=d.words,s=d.sessions;
  return '<div class="sg mb3">'
    +'<div class="sc2"><div class="sv">'+u.total+'</div><div class="sl">Users</div></div>'
    +'<div class="sc2"><div class="sv">'+u.active_today+'</div><div class="sl">Active today</div></div>'
    +'<div class="sc2"><div class="sv">'+w.total+'</div><div class="sl">Words</div></div>'
    +'<div class="sc2"><div class="sv">'+u.new_week+'</div><div class="sl">New 7d</div></div>'
    +'</div>'
    +'<div class="card mb2"><div class="rb2 mb2"><span class="fw7 f13">Teachers</span><span class="f12 c3">'+u.teachers+'</span></div>'
    +'<div class="rb2 mb2"><span class="fw7 f13">Admins</span><span class="f12 c3">'+u.admins+'</span></div>'
    +'<div class="rb2 mb2"><span class="fw7 f13">Sessions</span><span class="f12 c3">'+(s.total||0)+'</span></div>'
    +'<div class="rb2"><span class="fw7 f13">Cache entries</span><span class="f12 c3">'+d.cache.total+'</span></div></div>'
    +'<div class="fw7 f13 mb2">Top words</div>'
    +(d.top_words?.map(tw=>'<div class="rb2" style="padding:5px 0;border-bottom:1px solid var(--brd)"><span class="f12">'+tw.word+'</span><span class="f11 c3">×'+tw.cnt+'</span></div>').join('')||'')
    +'<div class="fw7 f13 mt3 mb2">Recent users</div>'
    +(d.recent_users?.map(u=>'<div class="wli" onclick="S.adm.tab=\'users\';S.adm.uSrch=\''+u.email+'\';render();admLoad(\'users\')">'
      +'<div style="flex:1"><div class="wen">'+u.name+'</div><div class="wru">'+u.email+'</div></div>'
      +roleBadge(u.role)+'</div>').join('')||'');
}

function rAdmUsers(){
  const a=S.adm;
  const srch='<div class="sw mb3"><span class="sico">🔍</span><input class="inp sinp" placeholder="Search email / name…" value="'+a.uSrch.replace(/"/g,'&quot;')+'" oninput="S.adm.uSrch=this.value" onkeydown="if(event.key===\'Enter\')admLoad(\'users\')"><button class="btn bs bsm" style="margin-left:6px;flex-shrink:0" onclick="admLoad(\'users\')">Go</button></div>';
  const list=a.users.filter(u=>!a.uSrch||(u.email+u.name).toLowerCase().includes(a.uSrch.toLowerCase()));
  return srch+(a.loading?ld('Loading…')
    :list.map(u=>'<div class="card mb2">'
      +'<div class="rb2 mb1"><div><div class="fw7 f13">'+u.name+'</div><div class="f11 c3">'+u.email+'</div></div>'+roleBadge(u.role)+'</div>'
      +'<div class="f11 c3 mb2">Words: '+u.word_count+' · Joined: '+u.created_at?.slice(0,10)+(u.last_seen?' · Seen: '+u.last_seen?.slice(0,10):'')+'</div>'
      +'<div class="row" style="gap:5px;flex-wrap:wrap">'
      +(['student','teacher','admin'].filter(r=>r!==u.role).map(r=>'<button class="btn bs bsm" onclick="admSetRole('+u.id+',\''+r+'\')">→ '+r+'</button>').join(''))
      +'<button class="btn bd bsm" style="margin-left:auto" onclick="admDelUser('+u.id+',\''+u.email+'\')">🗑</button>'
      +'</div></div>').join(''));
}

function rAdmCache(){
  const a=S.adm;
  return (a.loading?ld('Loading…')
    :a.cache.map(c=>'<div class="rb2" style="padding:8px 0;border-bottom:1px solid var(--brd)">'
      +'<div><span class="fw7 f12">'+c.word+'</span><span class="f11 c3"> '+c.learn_lang+'/'+c.native_lang+'</span><span class="f11 c2 ml1"> — '+c.translation+'</span></div>'
      +'<button class="ib" style="color:var(--danger);font-size:13px" onclick="admDelCache('+c.id+')">✕</button>'
      +'</div>').join(''));
}

function roleBadge(r){
  const colors={admin:'var(--danger)',teacher:'var(--ac2)',student:'var(--t3)'};
  return '<span style="font-size:10px;font-weight:700;color:'+colors[r]+';background:'+colors[r]+'20;padding:2px 7px;border-radius:10px">'+r+'</span>';
}

async function admLoad(tab){
  S.adm.loading=true;render();
  try{
    if(tab==='stats')S.adm.data=await api('/api/admin/stats');
    else if(tab==='users')S.adm.users=await api('/api/admin/users'+(S.adm.uSrch?'?q='+encodeURIComponent(S.adm.uSrch):''));
    else if(tab==='cache')S.adm.cache=await api('/api/admin/cache');
  }catch(e){console.error('admLoad',tab,e);}
  S.adm.loading=false;render();
}

async function admSetRole(id,role){
  if(!confirm('Set '+role+' for user #'+id+'?'))return;
  await api('/api/admin/user/'+id,{method:'PATCH',body:{role}});
  admLoad('users');
}

async function admDelUser(id,email){
  if(!confirm('Delete user '+email+'? This cannot be undone.'))return;
  try{await api('/api/admin/user/'+id,{method:'DELETE'});admLoad('users');}
  catch(e){alert(e.message);}
}

async function admDelCache(id){
  await api('/api/admin/cache/'+id,{method:'DELETE'});
  S.adm.cache=S.adm.cache.filter(c=>c.id!==id);render();
}

// ── INIT ────────────────────────────────────────────────
render();

// ── SWIPE DOWN TO CLOSE MODAL ────────────────────────────
let _swY=0,_swEl=null;
document.addEventListener('touchstart',e=>{
  const m=e.target.closest('.modal');
  if(m){_swY=e.touches[0].clientY;_swEl=m;}
},{passive:true});
document.addEventListener('touchmove',e=>{
  if(!_swEl)return;
  const dy=e.touches[0].clientY-_swY;
  if(dy>0){_swEl.style.transform='translateY('+dy+'px)';_swEl.style.transition='none';}
},{passive:true});
document.addEventListener('touchend',e=>{
  if(!_swEl)return;
  const dy=e.changedTouches[0].clientY-_swY;
  _swEl.style.transition='transform .25s ease';
  if(dy>90){
    _swEl.style.transform='translateY(110%)';
    setTimeout(()=>{_swEl?.closest('.ovl')?.click();if(_swEl)_swEl.style.transform='';_swEl=null;},220);
  }else{_swEl.style.transform='';_swEl=null;}
  _swY=0;
},{passive:true});
let _ptY=0;
document.addEventListener('touchstart',e=>{
  const mc=ge('mc');
  if(mc&&mc.scrollTop===0&&S.scr==='main'&&!S.add&&!S.det&&!S.prof&&!S.lp)
    _ptY=e.touches[0].clientY;
},{passive:true});
document.addEventListener('touchmove',e=>{
  if(!_ptY)return;
  const mc=ge('mc');if(!mc||mc.scrollTop>2){_ptY=0;return;}
  const dy=e.touches[0].clientY-_ptY;
  if(dy<=0)return;
  let ind=ge('ptr-ind');
  if(!ind){ind=document.createElement('div');ind.id='ptr-ind';ind.style.cssText='position:fixed;top:60px;left:50%;transform:translateX(-50%);background:var(--sur2);border:1px solid var(--brd2);border-radius:20px;padding:5px 14px;font-size:12px;color:var(--t3);z-index:30;pointer-events:none';document.body.appendChild(ind);}
  ind.textContent=dy>65?'⬆️ Release to refresh':'↓ Pull to refresh';
},{passive:true});
document.addEventListener('touchend',async e=>{
  if(!_ptY)return;
  const dy=e.changedTouches[0].clientY-_ptY;
  const ind=ge('ptr-ind');
  if(ind&&dy>65){
    ind.textContent='⟳ Refreshing…';
    if(S.user)await loadData();
    render();
  }
  if(ind)ind.remove();
  _ptY=0;
},{passive:true});

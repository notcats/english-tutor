// ── CONFIG ──────────────────────────────────────────────
(()=>{
  document.documentElement.setAttribute('data-theme','light');
  // PWA install prompt
  let _deferredInstall=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();_deferredInstall=e;const btn=document.getElementById('installBtn');if(btn)btn.style.display='flex';});
  window.installApp=async()=>{if(!_deferredInstall)return;_deferredInstall.prompt();const r=await _deferredInstall.userChoice;if(r.outcome==='accepted')_deferredInstall=null;const btn=document.getElementById('installBtn');if(btn)btn.style.display='none';};
})();
const LANGS=[{code:"ru",flag:"🇷🇺",name:"Русский",nameEn:"Russian"},{code:"es",flag:"🇪🇸",name:"Español",nameEn:"Spanish"},{code:"fr",flag:"🇫🇷",name:"Français",nameEn:"French"},{code:"de",flag:"🇩🇪",name:"Deutsch",nameEn:"German"},{code:"zh",flag:"🇨🇳",name:"中文",nameEn:"Chinese"},{code:"ar",flag:"🇸🇦",name:"العربية",nameEn:"Arabic"},{code:"pt",flag:"🇧🇷",name:"Português",nameEn:"Portuguese"},{code:"tr",flag:"🇹🇷",name:"Türkçe",nameEn:"Turkish"},{code:"it",flag:"🇮🇹",name:"Italiano",nameEn:"Italian"},{code:"ko",flag:"🇰🇷",name:"한국어",nameEn:"Korean"},{code:"ja",flag:"🇯🇵",name:"日本語",nameEn:"Japanese"},{code:"pl",flag:"🇵🇱",name:"Polski",nameEn:"Polish"},{code:"uk",flag:"🇺🇦",name:"Українська",nameEn:"Ukrainian"},{code:"nl",flag:"🇳🇱",name:"Nederlands",nameEn:"Dutch"},{code:"hi",flag:"🇮🇳",name:"हिन्दी",nameEn:"Hindi"}];
const LLANGS=[{code:"en",flag:"🇬🇧",name:"English"},{code:"de",flag:"🇩🇪",name:"Deutsch"},{code:"fr",flag:"🇫🇷",name:"Français"},{code:"es",flag:"🇪🇸",name:"Español"},{code:"it",flag:"🇮🇹",name:"Italiano"},{code:"zh",flag:"🇨🇳",name:"中文"},{code:"ja",flag:"🇯🇵",name:"日本語"},{code:"ko",flag:"🇰🇷",name:"한국어"},{code:"tr",flag:"🇹🇷",name:"Türkçe"}];
function sortByPhone(list){const ph=(navigator.language||'').slice(0,2).toLowerCase();const idx=list.findIndex(l=>l.code===ph);if(idx<=0)return list;const r=[...list];r.unshift(r.splice(idx,1)[0]);return r;}
const LEVELS = ['A1','A2','B1','B2','C1','C2'];
const WORD_PACKS=[
  {id:'hotel',icon:'🏨',title:'Работа в отеле',words:['receptionist','check in','check out','concierge','housekeeping','room service','front desk','vacancy','amenities','occupancy','maintenance','reservation','suite','shift','overtime','tip','linen','complaint','bellboy']},
  {id:'warehouse',icon:'📦',title:'Работа на складе',words:['forklift','loading dock','inventory','shipment','pallet','barcode','dispatch','stock','label','conveyor','shift supervisor','hazardous','throughput','returns','manifest','shrinkage']},
  {id:'phrasal',icon:'💬',title:'Фразовые глаголы',words:['carry out','deal with','fill in','hand in','look into','put off','set up','take on','turn down','back up','bring up','come up with','follow up','get along','run out of','sort out','take over','work out']},
  {id:'jobs',icon:'💼',title:'Поиск работы',words:['resume','cover letter','applicant','hiring manager','job posting','reference','probationary period','salary expectations','benefits','team player','multitasking','promotion','performance review','notice period','redundancy','freelance','background check']},
  {id:'restaurant',icon:'🍽️',title:'Работа в ресторане',words:['waiter','host','chef','sous chef','menu','order','bill','tip','reservation','kitchen','specials','appetizer','main course','dessert','beverage','shift','busboy','table service','takeaway','corkage']},
  {id:'retail',icon:'🛒',title:'Ритейл / Магазин',words:['cashier','checkout','receipt','refund','exchange','discount','sale','shelf','stock','price tag','fitting room','customer','queue','till','merchandise','display','markup','clearance','loyalty card','out of stock']},
  {id:'logistics',icon:'🚛',title:'Логистика / Доставка',words:['delivery','shipment','freight','customs','tracking','dispatch','carrier','route','invoice','cargo','transit','consignment','pickup','drop-off','signature','delay','distribution','waybill','forwarder','lead time']},
  {id:'construction',icon:'🏗️',title:'Строительство',words:['blueprint','scaffold','crane','concrete','foundation','contractor','permit','drill','hammer','beam','pipe','wiring','insulation','plumbing','renovation','foreman','site manager','subcontractor','load-bearing','commissioning']},
  {id:'it',icon:'💻',title:'IT / Офис',words:['deadline','agenda','presentation','spreadsheet','database','server','bug','deploy','backup','firewall','troubleshoot','software','hardware','interface','dashboard','login','bandwidth','update','milestone','stakeholder']},
  {id:'customer',icon:'📞',title:'Клиентский сервис',words:['complaint','resolution','escalate','refund','apology','satisfaction','feedback','query','support ticket','follow-up','policy','warranty','replacement','compensation','response time','live chat','FAQ','subscription','chargeback','goodwill gesture']},
  {id:'travel',icon:'✈️',title:'Путешествия',words:['passport','visa','boarding pass','customs','departure','arrival','gate','luggage','check-in','layover','itinerary','booking','cancellation','transit','security check','terminal','currency exchange','travel insurance','jet lag','carry-on']},
  {id:'medical',icon:'🏥',title:'Медицина',words:['appointment','prescription','diagnosis','symptom','allergy','treatment','dosage','pharmacy','insurance','surgery','checkup','blood test','specialist','referral','recovery','discharge','clinic','painkiller','side effect','medical history']},
  {id:'banking',icon:'🏦',title:'Банк / Финансы',words:['account','balance','transfer','withdrawal','deposit','loan','mortgage','interest rate','credit card','statement','overdraft','savings','investment','fee','ATM','wire transfer','currency','exchange rate','direct debit','standing order']},
  {id:'shopping',icon:'🛍️',title:'Шопинг',words:['size','fitting room','receipt','refund','exchange','discount','sale','cash','card payment','purchase','bargain','online order','return','warranty','price match','gift card','store credit','retail therapy','impulse buy','basket']},
  {id:'linking',icon:'🔗',title:'Слова-связки',words:['however','therefore','furthermore','moreover','nevertheless','consequently','meanwhile','in addition','on the other hand','as a result','for instance','in contrast','despite','although','due to','in conclusion','similarly','otherwise','subsequently','provided that']},
  {id:'modals',icon:'🎭',title:'Модальные глаголы',words:['can','could','may','might','must','shall','should','will','would','need to','have to','ought to','be able to','be allowed to','be supposed to','had better','would rather','used to','be going to','dare to']},
  {id:'idioms',icon:'💬',title:'Идиомы',words:['break a leg','piece of cake','hit the nail on the head','under the weather','bite the bullet','cost an arm and a leg','beat around the bush','get cold feet','burn the midnight oil','let the cat out of the bag','once in a blue moon','spill the beans','time flies','up in the air','a blessing in disguise','break the ice','hit the ground running','the tip of the iceberg','pull someone\'s leg','on the fence']},
  {id:'smalltalk',icon:'🗣️',title:'Смолток / Вежливые фразы',words:['how are you doing','nice to meet you','pleased to meet you','could you please','I was wondering','I appreciate it','looking forward to','let me know','get back to you','just to clarify','as discussed','kind regards','I apologize for','bear with me','catch up','touch base','no worries','fair enough','by the way','to be honest']}
];

// ── I18N ────────────────────────────────────────────────
const UI_LANG=(navigator.language||'en').slice(0,2).toLowerCase();
const I18N={
  en:{nativeQ:'What is your native language?',learnQ:'What will you learn?',step1:'Step 1 of 3 — Your native language',step2:'Step 2 of 3 — Language to learn',step3:'Step 3 of 3',cont:'Continue →',back:'← Back',search:'Search…',chooseLang:'Choose language to learn',addWord:'Add a word',noAccount:'No account needed',signInBtn:'Sign in',signInSub:'Save & sync progress',saveTitle:'Save your progress!',saveDesc:'Create a free account to keep your words safe.',register:'Create account',skip:'Skip for now',wordAdded:'Word added!',tabWords:'Words',tabTexts:'Texts',tabPractice:'Practice',tabHistory:'History',tabStats:'Stats',tabGroups:'Groups'},
  ru:{nativeQ:'Какой ваш родной язык?',learnQ:'Какой язык вы учите?',step1:'Шаг 1 из 3 — Родной язык',step2:'Шаг 2 из 3 — Язык для изучения',step3:'Шаг 3 из 3',cont:'Продолжить →',back:'← Назад',search:'Поиск…',chooseLang:'Выберите язык',addWord:'Добавить слово',noAccount:'Без регистрации',signInBtn:'Войти',signInSub:'Синхронизация прогресса',saveTitle:'Сохраните прогресс!',saveDesc:'Создайте бесплатный аккаунт, чтобы слова не потерялись.',register:'Создать аккаунт',skip:'Пропустить',wordAdded:'Слово добавлено!',tabWords:'Слова',tabTexts:'Тексты',tabPractice:'Практика',tabHistory:'История',tabStats:'Статус',tabGroups:'Группы'},
  es:{nativeQ:'¿Cuál es tu idioma nativo?',learnQ:'¿Qué idioma aprenderás?',step1:'Paso 1/3 — Tu idioma nativo',step2:'Paso 2/3 — Idioma a aprender',step3:'Paso 3/3',cont:'Continuar →',back:'← Atrás',search:'Buscar…',chooseLang:'Elige idioma',addWord:'Añadir palabra',noAccount:'Sin cuenta',signInBtn:'Iniciar sesión',signInSub:'Guardar progreso',saveTitle:'¡Guarda tu progreso!',saveDesc:'Crea una cuenta gratuita para guardar tus palabras.',register:'Crear cuenta',skip:'Omitir',wordAdded:'¡Palabra añadida!',tabWords:'Palabras',tabTexts:'Textos',tabPractice:'Práctica',tabHistory:'Historial',tabStats:'Stats',tabGroups:'Grupos'},
  fr:{nativeQ:'Quelle est votre langue maternelle?',learnQ:'Quelle langue apprendrez-vous?',step1:'Étape 1/3 — Langue maternelle',step2:'Étape 2/3 — Langue à apprendre',step3:'Étape 3/3',cont:'Continuer →',back:'← Retour',search:'Rechercher…',chooseLang:'Choisissez une langue',addWord:'Ajouter un mot',noAccount:'Sans compte',signInBtn:'Se connecter',signInSub:'Sauvegarder la progression',saveTitle:'Sauvegardez vos progrès!',saveDesc:'Créez un compte gratuit pour ne pas perdre vos mots.',register:'Créer un compte',skip:'Passer',wordAdded:'Mot ajouté!',tabWords:'Mots',tabTexts:'Textes',tabPractice:'Pratique',tabHistory:'Historique',tabStats:'Stats',tabGroups:'Groupes'},
  de:{nativeQ:'Was ist Ihre Muttersprache?',learnQ:'Welche Sprache lernen Sie?',step1:'Schritt 1/3 — Muttersprache',step2:'Schritt 2/3 — Lernsprache',step3:'Schritt 3/3',cont:'Weiter →',back:'← Zurück',search:'Suchen…',chooseLang:'Lernsprache wählen',addWord:'Wort hinzufügen',noAccount:'Ohne Konto',signInBtn:'Anmelden',signInSub:'Fortschritt synchronisieren',saveTitle:'Fortschritt speichern!',saveDesc:'Erstellen Sie ein kostenloses Konto für Ihre Wörter.',register:'Konto erstellen',skip:'Überspringen',wordAdded:'Wort hinzugefügt!',tabWords:'Wörter',tabTexts:'Texte',tabPractice:'Übung',tabHistory:'Verlauf',tabStats:'Stats',tabGroups:'Gruppen'},
  zh:{nativeQ:'您的母语是什么?',learnQ:'您要学习哪种语言?',step1:'第1/3步 — 您的母语',step2:'第2/3步 — 学习语言',step3:'第3/3步',cont:'继续 →',back:'← 返回',search:'搜索…',chooseLang:'选择学习语言',addWord:'添加单词',noAccount:'无需账户',signInBtn:'登录',signInSub:'同步进度',saveTitle:'保存您的进度！',saveDesc:'创建免费账户以保留您的单词。',register:'创建账户',skip:'跳过',wordAdded:'单词已添加！',tabWords:'单词',tabTexts:'文本',tabPractice:'练习',tabHistory:'历史',tabStats:'统计',tabGroups:'小组'},
  ja:{nativeQ:'母語は何ですか？',learnQ:'学ぶ言語は何ですか？',step1:'ステップ1/3 — 母語',step2:'ステップ2/3 — 学習言語',step3:'ステップ3/3',cont:'続ける →',back:'← 戻る',search:'検索…',chooseLang:'学習言語を選択',addWord:'単語を追加',noAccount:'アカウント不要',signInBtn:'サインイン',signInSub:'進捗を同期',saveTitle:'進捗を保存！',saveDesc:'無料アカウントを作成して単語を保存しましょう。',register:'アカウント作成',skip:'後で',wordAdded:'単語が追加されました！',tabWords:'単語',tabTexts:'テキスト',tabPractice:'練習',tabHistory:'履歴',tabStats:'統計',tabGroups:'グループ'},
  ko:{nativeQ:'모국어가 무엇인가요?',learnQ:'어떤 언어를 배울 건가요?',step1:'1/3단계 — 모국어',step2:'2/3단계 — 학습 언어',step3:'3/3단계',cont:'계속 →',back:'← 뒤로',search:'검색…',chooseLang:'학습 언어 선택',addWord:'단어 추가',noAccount:'계정 불필요',signInBtn:'로그인',signInSub:'진행 상황 동기화',saveTitle:'진행 상황을 저장하세요!',saveDesc:'무료 계정을 만들어 단어를 보관하세요.',register:'계정 만들기',skip:'나중에',wordAdded:'단어가 추가되었습니다!',tabWords:'단어',tabTexts:'텍스트',tabPractice:'연습',tabHistory:'기록',tabStats:'통계',tabGroups:'그룹'},
  uk:{nativeQ:'Яка ваша рідна мова?',learnQ:'Яку мову ви вивчаєте?',step1:'Крок 1/3 — Рідна мова',step2:'Крок 2/3 — Мова для вивчення',step3:'Крок 3/3',cont:'Продовжити →',back:'← Назад',search:'Пошук…',chooseLang:'Оберіть мову',addWord:'Додати слово',noAccount:'Без реєстрації',signInBtn:'Увійти',signInSub:'Синхронізація прогресу',saveTitle:'Збережіть прогрес!',saveDesc:'Створіть безкоштовний акаунт, щоб не втратити слова.',register:'Створити акаунт',skip:'Пропустити',wordAdded:'Слово додано!',tabWords:'Слова',tabTexts:'Тексти',tabPractice:'Практика',tabHistory:'Історія',tabStats:'Статус',tabGroups:'Групи'},
  pt:{nativeQ:'Qual é a sua língua materna?',learnQ:'Qual idioma vai aprender?',step1:'Passo 1/3 — Idioma nativo',step2:'Passo 2/3 — Idioma a aprender',step3:'Passo 3/3',cont:'Continuar →',back:'← Voltar',search:'Pesquisar…',chooseLang:'Escolha o idioma',addWord:'Adicionar palavra',noAccount:'Sem conta',signInBtn:'Entrar',signInSub:'Salvar progresso',saveTitle:'Salve seu progresso!',saveDesc:'Crie uma conta gratuita para guardar suas palavras.',register:'Criar conta',skip:'Pular',wordAdded:'Palavra adicionada!',tabWords:'Palavras',tabTexts:'Textos',tabPractice:'Prática',tabHistory:'Histórico',tabStats:'Stats',tabGroups:'Grupos'},
  tr:{nativeQ:'Ana diliniz nedir?',learnQ:'Hangi dili öğreneceksiniz?',step1:'Adım 1/3 — Ana dil',step2:'Adım 2/3 — Öğrenilecek dil',step3:'Adım 3/3',cont:'Devam →',back:'← Geri',search:'Ara…',chooseLang:'Dil seçin',addWord:'Kelime ekle',noAccount:'Hesap gerekmez',signInBtn:'Giriş yap',signInSub:'İlerlemeyi kaydet',saveTitle:'İlerlemenizi kaydedin!',saveDesc:'Kelimelerinizi korumak için ücretsiz hesap oluşturun.',register:'Hesap oluştur',skip:'Atla',wordAdded:'Kelime eklendi!',tabWords:'Kelimeler',tabTexts:'Metinler',tabPractice:'Pratik',tabHistory:'Geçmiş',tabStats:'İstatistik',tabGroups:'Gruplar'},
  it:{nativeQ:'Qual è la tua lingua madre?',learnQ:'Quale lingua stai imparando?',step1:'Passo 1/3 — Lingua madre',step2:'Passo 2/3 — Lingua da imparare',step3:'Passo 3/3',cont:'Continua →',back:'← Indietro',search:'Cerca…',chooseLang:'Scegli la lingua',addWord:'Aggiungi parola',noAccount:'Senza account',signInBtn:'Accedi',signInSub:'Salva i progressi',saveTitle:'Salva i tuoi progressi!',saveDesc:'Crea un account gratuito per non perdere le parole.',register:'Crea account',skip:'Salta',wordAdded:'Parola aggiunta!',tabWords:'Parole',tabTexts:'Testi',tabPractice:'Pratica',tabHistory:'Cronologia',tabStats:'Stats',tabGroups:'Gruppi'},
  pl:{nativeQ:'Jaki jest twój ojczysty język?',learnQ:'Jakiego języka się uczysz?',step1:'Krok 1/3 — Ojczysty język',step2:'Krok 2/3 — Język do nauki',step3:'Krok 3/3',cont:'Kontynuuj →',back:'← Wstecz',search:'Szukaj…',chooseLang:'Wybierz język',addWord:'Dodaj słowo',noAccount:'Bez konta',signInBtn:'Zaloguj się',signInSub:'Synchronizuj postępy',saveTitle:'Zapisz swoje postępy!',saveDesc:'Utwórz darmowe konto dla swoich słów.',register:'Utwórz konto',skip:'Pomiń',wordAdded:'Słowo dodane!',tabWords:'Słowa',tabTexts:'Teksty',tabPractice:'Ćwiczenia',tabHistory:'Historia',tabStats:'Statystyki',tabGroups:'Grupy'},
  ar:{nativeQ:'ما هي لغتك الأم؟',learnQ:'ما اللغة التي ستتعلمها؟',step1:'الخطوة 1/3 — لغتك الأم',step2:'الخطوة 2/3 — اللغة التي تتعلمها',step3:'الخطوة 3/3',cont:'متابعة →',back:'→ رجوع',search:'بحث…',chooseLang:'اختر اللغة',addWord:'إضافة كلمة',noAccount:'بدون حساب',signInBtn:'تسجيل الدخول',signInSub:'مزامنة التقدم',saveTitle:'احفظ تقدمك!',saveDesc:'أنشئ حسابًا مجانيًا للحفاظ على كلماتك.',register:'إنشاء حساب',skip:'تخطي',wordAdded:'تمت إضافة الكلمة!',tabWords:'كلمات',tabTexts:'نصوص',tabPractice:'تدريب',tabHistory:'السجل',tabStats:'إحصاء',tabGroups:'مجموعات'},
  hi:{nativeQ:'आपकी मातृभाषा क्या है?',learnQ:'आप कौन सी भाषा सीखेंगे?',step1:'चरण 1/3 — आपकी मातृभाषा',step2:'चरण 2/3 — सीखने की भाषा',step3:'चरण 3/3',cont:'जारी रखें →',back:'← वापस',search:'खोजें…',chooseLang:'भाषा चुनें',addWord:'शब्द जोड़ें',noAccount:'खाते की ज़रूरत नहीं',signInBtn:'साइन इन',signInSub:'प्रगति सिंक करें',saveTitle:'अपनी प्रगति बचाएं!',saveDesc:'अपने शब्दों को सुरक्षित रखने के लिए मुफ़्त खाता बनाएं।',register:'खाता बनाएं',skip:'छोड़ें',wordAdded:'शब्द जोड़ा गया!',tabWords:'शब्द',tabTexts:'पाठ',tabPractice:'अभ्यास',tabHistory:'इतिहास',tabStats:'आँकड़े',tabGroups:'समूह'},
};
function t(k){return(I18N[UI_LANG]||I18N.en)[k]||I18N.en[k]||k;}

// ── STATE & BOOTSTRAP ───────────────────────────────────
function dLang(){const b=(navigator.language||'ru').slice(0,2).toLowerCase();return LANGS.find(l=>l.code===b)?.code||'ru';}
let S={scr:'ob',step:1,nl:dLang(),ll:'en',obs:'',user:null,tok:localStorage.getItem('tok')||'',tab:'dict',words:[],filt:'All',sort:'new',srch:'',add:false,addTab:'manual',det:null,pm:null,sess:null,wmode:null,wsrc:'all',wcount:10,ho:false,prof:false,lp:false,hist:[],grps:[],guest:false,guestStep:'add',adm:{tab:'stats',data:null,users:[],cache:[],uSrch:'',loading:false},grpM:null,accent:localStorage.getItem('accent')||'en-US',tx:{mode:'home',loading:false,text:null,tip:null,ai:false,input:'',sel:[],selMode:false}};

// ── API ─────────────────────────────────────────────────
async function api(path,o={}){
  const r=await fetch(path,{...o,headers:{'Content-Type':'application/json',...(S.tok?{'Authorization':'Bearer '+S.tok}:{}),...(o.headers||{})},body:o.body?JSON.stringify(o.body):undefined});
  if(!r.ok){const e=await r.json().catch(()=>({error:r.statusText}));throw new Error(e.error||r.statusText);}
  return r.json();
}
async function ai(type,data){
  const r=await api('/api/ai/'+type,{method:'POST',body:{learnLang:S.ll,nativeLang:S.nl,...data}});
  if(S.user){S.user.du=(S.user.du||0)+1;}
  return r;
}
function mw(w){return{id:w.id,word:w.word,tr:w.translation||'',ts:w.transcription||'',lv:w.level||'B1',ex:w.example_en||'',exr:w.example_ru||'',gr:w.grammar_note||'',hard:w.hard||false,tp:w.times_practiced||0,tc:w.times_correct||0,ca:w.created_at||null};}
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
  if(stR.status==='fulfilled'){const st=stR.value;if(S.user){S.user.streak=st.streak?.current_streak||0;S.user.du=st.daily_used||0;S.user.dl=st.daily_limit||50;S.user.sessData=st.sessions||{total:0,correct:0,words:0,seconds:0,recent:[]};S.user.longestStreak=st.streak?.longest_streak||0;}}
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
function setAccent(a){S.accent=a;localStorage.setItem('accent',a);render();}
function speak(w,slow,accent){
  if(!window.speechSynthesis)return;speechSynthesis.cancel();
  const lang=S.ll==='en'?(accent||S.accent||'en-US'):(LC[S.ll]||'en-US');
  const u=new SpeechSynthesisUtterance(w);u.lang=lang;u.rate=slow?0.6:0.9;
  const vs=speechSynthesis.getVoices();
  const v=vs.find(v=>v.lang===lang&&v.name.includes('Google'))
    ||vs.find(v=>v.lang===lang)
    ||vs.find(v=>v.lang.startsWith(lang.slice(0,2))&&v.name.includes('Google'))
    ||vs.find(v=>v.lang.startsWith(lang.slice(0,2)));
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
function tts(w){
  const e=(w||'').replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  if(S.ll==='en'){
    const isUS=S.accent==='en-US';
    return '<button class="ttsb'+(isUS?' ttsb-on':'')+'" onclick="speak(\''+e+'\',false,\'en-US\')" title="American">🇺🇸</button>'
      +' <button class="ttsb'+(!isUS?' ttsb-on':'')+'" onclick="speak(\''+e+'\',false,\'en-GB\')" title="British">🇬🇧</button>'
      +' <button class="ttsb" onclick="speak(\''+e+'\',true)" title="Slow">🐢</button>';
  }
  return '<button class="ttsb" onclick="speak(\''+e+'\')">🔊</button> <button class="ttsb" onclick="speak(\''+e+'\',true)">🐢</button>';
}
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
    const isNew=S.words.length===0;
    ss({scr:'main',tab:'dict',guest:false,guestStep:'add',...(isNew?{add:true,addTab:'packs'}:{})});
  }catch(err){showErr(err.message);}
}
function enterGuest(){ss({scr:'main',tab:'dict',guest:true,guestStep:'add'});}

// ── RENDER: SHELL ───────────────────────────────────────
function render(){
  const app=document.getElementById('app');
  if(S.scr==='ob'){app.innerHTML=rOb();return;}
  const isT=S.user?.role==='teacher'||S.user?.role==='admin';
  const isA=S.user?.role==='admin';
  const tabs=isA
    ?[{id:'dict',i:'📖',l:t('tabWords')},{id:'texts',i:'📄',l:t('tabTexts')},{id:'groups',i:'👥',l:t('tabGroups')},{id:'practice',i:'🏋️',l:t('tabPractice')},{id:'progress',i:'📊',l:t('tabStats')},{id:'admin',i:'⚙️',l:'Admin'}]
    :isT?[{id:'dict',i:'📖',l:t('tabWords')},{id:'texts',i:'📄',l:t('tabTexts')},{id:'groups',i:'👥',l:t('tabGroups')},{id:'practice',i:'🏋️',l:t('tabPractice')},{id:'progress',i:'📊',l:t('tabStats')}]
    :[{id:'dict',i:'📖',l:t('tabWords')},{id:'texts',i:'📄',l:t('tabTexts')},{id:'practice',i:'🏋️',l:t('tabPractice')},{id:'history',i:'📜',l:t('tabHistory')},{id:'progress',i:'📊',l:t('tabStats')}];
  const u=S.user;const un=(u?.name||'?')[0].toUpperCase();
  const av=S.guest?'<button class="btn bp bsm" style="font-size:12px;padding:6px 12px" onclick="ss({scr:\'ob\',step:4})">'+t('signInBtn')+'</button>'
    :u?.avatar?'<button class="ava-btn" onclick="ss({prof:true})"><div class="ava"><img src="'+u.avatar+'"></div><span class="ava-arrow">▾</span></button>':'<button class="ava-btn" onclick="ss({prof:true})"><div class="ava">'+un+'</div><span class="ava-arrow">▾</span></button>';
  const ln=LLANGS.find(l=>l.code===S.ll)?.name||'English';
  app.innerHTML='<header class="hdr"><div class="logo">AI <em>Dictionary</em></div><div class="hdr-r"><button id="installBtn" class="btn bp bsm" style="display:none;font-size:12px;padding:5px 10px" onclick="installApp()">📲 Install</button>'+(S.guest?'':('<div class="streak">🔥 '+(u?.streak||0)+'</div>'))+av+'</div></header>'
    +'<main class="content" id="mc">'+rMain()+'</main>'
    +'<nav class="nav" data-user="'+(u?.name||u?.email||'')+'">'
    +tabs.map(tb=>'<button class="nb'+(S.tab===tb.id&&!S.add?' on':'')+'" onclick="swT(\''+tb.id+'\')"><span class="ni">'+tb.i+'</span>'+tb.l+'</button>').join('')
    +'</nav>'
    +(!S.add&&!S.pm&&!S.wmode?'<div class="fab-group">'
      +'<button class="fab fab-sm" title="Вставить текст для чтения" onclick="swT(\'texts\');S.tx.mode=\'input\';render()">✂️</button>'
      +'<button class="fab fab-sm" title="Добавить слова с фото" onclick="ss({add:true,addTab:\'photo\'})">📷</button>'
      +'<button class="fab" title="Добавить слово" onclick="ss({add:true,addTab:\'manual\'})">＋</button>'
      +'</div>':'')
    +(S.prof?rProf():'')+(S.lp?rLP():'')+(S.det?rWM():'');
}
function rMain(){if(S.add)return rAdd();if(S.tab==='dict')return rDict();if(S.tab==='texts')return rTexts();if(S.tab==='practice')return rPrac();if(S.tab==='progress')return rProg();if(S.tab==='history')return rHist();if(S.tab==='groups')return rGrps();if(S.tab==='admin')return rAdmin();return rDict();}
function swT(t){ss({tab:t,add:false,pm:null,sess:null,det:null});if(t==='admin')admLoad(S.adm.tab);}

// ── RENDER: ONBOARDING ──────────────────────────────────
function rOb(){if(S.step===1)return ob1();if(S.step===2)return ob2();if(S.step===3)return ob3();if(S.step===4)return ob4();return ob5();}
function ob1(){
  const list=sortByPhone(LANGS).filter(l=>l.name.toLowerCase().includes((S.obs||'').toLowerCase())||l.nameEn.toLowerCase().includes((S.obs||'').toLowerCase()));
  return '<div class="ob"><div class="obh"><div style="font-size:52px;margin-bottom:14px;filter:drop-shadow(0 0 20px rgba(94,255,196,.3))">🌍</div><div class="obl">AI Language <em>Tutor</em></div><div class="obs" style="color:var(--t3);font-size:12px">'+t('step1')+'</div></div>'
    +'<div class="obs2 mb3"><div class="oblbl">'+t('nativeQ')+'</div>'
    +'<div class="obsw"><span class="obsico">🔍</span><input class="obsinp" placeholder="'+t('search')+'" value="'+(S.obs||'')+'" oninput="S.obs=this.value;render()"></div>'
    +'<div class="lg">'+list.map(l=>'<div class="lc'+(S.nl===l.code?' sel':'')+'" onclick="S.nl=\''+l.code+'\';render()"><div class="lcf">'+l.flag+'</div><div class="lcn">'+l.name+'</div>'+(S.nl===l.code?'<div style="font-size:9px;color:var(--ac)">✓</div>':'')+'</div>').join('')+'</div></div>'
    +'<div style="width:100%;position:relative;z-index:1;margin-top:14px"><button class="btn bp bfu" style="padding:13px;font-size:14px;border-radius:13px" onclick="ss({step:2,obs:\'\'})">'+t('cont')+'</button></div></div>';
}
function ob2(){
  return '<div class="ob"><div class="obh"><div style="font-size:52px;margin-bottom:14px">📚</div><div class="obl">'+t('learnQ').replace(/\?/,'? <em>🎯</em>')+'</div><div class="obs" style="color:var(--t3);font-size:12px">'+t('step2')+'</div></div>'
    +'<div class="obs2 mb3"><div class="oblbl">'+t('chooseLang')+'</div>'
    +'<div class="lg">'+sortByPhone(LLANGS).map(l=>'<div class="lc'+(S.ll===l.code?' sel':'')+'" onclick="S.ll=\''+l.code+'\';render()"><div class="lcf">'+l.flag+'</div><div class="lcn">'+l.name+'</div>'+(S.ll===l.code?'<div style="font-size:9px;color:var(--ac)">✓</div>':'')+'</div>').join('')+'</div></div>'
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
    +'<button class="btn bd bfu mb2" onclick="logout()">🚪 Sign out</button>'
    +'<div class="card csm mb2"><div class="rb2 mb1"><span class="f12 fw6">AI requests today</span><span class="f12 c3">'+used+'/'+lim+'</span></div>'
    +'<div style="display:flex;align-items:center;gap:8px">' + progressBar(pct) + '</div></div>'
    +'<div class="card csm mb2"><div class="f12 fw6 mb2">Learning settings</div>'
    +'<div class="rb2 mb2"><span class="f12 c2">Native language</span><button class="btn bg_ bsm" onclick="ss({prof:false,lp:\'n\'})">'+(cl?cl.flag+' '+cl.name:'Select')+'</button></div>'
    +'<div class="rb2 mb2"><span class="f12 c2">Learning</span><button class="btn bg_ bsm" onclick="ss({prof:false,lp:\'l\'})">'+(ll?ll.flag+' '+ll.name:'Select')+'</button></div>'
    +(S.ll==='en'?'<div class="rb2"><span class="f12 c2">Акцент</span><div style="display:flex;gap:6px"><button class="btn bsm '+(S.accent==='en-US'?'bp':'bg_')+'" onclick="setAccent(\'en-US\')">🇺🇸 American</button><button class="btn bsm '+(S.accent==='en-GB'?'bp':'bg_')+'" onclick="setAccent(\'en-GB\')">🇬🇧 British</button></div></div>':'')
    +'</div>'
    +(isT?'<button class="btn bs bfu bsm mb2" onclick="ss({prof:false,tab:\'groups\'})">👥 Manage groups</button>':'');
  return modal(innerContent, 'ss({prof:false})');
}
function rLP(){
  const isN=S.lp==='n';const list=sortByPhone(isN?LANGS:LLANGS);const cur=isN?S.nl:S.ll;
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

function printWords(){
  document.body.setAttribute('data-date', new Date().toLocaleDateString());
  window.print();
}

// ── RENDER: DICTIONARY ──────────────────────────────────
const SORT_LV={A1:0,A2:1,B1:2,B2:3,C1:4,C2:5};
function rDict(){
  let list=S.words.filter(w=>{
    const m=w.word.toLowerCase().includes(S.srch.toLowerCase())||w.tr.toLowerCase().includes(S.srch.toLowerCase());
    return m;
  });
  if(S.sort==='az')list=[...list].sort((a,b)=>a.word.localeCompare(b.word));
  else if(S.sort==='za')list=[...list].sort((a,b)=>b.word.localeCompare(a.word));
  else if(S.sort==='lvasc')list=[...list].sort((a,b)=>(SORT_LV[a.lv]??9)-(SORT_LV[b.lv]??9));
  else if(S.sort==='lvdesc')list=[...list].sort((a,b)=>(SORT_LV[b.lv]??9)-(SORT_LV[a.lv]??9));
  else if(S.sort==='phrasal')list=list.filter(w=>w.word.includes(' '));
  else if(S.sort.startsWith('pack_')){const pid=S.sort.slice(5);const p=WORD_PACKS.find(x=>x.id===pid);if(p)list=list.filter(w=>p.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase()));}
  const guestBanner=S.guest?'<div class="rb" style="background:var(--acD);border-color:var(--ac);margin-bottom:12px;display:flex;align-items:center;gap:10px"><span style="font-size:20px">💾</span><div style="flex:1"><div class="fw6 f12">'+t('saveTitle')+'</div><div class="f11 c2 mt1">'+t('saveDesc')+'</div></div><button class="btn bp bsm" style="font-size:11px;white-space:nowrap" onclick="ss({scr:\'ob\',step:4})">'+t('register')+'</button></div>':'';
  return '<div class="sc">'+guestBanner
    +'<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px"><div class="sw" style="flex:1;margin-bottom:0"><span class="sico">🔍</span><input class="inp sinp" style="width:100%;box-sizing:border-box" placeholder="Search words…" value="'+S.srch+'" oninput="S.srch=this.value;render()"></div>'
    +'<select class="inp" style="flex-shrink:0;width:auto;font-size:13px;padding:11px 10px" onchange="S.sort=this.value;render()">'
    +[['new','Новые'],['az','A → Z'],['za','Z → A'],['lvasc','A1 → C2'],['lvdesc','C2 → A1'],['phrasal','Фразовые']].map(([v,l])=>'<option value="'+v+'"'+(S.sort===v?' selected':'')+'>'+l+'</option>').join('')
    +WORD_PACKS.filter(p=>S.words.some(w=>p.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase()))).map(p=>'<option value="pack_'+p.id+'"'+(S.sort==='pack_'+p.id?' selected':'')+'>'+p.icon+' '+p.title+'</option>').join('')
    +getCustomPacks().filter(p=>S.words.some(w=>p.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase()))).map((p,i)=>'<option value="custom_'+i+'"'+(S.sort==='custom_'+i?' selected':'')+'>✨ '+p.topic+'</option>').join('')
    +'</select></div>'
    +(list.length===0
      ? S.words.length===0
        ? '<div style="margin-top:4px"><div class="f14 fw7 mb3">👋 С чего начать?</div>'
          +'<div class="mc mb2" onclick="ss({add:true,addTab:\'manual\'})"><div class="mci">✏️</div><div style="flex:1"><div class="fw6 f13">Добавить слово вручную</div><div class="f11 c3 mt1">Введи слово — AI переведёт и объяснит</div></div><span class="c3">›</span></div>'
          +'<div class="mc mb2" onclick="ss({add:true,addTab:\'photo\'})"><div class="mci">📷</div><div style="flex:1"><div class="fw6 f13">Сфотографировать текст</div><div class="f11 c3 mt1">AI найдёт все слова на фото</div></div><span class="c3">›</span></div>'
          +'<div class="mc mb2" onclick="ss({add:true,addTab:\'packs\'})"><div class="mci">📦</div><div style="flex:1"><div class="fw6 f13">Выбрать готовый набор</div><div class="f11 c3 mt1">Отель, работа, фразовые глаголы…</div></div><span class="c3">›</span></div>'
          +'</div>'
        : '<div class="empty"><div style="font-size:44px;margin-bottom:10px">🔍</div><div class="syn fw7 f13 mb1">Ничего не найдено</div><div class="f12 c3">Попробуй другой запрос или сбрось фильтр</div></div>'
    :'<div class="dict-grid">'+list.map(w=>'<div class="wli" onclick="ss({det:S.words.find(x=>x.id==='+w.id+')})">'
      +'<div style="flex:1;min-width:0"><div class="row mb1"><span class="wen">'+w.word+'</span>'+lvl(w.lv)+'</div>'
      +'<div class="wru">'+w.tr+'</div>'
      +(w.gr?'<div class="wgr">📝 '+w.gr+'</div>':'')
      +(w.ex?'<div class="wex">"'+w.ex.slice(0,50)+'…"</div>':'')+'</div>'
      +'<div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0">'
      +'<button class="ib" onclick="event.stopPropagation();speak(\''+w.word.replace(/'/g,"\\'")+'\')">🔊</button>'
      +'<button class="ib" onclick="event.stopPropagation();togH('+w.id+')">'+(w.hard?'⭐':'☆')+'</button>'
      +'<button class="ib" onclick="event.stopPropagation();delW('+w.id+')">🗑</button>'
      +'</div></div>').join('')+'</div>')
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
    +'<button class="pill'+(S.addTab==='photo'?' on':'')+'" onclick="S.addTab=\'photo\';render()">📷 Фото</button>'
    +'<button class="pill'+(S.addTab==='list'?' on':'')+'" onclick="S.addTab=\'list\';render()">📋 List</button>'
    +'<button class="pill'+(S.addTab==='packs'?' on':'')+'" onclick="S.addTab=\'packs\';_packSt={};render()">📦 Пакеты</button>'
    +'</div>'+(S.addTab==='photo'?rAddP():S.addTab==='list'?rAddL():S.addTab==='packs'?rAddPacks():rAddM())+'</div>';
}
function rAddM(){
  return '<div><div style="margin-bottom:12px"><label style="display:block;font-size:10px;font-weight:700;color:var(--t3);margin-bottom:4px;text-transform:uppercase;letter-spacing:.7px">Word or phrase</label>'
    +'<div class="row"><input id="nw" class="inp" style="flex:1" placeholder="Enter word…" onkeydown="if(event.key===\'Enter\')fwAI()">'
    +'<button class="micb" id="mic1" onclick="mic(\'nw\',\'mic1\')" style="margin-left:7px;white-space:nowrap">🎤 Voice</button>'
    +'<button class="btn bp bsm" style="margin-left:6px" onclick="fwAI()">✨ AI</button></div></div>'
    +'<div id="ar"></div></div>';
}
function rAddP(){
  const btnStyle='display:flex;align-items:center;justify-content:center;gap:8px;padding:18px 10px;background:var(--sur2);border:2px dashed var(--brd2);border-radius:13px;color:var(--t2);font-size:13px;font-weight:500;cursor:pointer;flex:1;text-align:center';
  return '<div>'
    +'<input type="file" id="pfc" accept="image/*" capture="environment" style="display:none" onchange="hPhoto(this)">'
    +'<input type="file" id="pf" accept="image/*" style="display:none" onchange="hPhoto(this)">'
    +'<div style="display:flex;gap:10px;margin-bottom:10px">'
    +'<label for="pfc" style="'+btnStyle+'"><div><span style="font-size:30px;display:block;margin-bottom:4px">📷</span>Камера</div></label>'
    +'<label for="pf" style="'+btnStyle+'"><div><span style="font-size:30px;display:block;margin-bottom:4px">🖼️</span>Галерея</div></label>'
    +'</div>'
    +'<button class="btn bg_ bfu mb3" style="font-size:13px;gap:8px" onclick="openLiveCam(\'words\')">🎥 Живая камера — наведи и переведи</button>'
    +'<div id="pr"></div></div>';
}
let _camStream=null;
function openLiveCam(purpose){
  const html='<div id="camModal" style="position:fixed;inset:0;z-index:300;background:#000;display:flex;flex-direction:column;max-width:430px;left:50%;transform:translateX(-50%)">'
    +'<div style="position:relative;flex:1;overflow:hidden">'
    +'<video id="camVid" autoplay playsinline muted style="width:100%;height:100%;object-fit:cover"></video>'
    +'<div id="camOverlay" style="position:absolute;inset:0;display:flex;align-items:flex-end;pointer-events:none">'
    +'<div id="camResult" style="width:100%;background:rgba(0,0,0,.75);color:#fff;padding:14px 16px;font-size:13px;line-height:1.6;max-height:45%;overflow-y:auto;pointer-events:auto"></div>'
    +'</div>'
    +'</div>'
    +'<div style="background:var(--sur);padding:12px 16px;display:flex;gap:8px;align-items:center;flex-shrink:0">'
    +'<button class="btn bg_" onclick="closeLiveCam()" style="flex-shrink:0">✕</button>'
    +'<button id="camSnBtn" class="btn bp" style="flex:1;font-size:14px" onclick="camSnap(\''+purpose+'\')">📸 Перевести / найти слова</button>'
    +'</div></div>';
  document.body.insertAdjacentHTML('beforeend',html);
  navigator.mediaDevices?.getUserMedia({video:{facingMode:'environment',width:{ideal:1280},height:{ideal:720}}})
    .then(stream=>{_camStream=stream;const v=ge('camVid');if(v)v.srcObject=stream;})
    .catch(e=>{const r=ge('camResult');if(r)r.innerHTML='<span style="color:#ff6b6b">Нет доступа к камере: '+e.message+'</span>';});
}
function closeLiveCam(){
  if(_camStream){_camStream.getTracks().forEach(t=>t.stop());_camStream=null;}
  ge('camModal')?.remove();
}
async function camSnap(purpose){
  const vid=ge('camVid');const res=ge('camResult');const btn=ge('camSnBtn');
  if(!vid||!res)return;
  const canvas=document.createElement('canvas');
  canvas.width=vid.videoWidth||640;canvas.height=vid.videoHeight||480;
  canvas.getContext('2d').drawImage(vid,0,0);
  const b64=canvas.toDataURL('image/jpeg',0.85).split(',')[1];
  res.innerHTML=ld('Обрабатываю…');if(btn)btn.disabled=true;
  try{
    if(purpose==='words'){
      const r=await api('/api/ai/image',{method:'POST',body:{imageBase64:b64,mimeType:'image/jpeg'}});
      const words=r.words||[];
      res.innerHTML=words.length
        ?'<div style="margin-bottom:8px;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#aaa">Найдено '+words.length+' слов</div>'
          +words.map(w=>'<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(255,255,255,.1)"><span style="font-weight:600">'+w.word+'</span><span style="color:#aaa;font-size:12px">'+w.tr+'</span></div>').join('')
          +'<button onclick="camSaveWords('+JSON.stringify(JSON.stringify(words))+')" style="margin-top:10px;background:var(--ac);color:#000;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer;width:100%">+ Добавить в словарь</button>'
        :'<span style="color:#aaa">Слов не найдено. Попробуй другой ракурс.</span>';
    } else {
      const r=await api('/api/ai/image-text',{method:'POST',body:{imageBase64:b64,mimeType:'image/jpeg'}});
      const text=(r.text||'').trim();
      res.innerHTML=text
        ?'<div style="margin-bottom:8px;font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#aaa">Распознан текст</div>'
          +'<div style="margin-bottom:10px;line-height:1.6">'+text.slice(0,300)+(text.length>300?'…':'')+'</div>'
          +'<button onclick="closeLiveCam();S.tx.input='+JSON.stringify(text)+';swT(\'texts\');S.tx.mode=\'input\';render()" style="background:var(--ac);color:#000;border:none;border-radius:8px;padding:8px 16px;font-size:13px;font-weight:700;cursor:pointer;width:100%">▶ Читать этот текст</button>'
        :'<span style="color:#aaa">Текст не найден. Наведи камеру ближе.</span>';
    }
  }catch(e){res.innerHTML='<span style="color:#ff6b6b">Ошибка: '+e.message+'</span>';}
  if(btn)btn.disabled=false;
}
async function camSaveWords(jsonStr){
  const words=JSON.parse(jsonStr);
  for(const w of words){try{const s=await api('/api/words',{method:'POST',body:{word:w.word,translation:w.tr,transcription:w.ts,level:w.lv,example_en:w.ex,example_ru:w.exr}});saveWord(s);}catch{}}
  const res=ge('camResult');if(res)res.innerHTML='<span style="color:var(--ac);font-weight:700">✓ Слова добавлены в словарь!</span>';
}
let _packSt={},_customPack=null;
function rAddPacks(){
  const cp=_customPack;
  const customCard='<div class="card mb2" style="border-color:var(--ac2)">'
    +'<div class="fw7 f14 mb2">✨ Своя тема</div>'
    +'<div class="f12 c3 mb2">Введи любую тему — AI подберёт слова</div>'
    +(cp&&cp.loading?'<div>'+ld('AI подбирает слова…')+'</div>'
      :cp&&cp.words?'<div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px">'+cp.words.slice(0,8).map(w=>'<span class="badge bgr" style="font-size:10px">'+w.word+'</span>').join('')+(cp.words.length>8?'<span class="f11 c3" style="align-self:center;margin-left:2px">+'+( cp.words.length-8)+' ещё</span>':'')+'</div>'
        +(cp.saved?'<span style="color:var(--ac);font-size:12px;font-weight:600">✓ Добавлено</span>'
          :'<div class="row" style="gap:8px"><button class="btn bp bsm" onclick="saveCustomPack()">+ Добавить все</button><button class="btn bg_ bsm" onclick="_customPack=null;render()">✕ Сбросить</button></div>')
      :'<div class="row" style="gap:8px"><input id="cpTopic" class="inp" style="flex:1" placeholder="Авиация, кулинария, спорт…" onkeydown="if(event.key===\'Enter\')genCustomPack()">'
        +'<button class="btn bp bsm" onclick="genCustomPack()">✨ AI</button></div>')
    +'</div>';
  const stickyBar=cp&&cp.words&&!cp.saved
    ?'<div style="position:sticky;bottom:0;padding:10px 0 0;background:var(--bg);border-top:1px solid var(--brd);margin-top:6px"><div style="display:flex;gap:8px"><button class="btn bp" style="flex:1;padding:12px;font-size:13px" onclick="saveCustomPack()">+ Добавить все ('+cp.words.length+')</button><button class="btn bg_ bsm" onclick="_customPack=null;render()">✕</button></div></div>'
    :'';
  return '<div>'+customCard+WORD_PACKS.map(p=>{
    const st=_packSt[p.id]||{};
    const already=S.words.filter(w=>p.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase())).length;
    return '<div class="card mb2">'
      +'<div class="rb2 mb2">'
        +'<div><div class="fw7 f14">'+p.icon+' '+p.title+'</div>'
        +'<div class="f11 c3 mt1">'+p.words.length+' слов'+(already?' · '+already+' уже добавлено':'')+'</div></div>'
      +(st.done?'<span style="color:var(--ac);font-size:12px;font-weight:600">✓ Добавлено</span>'
        :st.loading?'<button class="btn bs bsm" disabled>Загрузка…</button>'
        :st.err?'<button class="btn bs bsm" onclick="addPack(\''+p.id+'\')">Повторить</button>'
        :'<button class="btn bp bsm" onclick="addPack(\''+p.id+'\')">+ Импорт</button>')
      +'</div>'
      +'<div style="display:flex;flex-wrap:wrap;gap:5px">'
        +p.words.slice(0,8).map(w=>'<span class="badge bgr" style="font-size:10px">'+w+'</span>').join('')
        +(p.words.length>8?'<span class="f11 c3" style="align-self:center;margin-left:2px">+'+( p.words.length-8)+' ещё</span>':'')
      +'</div></div>';
  }).join('')+stickyBar+'</div>';
}
async function genCustomPack(){
  const topic=ge('cpTopic')?.value?.trim();if(!topic)return;
  _customPack={loading:true,words:null,saved:false,topic};render();
  try{const d=await api('/api/ai/topic',{method:'POST',body:{topic,count:20}});_customPack={loading:false,words:d.words||[],saved:false,topic};}
  catch(e){_customPack=null;alert(e.message);}
  render();
}
function getCustomPacks(){try{return JSON.parse(localStorage.getItem('customPacks')||'[]');}catch{return[];}}
function getTextWords(){try{return JSON.parse(localStorage.getItem('textWords')||'[]');}catch{return[];}}
function addTextWord(word){const tw=getTextWords().filter(w=>w!==word.toLowerCase());tw.unshift(word.toLowerCase());localStorage.setItem('textWords',JSON.stringify(tw.slice(0,500)));}
function storeCustomPack(topic,words){const cp=getCustomPacks().filter(p=>p.topic!==topic);cp.unshift({topic,words:words.map(w=>w.word)});localStorage.setItem('customPacks',JSON.stringify(cp.slice(0,10)));}
async function saveCustomPack(){
  if(!_customPack?.words)return;
  for(const w of _customPack.words){try{const s=await api('/api/words',{method:'POST',body:w});saveWord(s);}catch{}}
  storeCustomPack(_customPack.topic,_customPack.words);
  _customPack.saved=true;render();
}
async function addPack(id){
  const p=WORD_PACKS.find(x=>x.id===id);if(!p)return;
  _packSt[id]={loading:true,done:false,err:false};render();
  try{
    const d=await ai('bulk',{words:p.words});
    for(const w of(d.words||[])){try{const s=await api('/api/words',{method:'POST',body:w});saveWord(s);}catch{}}
    _packSt[id]={loading:false,done:true,err:false};
  }catch{_packSt[id]={loading:false,done:false,err:true};}
  render();
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
function wsBySource(src){
  const now=Date.now();
  if(src==='hard')return S.words.filter(w=>w.hard);
  if(src==='new7')return S.words.filter(w=>w.ca&&(now-new Date(w.ca).getTime())<7*86400000);
  if(src==='new30')return S.words.filter(w=>w.ca&&(now-new Date(w.ca).getTime())<30*86400000);
  if(src==='text'){const tw=new Set(getTextWords());return S.words.filter(w=>tw.has(w.word.toLowerCase()));}
  if(src&&src.startsWith('last')){const n=parseInt(src.slice(4));const sorted=[...S.words].sort((a,b)=>new Date(b.ca||0)-new Date(a.ca||0));return sorted.slice(0,n);}
  if(src&&src.startsWith('pack_')){const p=WORD_PACKS.find(x=>x.id===src.slice(5));return p?S.words.filter(w=>p.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase())):S.words;}
  if(src&&src.startsWith('custom_')){const cp=getCustomPacks()[parseInt(src.slice(7))];return cp?S.words.filter(w=>cp.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase())):S.words;}
  return S.words;
}
function rPrac(){
  if(S.pm==='flash')return rFlash();if(S.pm==='fill')return rFill();if(S.pm==='read')return rRead();if(S.pm==='text')return rTxt();
  if(S.wmode)return rWSel();
  const streak=S.user?.streak||0;
  const streakBar=S.guest?'':streak===0
    ?'<div class="rb mb3" style="background:rgba(255,140,0,.07);border-color:rgba(255,140,0,.35);display:flex;align-items:center;gap:10px"><span style="font-size:22px">🔥</span><div><div class="fw6 f13">Начни серию!</div><div class="f12 c3 mt1">Потренируй хотя бы 5 слов сегодня</div></div></div>'
    :streak>=7?'<div class="rb mb3" style="background:rgba(255,140,0,.07);border-color:rgba(255,140,0,.35);display:flex;align-items:center;gap:10px"><span style="font-size:22px">🔥</span><div class="fw6 f13">'+streak+' дней подряд — ты молодец! 💪</div></div>'
    :streak>=3?'<div class="rb mb3" style="background:rgba(255,140,0,.07);border-color:rgba(255,140,0,.35);display:flex;align-items:center;gap:10px"><span style="font-size:22px">🔥</span><div class="fw6 f13">'+streak+' '+( streak===3||streak===4?'дня':'дней')+' подряд! Продолжай!</div></div>'
    :'';
  const seenHint=localStorage.getItem('seenPracHint');
  const hintCard=seenHint?'':'<div class="rb mb3" style="position:relative"><button class="ib" style="position:absolute;top:0;right:0;font-size:16px" onclick="localStorage.setItem(\'seenPracHint\',1);render()">✕</button><div class="fw6 f13 mb1">💡 Как это работает?</div><div class="f12 c2">Выбери режим → выбери слова для тренировки → начни. <strong>Flashcards</strong> — лучший старт, если ты новичок.</div></div>';
  return '<div class="sc"><div class="sht">Practice</div>'
    +streakBar+hintCard
    +'<div class="shs" style="margin-bottom:12px">Выбери режим тренировки</div>'
    +'<div class="mc mb2" onclick="ss({wmode:\'flash\'})"><div class="mci">🃏</div><div style="flex:1"><div class="syn fw7 f13">Flashcards</div><div class="f12 c2 mt1">Увидишь слово — вспомни перевод, потом переверни</div></div><span class="c3" style="font-size:17px">›</span></div>'
    +'<div class="mc mb2" onclick="ss({wmode:\'fill\'})"><div class="mci">✏️</div><div style="flex:1"><div class="syn fw7 f13">Fill the blank</div><div class="f12 c2 mt1">AI даёт предложение — выбери пропущенное слово</div></div><span class="c3" style="font-size:17px">›</span></div>'
    +'<div class="mc mb2" onclick="ss({wmode:\'read\'})"><div class="mci">📖</div><div style="flex:1"><div class="syn fw7 f13">AI Reading</div><div class="f12 c2 mt1">Читай текст, нажимай на незнакомые слова</div></div><span class="c3" style="font-size:17px">›</span></div>'
    +'<div class="mc" onclick="ss({wmode:\'text\'})"><div class="mci">✍️</div><div style="flex:1"><div class="syn fw7 f13">Generate story</div><div class="f12 c2 mt1">AI пишет историю именно на твоих словах</div></div><span class="c3" style="font-size:17px">›</span></div>'
    +'</div>';
}
function rWSel(){
  const modes={flash:'🃏 Flashcards',fill:'✏️ Fill the blank',read:'📖 AI Reading',text:'✍️ Generate story'};
  const now=Date.now();
  const textCnt=(()=>{const tw=new Set(getTextWords());return S.words.filter(w=>tw.has(w.word.toLowerCase())).length;})();
  const sources=[
    ['all','📚','Все слова',S.words.length],
    ['hard','⭐','Сложные слова',S.words.filter(w=>w.hard).length],
    ['text','📖','Из AI-текстов',textCnt],
    ['last10','🕐','Последние 10 добавленных',Math.min(10,S.words.length)],
    ['last20','🕑','Последние 20 добавленных',Math.min(20,S.words.length)],
    ['last50','🕒','Последние 50 добавленных',Math.min(50,S.words.length)],
    ['new7','🆕','Добавлены за 7 дней',S.words.filter(w=>w.ca&&(now-new Date(w.ca).getTime())<7*86400000).length],
    ['new30','📅','Добавлены за 30 дней',S.words.filter(w=>w.ca&&(now-new Date(w.ca).getTime())<30*86400000).length],
    ...WORD_PACKS.filter(p=>S.words.some(w=>p.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase()))).map(p=>[
      'pack_'+p.id, p.icon, p.title, S.words.filter(w=>p.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase())).length
    ]),
    ...getCustomPacks().map((p,i)=>[
      'custom_'+i, '✨', p.topic, S.words.filter(w=>p.words.some(pw=>pw.toLowerCase()===w.word.toLowerCase())).length
    ]).filter(([,,, cnt])=>cnt>0)
  ];
  const sel=S.wsrc||'all';
  const selCount=wsBySource(sel).length;
  const wc=S.wcount||10;
  const actual=Math.min(wc===0?selCount:wc,selCount);
  return '<div class="sc">'
    +'<div class="rb2 mb3"><button class="btn bg_ bsm" onclick="ss({wmode:null})">← Назад</button>'
    +'<div class="syn fw7 f14">'+(modes[S.wmode]||'Practice')+'</div></div>'
    +'<div class="f11 fw7 c3 mb2" style="text-transform:uppercase;letter-spacing:.7px">Какие слова тренируем?</div>'
    +sources.map(([v,icon,label,cnt])=>'<div class="mc mb2" style="'+(sel===v?'border-color:var(--ac);background:var(--acD)':'')+'" onclick="S.wsrc=\''+v+'\';render()">'
      +'<div class="mci" style="font-size:20px">'+icon+'</div>'
      +'<div style="flex:1"><div class="fw6 f13">'+label+'</div><div class="f11 c3 mt1">'+cnt+' слов</div></div>'
      +(sel===v?'<span style="color:var(--ac);font-size:18px">✓</span>':'<span class="c3" style="font-size:17px">›</span>')
      +'</div>').join('')
    +(selCount<2?'<div class="rb err f12 mt2">Недостаточно слов в выбранной категории (нужно минимум 2)</div>'
      :'<div style="margin-top:14px"><div class="f11 fw7 c3 mb2" style="text-transform:uppercase;letter-spacing:.7px">Сколько слов тренировать?</div>'
        +'<div style="display:flex;gap:6px;flex-wrap:wrap">'
        +[[10,'10'],[20,'20'],[30,'30'],[50,'50'],[0,'Все']].map(([v,l])=>'<button class="btn '+(wc===v?'bp':'bg_')+' bsm" style="flex:1;min-width:50px" onclick="S.wcount='+v+';render()">'+l+'</button>').join('')
        +'</div>'
        +'<button class="btn bp bfu mt2" onclick="stM(S.wmode)">Начать · '+actual+' слов →</button></div>')
    +'</div>';
}
function stM(m){
  const av=wsBySource(S.wsrc);
  S.pm=m;S.wmode=null;
  const wc=S.wcount||10;const wcLimit=wc===0?av.length:wc;
  S.sess={words:[...av].sort(()=>Math.random()-.5).slice(0,Math.min(wcLimit,av.length)),idx:0,score:0,done:false,extra:[],ex:null,load:false,sel:null,flip:false,rt:null,rl:false,ra:{},rc:false,tip:null,gt:null,gl:false,startTime:Date.now(),saved:false};
  render();if(m==='fill')lFill();if(m==='read')lRead();if(m==='text')lTxt();
}
async function saveSess(){
  const s=S.sess;if(!s||s.saved||!S.tok)return;s.saved=true;
  const dur=Math.round((Date.now()-(s.startTime||Date.now()))/1000);
  try{await api('/api/stats/session',{method:'POST',body:{mode:S.pm,words_count:s.words.length,correct_count:s.score,duration_seconds:dur}});}catch{}
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
  s.flip=false;const all=[...s.words,...s.extra];if(s.idx+1>=all.length){s.done=true;saveSess();}else s.idx++;render();
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
function nxF(){const s=S.sess;s.idx++;if(s.idx>=s.words.length){s.done=true;saveSess();render();return;}s.ex=null;s.sel=null;render();lFill();}
function rRead(){
  const s=S.sess;
  return '<div class="sc"><div class="rb2 mb2"><button class="btn bg_ bsm" onclick="ss({pm:null,sess:null})">← Back</button><button class="btn bs bsm" onclick="lRead()" '+(s.rl?'disabled':'')+'>🔄 New</button></div>'
    +rTip()
    +'<div class="card mb2"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:6px">📄 Tap any word for translation</div>'
    +'<div style="display:flex;gap:14px;font-size:10px;color:var(--t3);margin-bottom:10px;flex-wrap:wrap"><span><span style="color:var(--ac);font-weight:700;border-bottom:1px solid rgba(94,255,196,.4)">word</span> in dict</span><span><span style="border-bottom:1px dashed var(--brd2)">word</span> tap to translate</span></div>'
    +(s.rl?ld('AI writing…'):'<div class="rt">'+(s.rt?tappableText(s.rt.text):'')+'</div>')+'</div>'
    +(s.rt?.questions&&!s.rl?'<div class="syn fw7 f13 mb2">Questions</div>'
    +s.rt.questions.map((q,qi)=>'<div class="card mb2"><div class="fw6 f13 mb2">'+q.q+'</div><div style="display:flex;flex-direction:column;gap:6px">'
    +q.options.map(opt=>'<button class="opt'+(s.rc?(opt===q.correct?' cor':s.ra[qi]===opt?' wrg':''):'')+'" style="'+((!s.rc&&s.ra[qi]===opt)?'border-color:var(--ac2);color:var(--ac2)':'')+'" onclick="pickR('+qi+',\''+opt.replace(/'/g,"\\'")+'\')"> '+opt+'</button>').join('')
    +'</div></div>').join('')
    +(!s.rc?'<button class="btn bp bfu" onclick="chkR()" '+(Object.keys(s.ra).length<s.rt.questions.length?'disabled':'')+'>Check answers</button>'
    :'<div class="rb" style="text-align:center"><div class="sv ca" style="font-size:44px">'+s.rt.questions.filter((_,i)=>s.ra[i]===s.rt.questions[i].correct).length+'/'+s.rt.questions.length+'</div><div class="f12 c3 mt1">correct</div><div class="row mt2" style="justify-content:center;gap:8px"><button class="btn bs bsm" onclick="saveTH()" '+(s.saving?'disabled':'')+'>'+( s.saving?'Saving…':'💾 Save')+'</button><button class="btn bs bsm" onclick="lRead()">🔄 New</button></div></div>'):'')
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
  addTextWord(body.word);
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
async function saveTH(){
  const s=S.sess;if(!s?.rt)return;
  s.saving=true;render();
  try{const r=await api('/api/history',{method:'POST',body:{text:s.rt.text,words:s.words.map(w=>w.word),type:'read'}});if(!S.hist.find(h=>h.id===r.id))S.hist=[r,...S.hist];}catch{}
  ss({pm:null,sess:null,tab:'history'});
}

// ── TEXTS TAB ────────────────────────────────────────────
function txTitle(text){const s=(text||'').trim().split(/[.!?\n]/)[0].trim();return(s.length>65?s.slice(0,62)+'…':s)||text.slice(0,65);}
function rTexts(){
  const tx=S.tx;
  const tw=new Set(getTextWords());
  const textWords=S.words.filter(w=>tw.has(w.word.toLowerCase()));
  if(tx.mode==='read'){
    const selPhrase=(tx.sel||[]).join(' ');
    return '<div class="sc">'
      +'<div class="rb2 mb2"><button class="btn bg_ bsm" onclick="S.tx=Object.assign(S.tx,{mode:\'home\',text:null,tip:null,sel:[],selMode:false});render()">← Назад</button>'
      +'<div style="display:flex;gap:6px">'
      +(tx.ai?'<button class="btn bs bsm" onclick="lGenTx()" '+(tx.loading?'disabled':'')+'>🔄</button>':'')
      +'<button class="btn '+(tx.selMode?'bp':'bg_')+' bsm" onclick="S.tx.selMode=!S.tx.selMode;S.tx.sel=[];S.tx.tip=null;render()" title="Выделить фразу">✂️ Фраза</button>'
      +'</div></div>'
      +(tx.selMode?'<div class="rb mb2" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">'
        +'<span class="f11 c3">Нажимай слова по очереди:</span>'
        +(selPhrase?'<span class="fw6 f13" style="flex:1;color:var(--ac)">«'+selPhrase+'»</span>':'<span class="f12 c3" style="flex:1">—</span>')
        +(selPhrase?'<button class="btn bp bsm" onclick="txTranslatePhrase()">Перевести</button>':'')
        +(selPhrase?'<button class="btn bg_ bsm" onclick="S.tx.sel=[];render()">✕</button>':'')
        +'</div>':'')
      +rTxTip()
      +'<div class="card mb2"><div style="font-size:9px;font-weight:700;color:var(--t3);text-transform:uppercase;margin-bottom:6px">'
      +(tx.selMode?'✂️ Фраза: нажимай слова подряд':'📄 Нажми на слово — увидишь перевод')+'</div>'
      +'<div style="display:flex;gap:14px;font-size:10px;color:var(--t3);margin-bottom:10px;flex-wrap:wrap">'
      +'<span><span style="color:var(--ac);font-weight:700;border-bottom:1px solid rgba(94,255,196,.4)">word</span> — в словаре</span>'
      +'<span><span style="border-bottom:1px dashed var(--brd2)">word</span> — нажми, переведу</span>'
      +'</div>'
      +(tx.loading?ld('AI пишет текст…'):tx.text?'<div class="rt">'+tappableTextTx(tx.text)+'</div>':'')
      +'</div></div>';
  }
  const inputSection=tx.mode==='input'
    ?'<div class="card mb3">'
      +'<div class="f12 fw6 mb2">Вставь текст для чтения:</div>'
      +'<div style="display:flex;gap:8px;margin-bottom:10px">'
        +'<button class="btn bg_ bsm" style="flex:1" onclick="pasteClipboardTx()">📋 Из буфера</button>'
        +'<label for="txScanMain" class="btn bg_ bsm" style="flex:1;text-align:center;cursor:pointer;margin:0">📷 С фото</label>'
      +'</div>'
      +(tx.scanLoading?'<div style="margin-bottom:8px">'+ld('Читаю текст с фото…')+'</div>':'')
      +'<textarea id="txIn" class="inp" style="height:130px;resize:none;font-size:13px;line-height:1.5" placeholder="Вставь любой текст на английском…">'+(tx.input||'')+'</textarea>'
      +'<div style="display:flex;gap:8px;margin-top:10px"><button class="btn bp" style="flex:1" onclick="startCustomTx()">▶ Читать</button><button class="btn bg_ bsm" onclick="S.tx.mode=\'home\';S.tx.input=\'\';render()">✕</button></div></div>'
    :'';
  return '<div class="sc">'
    +'<div class="sht">Работа с текстом</div>'
    +'<div style="display:flex;gap:10px;margin-bottom:12px">'
    +'<div class="mc" style="flex:1;flex-direction:column;align-items:center;padding:16px 10px;text-align:center;gap:0;cursor:pointer" onclick="lGenTx()">'
      +'<div style="font-size:30px;margin-bottom:6px">🤖</div><div class="fw7 f13">AI Текст</div><div class="f11 c3 mt1">На моих словах</div></div>'
    +'<div class="mc" style="flex:1;flex-direction:column;align-items:center;padding:16px 10px;text-align:center;gap:0;cursor:pointer'+(tx.mode==='input'?';border-color:var(--ac);background:var(--acD)':'')+'" onclick="S.tx.mode=\'input\';render()">'
      +'<div style="font-size:30px;margin-bottom:6px">📝</div><div class="fw7 f13">Свой текст</div><div class="f11 c3 mt1">Вставить и читать</div></div>'
    +'</div>'
    +'<input type="file" id="txScanMain" accept="image/*" capture="environment" style="display:none" onchange="scanTextPhoto(this)">'
    +'<div style="display:flex;gap:8px;margin-bottom:12px">'
    +'<label for="txScanMain" class="btn bg_" style="flex:1;font-size:13px;padding:10px;gap:6px;cursor:pointer;margin:0;text-align:center">📷 Фото</label>'
    +'<button class="btn bg_" style="flex:1;font-size:13px;padding:10px;gap:6px" onclick="openLiveCam(\'text\')">🎥 Живая камера</button>'
    +'</div>'
    +(tx.scanLoading&&tx.mode!=='input'?'<div style="margin-bottom:8px">'+ld('Читаю текст с фото…')+'</div>':'')
    +inputSection
    +(S.hist.length
      ?'<div class="f11 fw7 c3 mb2 mt1" style="text-transform:uppercase;letter-spacing:.7px">Сохранённые тексты · '+S.hist.length+'</div>'
        +[...S.hist].sort((a,b)=>new Date(b.created_at||0)-new Date(a.created_at||0)).map(h=>{
          const d=new Date(h.created_at||Date.now());
          const dateStr=d.toLocaleDateString('ru-RU',{day:'numeric',month:'short'});
          const title=txTitle(h.text);
          return '<div class="card mb2" style="cursor:pointer;padding:12px 14px" onclick="openSavedTx('+h.id+')">'
            +'<div class="rb2 mb1"><div class="fw6 f13" style="flex:1;margin-right:8px">'+title+'</div><div class="f11 c3" style="white-space:nowrap">'+dateStr+'</div></div>'
            +(h.words?.length?'<div style="display:flex;gap:4px;flex-wrap:wrap">'+(h.words||[]).slice(0,5).map(w=>'<span class="badge bgr" style="font-size:9px">'+w+'</span>').join('')+'</div>':'')
            +'</div>';
        }).join('')
      :'<div class="empty" style="margin-top:16px"><div style="font-size:40px;margin-bottom:8px">📖</div><div class="f13 fw7 mb1">Текстов пока нет</div><div class="f12 c3">Нажми «AI Текст» или вставь свой — они сохранятся здесь</div></div>')
    +(textWords.length?'<div class="f11 fw7 c3 mt3 mb2" style="text-transform:uppercase;letter-spacing:.7px">Слова из текстов · '+textWords.length+'</div>'
        +textWords.slice(0,40).map(w=>'<div class="mc mb2" style="padding:10px 12px"><div style="flex:1"><div class="fw6 f13">'+w.word+'</div><div class="f11 c3 mt1">'+w.tr+'</div></div>'+lvl(w.lv)+'</div>').join('')
      :'')
    +'</div>';
}
async function lGenTx(){
  S.tx={mode:'read',loading:true,text:null,tip:null,ai:true,input:''};render();
  const words=S.words.slice(0,6).map(w=>w.word);
  try{const d=await ai('text',{words});S.tx.text=d.text||'';}
  catch{S.tx.text='Reading regularly helps you build vocabulary and improves your understanding of the language naturally.';}
  S.tx.loading=false;render();
  autoSaveHistory(S.tx.text,words,'read');
}
function startCustomTx(){
  const inp=ge('txIn')?.value?.trim();if(!inp)return;
  S.tx={mode:'read',loading:false,text:inp,tip:null,ai:false,input:inp};render();
  const tw=new Set(inp.split(/\W+/).map(w=>w.toLowerCase()).filter(Boolean));
  const wordsInText=S.words.filter(w=>tw.has(w.word.toLowerCase())).map(w=>w.word);
  autoSaveHistory(inp,wordsInText,'text');
}
function openSavedTx(id){
  const h=S.hist.find(x=>x.id===id);if(!h)return;
  S.tx={mode:'read',loading:false,text:h.text,tip:null,ai:false,input:h.text};render();
}
function tappableTextTx(text){
  const selSet=new Set((S.tx.sel||[]).map(w=>w.toLowerCase()));
  return text.split(/(\s+)/).map(tk=>{
    const cl=tk.replace(/[.,!?;:'"()\-]/g,'').toLowerCase().trim();
    if(!cl||cl.length<2)return tk;
    const isSel=selSet.has(cl);
    const inDict=S.words.some(w=>w.word.toLowerCase()===cl);
    const style=isSel
      ?'background:var(--ac);color:#000;border-radius:3px;padding:0 1px;font-weight:700;cursor:pointer'
      :inDict?'color:var(--ac);font-weight:600;border-bottom:1px solid rgba(94,255,196,.35);cursor:pointer'
      :'border-bottom:1px dashed var(--brd2);cursor:pointer';
    return '<span style="'+style+'" onclick="txTapWord(\''+cl.replace(/'/g,"\\'")+'\')">'+tk+'</span>';
  }).join('');
}
async function txTapWord(word){
  if(!word||word.length<2)return;
  if(S.tx.selMode){
    const sel=S.tx.sel||[];
    const i=sel.map(w=>w.toLowerCase()).lastIndexOf(word.toLowerCase());
    if(i>=0)sel.splice(i,1);else sel.push(word);
    S.tx.sel=sel;S.tx.tip=null;render();return;
  }
  const ex=S.words.find(w=>w.word.toLowerCase()===word.toLowerCase());
  if(ex){S.tx.tip={w:ex.word,t:ex.tr,ts:ex.ts,lv:ex.lv,gr:ex.gr,known:true};render();return;}
  S.tx.tip={w:word,t:'',ts:'',loading:true,known:false};render();
  try{const d=await ai('word',{word});S.tx.tip={w:word,t:d.translation,ts:d.transcription,lv:d.level,gr:d.grammar_note,ex:d.example_en,loading:false,known:false};}
  catch{S.tx.tip={w:word,t:'?',ts:'',loading:false,known:false};}
  render();
}
async function txTranslatePhrase(){
  const phrase=(S.tx.sel||[]).join(' ');if(!phrase)return;
  S.tx.tip={w:phrase,t:'',ts:'',loading:true,known:false};render();
  try{const d=await ai('word',{word:phrase});S.tx.tip={w:phrase,t:d.translation,ts:d.transcription,lv:d.level,gr:d.grammar_note,ex:d.example_en,loading:false,known:false};}
  catch{S.tx.tip={w:phrase,t:'?',ts:'',loading:false,known:false};}
  render();
}
async function addTxTip(){
  const tip=S.tx.tip;if(!tip||tip.known||tip.loading)return;
  const body={word:tip.w,translation:tip.t,transcription:tip.ts||'',level:tip.lv||'B1',example_en:tip.ex||'',example_ru:'',grammar_note:tip.gr||'',hard:false};
  try{const s=await api('/api/words',{method:'POST',body});saveWord(s);}
  catch{S.words=[{id:Date.now(),word:body.word,tr:body.translation,ts:body.transcription,lv:body.level,ex:body.example_en,exr:'',gr:body.grammar_note,hard:false,tp:0,tc:0},...S.words];}
  addTextWord(body.word);
  if(S.tx.tip)S.tx.tip.known=true;render();
}
function rTxTip(){
  const tip=S.tx?.tip;if(!tip)return '';
  return '<div class="card csm mb2" style="border-color:var(--ac)">'
    +'<div class="rb2 mb1"><div class="row" style="gap:6px"><span class="syn fw7 f13">'+tip.w+'</span>'+(tip.lv?lvl(tip.lv):'')+'</div><button class="ib" onclick="S.tx.tip=null;render()">✕</button></div>'
    +(tip.loading?ld('Translating…')
    :'<div class="f13 fw6 ca mb1">'+tip.t+'</div>'
    +(tip.ts?'<div class="f11 c3 mb1">['+tip.ts+']</div>':'')
    +(tip.gr?'<div class="f11 c3 mb1">'+tip.gr+'</div>':'')
    +'<div class="row" style="gap:8px;align-items:center">'+tts(tip.w)
    +(tip.known?'<span class="f11 c3" style="margin-left:auto">✓ В словаре</span>':'<button class="btn bp bsm" style="margin-left:auto" onclick="addTxTip()">+ Добавить</button>')
    +'</div>')+'</div>';
}
async function pasteClipboardTx(){
  try{const text=await navigator.clipboard.readText();if(!text)return;S.tx.input=text;const el=ge('txIn');if(el)el.value=text;else render();}
  catch{alert('Нет доступа к буферу. Вставь текст вручную (удержи поле → Вставить).');}
}
async function scanTextPhoto(input){
  const file=input.files[0];if(!file)return;
  S.tx.scanLoading=true;render();
  const reader=new FileReader();
  reader.onload=async(ev)=>{
    const b64=ev.target.result.split(',')[1];const mt=file.type||'image/jpeg';
    try{const r=await api('/api/ai/image-text',{method:'POST',body:{imageBase64:b64,mimeType:mt}});
      S.tx.input=(r.text||'').trim();S.tx.mode='input';S.tx.scanLoading=false;render();const el=ge('txIn');if(el)el.value=S.tx.input;}
    catch(e){S.tx.scanLoading=false;render();alert('Не удалось прочитать текст: '+e.message);}
  };
  reader.readAsDataURL(file);
}
function rEnd(){
  const s=S.sess;const pm=S.pm;
  const pct=s.words.length?Math.round(s.score/s.words.length*100):0;
  const msg=pct===100?'🎉 Отлично! Все верно!':pct>=70?'💪 Хороший результат!':pct>=40?'📈 Продолжай тренироваться!':'🔄 Повтори ещё раз!';
  const hardCount=S.words.filter(w=>w.hard).length;
  return '<div class="sc">'
    +'<div class="se"><div class="syn fw7" style="font-size:72px;color:var(--ac);line-height:1">'+s.score+'<span style="font-size:32px;color:var(--t3)">/'+s.words.length+'</span></div>'
    +'<div class="fw6 f14 mt2 mb1">'+msg+'</div>'
    +'<div class="f12 c3 mb4">'+pct+'% правильно</div></div>'
    +'<div class="f11 fw7 c3 mb2" style="text-transform:uppercase;letter-spacing:.7px">Что дальше?</div>'
    +'<div class="mc mb2" onclick="stM(\''+pm+'\')"><div class="mci">🔄</div><div style="flex:1"><div class="fw6 f13">Повторить этот набор</div><div class="f11 c3 mt1">Те же слова, новый порядок</div></div></div>'
    +(hardCount>0?'<div class="mc mb2" onclick="S.wsrc=\'hard\';S.wmode=\''+pm+'\';render()"><div class="mci">⭐</div><div style="flex:1"><div class="fw6 f13">Потренировать сложные</div><div class="f11 c3 mt1">'+hardCount+' слов отмечено звёздочкой</div></div></div>':'')
    +'<div class="mc mb2" onclick="ss({add:true,addTab:\'manual\'})"><div class="mci">➕</div><div style="flex:1"><div class="fw6 f13">Добавить новые слова</div><div class="f11 c3 mt1">Расширь свой словарь</div></div></div>'
    +'<div class="mc" onclick="ss({pm:null,sess:null})"><div class="mci">📋</div><div style="flex:1"><div class="fw6 f13">В меню режимов</div><div class="f11 c3 mt1">Выбрать другой тип тренировки</div></div></div>'
    +'</div>';
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
function fmtTime(secs){
  if(!secs)return '0 мин';
  const h=Math.floor(secs/3600),m=Math.floor((secs%3600)/60);
  return h>0?h+' ч '+(m>0?m+' мин':''):m+' мин';
}
function rProg(){
  let hardN=0,prac=0;const byLv={};const hardWords=[];
  for(const w of S.words){if(w.hard){hardN++;hardWords.push(w);}if(w.tp>0)prac++;byLv[w.lv]=(byLv[w.lv]||0)+1;}
  const total=S.words.length;const hard=hardN;
  const byL=LEVELS.map(l=>({l,n:byLv[l]||0})).filter(x=>x.n>0);
  const lim=S.user?.dl||50,used=S.user?.du||0,pct=Math.min(100,Math.round(used/lim*100));
  const sd=S.user?.sessData||{total:0,correct:0,words:0,seconds:0,recent:[]};
  const acc=sd.words>0?Math.round(sd.correct/sd.words*100):0;
  const modeNames={flash:'Карточки',fill:'Пропуски',read:'Чтение',text:'Текст'};
  const byMode={};(sd.recent||[]).forEach(s=>{if(!s)return;const k=s.mode||'?';byMode[k]=(byMode[k]||{n:0,correct:0,words:0,secs:0});byMode[k].n++;byMode[k].correct+=s.correct||0;byMode[k].words+=s.words||0;byMode[k].secs+=s.secs||0;});
  return '<div class="sc"><div class="sht">Прогресс</div><div class="shs">Статистика обучения</div>'
    +'<div class="sg"><div class="sc2"><div class="sv ca">'+total+'</div><div class="sl">Слов</div></div><div class="sc2"><div class="sv" style="color:var(--warn)">'+hard+'</div><div class="sl">Сложных</div></div><div class="sc2"><div class="sv" style="color:var(--ac3)">🔥'+(S.user?.streak||0)+'</div><div class="sl">Дней</div></div><div class="sc2"><div class="sv" style="color:var(--ac2)">'+sd.total+'</div><div class="sl">Тренировок</div></div></div>'
    +'<div class="card mb2"><div class="rb2 mb2"><div class="fw6 f13">🏋️ Упражнения</div><span class="f11 c3">всего '+sd.total+'</span></div>'
    +'<div class="sg" style="margin-bottom:10px"><div class="sc2"><div class="sv ca">'+sd.words+'</div><div class="sl">Заданий</div></div><div class="sc2"><div class="sv" style="color:var(--ac)">'+acc+'%</div><div class="sl">Точность</div></div><div class="sc2"><div class="sv" style="color:var(--ac2)">'+fmtTime(sd.seconds)+'</div><div class="sl">Время</div></div></div>'
    +(Object.keys(byMode).length?'<div style="font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">По режимам</div>'
      +Object.entries(byMode).map(([m,v])=>'<div class="rb2 mb1"><span class="f12">'+(modeNames[m]||m)+'</span><span class="f11 c3">'+v.n+' сес · '+Math.round(v.correct/(v.words||1)*100)+'% · '+fmtTime(v.secs)+'</span></div>').join(''):'')
    +'</div>'
    +'<div class="card mb2"><div class="rb2 mb2"><div class="fw6 f13">🤖 Запросов AI сегодня</div><span class="f12 c3">'+used+'/'+lim+'</span></div><div style="display:flex;align-items:center;gap:8px">' + progressBar(pct, null, '8px') + '<span class="f11 c3">'+pct+'%</span></div></div>'
    +(S.user?.longestStreak>1?'<div class="card mb2"><div class="rb2"><div class="f12 fw6">🔥 Серия дней</div><div class="f12 c3">Лучшая: '+(S.user?.longestStreak||0)+' дн · Текущая: '+(S.user?.streak||0)+' дн</div></div></div>':'')
    +(byL.length?'<div class="card mb2"><div class="fw6 f13 mb3">📊 По уровням</div>'+byL.map(({l,n})=>'<div class="mb2"><div class="rb2 mb1"><div class="row">'+lvl(l)+'<span class="f11 c3">'+n+' слов</span></div><span class="f11 c3">'+Math.round(n/total*100)+'%</span></div><div class="pbw" style="height:4px"><div class="pbf" style="width:'+n/total*100+'%;background:'+(l.startsWith('C')?'var(--ac3)':l.startsWith('B')?'var(--ac2)':'var(--ac)')+'"></div></div></div>').join('')+'</div>':'')
    +(hard?'<div class="card mb2"><div class="fw6 f13 mb2">⭐ Сложные слова</div>'+hardWords.map(w=>'<div class="rb2" style="padding:7px 0;border-bottom:1px solid var(--brd)"><div class="row"><span class="fw6 f13">'+w.word+'</span><span class="c3 f12">'+w.tr+'</span></div><div class="row" style="gap:4px">'+lvl(w.lv)+'<button class="ib" style="font-size:12px" onclick="speak(\''+w.word.replace(/'/g,"\\'")+'\')">🔊</button></div></div>').join('')+'</div>':'')
    +'<div class="card"><div class="fw6 f13 mb2">🏆 Достижения</div>'
    +[{i:'📖',l:'Первое слово',d:total>=1},{i:'📚',l:'10 слов',d:total>=10},{i:'💯',l:'50 слов',d:total>=50},{i:'🔥',l:'Серия 3 дня',d:(S.user?.streak||0)>=3},{i:'⭐',l:'Первое сложное',d:hard>=1},{i:'🎯',l:'Первая тренировка',d:sd.total>=1},{i:'💪',l:'10 тренировок',d:sd.total>=10},{i:'🎖',l:'Точность 80%+',d:acc>=80&&sd.total>=5}].map(a=>'<div class="row" style="padding:7px 0;border-bottom:1px solid var(--brd);gap:10px"><span style="font-size:19px;filter:'+(a.d?'none':'grayscale(1) opacity(.3)')+'">'+a.i+'</span><span class="f12" style="color:'+(a.d?'var(--t)':'var(--t3)')+'">'+a.l+'</span>'+(a.d?'<span style="margin-left:auto;font-size:11px;color:var(--ac)">✓</span>':'')+'</div>').join('')
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

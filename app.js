const C = window.C, $ = s => document.querySelector(s), app = $('#app');
const rnd = a => a[Math.floor(Math.random() * a.length)];
const T = s => s.replace(/\{n\}/g, () => rnd(C.nicks));
let seen = new Set();
try { seen = new Set(JSON.parse(localStorage.getItem('seen') || '[]')); } catch (e) {}
const save = () => { try { localStorage.setItem('seen', JSON.stringify([...seen])); } catch (e) {} };
const h = html => { app.innerHTML = html; window.scrollTo(0, 0); };
const V = {};

function go(id) {
  if (id !== 'home') { seen.add(id); save(); }
  $('#back').hidden = id === 'home';
  V[id]();
}
app.addEventListener('click', e => { const t = e.target.closest('[data-go]'); if (t && !t.disabled) go(t.dataset.go); });
$('#back').onclick = () => go('home');

function rain() {
  for (let i = 0; i < 24; i++) {
    const s = document.createElement('span');
    s.className = 'fall'; s.textContent = rnd(C.emojis);
    s.style.cssText = `left:${Math.random() * 92}vw;animation-delay:${Math.random() * .8}s`;
    document.body.append(s); setTimeout(() => s.remove(), 4000);
  }
}

V.home = () => {
  const n = [...seen].filter(x => x !== 'secret').length, open = n >= 3;
  h(`<div class="hero"><div class="doc">🩺</div><h1>أهلاً يا ${rnd(C.nicks)}!</h1><p>${C.welcome}</p></div>
  <div class="grid">${C.sections.map(s => `<button class="card" data-go="${s.id}"><span>${s.icon}</span><b>${s.name}</b><small>${s.sub}</small></button>`).join('')}
  <button class="card secret" data-go="secret" ${open ? '' : 'disabled'}><span>${open ? '🎁' : '🔒'}</span><b>المفاجأة السرية</b><small>${open ? 'جاهزة ليكي' : 'زوري ' + (3 - n) + ' أقسام كمان'}</small></button></div>
  ${open ? '' : '<button class="link" data-go="secret">مش عايزة تستني؟ افتحيها دلوقتي</button>'}`);
};

V.pharmacy = () => {
  h(`<h2>💊 صيدلية السعادة</h2><p class="sub">اختاري الدوا اللي يعجبك. مفيش آثار جانبية غير الابتسامة.</p>
  <div class="list">${C.meds.map(m => `<button class="med"><b>${m.n}</b><small>${m.d}</small><em hidden>${T(m.msg)}</em></button>`).join('')}</div>`);
  app.querySelectorAll('.med').forEach(b => b.onclick = () => b.querySelector('em').hidden = false);
};

V.mood = () => {
  let i = 0;
  const step = () => {
    if (i >= C.mood.length) return h(`<h2>🩻 نتيجة الفحص</h2><div class="box">${C.moodRes.map(r => `<p>✅ ${T(r)}</p>`).join('')}</div><button class="big" data-go="home">رجوع للاستقبال</button>`);
    const q = C.mood[i];
    h(`<h2>🩻 فحص المزاج (${i + 1}/${C.mood.length})</h2><p class="sub">مفيش إجابة غلط.</p><div class="box"><b>${q.q}</b></div><div class="list">${q.a.map(x => `<button class="med">${x}</button>`).join('')}</div>`);
    app.querySelectorAll('.med').forEach(b => b.onclick = () => { i++; step(); });
  };
  step();
};

V.roulette = () => {
  const n = C.wheel.length, cols = ['#ffd1dc', '#e4d9ff', '#cfe8ff', '#fff1c9'];
  const g = C.wheel.map((_, i) => `${cols[i % 4]} ${i * 360 / n}deg ${(i + 1) * 360 / n}deg`).join(',');
  h(`<h2>🎡 عجلة السعادة</h2><div class="wrap"><div class="pin">▼</div><div id="wheel" style="background:conic-gradient(${g})">${C.wheel.map((w, i) => `<span style="transform:rotate(${(i + .5) * 360 / n}deg)"><i>${w.e}</i></span>`).join('')}</div></div>
  <button class="big" id="spin">لفّي!</button><div class="box" id="res" hidden></div>`);
  let rot = 0;
  $('#spin').onclick = () => {
    const k = Math.floor(Math.random() * n);
    rot += 1440 + (360 - (k + .5) * 360 / n) - (rot % 360);
    $('#wheel').style.transform = `rotate(${rot}deg)`;
    $('#res').hidden = true;
    setTimeout(() => { const r = $('#res'); r.hidden = false; r.innerHTML = `<b>${C.wheel[k].e}</b> ${T(C.wheel[k].t)}`; }, 3100);
  };
};

V.chaos = () => {
  h(`<h2>🌀 فوضى عشوائية</h2><p class="sub">دوسي. على مسؤوليتك.</p><button class="big" id="boom">فوضى!</button><div class="box" id="cm">لسه مفيش فوضى…</div>`);
  $('#boom').onclick = () => {
    $('#cm').textContent = T(rnd(C.chaos));
    const f = rnd(['shake', 'spin', 'rain', 'hue']);
    if (f === 'rain') rain(); else { document.body.classList.add(f); setTimeout(() => document.body.classList.remove(f), 1500); }
  };
};

V.love = () => {
  const P = C.love.map(T); let i = 0;
  const draw = () => {
    h(`<h2>💌 ركن الحب</h2><div class="box letter">${P.slice(0, i + 1).map(p => `<p>${p}</p>`).join('')}</div>
    ${i < P.length - 1 ? '<button class="big" id="nx">كمّلي</button>' : '<button class="big" data-go="home">رجوع</button>'}`);
    const b = $('#nx'); if (b) b.onclick = () => { i++; draw(); };
  };
  draw();
};

V.secret = () => {
  h(`<h2>🎁 المفاجأة السرية</h2><div class="box">${T(C.secret.intro)}</div><button class="big" id="op">افتحي</button>
  <div class="box letter" id="rv" hidden>${C.secret.body.map(p => `<p>${T(p)}</p>`).join('')}</div>`);
  $('#op').onclick = () => { $('#op').hidden = true; $('#rv').hidden = false; rain(); };
};

go('home');

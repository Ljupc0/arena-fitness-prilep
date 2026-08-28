var Arena = (function () {
  var info = {
    name: 'Arena Fitness Prilep',
    address: 'Катна гаража, приземје, Прилеп',
    phone: '075 307 690',
    instagram: 'https://www.instagram.com/arenafitnesprilep',
    hours: [
      { label: 'Понеделник – Петок', value: '09:00 – 22:00' },
      { label: 'Сабота', value: '09:00 – 21:00' },
      { label: 'Недела', value: 'Затворено' },
    ],
  };
  var auth = null;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var infoReady = fetch('/api/info')
    .then(function (r) { return r.json(); })
    .then(function (data) { info = data; return info; })
    .catch(function () { return info; });

  var authReady = fetch('/api/auth/me', { credentials: 'include' })
    .then(function (r) { return r.ok ? r.json() : { user: null }; })
    .then(function (data) { auth = data.user || null; return auth; })
    .catch(function () { return null; });

  function logout() {
    return fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }).then(function () {
      window.location.href = 'index.html';
    });
  }

  function headerMarkup() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    function navLink(href, label) {
      var active = path === href ? ' active' : '';
      return '<a href="' + href + '" class="' + active.trim() + '">' + label + '</a>';
    }
    var accountBlock = auth
      ? '<a href="account.html" class="account-firstname">' + esc(auth.name.split(' ')[0]) + '</a>'
      : '<a href="login.html" class="account-firstname">Најава</a>';

    return (
      '<header class="site" id="siteHeaderEl">' +
      '<div class="container nav-row">' +
      '<a href="index.html" class="brand"><span class="mark">A</span>ARENA <span style="color:var(--lime)">FITNESS</span></a>' +
      '<nav class="primary">' +
      navLink('index.html', 'Почетна') +
      navLink('plans.html', 'Ценовник') +
      navLink('schedule.html', 'Распоред') +
      navLink('contact.html', 'Пробен термин') +
      '</nav>' +
      '<div class="nav-actions">' +
      accountBlock +
      '<a href="contact.html" class="btn btn-primary" style="padding:10px 20px;">Пријави се</a>' +
      '<button class="hamburger" id="hamburgerBtn" aria-label="Мени"><span></span><span></span><span></span></button>' +
      '</div>' +
      '</div>' +
      '</header>'
    );
  }

  function mobileMenuMarkup() {
    var accountLinks = auth
      ? '<a href="account.html" class="plain-link">Мојот профил (' + esc(auth.name.split(' ')[0]) + ')</a>' +
        '<button class="plain-link" id="mmLogoutBtn">Одјава</button>'
      : '<a href="login.html" class="plain-link">Најава</a><a href="register.html" class="plain-link">Регистрација</a>';

    return (
      '<div class="mobile-menu" id="mobileMenu">' +
      '<div class="backdrop" id="mmBackdrop"></div>' +
      '<div class="panel">' +
      '<div class="close-row"><button class="hamburger" id="mmCloseBtn" aria-label="Затвори"><span></span><span></span><span></span></button></div>' +
      '<a href="index.html" class="plain-link">Почетна</a>' +
      '<a href="plans.html" class="plain-link">Ценовник</a>' +
      '<a href="schedule.html" class="plain-link">Распоред</a>' +
      '<a href="contact.html" class="plain-link">Пробен термин</a>' +
      accountLinks +
      '</div>' +
      '</div>'
    );
  }

  function footerMarkup() {
    var hoursHtml = info.hours
      .map(function (h) { return '<p>' + esc(h.label) + ': ' + esc(h.value) + '</p>'; })
      .join('');
    return (
      '<footer class="site">' +
      '<div class="container">' +
      '<div class="footer-grid">' +
      '<div><h4>Arena Fitness Prilep</h4><p>' + esc(info.address) + '</p>' +
      '<p><a href="tel:' + esc(info.phone.replace(/\s/g, '')) + '">' + esc(info.phone) + '</a></p>' +
      '<p><a href="' + esc(info.instagram) + '" target="_blank" rel="noopener">Instagram</a></p></div>' +
      '<div><h4>Работно време</h4>' + hoursHtml + '</div>' +
      '<div><h4>Брзи линкови</h4>' +
      '<a href="plans.html">Ценовник</a><a href="schedule.html">Распоред на тренинзи</a><a href="contact.html">Закажи пробен термин</a><a href="admin.html">Admin</a></div>' +
      '</div>' +
      '<div class="footer-bottom"><span>© <span id="ftYear"></span> Arena Fitness Prilep</span><span>Демо/портфолио страница — не е официјална страница на Arena Fitness Prilep</span></div>' +
      '</div>' +
      '</footer>'
    );
  }

  function wireEvents() {
    var hb = document.getElementById('hamburgerBtn');
    var mmClose = document.getElementById('mmCloseBtn');
    var mmBackdrop = document.getElementById('mmBackdrop');
    var mmLogout = document.getElementById('mmLogoutBtn');
    if (hb) hb.addEventListener('click', function () { document.body.classList.add('menu-open'); });
    if (mmClose) mmClose.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    if (mmBackdrop) mmBackdrop.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    if (mmLogout) mmLogout.addEventListener('click', logout);
    var yearEl = document.getElementById('ftYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function render() {
    var headerMount = document.getElementById('site-header');
    var footerMount = document.getElementById('site-footer');
    var oldMobile = document.getElementById('mobileMenu');
    if (oldMobile) oldMobile.remove();
    if (headerMount) {
      // innerHTML (not outerHTML) so #site-header itself survives for the next render() call —
      // outerHTML would replace the mount point and break the second (auth-aware) re-render.
      headerMount.innerHTML = headerMarkup();
      var headerEl = document.getElementById('siteHeaderEl');
      if (headerEl) headerEl.insertAdjacentHTML('afterend', mobileMenuMarkup());
    }
    if (footerMount) footerMount.innerHTML = footerMarkup();
    wireEvents();
  }

  function mount() {
    render();
    Promise.all([infoReady, authReady]).then(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  return {
    infoReady: infoReady,
    authReady: authReady,
    get auth() { return auth; },
    get info() { return info; },
    logout: logout,
    esc: esc,
  };
})();

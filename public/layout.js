var Arena = (function () {
  var info = {
    name: 'Arena Fitness Prilep',
    address: 'Катна гаража, приземје, Прилеп',
    phone: '075 307 690',
    email: 'info@arenafitnessprilep.mk',
    instagram: 'https://www.instagram.com/arenafitnesprilep',
    mapsUrl: 'https://www.google.com/maps?q=41.3439648,21.5517821',
    lat: 41.3439648,
    lng: 21.5517821,
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

  // Small hand-built SVG icons (no external icon libraries / image assets).
  // Phone: base + a separate "receiver" group so CSS can animate just the
  // receiver on hover (see .icon-link.phone .receiver in style.css).
  function phoneIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path class="cradle" d="M4 15.5C4 9.7 8.7 5 14.5 5" stroke="#b7f22a" stroke-width="1.4" stroke-linecap="round" opacity="0.35"/>' +
      '<g class="receiver">' +
      '<path d="M6.6 3.6c.5-.3 1.1-.2 1.5.2l1.9 1.9c.4.4.5 1 .2 1.5l-.9 1.5c-.2.4-.2.9.1 1.3.9 1.1 2 2.2 3.1 3.1.4.3.9.3 1.3.1l1.5-.9c.5-.3 1.1-.2 1.5.2l1.9 1.9c.4.4.5 1.1.1 1.6-.6.8-1.5 1.5-2.5 1.6-1.8.2-4.5-.5-7.5-3.5s-3.7-5.7-3.5-7.5c.1-1 .8-1.9 1.6-2.5.1 0 .1-.1.2-.1z" fill="#b7f22a"/>' +
      '</g>' +
      '</svg>'
    );
  }

  // A generic "camera in a rounded square" glyph evoking Instagram without
  // reproducing the trademarked logo artwork. Filled with a static
  // Instagram-style gradient; the gradient itself animates on hover via CSS
  // (hue-rotate on .icon-link.instagram:hover .icon-circle svg).
  function instagramIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="3.5" y="3.5" width="17" height="17" rx="5.5" stroke="#0c0f0a" stroke-width="1.6"/>' +
      '<circle cx="12" cy="12" r="4.3" stroke="#0c0f0a" stroke-width="1.6"/>' +
      '<circle cx="16.6" cy="7.4" r="1.15" fill="#0c0f0a"/>' +
      '</svg>'
    );
  }

  function mailIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="#b7f22a" stroke-width="1.4"/>' +
      '<path d="M4.5 7l7.5 6 7.5-6" stroke="#b7f22a" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  function phoneLink(cls) {
    var tel = 'tel:' + esc(info.phone.replace(/\s/g, ''));
    return (
      '<a href="' + tel + '" class="icon-link phone' + (cls ? ' ' + cls : '') + '">' +
      '<span class="icon-circle">' + phoneIconSvg() + '</span>' +
      '<span class="label">' + esc(info.phone) + '</span>' +
      '</a>'
    );
  }

  function instagramLink(cls) {
    return (
      '<a href="' + esc(info.instagram) + '" target="_blank" rel="noopener" class="icon-link instagram' + (cls ? ' ' + cls : '') + '">' +
      '<span class="icon-circle">' + instagramIconSvg() + '</span>' +
      '<span class="label">Instagram</span>' +
      '</a>'
    );
  }

  function emailLink(cls) {
    return (
      '<a href="mailto:' + esc(info.email) + '" class="icon-link email' + (cls ? ' ' + cls : '') + '">' +
      '<span class="icon-circle">' + mailIconSvg() + '</span>' +
      '<span class="label">' + esc(info.email) + '</span>' +
      '</a>'
    );
  }

  function langToggleMarkup(mobile) {
    var next = I18N.lang === 'mk' ? 'EN' : 'MK';
    var cur = I18N.lang === 'mk' ? 'MK' : 'EN';
    return (
      '<button class="lang-toggle" id="' + (mobile ? 'mmLangToggle' : 'langToggle') + '" type="button" aria-label="Switch language">' +
      '<span class="cur">' + cur + '</span><span>/</span><span>' + next + '</span>' +
      '</button>'
    );
  }

  function headerMarkup() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    function navLink(href, label) {
      var active = path === href ? ' active' : '';
      return '<a href="' + href + '" class="' + active.trim() + '">' + label + '</a>';
    }
    var accountBlock = auth
      ? '<a href="account.html" class="account-firstname">' + esc(auth.name.split(' ')[0]) + '</a>'
      : '<a href="login.html" class="account-firstname">' + I18N.t('nav.login') + '</a>';

    return (
      '<header class="site" id="siteHeaderEl">' +
      '<div class="container nav-row">' +
      '<a href="index.html" class="brand"><span class="mark">A</span>ARENA <span style="color:var(--lime)">FITNESS</span></a>' +
      '<nav class="primary">' +
      navLink('index.html', I18N.t('nav.home')) +
      navLink('plans.html', I18N.t('nav.plans')) +
      navLink('trainers.html', I18N.t('nav.trainers')) +
      navLink('about.html', I18N.t('nav.about')) +
      navLink('contact.html', I18N.t('nav.contact')) +
      '</nav>' +
      '<div class="nav-actions">' +
      langToggleMarkup(false) +
      accountBlock +
      '<a href="contact.html" class="btn btn-primary" style="padding:10px 20px;">' + I18N.t('nav.cta') + '</a>' +
      '<button class="hamburger" id="hamburgerBtn" aria-label="Мени"><span></span><span></span><span></span></button>' +
      '</div>' +
      '</div>' +
      '</header>'
    );
  }

  function mobileMenuMarkup() {
    var accountLinks = auth
      ? '<a href="account.html" class="plain-link">' + I18N.t('nav.profile') + ' (' + esc(auth.name.split(' ')[0]) + ')</a>' +
        '<button class="plain-link" id="mmLogoutBtn">' + I18N.t('nav.logout') + '</button>'
      : '<a href="login.html" class="plain-link">' + I18N.t('nav.login') + '</a><a href="register.html" class="plain-link">' + I18N.t('nav.register') + '</a>';

    return (
      '<div class="mobile-menu" id="mobileMenu">' +
      '<div class="backdrop" id="mmBackdrop"></div>' +
      '<div class="panel">' +
      '<div class="close-row"><button class="hamburger" id="mmCloseBtn" aria-label="Затвори"><span></span><span></span><span></span></button></div>' +
      '<a href="index.html" class="plain-link">' + I18N.t('nav.home') + '</a>' +
      '<a href="plans.html" class="plain-link">' + I18N.t('nav.plans') + '</a>' +
      '<a href="trainers.html" class="plain-link">' + I18N.t('nav.trainers') + '</a>' +
      '<a href="about.html" class="plain-link">' + I18N.t('nav.about') + '</a>' +
      '<a href="contact.html" class="plain-link">' + I18N.t('nav.contact') + '</a>' +
      accountLinks +
      langToggleMarkup(true) +
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
      '<div class="footer-contact">' + phoneLink() + instagramLink() + emailLink() + '</div></div>' +
      '<div><h4>' + I18N.t('footer.hoursTitle') + '</h4>' + hoursHtml + '</div>' +
      '<div><h4>' + I18N.t('footer.linksTitle') + '</h4>' +
      '<a href="plans.html">' + I18N.t('footer.linkPlans') + '</a>' +
      '<a href="schedule.html">' + I18N.t('footer.linkSchedule') + '</a>' +
      '<a href="contact.html">' + I18N.t('footer.linkContact') + '</a>' +
      '<a href="admin.html">' + I18N.t('footer.linkAdmin') + '</a></div>' +
      '</div>' +
      '<div class="footer-bottom"><span>© <span id="ftYear"></span> Arena Fitness Prilep</span><span>' + I18N.t('footer.disclaimer') + '</span></div>' +
      '</div>' +
      '</footer>'
    );
  }

  function wireEvents() {
    var hb = document.getElementById('hamburgerBtn');
    var mmClose = document.getElementById('mmCloseBtn');
    var mmBackdrop = document.getElementById('mmBackdrop');
    var mmLogout = document.getElementById('mmLogoutBtn');
    var langBtn = document.getElementById('langToggle');
    var mmLangBtn = document.getElementById('mmLangToggle');
    if (hb) hb.addEventListener('click', function () { document.body.classList.add('menu-open'); });
    if (mmClose) mmClose.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    if (mmBackdrop) mmBackdrop.addEventListener('click', function () { document.body.classList.remove('menu-open'); });
    if (mmLogout) mmLogout.addEventListener('click', logout);
    if (langBtn) langBtn.addEventListener('click', function () { I18N.toggle(); });
    if (mmLangBtn) mmLangBtn.addEventListener('click', function () { I18N.toggle(); });
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

  // Header/footer text (nav labels, footer labels) is baked into the markup
  // strings above rather than marked with data-i18n, so a language switch
  // needs an explicit re-render here; I18N.apply() alone only touches
  // data-i18n elements elsewhere on the page.
  if (typeof I18N !== 'undefined') {
    I18N.onChange(function () { render(); });
  }

  return {
    infoReady: infoReady,
    authReady: authReady,
    get auth() { return auth; },
    get info() { return info; },
    logout: logout,
    esc: esc,
    phoneLink: phoneLink,
    instagramLink: instagramLink,
    emailLink: emailLink,
  };
})();

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
  // Phone: a single bold classic-handset silhouette, filled with currentColor
  // so it inherits the theme-aware ink/lime color set in style.css (rather
  // than a hardcoded fill that can end up low-contrast in either theme).
  // Wrapped in a "receiver" group purely so CSS can animate it on hover
  // (see .icon-link.phone .receiver in style.css).
  function phoneIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="receiver">' +
      '<path d="M6.6 3.6c.5-.3 1.1-.2 1.5.2l1.9 1.9c.4.4.5 1 .2 1.5l-.9 1.5c-.2.4-.2.9.1 1.3.9 1.1 2 2.2 3.1 3.1.4.3.9.3 1.3.1l1.5-.9c.5-.3 1.1-.2 1.5.2l1.9 1.9c.4.4.5 1.1.1 1.6-.6.8-1.5 1.5-2.5 1.6-1.8.2-4.5-.5-7.5-3.5s-3.7-5.7-3.5-7.5c.1-1 .8-1.9 1.6-2.5.1 0 .1-.1.2-.1z" fill="currentColor"/>' +
      '</g>' +
      '</svg>'
    );
  }

  // A generic "camera in a rounded square" glyph evoking Instagram without
  // reproducing the trademarked logo artwork. The badge that wraps this
  // (.social-badge) has no fill of its own — it sits flush on the footer's
  // own dark background — so the glyph itself carries the Instagram brand
  // gradient (via an inline <linearGradient>, unique id per instance so two
  // badges can appear on the same page, e.g. footer + contact.html card).
  var _igGradSeq = 0;
  function instagramIconSvg() {
    var gid = 'igGrad' + (_igGradSeq++);
    return (
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<defs><linearGradient id="' + gid + '" x1="2" y1="21" x2="21" y2="2" gradientUnits="userSpaceOnUse">' +
      '<stop offset="0" stop-color="#feda75"/>' +
      '<stop offset="0.3" stop-color="#fa7e1e"/>' +
      '<stop offset="0.55" stop-color="#d62976"/>' +
      '<stop offset="0.78" stop-color="#962fbf"/>' +
      '<stop offset="1" stop-color="#4f5bd5"/>' +
      '</linearGradient></defs>' +
      '<rect x="2.6" y="2.6" width="18.8" height="18.8" rx="6" stroke="url(#' + gid + ')" stroke-width="2"/>' +
      '<circle cx="12" cy="12" r="5" stroke="url(#' + gid + ')" stroke-width="2"/>' +
      '<circle cx="17.1" cy="6.9" r="1.35" fill="url(#' + gid + ')"/>' +
      '</svg>'
    );
  }

  function mailIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="3.5" y="5.5" width="17" height="13" rx="2.5" stroke="currentColor" stroke-width="1.6"/>' +
      '<path d="M4.5 7l7.5 6 7.5-6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>'
    );
  }

  // Solid map-pin marker. The punched-out center dot is a literal hex fill
  // (matching --bg) rather than currentColor/var() — safe now that the site
  // is a single fixed dark theme, so that exact background color never changes.
  function pinIconSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 6.72 11.23 7.55 11.94a.68.68 0 0 0 .9 0C13.28 21.23 20 15.25 20 10c0-4.42-3.58-8-8-8z" fill="currentColor"/>' +
      '<circle cx="12" cy="10" r="2.7" fill="#0c0f0a"/>' +
      '</svg>'
    );
  }

  // Ring-style rows: a lime-outlined circle icon beside a small uppercase
  // label and a bold value line — used in the footer's "Контакт" block and
  // on the contact page's info card.
  function iconRow(cls, iconSvg, label, value, href, external) {
    var attrs = 'class="icon-link ' + cls + '"';
    var tag = href ? 'a' : 'div';
    if (href) attrs += ' href="' + esc(href) + '"' + (external ? ' target="_blank" rel="noopener"' : '');
    return (
      '<' + tag + ' ' + attrs + '>' +
      '<span class="icon-ring">' + iconSvg + '</span>' +
      '<span class="text"><span class="label">' + esc(label) + '</span><span class="value">' + esc(value) + '</span></span>' +
      '</' + tag + '>'
    );
  }

  function addressLink() {
    var mapsUrl = info.mapsUrl || ('https://www.google.com/maps?q=' + (info.lat || 41.3439648) + ',' + (info.lng || 21.5517821));
    return iconRow('address', pinIconSvg(), I18N.t('common.addressLabel'), info.address, mapsUrl, true);
  }

  function phoneLink() {
    return iconRow('phone', phoneIconSvg(), I18N.t('common.phoneLabel'), info.phone, 'tel:' + info.phone.replace(/\s/g, ''), false);
  }

  function emailLink() {
    return iconRow('email', mailIconSvg(), I18N.t('common.emailLabel'), info.email, 'mailto:' + info.email, false);
  }

  // Compact icon-only badge for a "follow us" row (footer + contact page) —
  // distinct from the label+value rows above, matching how a gym's own site
  // typically separates contact details from social links.
  function instagramBadge() {
    return (
      '<a href="' + esc(info.instagram) + '" target="_blank" rel="noopener" class="social-badge" aria-label="Instagram">' +
      instagramIconSvg() +
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
      var active = path === href.split('#')[0] ? ' active' : '';
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
      navLink('contact.html#contactFormSection', I18N.t('nav.contact')) +
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
      '<a href="contact.html#contactFormSection" class="plain-link">' + I18N.t('nav.contact') + '</a>' +
      accountLinks +
      langToggleMarkup(true) +
      '</div>' +
      '</div>'
    );
  }

  function footerMapMarkup() {
    var lat = info.lat || 41.3439648;
    var lng = info.lng || 21.5517821;
    var mapsUrl = info.mapsUrl || ('https://www.google.com/maps?q=' + lat + ',' + lng);
    var src = 'https://www.google.com/maps?q=' + lat + ',' + lng + '&z=15&output=embed';
    return (
      '<div class="footer-map">' +
      '<iframe src="' + src + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Arena Fitness Prilep — локација"></iframe>' +
      '<a class="footer-map-link" href="' + esc(mapsUrl) + '" target="_blank" rel="noopener">' +
      '<span>' + esc(info.address) + '</span><span>↗</span>' +
      '</a>' +
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
      '<div>' +
      '<div class="footer-brand-name">ARENA <span style="color:var(--lime)">FITNESS</span></div>' +
      '<h4 style="margin-top:18px;">' + I18N.t('footer.contactTitle') + '</h4>' +
      '<div class="footer-contact">' + addressLink() + phoneLink() + emailLink() + '</div>' +
      '<div class="social-row"><span class="social-label">' + I18N.t('common.followUs') + '</span>' + instagramBadge() + '</div>' +
      '</div>' +
      '<div><h4>' + I18N.t('footer.hoursTitle') + '</h4>' + hoursHtml + '</div>' +
      '<div><h4>' + I18N.t('footer.linksTitle') + '</h4>' +
      '<a href="plans.html">' + I18N.t('footer.linkPlans') + '</a>' +
      '<a href="schedule.html">' + I18N.t('footer.linkSchedule') + '</a>' +
      '<a href="contact.html#contactFormSection">' + I18N.t('footer.linkContact') + '</a>' +
      '<a href="admin.html">' + I18N.t('footer.linkAdmin') + '</a></div>' +
      '<div><h4>' + I18N.t('footer.locationTitle') + '</h4>' + footerMapMarkup() + '</div>' +
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

  // Shared read-more modal — used by index.html (food/supplements/
  // transformations post cards) and trainers.html (trainer bio cards) so
  // those cards can be "opened" for a longer read instead of only showing
  // the short teaser text on the card itself.
  function ensureModalEl() {
    var el = document.getElementById('arenaModal');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'arenaModal';
    el.className = 'modal-overlay';
    el.innerHTML =
      '<div class="modal-box" role="dialog" aria-modal="true">' +
      '<button class="modal-close" type="button" aria-label="Затвори">&times;</button>' +
      '<div class="modal-eyebrow" id="arenaModalEyebrow"></div>' +
      '<h3 class="modal-title" id="arenaModalTitle"></h3>' +
      '<div class="modal-body" id="arenaModalBody"></div>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { if (e.target === el) closeModal(); });
    el.querySelector('.modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
    return el;
  }

  function openModal(eyebrow, title, bodyHtml) {
    var el = ensureModalEl();
    document.getElementById('arenaModalEyebrow').textContent = eyebrow || '';
    document.getElementById('arenaModalTitle').textContent = title || '';
    document.getElementById('arenaModalBody').innerHTML = bodyHtml || '';
    el.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeModal() {
    var el = document.getElementById('arenaModal');
    if (el) el.classList.remove('open');
    document.body.classList.remove('modal-open');
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
    addressLink: addressLink,
    phoneLink: phoneLink,
    emailLink: emailLink,
    instagramBadge: instagramBadge,
    openModal: openModal,
    closeModal: closeModal,
  };
})();

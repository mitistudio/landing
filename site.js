// Shared nav, footer language toggle and cookie consent for all pages. Plain JS, no build step.
(function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  window.__mitiLoadGA = function () {
    if (window.__mitiGALoaded) return;
    window.__mitiGALoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-G38949QMGW';
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', 'G-G38949QMGW');
  };
  if (localStorage.getItem('miti-consent') === 'granted') window.__mitiLoadGA();

  var NAV = {
    en: { services: 'What we do', contact: 'Write to us' },
    de: { services: 'Was wir tun', contact: 'Schreiben Sie uns' },
  };
  var CONSENT = {
    en: { text: 'We use Google Analytics to see which pages people read, so we can improve them.', linkLabel: 'Read more', accept: 'Accept', decline: 'Decline' },
    de: { text: 'Wir nutzen Google Analytics, um zu sehen, welche Seiten gelesen werden, damit wir sie verbessern können.', linkLabel: 'Mehr erfahren', accept: 'Akzeptieren', decline: 'Ablehnen' },
  };

  function getLang() { return localStorage.getItem('miti-lang') || 'en'; }

  function renderNav(current) {
    var lang = getLang();
    document.documentElement.lang = lang;
    var n = NAV[lang];
    var menu = document.getElementById('nav-menu');
    if (!menu) return;
    menu.innerHTML =
      '<a href="services.html" style="display:block; padding:16px 24px; font-family:var(--font-heading); font-weight:600; font-size:16px; text-decoration:none; white-space:nowrap; text-align:right; color:' + (current === 'services' ? 'var(--color-accent)' : 'var(--color-text)') + ';">' + n.services + '</a>' +
      '<a href="contact.html" style="display:block; padding:16px 24px; font-family:var(--font-heading); font-weight:600; font-size:16px; text-decoration:none; white-space:nowrap; text-align:right; color:' + (current === 'contact' ? 'var(--color-accent)' : 'var(--color-text)') + '; border-top:2px solid var(--color-divider);">' + n.contact + '</a>';
  }

  function initNav(current) {
    renderNav(current);
    var btn = document.getElementById('hamburger-btn');
    var menu = document.getElementById('nav-menu');
    var overlay = document.getElementById('nav-overlay');
    var iconOpen = document.getElementById('icon-open');
    var iconClosed = document.getElementById('icon-closed');
    function setOpen(open) {
      menu.style.display = open ? 'block' : 'none';
      overlay.style.display = open ? 'block' : 'none';
      btn.setAttribute('aria-expanded', String(open));
      iconOpen.style.display = open ? 'block' : 'none';
      iconClosed.style.display = open ? 'none' : 'block';
    }
    btn.addEventListener('click', function () { setOpen(menu.style.display !== 'block'); });
    overlay.addEventListener('click', function () { setOpen(false); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
  }

  function renderCookieBanner() {
    var lang = getLang();
    var c = CONSENT[lang];
    var text = document.getElementById('cookie-text');
    var accept = document.getElementById('cookie-accept');
    var decline = document.getElementById('cookie-decline');
    if (!text) return;
    text.innerHTML = c.text + ' <a href="legal.html#analytics" style="color:var(--color-accent); text-decoration:underline;">' + c.linkLabel + '</a>';
    accept.textContent = c.accept;
    decline.textContent = c.decline;
  }

  function initCookieConsent() {
    renderCookieBanner();
    var banner = document.getElementById('cookie-banner');
    var tab = document.getElementById('cookie-settings-tab');
    var accept = document.getElementById('cookie-accept');
    var decline = document.getElementById('cookie-decline');
    function showBanner(show) {
      banner.style.display = show ? 'block' : 'none';
      tab.style.display = show ? 'none' : 'flex';
    }
    var choice = localStorage.getItem('miti-consent');
    showBanner(!choice);
    accept.addEventListener('click', function () {
      localStorage.setItem('miti-consent', 'granted');
      window.__mitiLoadGA();
      showBanner(false);
    });
    decline.addEventListener('click', function () {
      localStorage.setItem('miti-consent', 'denied');
      showBanner(false);
    });
    tab.addEventListener('click', function () { showBanner(true); });
  }

  function initLangToggle(onLangChange) {
    var lang = getLang();
    var enBtn = document.getElementById('lang-en');
    var deBtn = document.getElementById('lang-de');
    function paint() {
      var active = getLang();
      [enBtn, deBtn].forEach(function (btn, i) {
        var isActive = (i === 0 ? 'en' : 'de') === active;
        btn.style.fontWeight = isActive ? '600' : '500';
        btn.style.color = isActive ? 'var(--color-text)' : 'color-mix(in srgb, var(--color-text) 65%, transparent)';
        btn.style.textDecorationLine = isActive ? 'underline' : 'none';
      });
    }
    function setLang(l) {
      localStorage.setItem('miti-lang', l);
      paint();
      renderNav(window.__mitiCurrentPage);
      renderCookieBanner();
      onLangChange(l);
    }
    enBtn.addEventListener('click', function () { setLang('en'); });
    deBtn.addEventListener('click', function () { setLang('de'); });
    paint();
  }

  window.miti = { getLang: getLang, initNav: initNav, initCookieConsent: initCookieConsent, initLangToggle: initLangToggle };
})();

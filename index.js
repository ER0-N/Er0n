// index.js — Eron portfolio scripts
// Wrapped in DOMContentLoaded so it works whether it's loaded in <head> or at the end of <body>.
document.addEventListener('DOMContentLoaded', function () {

  // ---- theme toggle (light / dark) ----
  var root = document.documentElement,
      btn  = document.getElementById('themeBtn'),
      sun  = document.getElementById('sun'),
      moon = document.getElementById('moon');

  function sysDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
  }

  function apply(mode) {
    if (mode === 'dark')      { root.setAttribute('data-theme', 'dark'); }
    else if (mode === 'light'){ root.setAttribute('data-theme', 'light'); }
    var dark = mode === 'dark' || (mode !== 'light' && sysDark());
    if (sun)  sun.hidden  = dark;
    if (moon) moon.hidden = !dark;
  }

  var saved = null;
  try { saved = localStorage.getItem('eron-theme'); } catch (e) {}
  apply(saved || (sysDark() ? 'dark' : 'light'));

  if (btn) {
    btn.addEventListener('click', function () {
      var isDark = moon && moon.hidden === false;
      var next = isDark ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem('eron-theme', next); } catch (e) {}
    });
  }

  // ---- discord: click to copy username ----
  var dBtn = document.getElementById('discordBtn'),
      dLbl = document.getElementById('discordLabel');
  if (dBtn) {
    dBtn.addEventListener('click', function () {
      var name = '0baw';
      function ok() {
        if (!dLbl) return;
        var o = dLbl.textContent;
        dLbl.textContent = 'Copied!';
        setTimeout(function () { dLbl.textContent = o; }, 1300);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(name).then(ok).catch(ok);
      } else {
        ok();
      }
    });
  }

  // ---- reveal elements on scroll ----
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  // ---- TABS (click a nav item to switch section) ----
  var panels = Array.prototype.slice.call(document.querySelectorAll('.tab-panel'));
  if (panels.length) {
    function activate(id) {
      var found = false;
      panels.forEach(function (p) {
        var on = p.id === id;
        p.classList.toggle('active', on);
        if (on) found = true;
      });
      if (!found) return;
      document.querySelectorAll('.links .tablink').forEach(function (l) {
        l.classList.toggle('on', l.getAttribute('data-tab') === id);
      });
      var panel = document.getElementById(id);
      if (panel) panel.querySelectorAll('.reveal').forEach(function (e) { e.classList.add('in'); });
      window.scrollTo(0, 0);
    }
    document.querySelectorAll('[data-tab]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        activate(el.getAttribute('data-tab'));
      });
    });
    activate('home');
  }

});

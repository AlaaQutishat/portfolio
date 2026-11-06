/**
 * Standalone Project Detail Page Controller
 * Uses ProjectDetail.renderProjectDetail from project-detail.js
 */
(function () {
  'use strict';

  const STORAGE_THEME = 'aq-portfolio-theme';
  const STORAGE_LANG = 'aq-portfolio-lang';

  let currentLang = localStorage.getItem(STORAGE_LANG) || 'en';
  let currentTheme = localStorage.getItem(STORAGE_THEME) || 'dark';

  window.currentLang = currentLang;

  const projectRoot = document.getElementById('projectPageRoot');
  const langToggle = document.getElementById('langToggle');
  const langCurrent = document.getElementById('langCurrent');
  const themeToggle = document.getElementById('themeToggle');
  const themeCurrent = document.getElementById('themeCurrent');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const shotLightbox = document.getElementById('shotLightbox');
  const shotLightboxImg = document.getElementById('shotLightboxImg');
  const shotLightboxCaption = document.getElementById('shotLightboxCaption');

  function getTranslation(key) {
    if (typeof ProjectDetail !== 'undefined') {
      return ProjectDetail.getTranslation(key, currentLang);
    }
    return key;
  }

  function getProjectMeta() {
    const slug = document.body.getAttribute('data-project-slug') || '';
    const key = document.body.getAttribute('data-project-key') || 'zain';
    if (window.projectRoutes?.bySlug?.[slug]) {
      return window.projectRoutes.bySlug[slug];
    }
    if (window.projectRoutes?.byId?.[key]) {
      return window.projectRoutes.byId[key];
    }
    return { id: key, slug: slug, index: '01' };
  }

  function renderPage() {
    const meta = getProjectMeta();
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', currentLang === 'ar');
    document.body.classList.toggle('lang-ar', currentLang === 'ar');

    if (langCurrent) langCurrent.textContent = currentLang === 'en' ? 'EN' : 'AR';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const k = el.getAttribute('data-i18n');
      const v = getTranslation(k);
      if (v && v !== k) el.textContent = v;
    });

    if (projectRoot && typeof ProjectDetail !== 'undefined') {
      ProjectDetail.renderProjectDetail(projectRoot, meta.id, meta, currentLang);
      const name = getTranslation('projects.' + meta.id + '.name');
      if (name) {
        document.title = name + ' | Alaa Qutishat';
      }
    }
  }

  function updateThemeUI() {
    document.body.classList.toggle('theme-light', currentTheme === 'light');
    if (themeIconSun && themeIconMoon) {
      themeIconSun.classList.toggle('active', currentTheme === 'dark');
      themeIconMoon.classList.toggle('active', currentTheme === 'light');
    }
    if (themeCurrent) {
      themeCurrent.textContent = currentTheme === 'light' ? getTranslation('themeLight') : getTranslation('themeDark');
    }
  }

  function openLightbox(src, alt, caption) {
    if (!shotLightbox || !shotLightboxImg) return;
    shotLightboxImg.src = src;
    shotLightboxImg.alt = alt || '';
    if (shotLightboxCaption) {
      shotLightboxCaption.textContent = caption || alt || '';
      shotLightboxCaption.hidden = !(caption || alt);
    }
    shotLightbox.hidden = false;
    shotLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('shot-lightbox-open');
  }

  function closeLightbox() {
    if (!shotLightbox || shotLightbox.hidden) return;
    shotLightbox.hidden = true;
    shotLightbox.setAttribute('aria-hidden', 'true');
    if (shotLightboxImg) shotLightboxImg.src = '';
    document.body.classList.remove('shot-lightbox-open');
  }

  document.addEventListener('click', (e) => {
    const zoomBtn = e.target.closest('.project-shot__zoom');
    if (zoomBtn) {
      const img = zoomBtn.querySelector('img');
      const fig = zoomBtn.closest('.project-shot');
      const capEl = fig ? fig.querySelector('.project-shot__caption') : null;
      if (img) {
        openLightbox(img.src, img.alt, capEl ? capEl.textContent.trim() : img.alt);
      }
      return;
    }
    if (e.target.closest('[data-close-shot-lightbox]')) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'ar' : 'en';
      window.currentLang = currentLang;
      localStorage.setItem(STORAGE_LANG, currentLang);
      renderPage();
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_THEME, currentTheme);
      updateThemeUI();
    });
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  updateThemeUI();
  renderPage();
})();

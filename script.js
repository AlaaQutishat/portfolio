/**
 * Alaa Qutishat — Portfolio Interactive & Animation Engine
 * Includes:
 * 1. Interactive Cyber-Neural Canvas Constellation (#neuralCanvas)
 * 2. 3D Tilting Mobile Device Stage & Live App Switcher (#heroShowcase)
 * 3. Bilingual Role Typewriter (#heroTypewriter) & Animated Counters (.counter-num)
 * 4. Interactive Project Domain Filter (.project-filter-btn)
 * 5. Mouse-Tracking Card Spotlight (.spotlight-card), Magnetic Buttons & Scroll Progress Bar
 * 6. In-Page Case Study Overlay & Full-Screen Screenshot Lightbox
 */
(function () {
  'use strict';

  const STORAGE_THEME = 'aq-portfolio-theme';
  const STORAGE_LANG = 'aq-portfolio-lang';
  const DEFAULT_THEME = 'dark';
  const DEFAULT_LANG = 'en';

  let currentLang = localStorage.getItem(STORAGE_LANG) || DEFAULT_LANG;
  let currentTheme = localStorage.getItem(STORAGE_THEME) || DEFAULT_THEME;
  let activeProjectId = null;

  window.currentLang = currentLang;

  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-menu > li > a');
  const contactForm = document.getElementById('contactForm');
  const themeCurrent = document.getElementById('themeCurrent');
  const langCurrent = document.getElementById('langCurrent');
  const langToggle = document.getElementById('langToggle');
  const themeToggle = document.getElementById('themeToggle');
  const themeIconSun = document.getElementById('themeIconSun');
  const themeIconMoon = document.getElementById('themeIconMoon');
  const scrollProgress = document.getElementById('scrollProgress');

  // Case Study Overlay & Lightbox Elements
  const projectOverlay = document.getElementById('projectOverlay');
  const projectOverlayBody = document.getElementById('projectOverlayBody');
  const shotLightbox = document.getElementById('shotLightbox');
  const shotLightboxImg = document.getElementById('shotLightboxImg');
  const shotLightboxCaption = document.getElementById('shotLightboxCaption');

  // Hero Interactive Phone Showcase Data
  const HERO_SHOWCASE_ITEMS = [
    {
      projectId: 'zain',
      img: 'assets/projects/zain/screen_02_pos_home_dashboard.png',
      tagEn: '01 · TELECOM & BIOMETRIC eKYC',
      tagAr: '01 · الاتصالات والتحقق البيومتري',
      titleEn: 'Zain Jordan SIM Swap POS',
      titleAr: 'نظام زين الأردن للتحقق والشرائح'
    },
    {
      projectId: 'jopetrol',
      img: 'assets/projects/jopetrol/jopetrol_screen_14_loyalty_home_qr_barcode.png',
      tagEn: '02 · OIL & GAS · DIGITAL WALLET',
      tagAr: '02 · الطاقة والمحفظة الرقمية',
      titleEn: 'JoPetrol Mobility & Loyalty',
      titleAr: 'تطبيق جو بترول للمحطات والولاء'
    },
    {
      projectId: 'orbex',
      img: 'assets/projects/orbex/orbex_screen_05_home_live_dashboard.png',
      tagEn: '04 · REGULATED FINTECH BROKERAGE',
      tagAr: '04 · التكنولوجيا المالية والتداول',
      titleEn: 'Orbex Multi-Currency Portal',
      titleAr: 'منصة أوربكس للتداول والمحافظ'
    },
    {
      projectId: 'edusphere',
      img: 'assets/projects/edusphere/edusphere_screen_04_student_home_dashboard.png',
      tagEn: '05 · EDTECH · 3-APP ECOSYSTEM',
      tagAr: '05 · منظومة تعليمية من 3 تطبيقات',
      titleEn: 'Edusphere Academic Suite',
      titleAr: 'منظومة إديوسفير التعليمية'
    },
    {
      projectId: 'eihal',
      img: 'assets/projects/eihal/eihal_screen_09_home_dashboard.png',
      tagEn: '06 · HEALTHTECH · TELE-DENTISTRY',
      tagAr: '06 · الرعاية الصحية الرقمية',
      titleEn: 'EIHAL Dental Referral Network',
      titleAr: 'منصة إيهال لطب الأسنان'
    },
    {
      projectId: 'wateen',
      img: 'assets/projects/wateen/wateen_screen_08_home_dashboard.png',
      tagEn: '07 · HEALTHTECH · FAMILY EHR',
      tagAr: '07 · السجل الطبي العائلي وحجز العيادات',
      titleEn: 'Wateen Healthcare & Family EHR',
      titleAr: 'منصة وتين للرعاية الصحية'
    },
    {
      projectId: 'osaka',
      img: 'assets/projects/osaka/osaka_screen_08_home_categories_catalog.png',
      tagEn: '08 · B2B/B2C FMCG E-COMMERCE',
      tagAr: '08 · التجارة الإلكترونية والجملة B2B/B2C',
      titleEn: 'Uncle Osaka B2B/B2C Grocery',
      titleAr: 'تطبيق أنكل أوساكا للتسوق والجملة'
    }
  ];

  let currentShowcaseIdx = 0;
  let showcaseInterval = null;

  function getTranslation(key) {
    if (typeof ProjectDetail !== 'undefined') {
      return ProjectDetail.getTranslation(key, currentLang);
    }
    return key;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      const value = getTranslation(key);
      if (value && value !== key) el.textContent = value;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      const value = getTranslation(key);
      if (value) el.placeholder = value;
    });
    updateHeroShowcaseSlide(currentShowcaseIdx, false);
    if (activeProjectId && projectOverlay && !projectOverlay.hidden) {
      const routeMeta = window.projectRoutes?.byId?.[activeProjectId];
      ProjectDetail.renderProjectDetail(projectOverlayBody, activeProjectId, routeMeta, currentLang);
    }
  }

  function setLanguage(lang) {
    currentLang = lang;
    window.currentLang = lang;
    localStorage.setItem(STORAGE_LANG, lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.body.classList.toggle('rtl', lang === 'ar');
    document.body.classList.toggle('lang-ar', lang === 'ar');
    if (langCurrent) langCurrent.textContent = lang === 'en' ? 'EN' : 'AR';
    applyTranslations();
    updateThemeIcon();
  }

  function setTheme(theme) {
    currentTheme = theme;
    localStorage.setItem(STORAGE_THEME, theme);
    document.body.classList.toggle('theme-light', theme === 'light');
    updateThemeIcon();
  }

  function updateThemeIcon() {
    if (themeIconSun && themeIconMoon) {
      themeIconSun.classList.toggle('active', currentTheme === 'dark');
      themeIconMoon.classList.toggle('active', currentTheme === 'light');
    }
    if (themeCurrent) {
      themeCurrent.textContent = currentTheme === 'light' ? getTranslation('themeLight') : getTranslation('themeDark');
    }
  }

  function handleNavbarScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 40);
    }
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
      scrollProgress.style.width = pct + '%';
    }
  }

  function toggleMobileMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    const open = navMenu.classList.contains('active');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeMobileMenu() {
    if (!navMenu || !navToggle) return;
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    if (!projectOverlay || projectOverlay.hidden) {
      document.body.style.overflow = '';
    }
  }

  function openProjectOverlay(projectId, pushHash = true) {
    if (!projectOverlay || !projectOverlayBody || typeof ProjectDetail === 'undefined') return;
    const routeMeta = window.projectRoutes?.byId?.[projectId];
    if (!routeMeta) return;

    activeProjectId = projectId;
    ProjectDetail.renderProjectDetail(projectOverlayBody, projectId, routeMeta, currentLang);
    projectOverlay.hidden = false;
    projectOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('project-overlay-open');

    const scroller = projectOverlay.querySelector('.project-overlay__scroller');
    if (scroller) scroller.scrollTop = 0;

    if (pushHash && routeMeta.slug) {
      history.pushState({ projectId }, '', '#project=' + routeMeta.slug);
    }
  }

  function closeProjectOverlay(updateHistory = true) {
    if (!projectOverlay || projectOverlay.hidden) return;
    projectOverlay.hidden = true;
    projectOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('project-overlay-open');
    activeProjectId = null;

    if (updateHistory && window.location.hash.startsWith('#project=')) {
      history.pushState(null, '', '#projects');
    }
  }

  function openShotLightbox(src, altText) {
    if (!shotLightbox || !shotLightboxImg) return;
    shotLightboxImg.src = src;
    shotLightboxImg.alt = altText || '';
    if (shotLightboxCaption) {
      shotLightboxCaption.textContent = altText || '';
    }
    shotLightbox.hidden = false;
    shotLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('shot-lightbox-open');
  }

  function closeShotLightbox() {
    if (!shotLightbox || shotLightbox.hidden) return;
    shotLightbox.hidden = true;
    shotLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('shot-lightbox-open');
    if (shotLightboxImg) {
      shotLightboxImg.removeAttribute('src');
    }
  }

  function handleHashRouting() {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#project=')) {
      const slug = hash.replace('#project=', '').trim();
      const routeMeta = window.projectRoutes?.bySlug?.[slug];
      if (routeMeta) {
        openProjectOverlay(routeMeta.id, false);
        return;
      }
    }
    if (projectOverlay && !projectOverlay.hidden) {
      closeProjectOverlay(false);
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const message = document.getElementById('message')?.value || '';
    const mailtoLink = `mailto:alaaqutishat98@gmail.com?subject=Portfolio Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0A---%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
    window.location.href = mailtoLink;
    contactForm.reset();
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /* ==========================================================================
     1. Hero 3D Interactive Mobile Showcase & Switcher
     ========================================================================== */
  function updateHeroShowcaseSlide(idx, animateTransition = true) {
    const item = HERO_SHOWCASE_ITEMS[idx];
    if (!item) return;
    currentShowcaseIdx = idx;

    const imgEl = document.getElementById('heroShowcaseImg');
    const tagEl = document.getElementById('heroShowcaseTag');
    const titleEl = document.getElementById('heroShowcaseTitle');
    const barEl = document.getElementById('heroShowcaseBar');

    if (imgEl) {
      if (animateTransition) {
        imgEl.style.opacity = '0.25';
        imgEl.style.transform = 'scale(1.04)';
        setTimeout(() => {
          imgEl.src = item.img;
          imgEl.alt = currentLang === 'ar' ? item.titleAr : item.titleEn;
          imgEl.style.opacity = '1';
          imgEl.style.transform = 'scale(1)';
        }, 140);
      } else {
        imgEl.src = item.img;
        imgEl.alt = currentLang === 'ar' ? item.titleAr : item.titleEn;
      }
    }
    if (tagEl) tagEl.textContent = currentLang === 'ar' ? item.tagAr : item.tagEn;
    if (titleEl) titleEl.textContent = currentLang === 'ar' ? item.titleAr : item.titleEn;

    if (barEl) {
      barEl.style.animation = 'none';
      void barEl.offsetWidth;
      barEl.style.animation = 'showcaseTimer 4.2s linear infinite';
    }

    document.querySelectorAll('.hero-showcase-tab').forEach((btn) => {
      const bIdx = Number(btn.getAttribute('data-showcase-idx'));
      const isActive = bIdx === idx;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function initHeroShowcase() {
    const showcaseWrap = document.getElementById('heroShowcase');
    const phoneTilt = document.getElementById('heroPhoneTilt');
    const phoneScreen = document.querySelector('.hero-phone-screen');

    document.querySelectorAll('.hero-showcase-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = Number(btn.getAttribute('data-showcase-idx'));
        updateHeroShowcaseSlide(idx, true);
        resetShowcaseTimer();
      });
    });

    if (phoneScreen) {
      phoneScreen.style.cursor = 'pointer';
      phoneScreen.addEventListener('click', () => {
        const item = HERO_SHOWCASE_ITEMS[currentShowcaseIdx];
        if (item && item.projectId) {
          openProjectOverlay(item.projectId, true);
        }
      });
    }

    function resetShowcaseTimer() {
      if (showcaseInterval) clearInterval(showcaseInterval);
      if (!prefersReducedMotion()) {
        showcaseInterval = setInterval(() => {
          const next = (currentShowcaseIdx + 1) % HERO_SHOWCASE_ITEMS.length;
          updateHeroShowcaseSlide(next, true);
        }, 4200);
      }
    }

    resetShowcaseTimer();

    if (showcaseWrap && phoneTilt && !prefersReducedMotion()) {
      showcaseWrap.addEventListener('mousemove', (e) => {
        const rect = showcaseWrap.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        phoneTilt.style.animation = 'none';
        phoneTilt.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 18}deg) translateZ(10px)`;
      });
      showcaseWrap.addEventListener('mouseleave', () => {
        phoneTilt.style.transform = '';
        phoneTilt.style.animation = 'phoneFloat 6s ease-in-out infinite alternate';
      });
    }
  }

  /* ==========================================================================
     2. Bilingual Role Typewriter (#heroTypewriter)
     ========================================================================== */
  function initTypewriter() {
    const el = document.getElementById('heroTypewriter');
    if (!el || prefersReducedMotion()) return;

    const phrasesEn = [
      'Enterprise Flutter & Clean Architecture',
      'M.Sc. in Artificial Intelligence (YOLO–GhostNet)',
      'Biometric eKYC, NFC & FinTech Wallets',
      'Synchronized Multi-App Mobile Ecosystems'
    ];
    const phrasesAr = [
      'هندسة تطبيقات Flutter والـ Clean Architecture',
      'ماجستير في الذكاء الاصطناعي (YOLO–GhostNet)',
      'أنظمة التحقق البيومتري eKYC والمحافظ المالية',
      'بناء منظومات الهواتف الذكية واسعة النطاق'
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function tick() {
      const list = currentLang === 'ar' ? phrasesAr : phrasesEn;
      const fullText = list[phraseIdx % list.length];

      if (isDeleting) {
        charIdx = Math.max(0, charIdx - 1);
      } else {
        charIdx = Math.min(fullText.length, charIdx + 1);
      }

      el.textContent = fullText.slice(0, charIdx);

      let delay = isDeleting ? 28 : 52;
      if (!isDeleting && charIdx === fullText.length) {
        delay = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % list.length;
        delay = 360;
      }
      setTimeout(tick, delay);
    }

    setTimeout(tick, 1200);
  }

  /* ==========================================================================
     3. Animated Telemetry Counters (.counter-num)
     ========================================================================== */
  function initCounters() {
    const counters = document.querySelectorAll('.counter-num');
    if (!counters.length || prefersReducedMotion()) return;

    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1500;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = current.toFixed(decimals);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals);
        }
      }
      requestAnimationFrame(step);
    });
  }

  /* ==========================================================================
     4. Interactive Cyber-Neural Canvas Constellation (#neuralCanvas)
     ========================================================================== */
  function initNeuralCanvas() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let nodes = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width || window.innerWidth;
      height = canvas.height = rect.height || 800;
      const count = Math.min(48, Math.max(22, Math.floor((width * height) / 26000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        r: Math.random() * 1.8 + 1.1,
        indigo: Math.random() > 0.65
      }));
    }

    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = n.indigo ? 'rgba(129, 140, 248, 0.65)' : 'rgba(56, 189, 248, 0.7)';
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 145) {
            const alpha = (1 - dist / 145) * 0.22;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        const mdx = n.x - mouse.x;
        const mdy = n.y - mouse.y;
        const mdist = Math.hypot(mdx, mdy);
        if (mdist < 180) {
          const mAlpha = (1 - mdist / 180) * 0.38;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(129, 140, 248, ${mAlpha})`;
          ctx.lineWidth = 1.1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }

  /* ==========================================================================
     5. Interactive Project Domain Filter (.project-filter-btn)
     ========================================================================== */
  function initProjectFilters() {
    const buttons = document.querySelectorAll('.project-filter-btn');
    const cards = document.querySelectorAll('.project-card[data-category]');
    if (!buttons.length || !cards.length) return;

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });

        cards.forEach((card, idx) => {
          const cats = (card.getAttribute('data-category') || '').split(/\s+/);
          const match = filter === 'all' || cats.includes(filter);
          if (match) {
            card.classList.remove('is-filtered-out');
            card.style.opacity = '0';
            card.style.transform = 'translateY(14px) scale(0.98)';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, idx * 45);
          } else {
            card.classList.add('is-filtered-out');
          }
        });
      });
    });
  }

  /* ==========================================================================
     6. Spotlight Cards (--mx, --my), Global Cursor Halo & Magnetic Buttons
     ========================================================================== */
  function initInteractiveEffects() {
    if (prefersReducedMotion()) return;

    window.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--cursor-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--cursor-y', e.clientY + 'px');
    });

    document.querySelectorAll('.spotlight-card').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', e.clientX - rect.left + 'px');
        card.style.setProperty('--my', e.clientY - rect.top + 'px');
      });
    });

    document.querySelectorAll('.btn-magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.16}px, ${y * 0.22}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ==========================================================================
     7. Scroll-Triggered Staggered Reveal Animations
     ========================================================================== */
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      '.about-content, .ai-thesis-card, .skill-card, .service-card, .project-card, .experience-card, .education-card, .languages-card, .tools-category-card, .contact-panel'
    );
    const sectionTitles = document.querySelectorAll('.section-title');

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      animatedElements.forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      sectionTitles.forEach((el) => el.classList.add('is-visible'));
      document.querySelectorAll('.section').forEach((s) => s.classList.add('is-visible'));
      return;
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '80px 0px 80px 0px' });

    document.querySelectorAll('.section').forEach((s) => sectionObserver.observe(s));

    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (idx % 3) * 55);
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.02, rootMargin: '100px 0px 100px 0px' });

    const vh = window.innerHeight || 900;
    animatedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh + 100) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        cardObserver.observe(el);
      }
    });
  }

  function init() {
    setTheme(currentTheme);
    setLanguage(currentLang);
    applyTranslations();

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    if (navToggle) {
      navToggle.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (projectOverlay && !projectOverlay.hidden) {
          closeProjectOverlay(false);
        }
        closeMobileMenu();
      });
    });

    if (langToggle) {
      langToggle.addEventListener('click', () => {
        setLanguage(currentLang === 'en' ? 'ar' : 'en');
        closeMobileMenu();
      });
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        closeMobileMenu();
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    document.addEventListener('click', (e) => {
      const openBtn = e.target.closest('.project-open-detail, .project-card-visual');
      if (openBtn) {
        const card = openBtn.closest('.project-card[data-project]');
        if (card) {
          e.preventDefault();
          const projId = card.getAttribute('data-project');
          openProjectOverlay(projId, true);
        }
      }

      const closeOverlayBtn = e.target.closest('[data-close-overlay]');
      if (closeOverlayBtn || e.target.classList.contains('project-overlay__backdrop')) {
        closeProjectOverlay(true);
      }

      const zoomBtn = e.target.closest('.project-shot__zoom');
      if (zoomBtn) {
        const img = zoomBtn.querySelector('.project-shot__img');
        if (img && img.src) {
          e.preventDefault();
          openShotLightbox(img.src, img.alt);
        }
      }

      if (
        e.target.closest('[data-close-lightbox]') ||
        e.target.classList.contains('shot-lightbox__backdrop')
      ) {
        closeShotLightbox();
      }

      const storeBtn = e.target.closest('.btn-store');
      if (storeBtn) {
        const href = storeBtn.getAttribute('href') || '';
        if (!href || href === '#' || href.startsWith('#project=')) {
          e.preventDefault();
          const card = storeBtn.closest('.project-card[data-project]');
          if (card) {
            openProjectOverlay(card.getAttribute('data-project'), true);
          }
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (shotLightbox && !shotLightbox.hidden) {
          closeShotLightbox();
        } else if (projectOverlay && !projectOverlay.hidden) {
          closeProjectOverlay(true);
        }
      }
    });

    window.addEventListener('popstate', handleHashRouting);
    handleHashRouting();

    // Wire published store links from window.projectRoutes onto homepage project cards if not already set in HTML
    document.querySelectorAll('.project-card[data-project]').forEach((card) => {
      const projId = card.getAttribute('data-project');
      const meta = window.projectRoutes?.byId?.[projId];
      if (!meta || !meta.storeLinks) return;
      const androidBtn = card.querySelector('.btn-store--android');
      const iosBtn = card.querySelector('.btn-store--ios');
      const huaweiBtn = card.querySelector('.btn-store--huawei');
      if (androidBtn && meta.storeLinks.android && (!androidBtn.href || androidBtn.getAttribute('href').startsWith('#'))) {
        androidBtn.href = meta.storeLinks.android;
        androidBtn.target = '_blank';
        androidBtn.rel = 'noopener noreferrer';
      }
      if (iosBtn && meta.storeLinks.ios && (!iosBtn.href || iosBtn.getAttribute('href').startsWith('#'))) {
        iosBtn.href = meta.storeLinks.ios;
        iosBtn.target = '_blank';
        iosBtn.rel = 'noopener noreferrer';
      }
      if (huaweiBtn && meta.storeLinks.huawei && (!huaweiBtn.href || huaweiBtn.getAttribute('href').startsWith('#'))) {
        huaweiBtn.href = meta.storeLinks.huawei;
        huaweiBtn.target = '_blank';
        huaweiBtn.rel = 'noopener noreferrer';
      }
    });

    initHeroShowcase();
    initTypewriter();
    initCounters();
    initNeuralCanvas();
    initProjectFilters();
    initInteractiveEffects();
    initScrollAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

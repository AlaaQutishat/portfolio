/**
 * Shared Project Case Study Renderer (In-Page Overlay & Standalone Project Pages)
 */
(function (global) {
  'use strict';

  function getTranslation(key, lang) {
    if (typeof translations === 'undefined') return key;
    const currentLang = lang || global.currentLang || 'en';
    const keys = key.split('.');
    let value = translations[currentLang];
    for (const k of keys) {
      value = value?.[k];
    }
    if (value === undefined && currentLang !== 'en') {
      let fallback = translations.en;
      for (const k of keys) {
        fallback = fallback?.[k];
      }
      return fallback ?? key;
    }
    return value ?? key;
  }

  function parseShotCaption(text) {
    if (!text) return { title: '', desc: '' };
    const parts = text.split(' — ');
    if (parts.length >= 2) {
      return {
        title: parts[0],
        desc: parts.slice(1).join(' — ')
      };
    }
    return { title: '', desc: text };
  }

  function resolveAssetSrc(src) {
    if (!src) return src;
    if (/^(https?:|data:|\/)/.test(src)) return src;
    if (window.PROJECT_PAGE && window.PROJECT_PAGE.basePath) {
      return window.PROJECT_PAGE.basePath + src;
    }
    return src;
  }

  function createProjectShotFigure(shot, variant, lang) {
    const captionText = getTranslation(shot.captionKey, lang);
    const parsed = parseShotCaption(captionText);

    const fig = document.createElement('figure');
    fig.className = 'project-shot project-shot--' + variant;
    fig.setAttribute('data-shot-caption-key', shot.captionKey);

    const row = document.createElement('div');
    row.className = 'project-shot__row';

    const media = document.createElement('div');
    media.className = 'project-shot__media';

    const zoomBtn = document.createElement('button');
    zoomBtn.type = 'button';
    zoomBtn.className = 'project-shot__zoom';
    zoomBtn.setAttribute(
      'aria-label',
      getTranslation('projects.previewScreenshot', lang) || 'View full-size screenshot'
    );

    const img = document.createElement('img');
    img.className = 'project-shot__img';
    img.src = resolveAssetSrc(shot.src);
    img.alt = parsed.title || captionText;
    img.loading = 'lazy';
    img.decoding = 'async';

    zoomBtn.appendChild(img);
    media.appendChild(zoomBtn);

    const cap = document.createElement('figcaption');
    cap.className = 'project-shot__caption';

    if (parsed.title) {
      const title = document.createElement('span');
      title.className = 'project-shot__caption-title';
      title.textContent = parsed.title;
      cap.appendChild(title);
    }

    const desc = document.createElement('p');
    desc.className = 'project-shot__caption-desc';
    desc.textContent = parsed.desc || captionText;
    cap.appendChild(desc);

    row.appendChild(media);
    row.appendChild(cap);
    fig.appendChild(row);
    return fig;
  }

  function createProjectScreenshotSection(sectionId, titleKey, shots, variant, lang) {
    if (!shots || !shots.length) return null;

    const section = document.createElement('section');
    section.className = 'project-overlay__shots project-page__shots';
    section.setAttribute('aria-labelledby', sectionId);

    const heading = document.createElement('h2');
    heading.id = sectionId;
    heading.className = 'project-overlay__shots-title mono';
    heading.setAttribute('data-i18n', titleKey);
    heading.textContent = getTranslation(titleKey, lang);

    const grid = document.createElement('div');
    grid.className = 'project-overlay__shots-grid project-overlay__shots-grid--' + variant;

    shots.forEach((shot) => {
      grid.appendChild(createProjectShotFigure(shot, variant, lang));
    });

    section.appendChild(heading);
    section.appendChild(grid);
    return section;
  }

  function appendTechBlock(parent, projectId, lang) {
    const techKey = 'projects.' + projectId + '.tech';
    const raw = getTranslation(techKey, lang);
    if (!raw || raw === techKey) return;

    const block = document.createElement('div');
    block.className = 'project-tech-block project-page__tech';

    const label = document.createElement('h2');
    label.className = 'project-tech-label';
    label.textContent = getTranslation('projects.tech', lang);

    const list = document.createElement('ul');
    list.className = 'project-tech-list';
    raw
      .split(/\s*•\s*/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((part) => {
        const li = document.createElement('li');
        li.textContent = part;
        list.appendChild(li);
      });

    block.appendChild(label);
    block.appendChild(list);
    parent.appendChild(block);
  }

  function appendHighlights(parent, projectId, lang) {
    const items = [];
    for (let i = 1; i <= 8; i += 1) {
      const key = 'projects.' + projectId + '.l' + i;
      const val = getTranslation(key, lang);
      if (val && val !== key) items.push(val);
    }
    if (!items.length) return;

    const wrap = document.createElement('div');
    wrap.className = 'project-details project-page__highlights';

    const heading = document.createElement('h2');
    heading.className = 'project-highlights-heading';
    heading.textContent = getTranslation('projects.highlightsTitle', lang);
    wrap.appendChild(heading);

    const ul = document.createElement('ul');
    ul.className = 'project-highlights';
    items.forEach((text) => {
      const li = document.createElement('li');
      li.textContent = text;
      ul.appendChild(li);
    });
    wrap.appendChild(ul);
    parent.appendChild(wrap);
  }

  function appendBody(parent, projectId, lang) {
    const bodyKey = 'projects.' + projectId + '.body';
    const bodyText = getTranslation(bodyKey, lang);
    if (bodyText && bodyText !== bodyKey) {
      const body = document.createElement('div');
      body.className = 'project-overlay__body project-page__body';
      body.textContent = bodyText;
      parent.appendChild(body);
      return;
    }
    const descKey = 'projects.' + projectId + '.desc';
    const desc = getTranslation(descKey, lang);
    if (desc && desc !== descKey) {
      const p = document.createElement('p');
      p.className = 'project-overlay__desc project-page__lead';
      p.textContent = desc;
      parent.appendChild(p);
    }
  }

  function appendScreenshots(parent, projectId, routeMeta, lang) {
    const manifest =
      typeof window.projectScreenshotManifest !== 'undefined'
        ? window.projectScreenshotManifest[projectId]
        : null;
    if (!manifest) return;

    const webSection = createProjectScreenshotSection(
      'projectShotsWeb',
      'projects.screenshotsSuite',
      manifest.web,
      'web',
      lang
    );
    if (webSection) parent.appendChild(webSection);

    const mobileSection = createProjectScreenshotSection(
      'projectShotsMobile',
      'projects.screenshotsMobile',
      manifest.mobile,
      'mobile',
      lang
    );
    if (mobileSection) parent.appendChild(mobileSection);
  }

  function renderProjectDetail(container, projectId, routeMeta, lang) {
    if (!container) return;
    container.replaceChildren();

    const nameKey = 'projects.' + projectId + '.name';
    const subtitleKey = 'projects.' + projectId + '.subtitle';
    const domainKey = 'projects.' + projectId + '.domain';
    const name = getTranslation(nameKey, lang);
    const subtitle = getTranslation(subtitleKey, lang);
    const domain = getTranslation(domainKey, lang);

    const header = document.createElement('header');
    header.className = 'project-page__header';

    if (routeMeta?.index) {
      const indexEl = document.createElement('span');
      indexEl.className = 'project-page__index mono';
      indexEl.textContent = routeMeta.index + (domain && domain !== domainKey ? ' · ' + domain : '');
      header.appendChild(indexEl);
    }

    const title = document.createElement('h1');
    title.className = 'project-overlay__title project-page__title';
    title.id = 'projectPageTitle';
    title.textContent = name;
    header.appendChild(title);

    if (subtitle && subtitle !== subtitleKey) {
      const sub = document.createElement('p');
      sub.className = 'project-overlay__subtitle project-page__subtitle';
      sub.textContent = subtitle;
      header.appendChild(sub);
    }

    if (routeMeta?.storeLinks) {
      const links = routeMeta.storeLinks;
      const hasAny =
        links.android || links.ios || links.huawei || links.androidTeacher || links.iosTeacher;
      if (hasAny) {
        const isMultiApp = Boolean(links.androidTeacher || links.iosTeacher);
        const storeWrap = document.createElement('div');
        storeWrap.className = 'project-page__live-stores';
        if (links.android) {
          const a = document.createElement('a');
          a.href = links.android;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'btn btn-store btn-store--android';
          a.textContent = isMultiApp
            ? (lang === 'ar' ? 'تطبيق الطالب · Google Play ↗' : 'Student · Google Play ↗')
            : (lang === 'ar' ? 'متجر Google Play ↗' : 'Google Play Store ↗');
          storeWrap.appendChild(a);
        }
        if (links.ios) {
          const a = document.createElement('a');
          a.href = links.ios;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'btn btn-store btn-store--ios';
          a.textContent = isMultiApp
            ? (lang === 'ar' ? 'تطبيق الطالب · App Store ↗' : 'Student · App Store ↗')
            : (lang === 'ar' ? 'متجر App Store ↗' : 'Apple App Store ↗');
          storeWrap.appendChild(a);
        }
        if (links.androidTeacher) {
          const a = document.createElement('a');
          a.href = links.androidTeacher;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'btn btn-store btn-store--android';
          a.textContent = lang === 'ar' ? 'تطبيق المعلم · Google Play ↗' : 'Teacher · Google Play ↗';
          storeWrap.appendChild(a);
        }
        if (links.iosTeacher) {
          const a = document.createElement('a');
          a.href = links.iosTeacher;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'btn btn-store btn-store--ios';
          a.textContent = lang === 'ar' ? 'تطبيق المعلم · App Store ↗' : 'Teacher · App Store ↗';
          storeWrap.appendChild(a);
        }
        if (links.huawei) {
          const a = document.createElement('a');
          a.href = links.huawei;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'btn btn-store btn-store--huawei';
          a.textContent = lang === 'ar' ? 'متجر Huawei AppGallery ↗' : 'Huawei AppGallery ↗';
          storeWrap.appendChild(a);
        }
        header.appendChild(storeWrap);
      }
    }

    container.appendChild(header);

    appendBody(container, projectId, lang);
    appendTechBlock(container, projectId, lang);
    appendHighlights(container, projectId, lang);
    appendScreenshots(container, projectId, routeMeta, lang);
  }

  global.ProjectDetail = {
    renderProjectDetail,
    getTranslation
  };
})(typeof window !== 'undefined' ? window : this);


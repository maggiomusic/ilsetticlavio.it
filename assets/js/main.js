(() => {
  'use strict';

  // ---------- Mobile nav toggle ----------
  const navToggle = document.getElementById('navToggle');
  const mainNav   = document.getElementById('mainNav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Chiudi menu' : 'Apri menu');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mainNav.classList.contains('is-open')) {
          mainNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
          navToggle.setAttribute('aria-label', 'Apri menu');
        }
      });
    });
  }

  // ---------- Copy to clipboard (IBAN) ----------
  document.querySelectorAll('[data-copy-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById(btn.dataset.copyTarget);
      if (!target || !navigator.clipboard) return;
      navigator.clipboard.writeText(target.textContent.replace(/\s+/g, '')).then(() => {
        const label = btn.textContent;
        btn.textContent = 'Copiato!';
        setTimeout(() => { btn.textContent = label; }, 1800);
      });
    });
  });

  // ---------- Rassegna stampa: open articles in a lightbox ----------
  const pressDialog = document.getElementById('pressDialog');
  if (pressDialog && typeof pressDialog.showModal === 'function') {
    const pressImg = pressDialog.querySelector('img');
    const pressCaption = pressDialog.querySelector('.press-dialog-caption');
    document.querySelectorAll('[data-press]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        pressImg.src = card.getAttribute('href');
        pressImg.alt = card.querySelector('img').alt;
        pressCaption.textContent = card.querySelector('.press-meta').textContent + ' — ' + card.querySelector('.press-title').textContent;
        pressDialog.showModal();
      });
    });
    // Project photo galleries: same lightbox, with prev/next inside a group
    const navPrev = pressDialog.querySelector('.press-dialog-nav--prev');
    const navNext = pressDialog.querySelector('.press-dialog-nav--next');
    let group = [];
    let index = 0;
    const showPhoto = () => {
      const link = group[index];
      pressImg.src = link.getAttribute('href');
      pressImg.alt = link.dataset.caption || '';
      pressCaption.textContent = link.dataset.caption || '';
    };
    document.querySelectorAll('[data-gallery]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const name = link.dataset.gallery;
        group = [...new Map([...document.querySelectorAll(`.project-gallery [data-gallery="${name}"]`)]
          .map(a => [a.getAttribute('href'), a])).values()];
        index = Math.max(0, group.findIndex(a => a.getAttribute('href') === link.getAttribute('href')));
        navPrev.hidden = navNext.hidden = group.length < 2;
        showPhoto();
        pressDialog.showModal();
      });
    });
    navPrev.addEventListener('click', () => { index = (index - 1 + group.length) % group.length; showPhoto(); });
    navNext.addEventListener('click', () => { index = (index + 1) % group.length; showPhoto(); });
    pressDialog.addEventListener('keydown', (e) => {
      if (navNext.hidden) return;
      if (e.key === 'ArrowRight') navNext.click();
      if (e.key === 'ArrowLeft') navPrev.click();
    });
    pressDialog.addEventListener('close', () => { group = []; navPrev.hidden = navNext.hidden = true; });

    pressDialog.querySelector('.press-dialog-close').addEventListener('click', () => pressDialog.close());
    pressDialog.addEventListener('click', (e) => { if (e.target === pressDialog) pressDialog.close(); });
  }

  // ---------- Ufficio stampa: carousel arrows (one pair per carousel) ----------
  document.querySelectorAll('.press-carousel').forEach(carousel => {
    const track = carousel.querySelector('.press-grid');
    if (!track) return;
    const navs = carousel.querySelectorAll('[data-press-scroll]');
    const updateNavs = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      navs.forEach(btn => {
        const dir = Number(btn.dataset.pressScroll);
        btn.disabled = dir < 0 ? track.scrollLeft <= 2 : track.scrollLeft >= max;
      });
    };
    navs.forEach(btn => btn.addEventListener('click', () => {
      track.scrollBy({ left: Number(btn.dataset.pressScroll) * track.clientWidth * 0.8, behavior: 'smooth' });
    }));
    track.addEventListener('scroll', updateNavs, { passive: true });
    window.addEventListener('resize', updateNavs);
    updateNavs();
  });

  // ---------- Footer year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Back-to-top button ----------
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('is-visible', window.scrollY > 400);
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
  }

  // ---------- Fade-in on scroll (IntersectionObserver) ----------
  const fadeTargets = document.querySelectorAll(
    '.section h2, .value-card, .project-card, .service-card, .support-card, .board-card, .partner-featured'
  );

  if ('IntersectionObserver' in window && fadeTargets.length) {
    fadeTargets.forEach(el => el.classList.add('fade-in'));

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    fadeTargets.forEach(el => io.observe(el));
  }

  // ---------- Share buttons (print, copy, dynamic URL) ----------
  const shareContainer = document.getElementById('shareActions');
  if (shareContainer) {
    const url   = window.location.href || shareContainer.dataset.shareUrl;
    const title = document.title || shareContainer.dataset.shareTitle || '';

    const encURL   = encodeURIComponent(url);
    const encTitle = encodeURIComponent(title);

    const hrefMap = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encURL}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encURL}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encTitle}%20-%20${encURL}`,
      email:    `mailto:?subject=${encTitle}&body=Ti%20segnalo%20%3A%20${encURL}`
    };

    shareContainer.querySelectorAll('.share-btn').forEach(btn => {
      const kind = btn.dataset.share;
      if (hrefMap[kind] && btn.tagName === 'A') {
        btn.setAttribute('href', hrefMap[kind]);
      }
    });

    shareContainer.addEventListener('click', async (e) => {
      const btn = e.target.closest('.share-btn');
      if (!btn) return;
      const kind = btn.dataset.share;

      if (kind === 'print') {
        e.preventDefault();
        window.print();
        return;
      }

      if (kind === 'copy') {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(url);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = url;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const label = btn.querySelector('.share-btn-label');
        const original = label ? label.textContent : '';
        if (label) label.textContent = 'Link copiato!';
        btn.classList.add('is-copied');
        setTimeout(() => {
          btn.classList.remove('is-copied');
          if (label) label.textContent = original;
        }, 2000);
      }
    });
  }

  // ---------- Smooth scroll offset compensation for sticky header ----------
  const header = document.querySelector('.site-header');
  if (header) {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        // #top is the sticky header itself: its rect always sits at the viewport top
        if (targetId === '#top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        const headerH = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

})();

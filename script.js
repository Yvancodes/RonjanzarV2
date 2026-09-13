/* =========================================================
   ROJANZAR PHARMACY — script.js
   Vanilla JS foundational interactions:
   1. Sticky navbar shadow on scroll
   2. Mobile nav toggle
   3. Smooth scroll + auto-close mobile menu on link click
   4. Scroll-reveal animations (IntersectionObserver)
   5. Animated stat counters (IntersectionObserver)
   6. Market / portfolio charts (Chart.js)
   7. Image lightbox for galleries, photos & documents
   8. Back-to-top button
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initSmoothScrollLinks();
  initScrollReveal();
  initStatCounters();
  initCharts();
  initTiltEffect();
  initLightbox();
  initCarousels();
  initGalleryModal();
  initContactModal();
  initBackToTop();
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ---------- 1. Sticky header shadow ---------- */
function initStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const toggleShadow = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  toggleShadow();
  window.addEventListener('scroll', toggleShadow, { passive: true });
}

/* ---------- 2. Mobile navigation toggle ---------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const nav = document.getElementById('mainNav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggleBtn.classList.toggle('is-active', isOpen);
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ---------- 3. Smooth scroll + close mobile menu after click ---------- */
function initSmoothScrollLinks() {
  const nav = document.getElementById('mainNav');
  const toggleBtn = document.getElementById('navToggle');

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggleBtn.classList.remove('is-active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* ---------- 4. Scroll-reveal animation for sections ---------- */
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    observer.observe(el);
  });
}

/* ---------- 5. Animated stat counters ---------- */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const animateCount = (el) => {
    const target = Number(el.dataset.target) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach((el) => observer.observe(el));
}

/* ---------- 6. Market / portfolio charts ---------- */
function initCharts() {
  if (typeof Chart === 'undefined') return;

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.color = '#675f7d';

  const purple = '#5E35B1';
  const cyan = '#00BCD4';
  const softGrid = 'rgba(103, 95, 125, 0.08)';

  /* --- Global pharmaceutical market growth (line/area) --- */
  const globalCtx = document.getElementById('globalMarketChart');
  if (globalCtx) {
    const gradient = globalCtx.getContext('2d').createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(94, 53, 177, 0.35)');
    gradient.addColorStop(1, 'rgba(94, 53, 177, 0)');

    new Chart(globalCtx, {
      type: 'line',
      data: {
        labels: ['2022', '2024', '2026', '2028', '2030'],
        datasets: [{
          label: 'Market size (USD B)',
          data: [1500, 1700, 1930, 2190, 2480],
          borderColor: purple,
          backgroundColor: gradient,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: purple,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          borderWidth: 3,
        }],
      },
      options: chartBaseOptions(softGrid, (v) => `$${v}B`),
    });
  }

  /* --- Philippine market growth (bar) --- */
  const phCtx = document.getElementById('phMarketChart');
  if (phCtx) {
    new Chart(phCtx, {
      type: 'bar',
      data: {
        labels: ['2024', '2025', '2026', '2027', '2028'],
        datasets: [{
          label: 'PH market value (₱B)',
          data: [150, 163, 176, 191, 207],
          backgroundColor: [cyan, cyan, purple, cyan, cyan],
          borderRadius: 8,
          maxBarThickness: 40,
        }],
      },
      options: chartBaseOptions(softGrid, (v) => `₱${v}B`),
    });
  }

  /* --- Rojanzar portfolio mix (doughnut) --- */
  const portfolioCtx = document.getElementById('portfolioChart');
  if (portfolioCtx) {
    new Chart(portfolioCtx, {
      type: 'doughnut',
      data: {
        labels: ['Own Brands', 'Collaborated Brands', 'Partner Doctors'],
        datasets: [{
          data: [5, 20, 30],
          backgroundColor: [purple, cyan, '#c9b8ff'],
          borderColor: '#0a0912',
          borderWidth: 3,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '62%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { boxWidth: 10, boxHeight: 10, padding: 16, font: { size: 11, weight: '600' } },
          },
          tooltip: {
            backgroundColor: '#151222',
            padding: 10,
            cornerRadius: 8,
          },
        },
      },
    });
  }

  function chartBaseOptions(gridColor, tickFormatter) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#151222',
          padding: 10,
          cornerRadius: 8,
          callbacks: tickFormatter ? { label: (ctx) => tickFormatter(ctx.parsed.y) } : undefined,
        },
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          grid: { color: gridColor },
          ticks: {
            font: { size: 11 },
            callback: tickFormatter ? (val) => tickFormatter(val) : undefined,
          },
        },
      },
    };
  }
}

/* ---------- 6b. 3D pointer-tracking tilt ---------- */
function initTiltEffect() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  /* .doc-card is excluded: it already has its own hover-to-full-size
     zoom effect (scale(1.4) in CSS), and an inline JS transform here
     would fight with that. */
  const selector = [
    '.product-tile', '.mini-tile', '.logo-tile',
    '.chart-card', '.info-card', '.value-card', '.video-frame', '.product-image',
  ].join(', ');

  const targets = document.querySelectorAll(selector);
  if (!targets.length) return;

  const maxTilt = 8;

  targets.forEach((el) => {
    let frame = null;

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const rotateY = (x - 0.5) * (maxTilt * 2);
      const rotateX = (0.5 - y) * (maxTilt * 2);

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
      });
    };

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      el.style.transform = '';
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
    el.addEventListener('blur', reset);
  });
}

/* ---------- 7. Lightbox for photos, product shots & documents ---------- */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const closeBtn = document.getElementById('lightboxClose');
  const items = document.querySelectorAll('[data-full]');

  if (!lightbox || !lightboxImg || !items.length) return;

  const openLightbox = (src, alt) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const altText = item.querySelector('img')?.getAttribute('alt');
      openLightbox(fullSrc, altText);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
  });
}

/* ---------- 7b. Photo carousels ---------- */
function initCarousels() {
  const carousels = document.querySelectorAll('[data-carousel]');
  if (!carousels.length) return;

  carousels.forEach((carousel) => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(carousel.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-btn--prev');
    const nextBtn = carousel.querySelector('.carousel-btn--next');
    const dotsWrap = carousel.querySelector('.carousel-dots');
    if (!track || !slides.length) return;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to photo ${i + 1}`);
      dot.addEventListener('click', () => {
        slides[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.querySelectorAll('.carousel-dot'));

    const updateActiveDot = () => {
      const trackRect = track.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let closestIndex = 0;
      let closestDistance = Infinity;
      slides.forEach((slide, i) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const distance = Math.abs(slideCenter - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });
      dots.forEach((dot, i) => dot.classList.toggle('is-active', i === closestIndex));
    };

    const scrollByAmount = () => {
      const slide = slides[0];
      const gap = 20;
      return slide.getBoundingClientRect().width + gap;
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -scrollByAmount(), behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: scrollByAmount(), behavior: 'smooth' });
      });
    }

    let scrollTimer = null;
    track.addEventListener('scroll', () => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(updateActiveDot, 80);
    }, { passive: true });

    updateActiveDot();
  });
}

/* ---------- 7c. "See all" gallery modal ---------- */
function initGalleryModal() {
  const modal = document.getElementById('galleryModal');
  const grid = document.getElementById('galleryModalGrid');
  const title = document.getElementById('galleryModalTitle');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  if (!modal || !grid) return;

  const triggers = document.querySelectorAll('[data-gallery-open]');
  const closers = modal.querySelectorAll('[data-gallery-close]');

  const openLightboxFrom = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const openGallery = (event) => {
    const trigger = event.currentTarget;
    const groupName = trigger.getAttribute('data-gallery-open');
    const source = document.querySelector(`[data-gallery-group="${groupName}"]`);
    if (!source) return;

    const headingEl = document.querySelector(`h3.gallery-subheading[data-gallery-title="${groupName}"]`) ||
      trigger.closest('.gallery-heading-row')?.querySelector('.gallery-subheading');
    if (title && headingEl) title.textContent = headingEl.textContent;

    grid.innerHTML = '';
    source.querySelectorAll('figure[data-full]').forEach((fig) => {
      const clone = fig.cloneNode(true);
      clone.classList.remove('carousel-slide', 'reveal');
      clone.classList.add('is-visible');
      const img = clone.querySelector('img');
      clone.addEventListener('click', () => {
        openLightboxFrom(fig.getAttribute('data-full'), img?.getAttribute('alt'));
      });
      grid.appendChild(clone);
    });

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggers.forEach((el) => el.addEventListener('click', openGallery));
  closers.forEach((el) => el.addEventListener('click', closeGallery));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeGallery();
  });
}

/* ---------- 7d. Contact modal (mailto) ---------- */
function initContactModal() {
  const modal = document.getElementById('contactModal');
  const form = document.getElementById('contactForm');
  if (!modal || !form) return;

  const RECIPIENT = 'rojanzarpharma@yahoo.com';
  const triggers = document.querySelectorAll('a[href="#contact"]');
  const closers = modal.querySelectorAll('[data-contact-close]');

  const openModal = (event) => {
    if (event) event.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstField = document.getElementById('contactName');
    if (firstField) firstField.focus();
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  triggers.forEach((el) => el.addEventListener('click', openModal));
  closers.forEach((el) => el.addEventListener('click', closeModal));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) return;

    const subject = `Website Inquiry from ${name}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone ? `Phone: ${phone}` : null,
      '',
      message,
    ].filter((line) => line !== null);

    const mailtoUrl =
      `mailto:${RECIPIENT}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(bodyLines.join('\n'))}`;

    window.location.href = mailtoUrl;
    form.reset();
    closeModal();
  });
}

/* ---------- 8. Back-to-top button ---------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('is-visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

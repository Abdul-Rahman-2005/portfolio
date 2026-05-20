/* ═══════════════════════════════════════════════════════════
   SCRIPT.JS — Alex Morgan Portfolio
   Vanilla JS · No frameworks · Optimised animations
═══════════════════════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────────────────────
   CUSTOM CURSOR
──────────────────────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  // Skip on touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth follower via RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover state
  const hoverEls = document.querySelectorAll('a, button, .project-card, .skill-tag, .gallery-item');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
})();

/* ────────────────────────────────────────────────────────
   NAVBAR — scroll behaviour
──────────────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active link highlighting */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => link.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
})();

/* ────────────────────────────────────────────────────────
   HAMBURGER MENU
──────────────────────────────────────────────────────── */
(function initHamburger() {
  const ham   = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!ham || !links) return;

  ham.addEventListener('click', () => {
    const open = ham.classList.toggle('open');
    links.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on nav link click
  links.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      ham.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ────────────────────────────────────────────────────────
   SCROLL REVEAL — Intersection Observer
──────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = el.dataset.delay ? parseInt(el.dataset.delay) : 0;

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  revealEls.forEach(el => observer.observe(el));
})();

/* ────────────────────────────────────────────────────────
   COUNTER ANIMATION — stats in hero
──────────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      const dur    = 1600;
      const start  = performance.now();

      function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ────────────────────────────────────────────────────────
   PARALLAX — hero video & about section
──────────────────────────────────────────────────────── */
(function initParallax() {
  const video = document.querySelector('.hero-video');
  if (!video) return;

  // Disable on reduced-motion or mobile
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 768) return;

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      // Parallax: video moves at 40% scroll speed
      video.style.transform = `translateY(${y * 0.4}px)`;
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ────────────────────────────────────────────────────────
   CONTACT FORM
──────────────────────────────────────────────────────── */
(function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name    = form.name.value.trim();
  const email   = form.email.value.trim();
  const message = form.message.value.trim();
  const subject = form.subject.value.trim();

  const btn     = form.querySelector('button[type="submit"]');
  const btnText = btn.querySelector('.btn-text');

  // Validation
  if (!name || !email || !message) {
    setStatus('Please fill in all required fields.', 'error');
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setStatus('Please enter a valid email address.', 'error');
    return;
  }

  // UI loading state
  btnText.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const formData = new FormData(form);

    const response = await fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      setStatus("✓ Message sent! I'll get back to you soon.", 'success');
      form.reset();
    } else {
      setStatus("❌ Failed to send message. Try again.", 'error');
    }

  } catch (error) {
    setStatus("❌ Network error. Try again later.", 'error');
  }

  // Reset button
  btnText.textContent = 'Send Message';
  btn.disabled = false;

  setTimeout(() => {
    status.textContent = '';
    status.className = 'form-status';
  }, 4000);
});

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className   = `form-status ${type}`;
  }

  function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  }
})();

/* ────────────────────────────────────────────────────────
   SMOOTH ANCHOR SCROLLING (offset for sticky nav)
──────────────────────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const navH   = document.getElementById('navbar')?.offsetHeight || 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ────────────────────────────────────────────────────────
   GALLERY — lightbox (simple)
──────────────────────────────────────────────────────── */
(function initGallery() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <img class="lb-img" src="" alt="" />
      <button class="lb-close" aria-label="Close">✕</button>
    </div>
  `;
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #lightbox {
      position: fixed; inset: 0; z-index: 5000;
      display: none; align-items: center; justify-content: center;
    }
    #lightbox.open { display: flex; }
    .lb-backdrop {
      position: absolute; inset: 0;
      background: rgba(0,0,0,0.92);
      backdrop-filter: blur(12px);
      cursor: pointer;
      animation: lb-fade .3s ease;
    }
    .lb-content {
      position: relative; z-index: 1;
      max-width: 90vw; max-height: 90vh;
      animation: lb-scale .35s cubic-bezier(0,0,0.2,1);
    }
    .lb-img {
      max-width: 100%; max-height: 90vh;
      object-fit: contain; border-radius: 12px;
      width: auto; height: auto;
    }
    .lb-close {
      position: absolute; top: -16px; right: -16px;
      width: 36px; height: 36px;
      background: #EE3F2C; border: none; border-radius: 50%;
      color: #fff; font-size: 0.9rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    @keyframes lb-fade  { from { opacity: 0 } to { opacity: 1 } }
    @keyframes lb-scale { from { transform: scale(0.88); opacity: 0 }
                          to   { transform: scale(1);    opacity: 1 } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(lb);

  const lbImg     = lb.querySelector('.lb-img');
  const lbClose   = lb.querySelector('.lb-close');
  const lbBackdrop = lb.querySelector('.lb-backdrop');

  function openLb(src, alt) {
    lbImg.src = src; lbImg.alt = alt;
    lb.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLb(img.src, img.alt);
    });
  });
  lbClose.addEventListener('click', closeLb);
  lbBackdrop.addEventListener('click', closeLb);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
})();

/* ────────────────────────────────────────────────────────
   TYPING EFFECT — hero tagline (subtle)
──────────────────────────────────────────────────────── */
(function initTypingEffect() {
  const tagline = document.querySelector('.hero-tagline');
  if (!tagline) return;

  const original = tagline.innerHTML;
  tagline.innerHTML = '';
  tagline.style.opacity = '1';

  // Simple character reveal using clip / opacity trick
  // We'll use a CSS clip approach instead of innerHTML manipulation
  tagline.style.clipPath = 'inset(0 100% 0 0)';
  tagline.style.transition = 'clip-path 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.6s';
  tagline.innerHTML = original;

  // Trigger after paint
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      tagline.style.clipPath = 'inset(0 0% 0 0)';
    });
  });
})();

/* ────────────────────────────────────────────────────────
   SKILL TAGS — staggered entrance
──────────────────────────────────────────────────────── */
(function initSkillTags() {
  const tags = document.querySelectorAll('.skill-tag');
  if (!tags.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const parent = entry.target.closest('.skills-grid');
      if (!parent) return;

      const children = parent.querySelectorAll('.skill-tag');
      children.forEach((tag, i) => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(20px)';
        tag.style.transition = `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`;
        setTimeout(() => {
          tag.style.opacity = '1';
          tag.style.transform = 'translateY(0)';
        }, 100 + i * 60);
      });

      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  // Observe the parent container
  const skillsGrid = document.querySelector('.skills-grid');
  if (skillsGrid) observer.observe(skillsGrid);
})();

/* ────────────────────────────────────────────────────────
   TIMELINE DOT — pulse on enter
──────────────────────────────────────────────────────── */
(function initTimelineDots() {
  const dots = document.querySelectorAll('.timeline-dot');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'pulse-dot 2s infinite';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  dots.forEach(d => observer.observe(d));
})();

/* ────────────────────────────────────────────────────────
   PAGE LOAD — fade in
──────────────────────────────────────────────────────── */
(function initPageLoad() {
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.documentElement.style.opacity = '1';
  });
})();

/* ────────────────────────────────────────────────────────
   LAZY LOAD IMAGES (native + polyfill)
──────────────────────────────────────────────────────── */
(function initLazyLoad() {
  // Modern browsers support loading="lazy" natively.
  // For older ones, use IntersectionObserver fallback.
  if ('loading' in HTMLImageElement.prototype) return;

  const imgs = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });
  imgs.forEach(img => observer.observe(img));
})();

/* ────────────────────────────────────────────────────────
   PROJECT CARDS — tilt effect (desktop only)
──────────────────────────────────────────────────────── */
(function initTilt() {
  if (window.innerWidth < 900) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.project-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ────────────────────────────────────────────────────────
   NAV ACTIVE STYLE (CSS extension via JS)
──────────────────────────────────────────────────────── */
(function addActiveLinkStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .nav-link.active { color: #FFFFFF !important; }
    .nav-link.active::after { width: 100% !important; }
  `;
  document.head.appendChild(style);
})();

console.log('%c[AM] Portfolio loaded. ✓', 'color:#EE3F2C;font-weight:700;font-family:Rubik,sans-serif;font-size:14px');

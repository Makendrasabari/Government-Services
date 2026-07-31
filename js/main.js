/**
 * main.js — Global JavaScript
 * Government Services Portal
 * Handles: Preloader, Navbar, Custom Cursor, ScrollTop,
 *          Page Transitions, GSAP Global Init
 */

// ── GSAP Registration ──────────────────────────────────────
if (typeof ScrollTrigger !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

// ── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbar();
  initCursor();
  initScrollTop();
  initPageTransition();
  initAccordions();
  initMobileMenu();
  initGlobalReveal();
  initHeroCarousel();
});

/* ============================================================
   PRELOADER
   ============================================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const bar   = preloader.querySelector('.preloader-bar-inner');
  const label = preloader.querySelector('.preloader-text');
  let progress = 0;
  let isWindowLoaded = false;

  const texts = ['Initializing...', 'Loading Services...', 'Almost Ready...', 'Welcome to Stackly'];
  let textIdx = 0;

  window.addEventListener('load', () => {
    isWindowLoaded = true;
  });

  // Safety fallback if load event already fired
  if (document.readyState === 'complete') {
    isWindowLoaded = true;
  }

  const interval = setInterval(() => {
    const step = isWindowLoaded ? (Math.random() * 25 + 15) : (Math.random() * 10 + 4);
    progress += step;

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      hidePreloader();
    }
    if (bar) bar.style.width = Math.min(progress, 100) + '%';
    if (label && textIdx < texts.length) {
      const threshold = ((textIdx + 1) / texts.length) * 100;
      if (progress >= threshold) {
        label.textContent = texts[textIdx];
        textIdx++;
      }
    }
  }, 80);
}

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  preloader.classList.add('fade-out');

  if (typeof gsap !== 'undefined') {
    gsap.to(preloader, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        document.body.classList.add('loaded');
        triggerHeroAnimations();
      }
    });
  } else {
    setTimeout(() => {
      preloader.style.display = 'none';
      document.body.classList.add('loaded');
      triggerHeroAnimations();
    }, 1200);
  }
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Scroll detection
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      if (navbar.dataset.transparent === 'true') {
        navbar.classList.add('transparent');
      }
    }
  };

  // Set initial transparent state
  if (navbar.dataset.transparent === 'true') {
    navbar.classList.add('transparent');
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active link highlighting
  const links = navbar.querySelectorAll('.nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.includes(currentPage))) {
      link.classList.add('active');
    }
  });

  // GSAP navbar entrance
  gsap.fromTo(navbar, { y: -100, opacity: 0 }, {
    y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2
  });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger   = document.querySelector('.nav-hamburger');
  const mobileMenu  = document.querySelector('.nav-mobile');
  const overlay     = document.querySelector('.nav-overlay');
  const closeBtn    = document.querySelector('.nav-mobile-close');

  if (!hamburger || !mobileMenu) return;

  const openMenu = () => {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (overlay)  overlay.addEventListener('click', closeMenu);

  // Mobile sub-menus
  document.querySelectorAll('.nav-mobile-link[data-submenu]').forEach(link => {
    link.addEventListener('click', () => {
      const target = document.querySelector(link.dataset.submenu);
      link.classList.toggle('open');
      if (target) target.classList.toggle('open');
    });
  });
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor   = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1, ease: 'none' });
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    gsap.set(follower, { x: followerX, y: followerY });
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover states
  const hoverTargets = 'a, button, .btn, .card, .service-card, input, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    });
  });
}

/* ============================================================
   SCROLL TO TOP
   ============================================================ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power3.inOut' });
  });
}

/* ============================================================
   PAGE TRANSITION
   ============================================================ */
function initPageTransition() {
  const preloader = document.getElementById('preloader');

  // Reset preloader on page show (handles BFCache back button!)
  window.addEventListener('pageshow', (event) => {
    if (event.persisted && preloader) {
      preloader.classList.add('fade-out');
      preloader.style.display = 'none';
      document.body.classList.add('loaded');
    }
  });

  // Intercept internal link clicks for seamless preloader transition
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript') ||
        href.startsWith('mailto') || href.startsWith('tel') || link.target === '_blank') return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (preloader) {
        preloader.style.display = 'flex';
        preloader.classList.remove('fade-out');
        if (typeof gsap !== 'undefined') {
          gsap.to(preloader, {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.inOut',
            onComplete: () => { window.location.href = href; }
          });
        } else {
          window.location.href = href;
        }
      } else {
        window.location.href = href;
      }
    });
  });
}

/* ============================================================
   GLOBAL SCROLL REVEAL (ScrollTrigger)
   ============================================================ */
function initGlobalReveal() {
  // Fade up reveals
  gsap.utils.toArray('[data-reveal]').forEach(el => {
    const direction = el.dataset.reveal;
    const delay     = parseFloat(el.dataset.delay || 0);
    const duration  = parseFloat(el.dataset.duration || 0.8);

    const fromVars = { opacity: 0 };
    const isMobile = window.innerWidth <= 768;

    if (direction === 'up')    fromVars.y =  60;
    if (direction === 'down')  fromVars.y = -40;
    if (direction === 'left')  { isMobile ? (fromVars.y = 40) : (fromVars.x = -60); }
    if (direction === 'right') { isMobile ? (fromVars.y = 40) : (fromVars.x =  60); }
    if (direction === 'scale') { fromVars.scale = 0.85; }
    if (direction === 'zoom')  { fromVars.scale = 0.7; }

    gsap.fromTo(el, fromVars, {
      opacity: 1, x: 0, y: 0, scale: 1,
      duration, delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Stagger groups
  gsap.utils.toArray('[data-stagger]').forEach(container => {
    const children = container.children;
    const delay    = parseFloat(container.dataset.delay || 0);
    const stagger  = parseFloat(container.dataset.stagger || 0.12);

    gsap.fromTo(children,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        stagger,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  // Animated counters
  gsap.utils.toArray('.count-number').forEach(el => {
    const target = parseInt(el.dataset.target || el.textContent, 10);
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          gsap.fromTo({ val: 0 },
            { val: target },
            {
              val: target,
              duration: 2.5,
              ease: 'power2.out',
              onUpdate: function () {
                el.textContent = Math.round(this.targets()[0].val).toLocaleString();
              }
            }
          );
        },
        once: true
      });
    } else {
      el.textContent = target.toLocaleString();
    }
  });

  // Progress bars
  gsap.utils.toArray('.progress-bar-fill').forEach(bar => {
    const width = bar.dataset.width || bar.style.width || '0%';
    bar.style.width = '0%';
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: bar,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(bar, { width, duration: 1.5, ease: 'power2.out' });
        },
        once: true
      });
    } else {
      bar.style.width = width;
    }
  });

  // Image clip reveals
  gsap.utils.toArray('.clip-reveal').forEach(wrap => {
    const img = wrap.querySelector('img, .clip-inner');
    if (!img) return;
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.fromTo(wrap, { clipPath: 'inset(100% 0 0 0)' }, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: { trigger: wrap, start: 'top 85%' }
      });
      gsap.fromTo(img, { scale: 1.15 }, {
        scale: 1,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: wrap, start: 'top 85%' }
      });
    } else {
      wrap.style.clipPath = 'inset(0% 0 0 0)';
      img.style.scale = '1';
    }
  });
}

/* ============================================================
   HERO ANIMATIONS (called after preloader)
   ============================================================ */
function triggerHeroAnimations() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Label
  const label = hero.querySelector('.section-label');
  if (label) tl.fromTo(label, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 });

  // Title words
  const title = hero.querySelector('.hero-title');
  if (title) {
    const words = title.querySelectorAll('.word');
    if (words.length > 0) {
      tl.fromTo(words, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, '-=0.3');
    } else {
      tl.fromTo(title, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9 }, '-=0.3');
    }
  }

  // Subtitle
  const sub = hero.querySelector('.hero-sub');
  if (sub) tl.fromTo(sub, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');

  // Buttons
  const btns = hero.querySelectorAll('.hero-actions .btn');
  if (btns.length) tl.fromTo(btns, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.6 }, '-=0.4');

  // Hero carousel background fade-in
  const carousel = hero.querySelector('.hero-carousel');
  if (carousel) tl.fromTo(carousel, { opacity: 0 }, { opacity: 1, duration: 1.2 }, '-=1.2');
}

/* ============================================================
   ACCORDION
   ============================================================ */
function initAccordions() {
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const bodyInner = item.querySelector('.accordion-body-inner');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        const b = openItem.querySelector('.accordion-body');
        if (b) b.style.maxHeight = '0';
      });

      // Open current
      if (!isOpen) {
        item.classList.add('open');
        if (body && bodyInner) {
          body.style.maxHeight = bodyInner.scrollHeight + 'px';
        }
      }
    });
  });
}

/* ============================================================
   UTILITY HELPERS
   ============================================================ */
// Wrap words for split text animation
function wrapWords(el) {
  const text = el.textContent.trim();
  const words = text.split(' ');
  el.innerHTML = words.map(w => `<span class="word" style="display:inline-block">${w}&nbsp;</span>`).join('');
}

// Marquee pause on hover
document.querySelectorAll('.marquee-content').forEach(el => {
  el.addEventListener('mouseenter', () => el.style.animationPlayState = 'paused');
  el.addEventListener('mouseleave', () => el.style.animationPlayState = 'running');
});

// Tilt cards
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = -(y / rect.height) * 10;
    const rotY = (x / rect.width) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Tab component
document.querySelectorAll('.tabs-nav').forEach(nav => {
  const container = nav.closest('[data-tabs]') || nav.parentElement;
  nav.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      if (container) {
        container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        const panel = container.querySelector(`#${target}`);
        if (panel) panel.classList.add('active');
      }
    });
  });
});

// Horizontal spotlight effect
document.querySelectorAll('.hover-spotlight').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--spotlight-x', x + 'px');
    el.style.setProperty('--spotlight-y', y + 'px');
  });
});

// Hero carousel auto-slide loop
function initHeroCarousel() {
  const track = document.querySelector('.hero-carousel-track');
  if (!track) return;
  const slides = track.querySelectorAll('.hero-carousel-slide');
  if (!slides.length) return;
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  
  // Clone first slide to the end for seamless looping
  const firstClone = slides[0].cloneNode(true);
  track.appendChild(firstClone);
  
  setInterval(() => {
    currentIndex++;
    track.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    if (currentIndex === totalSlides) {
      setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        currentIndex = 0;
      }, 800);
    }
  }, 1500);
}

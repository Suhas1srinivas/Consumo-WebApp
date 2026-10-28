/**
 * Consummo - AI-Powered Intelligence for FMCG & Retail
 * Enterprise Micro-Interactions & Application Logic
 * (Scroll Reveals, Satisfying Clicks, Ripple Physics, Progress Bar)
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgressBar();
  initScrollRevealObserver();
  initButtonRipplePhysics();
  initAssessmentModal();
  initMobileNavigation();
  initScrollHeader();
  initSmoothScroll();
  initCardSpotlightPhysics();
  initHeroCounters();
  initScrollFunInteractions();
  initHeroSubtleMotionGraphics();
});

/* ==========================================================================
   1. Scroll Reading Progress Bar (Top Window)
   ========================================================================== */
function initScrollProgressBar() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
  });
}

/* ==========================================================================
   2. Scroll-Driven Reveal Observer (Smooth Rolling Transitions)
   ========================================================================== */
function initScrollRevealObserver() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        // Once revealed, unobserve to keep lightweight
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   3. Satisfying Button Click Physics (Water Ripple Animation)
   ========================================================================== */
function initButtonRipplePhysics() {
  const buttons = document.querySelectorAll('.btn');

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple-wave');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      // Set specific ripple color for dark/cyan buttons
      if (this.classList.contains('btn-cyan')) {
        ripple.style.backgroundColor = 'rgba(11, 25, 44, 0.25)';
      } else {
        ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
      }

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

/* ==========================================================================
   4. Interactive Card Spotlight & Hover Physics
   ========================================================================== */
function initCardSpotlightPhysics() {
  const cards = document.querySelectorAll('.challenge-card, .flow-step-card, .action-card, .dashboard-card, .why-card, .vertical-card, .benchmark-container-card, .cta-box');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   5. Modal Handling
   ========================================================================== */
function initAssessmentModal() {
  const modal = document.getElementById('assessment-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const cancelBtn = document.getElementById('modal-cancel-btn');
  const submitBtn = document.getElementById('modal-submit-btn');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const form = document.getElementById('assessment-form');

  function openModal() {
    if (modal) modal.classList.add('active');
  }

  function closeModal() {
    if (modal) modal.classList.remove('active');
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  submitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('modal-name');
    const emailInput = document.getElementById('modal-email');
    
    if (nameInput && !nameInput.value.trim()) {
      showToast('Please enter your full name.');
      nameInput.focus();
      return;
    }
    
    if (emailInput && !emailInput.value.trim()) {
      showToast('Please enter your corporate email address.');
      emailInput.focus();
      return;
    }

    closeModal();
    showToast('Thank you! Your assessment request has been received. Our Enterprise Solutions Director will contact you within 24h.');
    if (form) form.reset();
  });
}

/* ==========================================================================
   6. Mobile Navigation & Header Scroll
   ========================================================================== */
function initMobileNavigation() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');

  toggleBtn?.addEventListener('click', () => {
    if (navMenu) {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      navMenu.style.flexDirection = 'column';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '76px';
      navMenu.style.left = '0';
      navMenu.style.width = '100%';
      navMenu.style.background = '#0b192c';
      navMenu.style.padding = '28px';
      navMenu.style.borderBottom = '1px solid rgba(41, 181, 232, 0.35)';
      navMenu.style.boxShadow = '0 15px 40px rgba(7, 17, 30, 0.9)';
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && navMenu) {
        navMenu.style.display = 'none';
      }
    });
  });
}

function initScrollHeader() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 84;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   7. Toast Notification System
   ========================================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#29b5e8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}


/* ==========================================================================
   9. Fast Running Number Counters (0 to Target with Easing)
   ========================================================================== */
function initHeroCounters() {
  const counterElements = document.querySelectorAll('.count-up-val');
  if (!counterElements.length) return;

  let hasAnimated = false;

  function runCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    const duration = 1600; // Fast, smooth 1.6s
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      counterElements.forEach(el => {
        el.classList.add('is-counting');
        const suffix = el.getAttribute('data-suffix') || '';

        if (el.hasAttribute('data-target')) {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const current = Math.round(target * easedProgress);
          el.textContent = `${current}${suffix}`;
        } else if (el.hasAttribute('data-range-min') && el.hasAttribute('data-range-max')) {
          const minTarget = parseInt(el.getAttribute('data-range-min'), 10);
          const maxTarget = parseInt(el.getAttribute('data-range-max'), 10);
          const currentMin = Math.round(minTarget * easedProgress);
          const currentMax = Math.round(maxTarget * easedProgress);
          el.textContent = `${currentMin}-${currentMax}${suffix}`;
        }

        if (progress === 1) {
          el.classList.remove('is-counting');
          el.classList.add('is-counted');
        }
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }

  // Start counter right away or on observe
  const heroStrip = document.querySelector('.hero-trust-strip');
  if (heroStrip) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounters();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(heroStrip);
  } else {
    runCounters();
  }
}

/* ==========================================================================
   10. Interactive Fun Scroll Transitions (Parallax, Step Glow, Pipeline, Top Button)
   ========================================================================== */
function initScrollFunInteractions() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  const solutionsSection = document.getElementById('solutions');
  const processCards = document.querySelectorAll('.process-card');

  // A. Back to Top Button
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 380) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // B. Scroll Parallax on Ambient Hero Orbs
  if (orb1 || orb2) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 900) {
        if (orb1) orb1.style.transform = `translate3d(0, ${scrollY * 0.18}px, 0)`;
        if (orb2) orb2.style.transform = `translate3d(0, ${scrollY * -0.12}px, 0)`;
      }
    }, { passive: true });
  }
}


/* ==========================================================================
   11. Subtle Supply Chain Pathways, Conveyor Pulses & Inventory Highlights
   Aligns directly with the background 3D visualization:
   - Pathway A: Retail Store Checkout (Left) -> Central AI Demand Prism (Center)
   - Pathway B: Central AI -> Warehouse Conveyor & Logistics Hub (Right)
   - Pathway C: Central AI -> Automated Delivery Fleet (Bottom-Right)
   - Pulsing warehouse inventory nodes & retail highlights
   ========================================================================== */
function initHeroSubtleMotionGraphics() {
  const canvas = document.getElementById('hero-subtle-motion-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const hero = document.getElementById('hero');
  const bgWrapper = document.getElementById('hero-bg-wrapper');
  if (!hero) return;

  let width = 0;
  let height = 0;
  let animId = null;
  let isVisible = true;
  let time = 0;

  // Mouse Parallax on Background Layer only (foreground stays fixed)
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;

  if (!prefersReducedMotion && !isTouch && bgWrapper) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      mouse.targetX = nx * 12; // Gentle, restrained parallax
      mouse.targetY = ny * 8;
    }, { passive: true });

    hero.addEventListener('mouseleave', () => {
      mouse.targetX = 0;
      mouse.targetY = 0;
    }, { passive: true });
  }

  function resize() {
    const rect = hero.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  // Supply Chain Conveyor Pathways mapped to visual 3D elements
  // 1. Retail Store / Shopping Carts -> AI Prism
  // 2. AI Prism -> Logistics Hub Conveyor Portal
  // 3. AI Prism -> Fleet Dispatch
  const pathways = [
    {
      name: 'RetailToAI',
      p0: { rx: 0.18, ry: 0.62 },
      p1: { rx: 0.34, ry: 0.58 },
      p2: { rx: 0.50, ry: 0.54 },
      type: 'inbound'
    },
    {
      name: 'AIToLogistics',
      p0: { rx: 0.50, ry: 0.54 },
      p1: { rx: 0.65, ry: 0.44 },
      p2: { rx: 0.80, ry: 0.36 },
      type: 'outbound'
    },
    {
      name: 'AIToFleet',
      p0: { rx: 0.52, ry: 0.56 },
      p1: { rx: 0.68, ry: 0.64 },
      p2: { rx: 0.85, ry: 0.66 },
      type: 'fleet'
    }
  ];

  // Subtle Conveyor Flow Pulses & Data Particles
  const particles = [];
  const particleCount = 16; // Restrained count to keep background quiet and professional

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      pathwayIdx: i % pathways.length,
      t: Math.random(),
      speed: 0.0016 + Math.random() * 0.0022, // Slow, smooth movement
      size: 1.8 + Math.random() * 1.4,
      alpha: 0.35 + Math.random() * 0.45
    });
  }

  // Inventory & Logistics Node Highlights (Pulsing Ambient Rings)
  const inventoryNodes = [
    { rx: 0.80, ry: 0.36, label: 'Logistics Hub', baseR: 16, color: '#8FAADC' },
    { rx: 0.88, ry: 0.45, label: 'Warehouse Shelves', baseR: 12, color: '#2F5DA8' },
    { rx: 0.85, ry: 0.66, label: 'Fleet Route', baseR: 13, color: '#8FAADC' },
    { rx: 0.18, ry: 0.62, label: 'Store POS', baseR: 14, color: '#2F5DA8' }
  ];

  function getBezierPoint(p0, p1, p2, t) {
    const mt = 1 - t;
    return {
      x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
      y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
    };
  }

  function render() {
    if (!isVisible) return;
    time += 0.016;

    // Smooth background parallax interpolation
    if (!prefersReducedMotion && !isTouch && bgWrapper) {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      bgWrapper.style.transform = `translate3d(${mouse.x.toFixed(2)}px, ${mouse.y.toFixed(2)}px, 0)`;
    }

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Subtle Glowing Supply Chain Pathways (Along existing conveyors)
    pathways.forEach((pw) => {
      const p0 = { x: pw.p0.rx * width, y: pw.p0.ry * height };
      const p1 = { x: pw.p1.rx * width, y: pw.p1.ry * height };
      const p2 = { x: pw.p2.rx * width, y: pw.p2.ry * height };

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);

      // Faint, restrained glowing pathway
      ctx.strokeStyle = pw.type === 'inbound' 
        ? 'rgba(143, 170, 220, 0.18)' 
        : 'rgba(47, 93, 168, 0.22)';
      ctx.lineWidth = 1.6;
      ctx.stroke();
      ctx.restore();
    });

    // 2. Draw Moving Flow Particles & Light Pulses Along Conveyors
    particles.forEach((p) => {
      p.t += p.speed;
      if (p.t > 1) {
        p.t = 0;
      }

      const pw = pathways[p.pathwayIdx];
      const p0 = { x: pw.p0.rx * width, y: pw.p0.ry * height };
      const p1 = { x: pw.p1.rx * width, y: pw.p1.ry * height };
      const p2 = { x: pw.p2.rx * width, y: pw.p2.ry * height };

      const pt = getBezierPoint(p0, p1, p2, p.t);
      const prevPt = getBezierPoint(p0, p1, p2, Math.max(0, p.t - 0.035));

      // Elegant Periwinkle / Sapphire Pulse with soft trailing tail
      const pulseColor = pw.type === 'inbound' 
        ? 'rgba(143, 170, 220, ' + p.alpha + ')' 
        : 'rgba(79, 134, 219, ' + p.alpha + ')';

      ctx.save();
      // Flow tail
      ctx.beginPath();
      ctx.moveTo(prevPt.x, prevPt.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = pulseColor;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Flow head
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.size * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = '#EBF2FA';
      ctx.shadowColor = pulseColor;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.restore();
    });

    // 3. Draw Warehouse & Inventory Understated Pulsing Halos
    inventoryNodes.forEach((n, idx) => {
      const nx = n.rx * width;
      const ny = n.ry * height;
      const pulse = (Math.sin(time * 1.8 + idx * 1.5) + 1) * 0.5;

      ctx.save();
      ctx.beginPath();
      ctx.arc(nx, ny, n.baseR + pulse * 5, 0, Math.PI * 2);
      ctx.strokeStyle = n.color === '#8FAADC' 
        ? `rgba(143, 170, 220, ${0.12 + pulse * 0.16})` 
        : `rgba(47, 93, 168, ${0.14 + pulse * 0.18})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Small center soft node dot
      ctx.beginPath();
      ctx.arc(nx, ny, 2, 0, Math.PI * 2);
      ctx.fillStyle = n.color;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    });

    animId = requestAnimationFrame(render);
  }

  // IntersectionObserver to pause loop when scrolled away
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) {
        animId = requestAnimationFrame(render);
      } else if (!isVisible && animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    });
  }, { threshold: 0.05 });

  observer.observe(hero);
  animId = requestAnimationFrame(render);
}

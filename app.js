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
  initHeroSupplyChainMotionGraphics();
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
   11. Interactive Consumer, Retail & Supply Chain Flow Motion Canvas
   Visualizes Consummo's Core Architecture:
   - Consumer & Retail Shopping POS Signals (Left)
   - Real-Time Consummo AI Demand Sensing Core (Center)
   - Multi-Echelon Warehouses & Distribution Supply Fleets (Right)
   Color Palette: #EBF2FA (Ice), #8FAADC (Periwinkle), #2F5DA8 (Sapphire), #0C1F3F (Navy)
   ========================================================================== */
function initHeroSupplyChainMotionGraphics() {
  const canvas = document.getElementById('hero-motion-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const hero = document.getElementById('hero');
  if (!hero) return;

  let width = 0;
  let height = 0;
  let animId = null;
  let isVisible = true;
  let time = 0;

  // Mouse Parallax Physics
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouse.targetX = nx * 24;
    mouse.targetY = ny * 16;
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    mouse.targetX = 0;
    mouse.targetY = 0;
  }, { passive: true });

  // DPR resize handling
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

  // Supply Chain Network Nodes
  const nodes = [
    // 1. Consumer & Retail Shopping Signals (Left)
    { id: 'store', rx: 0.10, ry: 0.28, z: 1.15, type: 'consumer', label: 'Retail Store POS', icon: 'cart', baseRadius: 18 },
    { id: 'basket', rx: 0.16, ry: 0.70, z: 0.90, type: 'consumer', label: 'Shopper Demand', icon: 'bag', baseRadius: 16 },
    { id: 'omni', rx: 0.24, ry: 0.44, z: 1.25, type: 'consumer', label: 'Omnichannel Orders', icon: 'cart', baseRadius: 17 },

    // 2. Consummo AI Demand Sensing Core (Center)
    { id: 'aiCore', rx: 0.50, ry: 0.26, z: 1.40, type: 'core', label: 'Consummo AI Engine', icon: 'ai', baseRadius: 26 },

    // 3. Multi-Echelon Supply Chain & Fulfillment (Right)
    { id: 'dc', rx: 0.76, ry: 0.26, z: 1.20, type: 'supply', label: 'Regional DC', icon: 'warehouse', baseRadius: 19 },
    { id: 'plant', rx: 0.88, ry: 0.64, z: 0.95, type: 'supply', label: 'Central Warehouse', icon: 'box', baseRadius: 18 },
    { id: 'fleet', rx: 0.73, ry: 0.78, z: 1.10, type: 'supply', label: 'Fleet Replenishment', icon: 'truck', baseRadius: 17 }
  ];

  // Supply Chain Conduits (Bezier Curves)
  const conduits = [
    // Consumer Shopper signals flowing INTO Consummo AI Core
    { from: 'store', to: 'aiCore', ctrl: { rx: 0.30, ry: 0.18 }, flow: 'inbound' },
    { from: 'basket', to: 'aiCore', ctrl: { rx: 0.32, ry: 0.55 }, flow: 'inbound' },
    { from: 'omni', to: 'aiCore', ctrl: { rx: 0.36, ry: 0.32 }, flow: 'inbound' },

    // Optimized Stocking & Replenishment orders flowing OUT to Supply Chain
    { from: 'aiCore', to: 'dc', ctrl: { rx: 0.63, ry: 0.18 }, flow: 'outbound' },
    { from: 'aiCore', to: 'plant', ctrl: { rx: 0.70, ry: 0.48 }, flow: 'outbound' },
    { from: 'aiCore', to: 'fleet', ctrl: { rx: 0.62, ry: 0.60 }, flow: 'outbound' },

    // Inter-Supply Chain Replenishment link
    { from: 'dc', to: 'fleet', ctrl: { rx: 0.80, ry: 0.52 }, flow: 'supply' }
  ];

  // Dynamic Flow Packets
  const isMobile = width < 768;
  const packetCount = isMobile ? 18 : 36;
  const packets = [];

  for (let i = 0; i < packetCount; i++) {
    packets.push({
      conduitIdx: i % conduits.length,
      t: Math.random(),
      speed: 0.0025 + Math.random() * 0.0035,
      size: 2.2 + Math.random() * 1.6,
      sparkle: Math.random() * Math.PI * 2
    });
  }

  // Ambient Floating Constellation Particles
  const ambientCount = isMobile ? 12 : 24;
  const ambients = [];
  for (let i = 0; i < ambientCount; i++) {
    ambients.push({
      rx: Math.random(),
      ry: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      size: 1.2 + Math.random() * 1.6,
      alpha: 0.2 + Math.random() * 0.3
    });
  }

  // Draw Micro-Icons
  function drawIcon(type, x, y, strokeCol, fillCol) {
    ctx.save();
    ctx.strokeStyle = strokeCol;
    ctx.fillStyle = fillCol || strokeCol;
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (type === 'cart') {
      // Shopping cart
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 4);
      ctx.lineTo(x - 3.5, y - 4);
      ctx.lineTo(x - 1.5, y + 2.5);
      ctx.lineTo(x + 5, y + 2.5);
      ctx.lineTo(x + 6.5, y - 2.5);
      ctx.lineTo(x - 2.5, y - 2.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x - 0.5, y + 5.5, 1.2, 0, Math.PI * 2);
      ctx.arc(x + 4, y + 5.5, 1.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'bag') {
      // Shopping bag
      ctx.strokeRect(x - 4, y - 2, 8, 8);
      ctx.beginPath();
      ctx.arc(x, y - 2, 2.6, Math.PI, 0);
      ctx.stroke();
    } else if (type === 'ai') {
      // Hexagonal Neural Core
      const r = 7.5;
      ctx.beginPath();
      for (let a = 0; a < 6; a++) {
        const ang = (a * Math.PI) / 3;
        const px = x + Math.cos(ang) * r;
        const py = y + Math.sin(ang) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === 'warehouse') {
      // Distribution Center Warehouse
      ctx.beginPath();
      ctx.moveTo(x - 6, y - 1);
      ctx.lineTo(x, y - 6);
      ctx.lineTo(x + 6, y - 1);
      ctx.lineTo(x + 6, y + 5);
      ctx.lineTo(x - 6, y + 5);
      ctx.closePath();
      ctx.stroke();
      ctx.strokeRect(x - 1.8, y + 1, 3.6, 4);
    } else if (type === 'box') {
      // Inventory Cartons / Pallet Box
      ctx.strokeRect(x - 4.5, y - 4.5, 9, 9);
      ctx.beginPath();
      ctx.moveTo(x - 4.5, y);
      ctx.lineTo(x + 4.5, y);
      ctx.moveTo(x, y - 4.5);
      ctx.lineTo(x, y + 4.5);
      ctx.stroke();
    } else if (type === 'truck') {
      // Replenishment Fleet Cargo Truck
      ctx.strokeRect(x - 6, y - 4, 7.5, 6);
      ctx.strokeRect(x + 1.5, y - 1, 4.5, 3);
      ctx.beginPath();
      ctx.arc(x - 3.5, y + 3.8, 1.2, 0, Math.PI * 2);
      ctx.arc(x + 4, y + 3.8, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Bezier Calculation (Quadratic Curve for Smooth Fluid Movement)
  function getQuadPoint(p0, p1, p2, t) {
    const mt = 1 - t;
    const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
    const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;
    return { x, y };
  }

  // Animation Loop
  function render() {
    if (!isVisible) return;
    time += 0.016;

    // Ease mouse towards target
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    ctx.clearRect(0, 0, width, height);

    // Calculate actual pixel positions for nodes with 3D parallax
    const nodePos = {};
    nodes.forEach(n => {
      // Responsive layout adjustments
      let rx = n.rx;
      let ry = n.ry;
      if (width < 768) {
        // Compress laterally on mobile so nodes stay within screen
        rx = 0.5 + (rx - 0.5) * 0.85;
      }
      const px = rx * width + mouse.x * n.z;
      const py = ry * height + mouse.y * n.z;
      nodePos[n.id] = { x: px, y: py, ...n };
    });

    // 1. Draw Ambient Floating Mesh
    ctx.save();
    ambients.forEach(a => {
      a.rx += a.vx;
      a.ry += a.vy;
      if (a.rx < 0) a.rx = 1;
      if (a.rx > 1) a.rx = 0;
      if (a.ry < 0) a.ry = 1;
      if (a.ry > 1) a.ry = 0;

      const ax = a.rx * width;
      const ay = a.ry * height;

      ctx.beginPath();
      ctx.arc(ax, ay, a.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(143, 170, 220, ${a.alpha})`;
      ctx.fill();
    });
    ctx.restore();

    // 2. Draw Supply Chain Conduits (Bezier Tracks)
    conduits.forEach(c => {
      const from = nodePos[c.from];
      const to = nodePos[c.to];
      if (!from || !to) return;

      const ctrlX = c.ctrl.rx * width + mouse.x * 1.1;
      const ctrlY = c.ctrl.ry * height + mouse.y * 1.1;

      // Conduit Glow & Base Line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.quadraticCurveTo(ctrlX, ctrlY, to.x, to.y);

      if (c.flow === 'inbound') {
        // Shopper Demand Flow track
        ctx.strokeStyle = 'rgba(143, 170, 220, 0.22)';
        ctx.lineWidth = 1.2;
      } else if (c.flow === 'outbound') {
        // AI Replenishment track
        ctx.strokeStyle = 'rgba(47, 93, 168, 0.32)';
        ctx.lineWidth = 1.4;
      } else {
        // Inter-hub logistics track
        ctx.strokeStyle = 'rgba(143, 170, 220, 0.16)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
      }
      ctx.stroke();
      ctx.restore();
    });

    // 3. Draw Flow Packets (Dynamic Supply Chain Signals)
    packets.forEach(p => {
      p.t += p.speed;
      if (p.t > 1) {
        p.t = 0;
        p.sparkle = Math.random() * Math.PI * 2;
      }

      const conduit = conduits[p.conduitIdx];
      const from = nodePos[conduit.from];
      const to = nodePos[conduit.to];
      if (!from || !to) return;

      const ctrlX = conduit.ctrl.rx * width + mouse.x * 1.1;
      const ctrlY = conduit.ctrl.ry * height + mouse.y * 1.1;

      const pt = getQuadPoint(from, { x: ctrlX, y: ctrlY }, to, p.t);
      const prevPt = getQuadPoint(from, { x: ctrlX, y: ctrlY }, to, Math.max(0, p.t - 0.035));

      // Color scheme based on supply chain stage
      let headCol, glowCol;
      if (conduit.flow === 'inbound') {
        // Consumer purchase signals: Luminous Periwinkle
        headCol = '#EBF2FA';
        glowCol = 'rgba(143, 170, 220, 0.85)';
      } else if (conduit.flow === 'outbound') {
        // Replenishment execution: Royal Sapphire & Cyan
        headCol = '#8FAADC';
        glowCol = 'rgba(47, 93, 168, 0.95)';
      } else {
        // Logistics distribution: Ice White
        headCol = '#EBF2FA';
        glowCol = 'rgba(143, 170, 220, 0.6)';
      }

      ctx.save();
      // Flow Streamline Tail
      ctx.beginPath();
      ctx.moveTo(prevPt.x, prevPt.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.strokeStyle = glowCol;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Flow Packet Head
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, p.size * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = headCol;
      ctx.shadowColor = glowCol;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    });

    // 4. Draw Supply Chain Network Nodes & Micro-Badges
    nodes.forEach(n => {
      const pos = nodePos[n.id];
      if (!pos) return;

      const isCore = n.type === 'core';
      const rad = pos.baseRadius;
      const pulse = (Math.sin(time * 2.2 + pos.z * 2) + 1) * 0.5;

      ctx.save();

      // Outer Concentric Pulse Waves
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, rad + 4 + pulse * 7, 0, Math.PI * 2);
      ctx.strokeStyle = isCore ? `rgba(143, 170, 220, ${0.25 + pulse * 0.25})` : `rgba(143, 170, 220, ${0.12 + pulse * 0.15})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Node Outer Shadow & Glow Halo
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2);
      ctx.fillStyle = isCore ? 'rgba(12, 31, 63, 0.95)' : 'rgba(12, 31, 63, 0.85)';
      ctx.shadowColor = isCore ? 'rgba(47, 93, 168, 0.8)' : 'rgba(143, 170, 220, 0.45)';
      ctx.shadowBlur = isCore ? 20 : 12;
      ctx.fill();

      // Node Rim Border
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, rad, 0, Math.PI * 2);
      ctx.strokeStyle = isCore ? '#8FAADC' : 'rgba(143, 170, 220, 0.6)';
      ctx.lineWidth = isCore ? 2 : 1.3;
      ctx.stroke();

      // Node Center Micro-Icon
      const iconStroke = isCore ? '#EBF2FA' : '#8FAADC';
      drawIcon(n.icon, pos.x, pos.y, iconStroke);

      // Micro-Label underneath (hidden on narrow screens to prevent crowding)
      if (width >= 600) {
        ctx.font = isCore ? '700 10.5px "JetBrains Mono", monospace' : '600 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.letterSpacing = '0.04em';
        ctx.fillStyle = isCore ? '#EBF2FA' : 'rgba(235, 242, 250, 0.75)';
        ctx.shadowBlur = 0;
        ctx.fillText(n.label, pos.x, pos.y + rad + 14);
      }

      ctx.restore();
    });

    animId = requestAnimationFrame(render);
  }

  // IntersectionObserver to pause loop when scrolled away
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
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

/**
 * Consumo - AI-Powered Intelligence for FMCG & Retail
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

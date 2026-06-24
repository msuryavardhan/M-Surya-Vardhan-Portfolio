/* ============================================================
   script_v4.js — Premium Silicon Die Portfolio v4
   M Surya Vardhan · M.Tech VLSI Design Student · VIT Chennai
   Adds: project carousels, cert modal, image fallbacks,
         lazy-load skeletons, swipe support.
   ============================================================ */

'use strict';

/* ── PRELOADER ── */
window.addEventListener('load', () => {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  setTimeout(() => {
    pre.style.opacity = '0';
    pre.style.transition = 'opacity 0.55s ease';
    setTimeout(() => pre.remove(), 600);
  }, 1400);
});

/* ── MAIN INIT ── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── PARTICLES.JS ── */
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 44, density: { enable: true, value_area: 1000 } },
        color: { value: ['#A3FF12', '#00E5FF', '#ffffff'] },
        shape: { type: 'circle' },
        opacity: {
          value: 0.20, random: true,
          anim: { enable: true, speed: 0.6, opacity_min: 0.04, sync: false }
        },
        size: { value: 1.6, random: true, anim: { enable: false } },
        line_linked: { enable: true, distance: 160, color: '#A3FF12', opacity: 0.045, width: 0.5 },
        move: { enable: true, speed: 0.45, direction: 'none', random: true, straight: false, out_mode: 'out' }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true
        },
        modes: {
          grab: { distance: 130, line_linked: { opacity: 0.16 } },
          push: { particles_nb: 2 }
        }
      },
      retina_detect: true
    });
  }

  /* ── AOS ── */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 850, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', once: true, offset: 50 });
  }

  /* ── NAVBAR SCROLL ── */
  const navbar = document.querySelector('.navbar');
  let lastY = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', y > 60);
      if (y > lastY + 5 && y > 200) navbar.classList.add('nav-hidden');
      else if (y < lastY - 5) navbar.classList.remove('nav-hidden');
    }
    lastY = y;
  }, { passive: true });

  /* ── ACTIVE NAV HIGHLIGHT ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.25 });
  sections.forEach(s => sectionObserver.observe(s));

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      document.querySelector('.mobile-menu')?.classList.remove('open');
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── MOBILE MENU ── */
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobClose   = document.querySelector('.mob-close');
  hamburger && hamburger.addEventListener('click', () => mobileMenu?.classList.add('open'));
  mobClose  && mobClose.addEventListener('click',  () => mobileMenu?.classList.remove('open'));
  document.querySelectorAll('.mobile-menu a').forEach(a =>
    a.addEventListener('click', () => mobileMenu?.classList.remove('open'))
  );
  hamburger && hamburger.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') mobileMenu?.classList.add('open');
  });

  /* ── GLITCH ON NAME ── */
  const nameEl = document.querySelector('.h-name');
  if (nameEl) {
    setInterval(() => {
      nameEl.classList.add('glitching');
      setTimeout(() => nameEl.classList.remove('glitching'), 300);
    }, 5000);
  }

  /* ── COUNTER ANIMATION ── */
  const counters = document.querySelectorAll('.counter[data-target]');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const dur    = 1800;
        const start  = performance.now();
        const run = (now) => {
          const p    = Math.min((now - start) / dur, 1);
          const ease = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = Math.floor(ease * target);
          if (p < 1) requestAnimationFrame(run);
          else el.textContent = target;
        };
        requestAnimationFrame(run);
        counterObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* ── CHIP HOVER — BLOOM BOOST ── */
  const chipWrapper = document.querySelector('.chip-wrapper');
  const bloom       = document.querySelector('.hero-bloom');
  if (chipWrapper && bloom) {
    chipWrapper.addEventListener('mouseenter', () => {
      bloom.style.transition = 'transform 0.55s ease, opacity 0.55s ease';
      bloom.style.transform  = 'translate(-50%,-50%) scale(1.14)';
      bloom.style.opacity    = '1';
    });
    chipWrapper.addEventListener('mouseleave', () => {
      bloom.style.transform = 'translate(-50%,-50%) scale(1)';
      bloom.style.opacity   = '0.80';
    });
  }

  /* ── CHIP PARALLAX TILT ── */
  const heroEl  = document.querySelector('.hero');
  const chipSvg = document.querySelector('.silicon-chip');
  if (heroEl && chipSvg) {
    let ticking = false;
    heroEl.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = heroEl.getBoundingClientRect();
        const dx   = (e.clientX - (rect.left + rect.width  / 2)) / rect.width;
        const dy   = (e.clientY - (rect.top  + rect.height / 2)) / rect.height;
        const mx   = 7;
        chipSvg.style.transition = 'transform 0.10s linear';
        chipSvg.style.transform  = `perspective(1000px) rotateX(${(-dy * mx).toFixed(2)}deg) rotateY(${(dx * mx).toFixed(2)}deg)`;
        ticking = false;
      });
    });
    heroEl.addEventListener('mouseleave', () => {
      chipSvg.style.transition = 'transform 0.65s cubic-bezier(0.16,1,0.3,1)';
      chipSvg.style.transform  = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  }

  /* ── SKILL TILES — MOUSE-FOLLOW GLOW ── */
  document.querySelectorAll('.skill-tile').forEach(tile => {
    tile.addEventListener('mousemove', (e) => {
      const rect = tile.getBoundingClientRect();
      tile.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      tile.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  /* ── PROJECT CARD 3D TILT ── */
  document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 20;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 20;
      card.style.transform = `translateY(-8px) perspective(600px) rotateY(${x * 0.3}deg) rotateX(${-y * 0.3}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform  = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), border-color 0.35s, box-shadow 0.35s';
    });
  });

  /* ── BACK TO TOP ── */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── SCROLL HINT FADE ── */
  const hint = document.querySelector('.scroll-hint');
  if (hint) {
    window.addEventListener('scroll', () => {
      hint.style.opacity = window.scrollY > 80 ? '0' : '1';
    }, { passive: true });
  }

  /* ============================================================
     v4 FEATURE INIT
     ============================================================ */

  initImageFallbacks();
  initProjectCarousels();
  initCertModal();

  /* ── CONSOLE — student branding ── */
  console.log('%c⬡ M SURYA VARDHAN', 'color:#A3FF12;font-size:22px;font-weight:900;font-family:monospace;');
  console.log('%cM.Tech VLSI Design Student · VIT Chennai', 'color:#00E5FF;font-size:13px;font-family:monospace;');
  console.log('%c──────────────────────────────────────────────', 'color:rgba(163,255,18,0.25);');
  console.log('%c  Interests: ASIC Physical Design · FPGA · RTL Design · Semiconductor Systems', 'color:rgba(255,255,255,0.4);font-family:monospace;font-size:11px;');
  console.log('%c  EDA: Cadence Genus · Innovus · Tempus · gpdk90', 'color:rgba(255,255,255,0.4);font-family:monospace;font-size:11px;');
  console.log('%c  Contact: msuryavar@gmail.com', 'color:rgba(163,255,18,0.55);font-family:monospace;font-size:11px;');
  console.log('%c  v4: Image carousels · Cert gallery · Modal viewer', 'color:rgba(0,229,255,0.45);font-family:monospace;font-size:11px;');

}); /* end DOMContentLoaded */

/* ============================================================
   IMAGE FALLBACKS
   Watches every .proj-slide-img and .cert-thumb-img.
   On error → shows placeholder. On load → removes skeleton.
   ============================================================ */
function initImageFallbacks() {

  /* Project slide images */
  document.querySelectorAll('.proj-slide-img').forEach(img => {
    const slide = img.closest('.carousel-slide');
    const ph    = slide ? slide.querySelector('.proj-slide-ph') : null;
    const skel  = slide ? slide.querySelector('.img-skel') : null;

    const onLoad = () => {
      if (skel) skel.classList.add('done');
      /* Image loaded successfully — keep placeholder hidden */
    };

    const onError = () => {
      img.classList.add('ph-active');
      if (ph)   ph.classList.add('ph-visible');
      if (skel) skel.classList.add('done');
    };

    if (img.complete) {
      if (img.naturalWidth === 0) onError(); else onLoad();
    } else {
      img.addEventListener('load',  onLoad,  { once: true });
      img.addEventListener('error', onError, { once: true });
    }
  });

  /* Cert thumbnail images */
  document.querySelectorAll('.cert-thumb-img').forEach(img => {
    const wrap = img.closest('.cert-thumb-wrap');
    const ph   = wrap ? wrap.querySelector('.cert-thumb-ph') : null;
    const skel = wrap ? wrap.querySelector('.img-skel') : null;

    const onLoad = () => {
      if (skel) skel.classList.add('done');
    };

    const onError = () => {
      img.classList.add('ph-active');
      if (ph)   ph.classList.add('ph-visible');
      if (skel) skel.classList.add('done');
    };

    if (img.complete) {
      if (img.naturalWidth === 0) onError(); else onLoad();
    } else {
      img.addEventListener('load',  onLoad,  { once: true });
      img.addEventListener('error', onError, { once: true });
    }
  });
}

/* ============================================================
   PROJECT CAROUSELS
   Each .proj-carousel with data-carousel attribute gets:
   - Slide tracking
   - Dot click navigation
   - Prev / Next button navigation
   - Touch / swipe support
   - Keyboard arrow navigation (when focused)
   ============================================================ */
function initProjectCarousels() {

  document.querySelectorAll('.proj-carousel').forEach(carousel => {
    const track  = carousel.querySelector('.carousel-track');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const dots   = carousel.querySelectorAll('.car-dot');
    const prevBtn = carousel.querySelector('.car-prev');
    const nextBtn = carousel.querySelector('.car-next');

    if (!track || slides.length === 0) return;

    let current = 0;
    const total = slides.length;

    /* Mark single-slide carousels (hides controls via CSS) */
    if (total <= 1) {
      carousel.setAttribute('data-single', 'true');
      return;
    }

    function goTo(idx) {
      idx = ((idx % total) + total) % total;
      current = idx;
      track.style.transform = `translateX(-${current * 100}%)`;

      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    /* Dot clicks */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goTo(i));
    });

    /* Arrow buttons */
    prevBtn && prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(current - 1);
    });
    nextBtn && nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goTo(current + 1);
    });

    /* Touch / swipe */
    let touchStartX = 0;
    let touchDeltaX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
    }, { passive: true });
    carousel.addEventListener('touchmove', (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });
    carousel.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > 40) {
        goTo(touchDeltaX < 0 ? current + 1 : current - 1);
      }
    });

    /* Keyboard (when card is focused) */
    const card = carousel.closest('.proj-card');
    if (card) {
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); }
      });
    }

    /* Init at slide 0 */
    goTo(0);
  });
}

/* ============================================================
   CERTIFICATION MODAL
   Opens when any .cert-thumb-wrap is clicked.
   Reads data-cert-img, data-cert-name, data-cert-issuer.
   Closes on ✕ button, backdrop click, or Escape key.
   ============================================================ */
function initCertModal() {
  const modal    = document.getElementById('certModal');
  if (!modal) return;

  const backdrop  = modal.querySelector('.cert-modal-backdrop');
  const closeBtn  = modal.querySelector('.cert-modal-close');
  const modalImg  = modal.querySelector('.cert-modal-img');
  const modalPh   = modal.querySelector('.cert-modal-ph');
  const modalName = modal.querySelector('.cert-modal-name');
  const modalIssuer = modal.querySelector('.cert-modal-issuer');

  /* Open modal */
  function openModal(imgSrc, name, issuer) {
    /* Reset state */
    modalImg.src = '';
    modalImg.alt = name || 'Certificate';
    modalImg.classList.remove('ph-active');
    modalPh && modalPh.classList.remove('ph-visible');

    /* Populate info */
    if (modalName)   modalName.textContent   = name   || '';
    if (modalIssuer) modalIssuer.textContent = issuer || '';

    /* Update ph path hint */
    const phPath = modal.querySelector('.cert-modal-ph-path');
    if (phPath && imgSrc) phPath.textContent = imgSrc;

    /* Load image */
    if (imgSrc) {
      const tempImg = new Image();
      tempImg.onload = () => {
        modalImg.src = imgSrc;
        modalImg.classList.remove('ph-active');
        if (modalPh) modalPh.classList.remove('ph-visible');
      };
      tempImg.onerror = () => {
        modalImg.classList.add('ph-active');
        if (modalPh) modalPh.classList.add('ph-visible');
      };
      tempImg.src = imgSrc;
    } else {
      modalImg.classList.add('ph-active');
      if (modalPh) modalPh.classList.add('ph-visible');
    }

    /* Show modal */
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    /* Focus close button for accessibility */
    setTimeout(() => closeBtn && closeBtn.focus(), 350);
  }

  /* Close modal */
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    /* Clear src after transition */
    setTimeout(() => {
      if (modalImg) modalImg.src = '';
    }, 320);
  }

  /* Close triggers */
  closeBtn  && closeBtn.addEventListener('click', closeModal);
  backdrop  && backdrop.addEventListener('click', closeModal);

  /* Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });

  /* Bind all cert-thumb-wrap elements */
  document.querySelectorAll('.cert-thumb-wrap').forEach(wrap => {
    const imgSrc = wrap.dataset.certImg    || '';
    const name   = wrap.dataset.certName   || '';
    const issuer = wrap.dataset.certIssuer || '';

    wrap.addEventListener('click', () => openModal(imgSrc, name, issuer));

    /* Keyboard accessibility */
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(imgSrc, name, issuer);
      }
    });
  });
}

/* ── RESIZE → REFRESH AOS ── */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (typeof AOS !== 'undefined') AOS.refresh();
  }, 250);
});

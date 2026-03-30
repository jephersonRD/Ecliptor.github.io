document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initScrollAnimations();
  initUserMenu();
  initMobileNav();
  initAuth();
  init3DTilt();
  initCursorGlow();
  initCounters();
  initTypingEffect();
  initButtonRipple();
});

/* ==================== HEADER SCROLL ==================== */
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ==================== SCROLL ANIMATIONS ==================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ==================== USER MENU ==================== */
function initUserMenu() {
  const userBtn = document.querySelector('.nav-user');
  const userMenu = document.querySelector('.user-menu');
  if (!userBtn || !userMenu) return;

  userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.classList.remove('active');
    }
  });
}

/* ==================== MOBILE NAV ==================== */
function initMobileNav() {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    nav.classList.toggle('active');
    const icon = btn.querySelector('i');
    if (nav.classList.contains('active')) {
      icon.className = 'fas fa-times';
    } else {
      icon.className = 'fas fa-bars';
    }
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      btn.querySelector('i').className = 'fas fa-bars';
    });
  });
}

/* ==================== AUTH ==================== */
function initAuth() {
  const isAuthenticated = localStorage.getItem('userAuth');
  const userAuth = isAuthenticated ? JSON.parse(isAuthenticated) : null;

  const navUser = document.querySelector('.nav-user');
  const navCta = document.querySelector('.nav-cta');
  const heroBtn = document.querySelector('#hero-primary-btn');

  if (userAuth) {
    if (navUser) navUser.style.display = 'flex';
    if (navCta) navCta.style.display = 'none';
    if (heroBtn) heroBtn.href = 'download.html';

    const userName = document.querySelector('#userName');
    const userAvatar = document.querySelector('#userAvatar');
    if (userName) userName.textContent = userAuth.username || userAuth.email?.split('@')[0] || 'Usuario';
    if (userAvatar && userAuth.profilePic) userAvatar.src = userAuth.profilePic;
  } else {
    if (navUser) navUser.style.display = 'none';
    if (navCta) navCta.style.display = 'inline-flex';
    if (heroBtn) heroBtn.href = 'login.html';
  }
}

function handleLogout() {
  localStorage.removeItem('userAuth');
  window.location.reload();
}

/* ==================== AUTH FORM ==================== */
function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      document.getElementById('profilePreview').src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const profilePic = document.getElementById('profilePreview').src;

  let valid = true;

  if (!isValidEmail(email)) {
    document.getElementById('emailError').classList.add('visible');
    valid = false;
  } else {
    document.getElementById('emailError').classList.remove('visible');
  }

  if (password.length < 6) {
    document.getElementById('passwordError').classList.add('visible');
    valid = false;
  } else {
    document.getElementById('passwordError').classList.remove('visible');
  }

  if (!valid) return false;

  localStorage.setItem('userAuth', JSON.stringify({
    username,
    email,
    profilePic,
    loginMethod: 'email'
  }));

  window.location.href = 'index.html';
  return false;
}

function toggleForm() {
  const title = document.querySelector('.auth-subtitle');
  const submitBtn = document.querySelector('.auth-submit');
  const toggleLink = document.querySelector('.toggle-link');
  const usernameField = document.getElementById('username')?.parentElement;
  const profileSection = document.querySelector('.profile-upload');

  if (!title) return;

  if (title.textContent.includes('Crear cuenta')) {
    title.textContent = 'Inicia sesión para continuar';
    if (submitBtn) submitBtn.textContent = 'Iniciar Sesión';
    if (toggleLink) toggleLink.textContent = 'Crear cuenta nueva';
    if (usernameField) usernameField.style.display = 'none';
    if (profileSection) profileSection.style.display = 'none';
  } else {
    title.textContent = 'Crea tu cuenta para comenzar';
    if (submitBtn) submitBtn.textContent = 'Crear Cuenta';
    if (toggleLink) toggleLink.textContent = 'Iniciar Sesión';
    if (usernameField) usernameField.style.display = 'block';
    if (profileSection) profileSection.style.display = 'flex';
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ==================== SMOOTH SCROLL ==================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ==================== 3D TILT EFFECT ==================== */
function init3DTilt() {
  const cards = document.querySelectorAll('.hero-3d-card');
  if (!cards.length) return;

  cards.forEach(card => {
    const img = card.querySelector('img');
    const shine = card.querySelector('.hero-image-shine');
    const badges = card.querySelectorAll('.badge-3d');

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let animating = false;

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function animate() {
      currentX = lerp(currentX, targetX, 0.12);
      currentY = lerp(currentY, targetY, 0.12);

      if (img) {
        img.style.transform = 'rotateX(' + (-currentY * 10) + 'deg) rotateY(' + (currentX * 10) + 'deg) scale(1.03)';
      }

      badges.forEach(function(badge, i) {
        var depth = 6 + (i * 4);
        badge.style.transform = 'translate(' + (currentX * depth) + 'px, ' + (currentY * depth) + 'px)';
      });

      if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
        requestAnimationFrame(animate);
      } else {
        animating = false;
      }
    }

    function startAnimation() {
      if (!animating) {
        animating = true;
        requestAnimationFrame(animate);
      }
    }

    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      if (shine) {
        shine.style.setProperty('--shine-x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        shine.style.setProperty('--shine-y', ((e.clientY - rect.top) / rect.height * 100) + '%');
      }

      startAnimation();
    });

    card.addEventListener('mouseleave', function() {
      targetX = 0;
      targetY = 0;
      startAnimation();
    });
  });
}

/* ==================== CURSOR GLOW ==================== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  let ticking = false;

  document.addEventListener('mousemove', function(e) {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(function() {
        glow.style.transform = 'translate3d(' + (e.clientX - 250) + 'px, ' + (e.clientY - 250) + 'px, 0)';
        ticking = false;
      });
    }
  }, { passive: true });
}

/* ==================== ANIMATED COUNTERS ==================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-value');
  if (!counters.length) return;

  let started = false;

  function startCounting() {
    if (started) return;
    started = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const suffix = counter.dataset.suffix || '';
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        counter.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounting();
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ==================== TYPING EFFECT ==================== */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const words = ['Sin Límites', 'Sin Barreras', 'En Local', 'Sin GPU', 'Gratis'];
  let wordIndex = 0;
  let charIndex = words[0].length;
  let isDeleting = true;
  let speed = 60;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex--;
      el.textContent = currentWord.substring(0, charIndex);
      speed = 40;

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 300;
      }
    } else {
      const nextWord = words[wordIndex];
      charIndex++;
      el.textContent = nextWord.substring(0, charIndex);
      speed = 80;

      if (charIndex === nextWord.length) {
        isDeleting = true;
        speed = 2000;
      }
    }

    setTimeout(type, speed);
  }

  setTimeout(type, 1500);
}

/* ==================== BUTTON RIPPLE ==================== */
function initButtonRipple() {
  const btns = document.querySelectorAll('.btn-primary');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      btn.style.setProperty('--ripple-x', x + '%');
      btn.style.setProperty('--ripple-y', y + '%');
    });
  });
}

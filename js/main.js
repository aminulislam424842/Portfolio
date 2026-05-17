// ===== Dark Mode =====
const themeToggle = document.getElementById('themeToggle');
const sunIcon = themeToggle.querySelector('.sun-icon');
const moonIcon = themeToggle.querySelector('.moon-icon');

function getTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  } else {
    document.documentElement.classList.remove('dark');
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  }
}

applyTheme(getTheme());
themeToggle.addEventListener('click', () => {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', next);
  applyTheme(next);
});

// ===== Mobile Menu =====
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() {
  mobileMenu.classList.add('open');
  menuOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);
mobileLinks.forEach(l => l.addEventListener('click', closeMenu));

// ===== Scroll Reveal =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { root: null, rootMargin: '0px', threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== Skill Bars =====
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const w = fill.getAttribute('data-width');
        setTimeout(() => { fill.style.width = w + '%'; }, 200);
      });
      const pcts = entry.target.querySelectorAll('.skill-percent');
      pcts.forEach(pct => {
        const t = parseInt(pct.getAttribute('data-value'));
        animateCounter(pct, 0, t, 1200, '%');
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));

// ===== Counter =====
function animateCounter(el, start, end, dur, suffix) {
  const t0 = performance.now();
  function step(now) {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(start + (end - start) * eased) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.counter').forEach(c => {
        animateCounter(c, 0, parseInt(c.getAttribute('data-target')), 2000, '');
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px', threshold: 0.1 }); 

const countersContainer = document.querySelector('.hero-stats');
if (countersContainer) {
  counterObserver.observe(countersContainer);
} else {
  document.querySelectorAll('.counter').forEach(c => {
    animateCounter(c, 0, parseInt(c.getAttribute('data-target')), 2000, '');
  });

}

// ===== Contact Form =====
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const message = document.getElementById('messageInput').value.trim();

  if (!name || !email || !message) {
    showToast('Oops!', 'Please fill in all required fields.', 'warning');
    return;
  }

  const btn = this.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '<svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.innerHTML = orig;
    btn.disabled = false;
    this.reset();
    showToast('Message Sent!', 'Thanks ' + name + '! I\'ll get back to you soon.', 'success');
  }, 1500);
});

// ===== Toast =====
function showToast(title, message, type) {
  const toast = document.getElementById('toast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMessage').textContent = message;

  const iconWrap = document.getElementById('toastIcon');
  if (type === 'warning') {
    iconWrap.className = 'toast-icon toast-icon-warning';
  } else {
    iconWrap.className = 'toast-icon toast-icon-success';
  }

  toast.classList.add('show');
  setTimeout(hideToast, 5000);
}

function hideToast() {
  document.getElementById('toast').classList.remove('show');
}

// ===== Download CV =====
function downloadCV() {
  showToast('CV Download', 'CV download will start shortly. (Demo — add your real PDF link!)', 'success');
}

// ===== Nav scroll shadow =====
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});
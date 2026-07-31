/**
 * login.js — Login Page JavaScript
 * Government Services Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  initLoginAnimations();
  initLoginForm();
  initPasswordToggle();
});

/* ── Page Entry Animations ───────────────────────────────── */
function initLoginAnimations() {
  // Left panel
  gsap.fromTo('.login-visual-content', { opacity: 0, x: -40 }, {
    opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.3
  });

  // Right form
  gsap.fromTo('.login-form-wrapper', { opacity: 0, x: 40 }, {
    opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.4
  });

  // Particles float
  gsap.to('.login-particle-1', { y: -20, duration: 5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  gsap.to('.login-particle-2', { y: -15, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 0.8 });
  gsap.to('.login-particle-3', { y: -10, duration: 4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 1.2 });
}

/* ── Login Form Handler ──────────────────────────────────── */
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    // Get selected radio role
    const role = document.querySelector('input[name="role"]:checked')?.value;
    const btn = document.getElementById('loginBtn');

    if (!role) return;

    // Loading state
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in...';
    btn.disabled = true;

    // Save email in localStorage
    localStorage.setItem('loggedInUser', document.getElementById('loginEmail').value);

    // Simulate authentication check, then direct navigation
    setTimeout(() => {
      const dest = role === 'officer' ? 'officer-dashboard.html' : 'citizen-dashboard.html';

      // Page out animation
      const overlay = document.querySelector('.page-transition-overlay');
      if (overlay) {
        gsap.fromTo(overlay,
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 0.6, ease: 'power3.inOut', onComplete: () => {
            window.location.href = dest;
          }}
        );
      } else {
        window.location.href = dest;
      }
    }, 1000);
  });
}

/* ── Form Validation ─────────────────────────────────────── */
function validateLoginForm() {
  let valid = true;

  const email    = document.getElementById('loginEmail');
  const password = document.getElementById('loginPassword');
  const emailErr = document.getElementById('emailError');
  const pwdErr   = document.getElementById('passwordError');

  // Reset
  [email, password].forEach(el => el.classList.remove('error'));
  [emailErr, pwdErr].forEach(el => el.classList.remove('visible'));

  // Validate email
  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value || !emailRx.test(email.value)) {
    email.classList.add('error');
    emailErr.classList.add('visible');
    gsap.fromTo(email, { x: 0 }, { x: [-8, 8, -6, 6, 0], duration: 0.4, ease: 'power2.inOut' });
    valid = false;
  }

  // Validate password
  if (!password.value || password.value.length < 2) {
    password.classList.add('error');
    pwdErr.classList.add('visible');
    if (valid) gsap.fromTo(password, { x: 0 }, { x: [-8, 8, -6, 6, 0], duration: 0.4, ease: 'power2.inOut' });
    valid = false;
  }

  return valid;
}

/* ── Password Toggle ─────────────────────────────────────── */
function initPasswordToggle() {
  const btn  = document.getElementById('togglePwd');
  const icon = document.getElementById('togglePwdIcon');
  const pwd  = document.getElementById('loginPassword');
  if (!btn || !pwd) return;

  btn.addEventListener('click', () => {
    const isHidden = pwd.type === 'password';
    pwd.type = isHidden ? 'text' : 'password';
    icon.classList.toggle('fa-eye', !isHidden);
    icon.classList.toggle('fa-eye-slash', isHidden);
  });
}

// ─── EmailJS config ───────────────────────────────────────────────
// Replace these three values with your own from emailjs.com dashboard
const EMAILJS_PUBLIC_KEY  = 'gj_v7iaa1qEJpcwb7';   // Account → Public Key
const EMAILJS_SERVICE_ID  = 'service_uurg2o7';   // Email Services → Service ID
const EMAILJS_TEMPLATE_ID = 'template_7ft48os';  // Email Templates → Template ID
// ──────────────────────────────────────────────────────────────────

emailjs.init(EMAILJS_PUBLIC_KEY);

// Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

// Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// Scroll-reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.platform-card, .pillar-card, .tech-card, .roadmap-content, .scenario-card, .contact-left, .contact-form, .tech-layer, .founder-img-wrap, .founder-text, .hiring-card'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.6s ease ${(i % 6) * 70}ms, transform 0.6s ease ${(i % 6) * 70}ms`;
  observer.observe(el);
});

// ─── Apply Modal ──────────────────────────────────────────────────
const applyModal    = document.getElementById('apply-modal');
const applyForm     = document.getElementById('apply-form');
const applySubmitBtn = document.getElementById('apply-submit-btn');
const applyFormMsg  = document.getElementById('apply-form-msg');

function openApply(el) {
  const role = el.getAttribute('data-role');
  document.getElementById('modal-role-tag').textContent = role;
  document.getElementById('modal-title').textContent = 'Apply — ' + role;
  document.getElementById('a-role').value = role;
  applyModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

document.getElementById('modal-close').addEventListener('click', closeApply);
applyModal.addEventListener('click', (e) => { if (e.target === applyModal) closeApply(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeApply(); });

function closeApply() {
  applyModal.classList.remove('open');
  document.body.style.overflow = '';
  applyForm.reset();
  applyFormMsg.textContent = '';
  applyFormMsg.className = 'form-note';
  applySubmitBtn.textContent = 'Submit application →';
  applySubmitBtn.disabled = false;
  applySubmitBtn.style.background = '';
}

applyForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  applySubmitBtn.textContent = 'Sending…';
  applySubmitBtn.disabled = true;
  applyFormMsg.textContent = '';
  applyFormMsg.className = 'form-note';

  const templateParams = {
    name:       document.getElementById('a-name').value,
    email:      document.getElementById('a-email').value,
    phone:      document.getElementById('a-phone').value,
    experience: document.getElementById('a-experience').value,
    portfolio:  document.getElementById('a-portfolio').value,
    message:    document.getElementById('a-cover').value,
    interest:   document.getElementById('a-role').value,
    org:        'Job Application — ' + document.getElementById('a-role').value,
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    applySubmitBtn.textContent = 'Application sent ✓';
    applySubmitBtn.style.background = '#059669';
    applyFormMsg.textContent = "We'll review your application and get back to you soon.";
    applyFormMsg.classList.add('form-note--success');
    applyForm.reset();
    setTimeout(closeApply, 3000);
  } catch (err) {
    console.error('EmailJS error:', err);
    applySubmitBtn.textContent = 'Submit application →';
    applySubmitBtn.disabled = false;
    applyFormMsg.textContent = 'Something went wrong. Email us directly at developeranis123@gmail.com';
    applyFormMsg.classList.add('form-note--error');
  }
});

const form      = document.getElementById('briefing-form');
const submitBtn = document.getElementById('submit-btn');
const formMsg   = document.getElementById('form-msg');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  submitBtn.textContent = 'Sending…';
  submitBtn.disabled = true;
  formMsg.textContent = '';
  formMsg.className = 'form-note';

  const templateParams = {
    name:     form.querySelector('#name').value,
    org:      form.querySelector('#org').value,
    email:    form.querySelector('#email').value,
    interest: form.querySelector('#interest').value,
    message:  form.querySelector('#message').value,
  };

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);

    submitBtn.textContent = 'Briefing request sent ✓';
    submitBtn.style.background = '#059669';
    formMsg.textContent = "We'll be in touch within 24 hours.";
    formMsg.classList.add('form-note--success');
    form.reset();

    setTimeout(() => {
      submitBtn.textContent = 'Request briefing →';
      submitBtn.style.background = '';
      submitBtn.disabled = false;
    }, 4000);

  } catch (err) {
    console.error('EmailJS error:', err);
    submitBtn.textContent = 'Request briefing →';
    submitBtn.disabled = false;
    formMsg.textContent = 'Something went wrong. Please email developeranis123@gmail.com directly.';
    formMsg.classList.add('form-note--error');
  }
});

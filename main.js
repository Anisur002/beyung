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
  '.platform-card, .pillar-card, .tech-card, .roadmap-content, .scenario-card, .contact-left, .contact-form, .tech-layer, .founder-img-wrap, .founder-text, .hiring-card, .leader-card'
).forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = `opacity 0.6s ease ${(i % 6) * 70}ms, transform 0.6s ease ${(i % 6) * 70}ms`;
  observer.observe(el);
});

// ─── Apply Modal ──────────────────────────────────────────────────
const applyModal     = document.getElementById('apply-modal');
const applyForm      = document.getElementById('apply-form');
const applySubmitBtn = document.getElementById('apply-submit-btn');
const applyFormMsg   = document.getElementById('apply-form-msg');
const resumeInput    = document.getElementById('a-resume');
const fileUploadWrap = document.getElementById('file-upload-wrap');
const fileUploadText = document.getElementById('file-upload-text');
const fileError      = document.getElementById('file-error');

// File input UI feedback
resumeInput.addEventListener('change', () => {
  const file = resumeInput.files[0];
  fileError.textContent = '';
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      fileError.textContent = 'File too large. Max 5MB.';
      resumeInput.value = '';
      fileUploadWrap.classList.remove('has-file');
      fileUploadText.textContent = 'Click to upload or drag & drop';
      return;
    }
    fileUploadWrap.classList.add('has-file');
    fileUploadText.textContent = '📄 ' + file.name;
  } else {
    fileUploadWrap.classList.remove('has-file');
    fileUploadText.textContent = 'Click to upload or drag & drop';
  }
});

function openApply(el) {
  const role = el.getAttribute('data-role');
  document.getElementById('modal-role-tag').textContent = role;
  document.getElementById('modal-title').textContent = 'Apply — ' + role;
  document.getElementById('a-role').value = role;
  document.getElementById('a-subject').value = 'Job Application — ' + role;
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
  fileUploadWrap.classList.remove('has-file');
  fileUploadText.textContent = 'Click to upload or drag & drop';
  fileError.textContent = '';
}

applyForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name  = document.getElementById('a-name').value.trim();
  const email = document.getElementById('a-email').value.trim();
  const cover = document.getElementById('a-cover').value.trim();
  const file  = resumeInput.files[0];

  if (!name || !email || !cover) {
    applyFormMsg.textContent = 'Please fill in all required fields.';
    applyFormMsg.className = 'form-note form-note--error';
    return;
  }
  if (!file) {
    fileError.textContent = 'Please upload your resume.';
    return;
  }

  applySubmitBtn.textContent = 'Sending…';
  applySubmitBtn.disabled = true;
  applyFormMsg.textContent = '';
  applyFormMsg.className = 'form-note';

  const role = document.getElementById('a-role').value;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('phone', document.getElementById('a-phone').value || '—');
  formData.append('experience', document.getElementById('a-experience').value || '—');
  formData.append('portfolio', document.getElementById('a-portfolio').value || '—');
  formData.append('message', cover);
  formData.append('role', role);
  formData.append('resume', file, file.name);

  try {
    // Formspree endpoint — replace xwkgpqna with your Formspree form ID
    // Sign up free at formspree.io → New Form → copy the ID from the endpoint
    const res = await fetch('https://formspree.io/f/xbdvpwol', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    });
    const data = await res.json();

    if (res.ok) {
      applySubmitBtn.textContent = 'Application sent ✓';
      applySubmitBtn.style.background = '#059669';
      applyFormMsg.textContent = "We'll review your application and get back to you soon.";
      applyFormMsg.className = 'form-note form-note--success';
      applyForm.reset();
      fileUploadWrap.classList.remove('has-file');
      fileUploadText.textContent = 'Click to upload or drag & drop';
      setTimeout(closeApply, 3000);
    } else {
      throw new Error(data.error || 'Submission failed');
    }
  } catch (err) {
    console.error('Submission error:', err);
    applySubmitBtn.textContent = 'Submit application →';
    applySubmitBtn.disabled = false;
    applyFormMsg.textContent = 'Something went wrong. Please email developeranis123@gmail.com directly.';
    applyFormMsg.className = 'form-note form-note--error';
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

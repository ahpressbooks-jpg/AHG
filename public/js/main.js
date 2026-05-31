document.addEventListener('DOMContentLoaded', () => {

  // Mobile nav toggle
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('open');
      document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Nav scroll effect
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Fade-in on scroll
  const fadeEls = document.querySelectorAll('.fade-in');
  if (fadeEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    fadeEls.forEach(el => observer.observe(el));
  }

  // Accordion
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const body = item.querySelector('.accordion-body');
      const isOpen = item.classList.contains('open');

      item.closest('.accordion').querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.accordion-body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  // Membership billing toggle
  const billingToggle = document.querySelector('.toggle-switch');
  if (billingToggle) {
    billingToggle.addEventListener('click', () => {
      billingToggle.classList.toggle('active');
      const isYearly = billingToggle.classList.contains('active');
      document.querySelector('.toggle-monthly').classList.toggle('active', !isYearly);
      document.querySelector('.toggle-yearly').classList.toggle('active', isYearly);

      document.querySelectorAll('.tier-card').forEach(card => {
        const monthly = card.dataset.monthly;
        const yearly = card.dataset.yearly;
        const priceEl = card.querySelector('.tier-price');
        if (priceEl) {
          priceEl.innerHTML = isYearly
            ? `$${yearly}<span>/year</span>`
            : `$${monthly}<span>/month</span>`;
        }
      });
    });
  }

  // Membership Stripe checkout
  document.querySelectorAll('.membership-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const card = btn.closest('.tier-card');
      const tier = card.dataset.tier;
      const isYearly = document.querySelector('.toggle-switch')?.classList.contains('active');
      const billing = isYearly ? 'yearly' : 'monthly';

      const email = prompt('Enter your email to continue:');
      if (!email) return;
      const name = prompt('Enter your full name:');
      if (!name) return;

      btn.textContent = 'PROCESSING...';
      btn.disabled = true;

      try {
        const res = await fetch('/stripe/create-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tier, billing, email, name })
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          alert(data.error || 'Something went wrong.');
          btn.textContent = btn.dataset.originalText || 'JOIN';
          btn.disabled = false;
        }
      } catch {
        alert('Connection error. Please try again.');
        btn.textContent = btn.dataset.originalText || 'JOIN';
        btn.disabled = false;
      }
    });
  });

  // Founding member payment
  const foundingPayForm = document.querySelector('.founding-payment-form');
  if (foundingPayForm) {
    foundingPayForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(foundingPayForm);
      const email = formData.get('email');
      const name = formData.get('name');
      const btn = foundingPayForm.querySelector('button[type="submit"]');

      btn.textContent = 'PROCESSING...';
      btn.disabled = true;

      try {
        const res = await fetch('/stripe/create-founding-checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name })
        });
        const data = await res.json();
        if (data.url) {
          window.location.href = data.url;
        } else {
          showFormMessage(foundingPayForm, data.error || 'Something went wrong.', 'error');
          btn.textContent = 'BECOME A FOUNDING MEMBER — $10/MONTH';
          btn.disabled = false;
        }
      } catch {
        showFormMessage(foundingPayForm, 'Connection error. Please try again.', 'error');
        btn.textContent = 'BECOME A FOUNDING MEMBER — $10/MONTH';
        btn.disabled = false;
      }
    });
  }

  // Generic form handler
  const forms = {
    '.contact-form': '/api/contact',
    '.newsletter-form': '/api/newsletter',
    '.waitlist-form': '/api/founding-member/waitlist',
    '.volunteer-form': '/api/volunteer',
    '.speaker-form': '/api/speaker'
  };

  Object.entries(forms).forEach(([selector, endpoint]) => {
    const form = document.querySelector(selector);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'SENDING...';
      btn.disabled = true;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();

        if (result.success) {
          showFormMessage(form, result.message, 'success');
          form.reset();
        } else {
          showFormMessage(form, result.error, 'error');
        }
      } catch {
        showFormMessage(form, 'Connection error. Please try again.', 'error');
      }

      btn.textContent = originalText;
      btn.disabled = false;
    });
  });

  // Newsletter inline forms
  document.querySelectorAll('.newsletter-inline').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const btn = form.querySelector('button');
      const originalText = btn.textContent;

      btn.textContent = '...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: input.value })
        });
        const result = await res.json();
        if (result.success) {
          input.value = '';
          btn.textContent = 'DONE';
          setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 3000);
        }
      } catch {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  });

  function showFormMessage(form, message, type) {
    let msgEl = form.querySelector('.form-message');
    if (!msgEl) {
      msgEl = document.createElement('div');
      msgEl.className = 'form-message';
      form.appendChild(msgEl);
    }
    msgEl.textContent = message;
    msgEl.className = `form-message ${type}`;
    msgEl.style.display = 'block';

    if (type === 'success') {
      setTimeout(() => { msgEl.style.display = 'none'; }, 5000);
    }
  }

  // Stat counter animation
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (statNumbers.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(el => statObserver.observe(el));
  }

  function animateCount(el) {
    const target = el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const num = parseFloat(target);
    const isFloat = target.includes('.');
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat ? (num * eased).toFixed(1) : Math.floor(num * eased);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }
});

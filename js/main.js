/* ============================================================
   Almost Human Group — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     Navigation: active link highlighting
     ---------------------------------------------------------- */
  function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-links a');
    links.forEach(function (link) {
      const href = link.getAttribute('href');
      if (
        href === currentPage ||
        (currentPage === '' && href === 'index.html') ||
        (currentPage === 'index.html' && href === 'index.html')
      ) {
        link.classList.add('active');
      }
    });
  }

  /* ----------------------------------------------------------
     Navigation: subtle background shift on scroll
     ---------------------------------------------------------- */
  function initNavScroll() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    function onScroll() {
      if (window.scrollY > 40) {
        nav.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
      } else {
        nav.style.boxShadow = 'none';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     Contact Form: client-side handling
     ---------------------------------------------------------- */
  function initContactForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;

    var successMsg = document.getElementById('form-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('.btn-primary');
      var originalText = btn.textContent;

      btn.textContent = 'Sending...';
      btn.style.opacity = '0.7';
      btn.disabled = true;

      // Simulate async submit — replace with real endpoint
      setTimeout(function () {
        form.style.display = 'none';
        if (successMsg) {
          successMsg.style.display = 'block';
        }
      }, 1200);
    });
  }

  /* ----------------------------------------------------------
     Smooth entrance: fade-in sections on scroll
     ---------------------------------------------------------- */
  function initScrollReveal() {
    if (!window.IntersectionObserver) return;

    var targets = document.querySelectorAll(
      '.service-card, .service-full-card, .value-item, ' +
      '.impact-pillar, .charter-stat, .impact-metric, .contact-detail'
    );

    targets.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    targets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------------------------
     Init
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    initNavScroll();
    initContactForm();
    initScrollReveal();
  });

})();

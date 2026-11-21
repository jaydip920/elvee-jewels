/* Elvee Jewels — interaction layer
 * No external libraries, no network requests, no runtime APIs.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CONTACT_EMAIL = 'info@elvee.in';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------- Year -------------------------------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* -------------------------- Mobile nav ---------------------------- */
    var navToggle = document.querySelector('.nav-toggle');
    var primaryNav = document.getElementById('primary-nav');

    if (navToggle && primaryNav) {
      function setMenu(open) {
        primaryNav.classList.toggle('is-open', open);
        navToggle.setAttribute('aria-expanded', String(open));
        navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      }

      navToggle.addEventListener('click', function () {
        setMenu(navToggle.getAttribute('aria-expanded') !== 'true');
      });

      primaryNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () { setMenu(false); });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
          setMenu(false);
          navToggle.focus();
        }
      });

      document.addEventListener('click', function (e) {
        if (!primaryNav.contains(e.target) && !navToggle.contains(e.target)) setMenu(false);
      });
    }

    /* --------------------------- Carousel ----------------------------- */
    var hero = document.querySelector('.hero');
    var carousel = document.querySelector('[data-carousel]');

    if (hero && carousel) {
      var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero__slide'));
      var dots = Array.prototype.slice.call(document.querySelectorAll('.carousel-dot'));
      var arrows = Array.prototype.slice.call(document.querySelectorAll('.carousel-arrow'));
      var current = 0;
      var timer = null;
      var INTERVAL = 6500;

      slides.forEach(function (slide) {
        var img = slide.querySelector('img');
        if (img) {
          img.addEventListener('error', function () { img.classList.add('img-failed'); });
        }
      });

      function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === current);
        });
        dots.forEach(function (dot, i) {
          var active = i === current;
          dot.classList.toggle('is-active', active);
          dot.setAttribute('aria-selected', String(active));
        });
      }

      function stopCarousel() {
        if (timer) {
          window.clearInterval(timer);
          timer = null;
        }
      }

      function startCarousel() {
        if (reduceMotion || slides.length < 2) return;
        stopCarousel();
        timer = window.setInterval(function () { showSlide(current + 1); }, INTERVAL);
      }

      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          showSlide(Number(dot.getAttribute('data-slide')));
          startCarousel();
        });
      });

      arrows.forEach(function (arrow) {
        arrow.addEventListener('click', function () {
          showSlide(current + (arrow.getAttribute('data-dir') === 'next' ? 1 : -1));
          startCarousel();
        });
      });

      hero.addEventListener('mouseenter', stopCarousel);
      hero.addEventListener('mouseleave', startCarousel);
      hero.addEventListener('focusin', stopCarousel);
      hero.addEventListener('focusout', function (e) {
        if (!hero.contains(e.relatedTarget)) startCarousel();
      });

      document.addEventListener('keydown', function (e) {
        if (!hero.contains(document.activeElement)) return;
        if (e.key === 'ArrowRight') { showSlide(current + 1); startCarousel(); }
        if (e.key === 'ArrowLeft') { showSlide(current - 1); startCarousel(); }
      });

      startCarousel();
    }

    /* ------------------------- Scroll reveal -------------------------- */
    var revealItems = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

    if ('IntersectionObserver' in window) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealItems.forEach(function (el) { revealObserver.observe(el); });
    } else {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* --------------------------- Counters ----------------------------- */
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));

    function animateCounter(el) {
      var target = Number(el.getAttribute('data-count')) || 0;
      var suffix = el.getAttribute('data-suffix') || '';

      if (reduceMotion) {
        el.textContent = target + suffix;
        return;
      }

      var duration = 1500;
      var start = performance.now();

      function frame(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if ('IntersectionObserver' in window && counters.length) {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(function (el) { counterObserver.observe(el); });
    } else {
      counters.forEach(function (el) {
        el.textContent = (Number(el.getAttribute('data-count')) || 0) + (el.getAttribute('data-suffix') || '');
      });
    }

    /* ------------------- Progress bar, header, to-top ------------------ */
    var progress = document.querySelector('.scroll-progress span');
    var header = document.querySelector('.site-header');
    var toTop = document.querySelector('.to-top');
    var ticking = false;

    function updateScrollUI() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var percent = max > 0 ? (y / max) * 100 : 0;

      if (progress) progress.style.width = percent + '%';
      if (header) header.classList.toggle('is-scrolled', y > 10);
      if (toTop) toTop.classList.toggle('is-visible', y > 500);
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollUI);
        ticking = true;
      }
    }, { passive: true });
    updateScrollUI();

    if (toTop) {
      toTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }

    /* --------------------------- Date min ----------------------------- */
    document.querySelectorAll('input[data-min-today]').forEach(function (input) {
      var now = new Date();
      var local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
      input.min = local.toISOString().slice(0, 10);
    });

    /* -------------------------- Forms --------------------------------- */
    document.querySelectorAll('form[data-mailto]').forEach(function (form) {
      var status = form.querySelector('.form-status');

      function setStatus(message, isError) {
        if (!status) return;
        status.textContent = message;
        status.classList.toggle('is-error', Boolean(isError));
      }

      form.addEventListener('input', function () {
        if (status && status.classList.contains('is-error')) setStatus('', false);
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.checkValidity()) {
          setStatus('Please complete the required fields before sending.', true);
          if (typeof form.reportValidity === 'function') form.reportValidity();
          return;
        }

        var data = new FormData(form);
        var lines = [];
        data.forEach(function (value, key) {
          var text = String(value || '').trim();
          if (text) lines.push(key + ': ' + text);
        });

        var subject = form.getAttribute('data-subject') || 'Website enquiry';
        var body = lines.join('\n') + '\n\nSent from the Elvee Jewels website.';
        var href = 'mailto:' + CONTACT_EMAIL +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(body);

        setStatus('Thank you — your email app will open with this message ready to send.', false);
        window.location.href = href;
      });
    });

    /* ------------------- Interactive collections --------------------- */
    document.querySelectorAll('[data-explorer]').forEach(function (explorer) {
      var tabs = Array.prototype.slice.call(explorer.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(explorer.querySelectorAll('[role="tabpanel"]'));
      if (!tabs.length || !panels.length) return;

      function activate(tab, moveFocus) {
        tabs.forEach(function (item) {
          var active = item === tab;
          item.classList.toggle('is-active', active);
          item.setAttribute('aria-selected', String(active));
          item.setAttribute('tabindex', active ? '0' : '-1');
        });

        var targetId = tab.getAttribute('aria-controls');
        panels.forEach(function (panel) {
          var active = panel.id === targetId;
          panel.hidden = !active;
          panel.classList.toggle('is-active', active);
          if (active) {
            panel.style.animation = 'none';
            void panel.offsetWidth;
            panel.style.animation = '';
          }
        });

        if (moveFocus) tab.focus();
      }

      tabs.forEach(function (tab, index) {
        tab.addEventListener('click', function () { activate(tab, false); });
        tab.addEventListener('keydown', function (e) {
          var next = null;
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (index + 1) % tabs.length;
          if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
          if (e.key === 'Home') next = 0;
          if (e.key === 'End') next = tabs.length - 1;
          if (next === null) return;
          e.preventDefault();
          activate(tabs[next], true);
        });
      });
    });

    /* ----------------------- Smooth anchor links ---------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var id = link.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;

      link.addEventListener('click', function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  });
})();

/* =========================================================
   0xwi11iam — site interactivity
   Typewriter, scroll reveal, nav, filters, terminal boot
   ========================================================= */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        navLinks.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------- Typewriter (hero role) ---------- */
  var typedEl = document.querySelector('[data-typewriter]');
  if (typedEl) {
    var roles = (typedEl.getAttribute('data-typewriter') || '').split('|').filter(Boolean);
    var roleIdx = 0;
    var charIdx = 0;
    var deleting = false;

    var typeNext = function () {
      if (!typedEl.isConnected) return;
      var current = roles[roleIdx % roles.length];
      if (!deleting) {
        charIdx++;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeNext, 1900);
          return;
        }
        setTimeout(typeNext, 55);
      } else {
        charIdx--;
        typedEl.textContent = current.slice(0, charIdx);
        if (charIdx === 0) {
          deleting = false;
          roleIdx++;
          setTimeout(typeNext, 350);
          return;
        }
        setTimeout(typeNext, 30);
      }
    };

    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
    } else {
      typeNext();
    }
  }

  /* ---------- Terminal boot lines ---------- */
  var terminal = document.querySelector('[data-terminal]');
  if (terminal && !prefersReducedMotion) {
    terminal.classList.add('is-booting');
    var lines = Array.prototype.slice.call(terminal.querySelectorAll('.line'));
    var lineIdx = 0;

    var showLine = function () {
      if (lineIdx >= lines.length) {
        terminal.classList.remove('is-booting');
        return;
      }
      lines[lineIdx].classList.add('typed-line');
      lineIdx++;
      setTimeout(showLine, 300);
    };

    showLine();
  }

  /* ---------- Project filters ---------- */
  var filterWrap = document.querySelector('.filters');
  if (filterWrap) {
    var cards = document.querySelectorAll('.project-card');

    filterWrap.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filterWrap.querySelectorAll('.filter-btn').forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');

      var filter = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var cats = (card.getAttribute('data-categories') || '').split(' ');
        var show = filter === 'all' || cats.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !show);
      });
    });
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();

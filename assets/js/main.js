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

  /* ---------- Theme toggle ---------- */
  var themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    var applyTheme = function (theme) {
      document.documentElement.setAttribute('data-theme', theme);
      themeToggle.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
      themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      try { localStorage.setItem('0xwi11iam-theme', theme); } catch (e) {}
    };

    var storedTheme = null;
    try { storedTheme = localStorage.getItem('0xwi11iam-theme'); } catch (e) {}
    applyTheme(storedTheme === 'light' ? 'light' : 'dark');

    themeToggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ---------- Nav scroll-spy (section links like Contact) ---------- */
  (function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href]'));
    if (!links.length) return;

    var pageHref = location.pathname.split('/').pop() || 'index.html';

    // Section links that point at a section on THIS page, e.g. /about.html#contact
    var sectionLinks = links.filter(function (a) {
      var href = a.getAttribute('href') || '';
      var m = href.match(/^\/?([^\/?#]+\.html)#(.+)$/);
      return m && m[1] === pageHref;
    });
    if (!sectionLinks.length) return;

    var pageLink = links.filter(function (a) {
      var href = a.getAttribute('href') || '';
      return href === '/' + pageHref || href === pageHref;
    })[0] || null;

    var linkFor = function (id) {
      for (var i = 0; i < sectionLinks.length; i++) {
        if ((sectionLinks[i].getAttribute('href') || '').split('#')[1] === id) return sectionLinks[i];
      }
      return null;
    };

    var applyActive = function (active) {
      links.forEach(function (a) { a.removeAttribute('aria-current'); });
      if (active) active.setAttribute('aria-current', 'page');
    };

    var hashTarget = null;

    var activateHash = function () {
      var h = (location.hash || '').replace('#', '');
      if (!h) { hashTarget = null; return; }
      var link = linkFor(h);
      if (link) { hashTarget = h; applyActive(link); }
    };

    var spy = function () {
      var active = null;
      sectionLinks.forEach(function (a) {
        var id = (a.getAttribute('href') || '').split('#')[1];
        var el = document.getElementById(id);
        if (el) {
          var r = el.getBoundingClientRect();
          if (r.top <= 140 && r.bottom > 140) active = a;
        }
      });
      if (active) {
        // Reached a section — release the hash lock once it's the target
        if (hashTarget && (active.getAttribute('href') || '').split('#')[1] === hashTarget) hashTarget = null;
        applyActive(active);
      } else if (hashTarget) {
        // A hash target is set but the smooth scroll hasn't arrived yet — keep it active
        applyActive(linkFor(hashTarget));
      } else if (pageLink) {
        applyActive(pageLink);
      }
    };

    activateHash();
    if (!location.hash) spy();

    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy, { passive: true });
    window.addEventListener('hashchange', function () {
      activateHash();
      spy();
    });
  })();

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

  /* ---------- Terminal easter egg ---------- */
  var termForm = document.querySelector('.terminal-form');
  var termField = document.querySelector('.terminal-field');
  var termBody = document.querySelector('.terminal-body');

  if (termForm && termField && termBody) {
    var MOTD = '\u201CEvery vulnerability discovered is a step towards a safer internet for everyone.\u201D';

    var print = function (text, cls) {
      var line = document.createElement('span');
      line.className = 'line dynamic' + (cls ? ' ' + cls : '');
      line.textContent = text;
      termBody.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
    };

    var printCmd = function (cmd) {
      var line = document.createElement('span');
      line.className = 'line dynamic cmdline';
      var p = document.createElement('span');
      p.className = 'prompt';
      p.textContent = '$ ';
      var c = document.createElement('span');
      c.className = 'cmd';
      c.textContent = cmd;
      line.appendChild(p);
      line.appendChild(c);
      termBody.appendChild(line);
      termBody.scrollTop = termBody.scrollHeight;
    };

    var commands = {
      help: function () {
        return [
          ['available commands:', 'out-dim'],
          ['  whoami     identify the operator', ''],
          ['  ls         list projects', ''],
          ['  projects   one-line breakdown', ''],
          ['  cat motd   print the motto', ''],
          ['  contact    get in touch', ''],
          ['  github     source on github', ''],
          ['  theme      toggle dark / light', ''],
          ['  clear      clear the terminal', '']
        ];
      },
      whoami: function () {
        return [
          ['william_jiang \u2014 0xwi11iam', 'out-ok'],
          ['security researcher \u00b7 systems programmer \u00b7 AI red-teaming architect', ''],
          ['based in hong kong', 'out-dim']
        ];
      },
      ls: function () {
        return [
          ['projects/', ''],
          ['\u251c\u2500\u2500 suijin/', ''],
          ['\u251c\u2500\u2500 breachbench/', ''],
          ['\u251c\u2500\u2500 dd-rs/', ''],
          ['\u251c\u2500\u2500 macvault/', ''],
          ['\u251c\u2500\u2500 crontastic/', ''],
          ['\u2514\u2500\u2500 macos-evilmaid/', '']
        ];
      },
      projects: function () {
        return [
          ['suijin          dual-mode autonomous security platform', ''],,
          ['breachbench     LLM offensive security benchmark', ''],
          ['dd-rs           safe, modern dd replacement', ''],
          ['macvault        encrypted file store', ''],
          ['crontastic      natural language cron', ''],
          ['macos-evilmaid  macOS physical-access research', ''],
          ['', ''],
          ['\u2192 open /projects for the full breakdown', 'out-dim']
        ];
      },
      contact: function () {
        return [
          ['email     jiangwilliam30@gmail.com', ''],
          ['x         @0xwi11iam', ''],
          ['instagram @walliamjiang', ''],
          ['discord   @0xwi11iam', ''],
          ['linkedin  linkedin.com/in/william-jiang12', ''],
          ['', ''],
          ['\u2192 open /about#contact', 'out-dim']
        ];
      },
      github: function () {
        return [['github.com/0xwi11iam', '']];
      },
      theme: function () {
        return [['toggling theme\u2026', 'out-dim']];
      },
      date: function () {
        return [[new Date().toString(), 'out-dim']];
      }
    };

    termForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var raw = termField.value.trim();
      if (!raw) return;
      termField.value = '';
      printCmd(raw);

      var cmd = raw.toLowerCase().replace(/\s+/g, ' ');

      if (cmd === 'clear') {
        var dyn = termBody.querySelectorAll('.line.dynamic');
        for (var i = 0; i < dyn.length; i++) dyn[i].remove();
        termBody.scrollTop = termBody.scrollHeight;
        return;
      }

      if (cmd === 'theme' && themeToggle) {
        themeToggle.click();
      }

      var out;
      if (cmd === 'cat motd' || cmd === 'motd') {
        out = [[MOTD, 'out-ok']];
      } else if (cmd === 'sudo') {
        out = [['nice try \u2014 this is a website, not a root shell.', 'out-error']];
      } else if (commands[cmd]) {
        out = commands[cmd]();
      } else {
        out = [["command not found: " + raw + " \u2014 type 'help' for a list.", 'out-error']];
      }

      out.forEach(function (item) {
        print(item[0], item[1]);
      });
    });

    var termCard = termForm.closest('.terminal');
    if (termCard) {
      termCard.addEventListener('click', function () {
        termField.focus();
      });
    }
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

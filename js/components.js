/* ==========================================================================
   UI components (no scroll choreography here, see motion.js)
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- Empty CTAs: every link and form is inert in this build ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#"]');
    if (a) e.preventDefault();
  });
  document.querySelectorAll('[data-empty-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) { e.preventDefault(); });
  });

  /* ---------- Hero video: keep the loop running ---------- */
  // autoplay can be refused (low-power mode, data saver) or left paused after a tab switch.
  var heroVideo = document.querySelector('.mn-hero__video');
  if (heroVideo) {
    heroVideo.muted = true;
    var playHero = function () {
      // Held on frame 0 while the intro loader runs (its last image is this frame).
      if (!heroVideo.paused || document.documentElement.classList.contains('is-preloading')) return;
      var p = heroVideo.play();
      if (p && p.catch) p.catch(function () {});
    };
    window.addEventListener('mn:preloaded', function () {
      try { heroVideo.currentTime = 0; } catch (e) {}
      playHero();
    });
    playHero();
    heroVideo.addEventListener('canplay', playHero);
    heroVideo.addEventListener('ended', function () { heroVideo.currentTime = 0; playHero(); });
    document.addEventListener('visibilitychange', function () { if (!document.hidden) playHero(); });
    ['touchstart', 'pointerdown', 'keydown'].forEach(function (type) {
      document.addEventListener(type, playHero, { once: true, passive: true });
    });
  }

  /* ---------- Header ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var toggle = header.querySelector('[data-menu-toggle]');
    var drawer = header.querySelector('.mn-header__drawer');
    var lastY = window.scrollY;

    var onScroll = function () {
      var y = window.scrollY;
      header.classList.toggle('is-solid', y > 40);
      if (!header.classList.contains('is-open')) {
        var dy = y - lastY;
        if (y <= 80) header.classList.remove('is-hidden');
        else if (dy > 4) header.classList.add('is-hidden');
        else if (dy < -4) header.classList.remove('is-hidden');
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var setDrawer = function (open) {
      header.classList.toggle('is-open', open);
      header.classList.remove('is-hidden');
      toggle.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      if (window.mnLenis) open ? window.mnLenis.stop() : window.mnLenis.start();
    };
    toggle.addEventListener('click', function () {
      setDrawer(!header.classList.contains('is-open'));
    });
    // In-page links (#private-access etc.) would otherwise leave the menu open over the page.
    drawer.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (a && a.getAttribute('href') !== '#') setDrawer(false);
    });
  }

  /* ---------- Header dropdowns (Experiences, Plan) ---------- */
  // Hover opens them via CSS for mouse users; this handles click, touch and keyboard.
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-dropdown]'));
  var closeDropdown = function (box) {
    box.classList.remove('is-open');
    box.querySelector('.mn-dd__btn').setAttribute('aria-expanded', 'false');
  };
  dropdowns.forEach(function (box) {
    var btn = box.querySelector('.mn-dd__btn');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !box.classList.contains('is-open');
      dropdowns.forEach(closeDropdown);
      box.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
    box.addEventListener('focusout', function (e) {
      if (!box.contains(e.relatedTarget)) closeDropdown(box);
    });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && box.classList.contains('is-open')) {
        closeDropdown(box);
        btn.focus();
      }
    });
  });
  document.addEventListener('click', function () { dropdowns.forEach(closeDropdown); });

  /* ---------- Crossfading slideshows ---------- */
  document.querySelectorAll('[data-slideshow]').forEach(function (show) {
    var slides = Array.prototype.slice.call(show.children);
    if (slides.length < 2 || reduceMotion) return;
    var index = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('is-active'); }));
    setInterval(function () {
      var next = (index + 1) % slides.length;
      var img = slides[next].querySelector('img');
      var go = function () {
        slides[index].classList.remove('is-active');
        slides[next].classList.add('is-active');
        index = next;
      };
      // Ensure the next frame is decoded so the fade never shows a blank slide.
      if (img && img.decode) img.decode().then(go, go); else go();
    }, Number(show.dataset.interval) || 4500);
  });

  /* ---------- Hover-to-play preview videos ---------- */
  function hoverVideo(hostSelector, videoSelector) {
    document.querySelectorAll(hostSelector).forEach(function (host) {
      var video = host.querySelector(videoSelector);
      if (!video) return;
      host.addEventListener('mouseenter', function () {
        if (!canHover.matches || window.innerWidth <= 1024) return;
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      });
      host.addEventListener('mouseleave', function () { video.pause(); });
    });
  }
  // The theme panel (section 4) runs its own video, so it is left out here.
  hoverVideo('.mn-promo:not([data-theme-panel])', '.mn-promo__video');

  /* ---------- Theme explorer (section 4, and the Originals in section 9): a card brings its theme into the big panel ---------- */
  document.querySelectorAll('[data-themes]').forEach(function (wrap) {
    var panel = wrap.querySelector('[data-theme-panel]');
    var video = wrap.querySelector('[data-theme-video]');
    var still = wrap.querySelector('[data-theme-still]');
    var cards = Array.prototype.slice.call(wrap.querySelectorAll('.mn-card[data-theme]'));
    var states = Array.prototype.slice.call(wrap.querySelectorAll('[data-state]'));
    var conn = navigator.connection || {};
    var noVideo = reduceMotion || conn.saveData === true;
    var inView = false;
    var current = null;
    var intent;

    var play = function () {
      if (!inView || !panel.classList.contains('is-playing')) return;
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    };

    var activate = function (card) {
      var theme = card.dataset.theme;
      if (theme === current) return;
      current = theme;
      states.forEach(function (s) {
        var on = s.dataset.state === theme;
        s.classList.toggle('is-current', on);
        s.setAttribute('aria-hidden', String(!on));
        s.inert = !on;
      });
      cards.forEach(function (c) { c.classList.toggle('is-active', c === card); });

      if (noVideo) {
        still.src = card.querySelector('.mn-card__img').currentSrc || card.querySelector('.mn-card__img').src;
        panel.classList.add('has-still');
        return;
      }
      // Swap the clip only when this theme uses a different one; the poster covers the load gap.
      var src = card.dataset.video;
      if (src && video.getAttribute('src') !== src) {
        if (card.dataset.poster) video.poster = card.dataset.poster;
        // Optional focal point, since the tall desktop panel crops landscape clips hard.
        video.style.objectPosition = card.dataset.videoPos || '';
        video.setAttribute('src', src);
        video.load();
      }
      panel.classList.add('is-playing');
      play();
    };

    cards.forEach(function (card) {
      // Desktop: short hover intent so sweeping across the grid doesn't flicker the panel.
      card.addEventListener('mouseenter', function () {
        if (!canHover.matches) return;
        clearTimeout(intent);
        intent = setTimeout(function () { activate(card); }, 120);
      });
      card.addEventListener('mouseleave', function () { clearTimeout(intent); });
      // Keyboard focus only: a tap also focuses the link, and activating there would make the
      // click below see the card as already active and follow the link on the first tap.
      card.addEventListener('focus', function () { if (card.matches(':focus-visible')) activate(card); });
      // Touch: first tap previews the theme in the panel, a second tap opens its page.
      card.addEventListener('click', function (e) {
        if (canHover.matches || card.classList.contains('is-active')) return;
        e.preventDefault();
        activate(card);
        if (panel.getBoundingClientRect().top < 0) {
          if (window.mnLenis) window.mnLenis.scrollTo(panel, { offset: -80 });
          else panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Only play while the section is on screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        if (inView) play(); else video.pause();
      }, { threshold: .15 }).observe(wrap);
    } else {
      inView = true;
    }
  });

  /* ---------- Conventions carousel (section 3b) ----------
     Two modes share one geometry:
     - discrete: slot classes (tablet/phone, reduced motion), arrows/keys/swipe step one card;
     - scrub: desktop scroll drives a continuous position f (0..n-1) via window.mnConv.scrub(),
       wired up in motion.js; arrows/keys then scroll to the matching card. */
  (function () {
    var wrap = document.querySelector('[data-conventions]');
    if (!wrap) return;
    var stage = wrap.querySelector('[data-conv-stage]');
    var meta = wrap.querySelector('[data-conv-meta]');
    var live = wrap.querySelector('[data-conv-live]');
    var prevBtn = wrap.querySelector('[data-conv-prev]');
    var nextBtn = wrap.querySelector('[data-conv-next]');
    var $ = function (sel) { return wrap.querySelector(sel); };

    // Hide conventions that have already ended (compared by date only).
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var cards = Array.prototype.slice.call(stage.querySelectorAll('.mn-conv__card')).filter(function (card) {
      if (new Date(card.dataset.end + 'T00:00:00') < today) { card.remove(); return false; }
      return true;
    });
    if (!cards.length) { wrap.hidden = true; return; }
    if (reduceMotion) wrap.classList.add('no-motion');

    var n = cards.length;
    var index = 0;
    var scrubbing = false;
    var pad = function (v) { return (v < 10 ? '0' : '') + v; };
    var slots = ['is-current', 'is-next-1', 'is-next-2', 'is-prev-1', 'is-prev-2', 'is-gone-next', 'is-gone-prev'];
    $('[data-conv-total]').textContent = pad(n);
    if (n < 2) wrap.querySelector('.mn-conv__nav').hidden = true;

    // Path for the scroll scrub: d = card offset from the current position.
    // x = left edge as a fraction of stage width, y = top as a fraction of stage height (matches the CSS slots).
    var KEYS = [
      { d: -3, x: -.30, y: .70, s: .88, o: 0 },
      { d: -2, x: -.07, y: .62, s: .88, o: 1 },
      { d: -1, x: .07,  y: .56, s: .88, o: 1 },
      { d: 0,  x: .37,  y: .34, s: 1,   o: 1 },
      { d: 1,  x: .70,  y: .10, s: .88, o: 1 },
      { d: 2,  x: .85,  y: .05, s: .88, o: 1 },
      { d: 3,  x: 1.04, y: 0,   s: .88, o: 0 }
    ];
    var at = function (d) {
      d = Math.max(-3, Math.min(3, d));
      var i = Math.min(KEYS.length - 2, Math.floor(d + 3));
      var a = KEYS[i], b = KEYS[i + 1], t = d - a.d;
      return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: a.s + (b.s - a.s) * t, o: a.o + (b.o - a.o) * t };
    };

    var setMeta = function (announce) {
      var card = cards[index];
      $('[data-conv-index]').textContent = pad(index + 1);
      $('[data-conv-date]').textContent = card.dataset.date;
      $('[data-conv-tag]').hidden = !card.hasAttribute('data-tentative');
      $('[data-conv-venue-text]').textContent = card.dataset.venue;
      $('[data-conv-venue]').setAttribute('href', card.dataset.href);
      meta.classList.remove('is-swapping'); void meta.offsetWidth; meta.classList.add('is-swapping');
      cards.forEach(function (c, i) {
        var on = i === index;
        c.classList.toggle('is-current', on);
        c.setAttribute('aria-hidden', String(!on));
        c.inert = !on;
      });
      if (announce) live.textContent = card.querySelector('.mn-conv__name').textContent + ', ' + card.dataset.date + ', ' + card.dataset.venue;
    };

    // Discrete mode: one slot class per card.
    var render = function (announce) {
      cards.forEach(function (card, i) {
        var d = (i - index + n) % n;
        var slot = d === 0 ? 'is-current'
          : d === 1 ? 'is-next-1'
          : d === 2 && n > 3 ? 'is-next-2'
          : d === n - 1 ? 'is-prev-1'
          : d === n - 2 && n > 4 ? 'is-prev-2'
          : d < n / 2 ? 'is-gone-next' : 'is-gone-prev';
        slots.forEach(function (s) { card.classList.toggle(s, s === slot); });
      });
      setMeta(announce);
    };

    // Scrub mode: continuous position f; no wrap-around (scroll runs 01 -> n).
    var scrub = function (f) {
      var W = stage.clientWidth, H = stage.clientHeight;
      cards.forEach(function (card, i) {
        var d = i - f, p = at(d), ad = Math.abs(d);
        card.style.transform = 'translate3d(' + (p.x * W).toFixed(1) + 'px,' + (p.y * H).toFixed(1) + 'px,0) scale(' + p.s.toFixed(4) + ')';
        card.style.opacity = p.o.toFixed(3);
        card.style.zIndex = String(Math.round(10 - ad * 2));
        card.style.setProperty('--veil', Math.min(.18, ad * .3).toFixed(3));
        card.querySelector('.mn-conv__name').style.opacity = Math.max(0, 1 - ad * 2.4).toFixed(3);
      });
      var i = Math.round(f);
      if (i !== index) { index = i; setMeta(false); }
      prevBtn.disabled = f <= .01;
      nextBtn.disabled = f >= n - 1.01;
    };

    var go = function (to, announce) {
      if (scrubbing && api.scrollToIndex) {
        to = Math.max(0, Math.min(n - 1, to));
        api.scrollToIndex(to);
        if (announce) { index = to; setMeta(true); }
        return;
      }
      index = (to + n) % n;
      render(announce);
    };

    var api = window.mnConv = {
      count: n,
      scrollToIndex: null,          // set by motion.js while scrubbing
      scrub: scrub,
      enterScrub: function () {
        scrubbing = true;
        wrap.classList.add('is-scrub');
        slots.forEach(function (s) { cards.forEach(function (c) { if (s !== 'is-current') c.classList.remove(s); }); });
      },
      exitScrub: function () {
        scrubbing = false;
        api.scrollToIndex = null;
        wrap.classList.remove('is-scrub');
        prevBtn.disabled = nextBtn.disabled = false;
        cards.forEach(function (c) {
          c.style.transform = c.style.opacity = c.style.zIndex = '';
          c.style.removeProperty('--veil');
          c.querySelector('.mn-conv__name').style.opacity = '';
        });
        render(false);
      }
    };

    prevBtn.addEventListener('click', function () { go(index - 1, true); });
    nextBtn.addEventListener('click', function () { go(index + 1, true); });
    // A side card brings itself to the centre instead of following its link.
    cards.forEach(function (card, i) {
      card.addEventListener('click', function (e) {
        if (i === index) return;
        e.preventDefault();
        go(i, true);
      }, true);
    });
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1, true); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1, true); }
    });
    // Swipe / drag (discrete mode only; on desktop the page scroll drives it).
    var startX = null, startY = 0;
    stage.addEventListener('pointerdown', function (e) { startX = e.clientX; startY = e.clientY; });
    stage.addEventListener('pointerup', function (e) {
      if (startX === null || scrubbing) { startX = null; return; }
      var dx = e.clientX - startX, dy = e.clientY - startY;
      startX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1), true);
    });
    stage.addEventListener('pointercancel', function () { startX = null; });

    render(false);
  })();

  /* ---------- Steps: accordion on phones ---------- */
  document.addEventListener('click', function (e) {
    var head = e.target.closest && e.target.closest('.mn-step__head');
    if (!head || window.innerWidth > 749) return;
    var step = head.parentElement;
    var wasOpen = step.classList.contains('is-open');
    step.parentElement.querySelectorAll('.mn-step').forEach(function (s) { s.classList.remove('is-open'); });
    if (!wasOpen) step.classList.add('is-open');
  });

  /* ---------- Testimonials: guests as tabs ----------
     A pick swaps backdrop, portrait and quote together. While the section is on screen the
     active tab's gold hairline runs as a CSS timer and its end moves to the next guest;
     hovering the card or tabs, or keyboard focus inside them, pauses it. */
  document.querySelectorAll('[data-voices]').forEach(function (root) {
    var all = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
    var tabs = all('[role="tab"]');
    var sets = [tabs, all('.mn-voices__quote'), all('.mn-voices__face'), all('.mn-voices__bg')];
    var card = root.querySelector('.mn-voices__card');
    var portrait = root.querySelector('.mn-voices__portrait');
    var active = 0, inView = false, hovering = false, focused = false;

    var select = function (i) {
      active = i;
      sets.forEach(function (set) {
        set.forEach(function (el, k) { el.classList.toggle('is-active', k === i); });
      });
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        t.tabIndex = k === i ? 0 : -1;
      });
      // Hidden quotes stay in the layout (stable card height), so take them out of focus and reading order.
      sets[1].forEach(function (q, k) { q.toggleAttribute('inert', k !== i); q.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    };
    var sync = function () { root.classList.toggle('is-paused', !inView || hovering || focused); };

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        select(i);
        // Small screens: portrait and quote sit above the tabs; bring them back if they have scrolled away.
        if (window.innerWidth <= 1024 && portrait && card && card.getBoundingClientRect().top < 0) {
          if (window.mnLenis) window.mnLenis.scrollTo(portrait, { offset: -88 });
          else portrait.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      tab.addEventListener('keydown', function (e) {
        var to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        to = (to + tabs.length) % tabs.length;
        tabs[to].focus();
        select(to);
      });
    });
    select(0);
    if (reduceMotion) return;

    if (window.matchMedia('(hover: hover)').matches) {
      [card, root.querySelector('[role="tablist"]')].forEach(function (el) {
        if (!el) return;
        el.addEventListener('mouseenter', function () { hovering = true; sync(); });
        el.addEventListener('mouseleave', function () { hovering = false; sync(); });
      });
    }
    root.addEventListener('focusin', function (e) { focused = !!(e.target.matches && e.target.matches(':focus-visible')); sync(); });
    root.addEventListener('focusout', function () { focused = false; sync(); });
    root.addEventListener('animationend', function (e) {
      if (e.animationName === 'mn-voices-bar') select((active + 1) % tabs.length);
    });
    sync();
    root.classList.add('is-auto');
    // "On screen" = crossing the middle of the viewport (the section is taller than the screen on phones).
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        inView = entries[0].isIntersecting;
        sync();
      }, { rootMargin: '-35% 0px -35% 0px' }).observe(root);
    } else {
      inView = true;
      sync();
    }
  });

  /* ---------- Reels marquee (@aslihyderabad) ----------
     The set is cloned once so the CSS marquee loops seamlessly (clones hidden from assistive tech).
     A reel plays only while it is on screen; with reduced motion or data-saver the posters stay. */
  var reels = document.querySelector('[data-reels]');
  if (reels) {
    var reelTrack = reels.querySelector('.mn-social__track');
    Array.prototype.slice.call(reelTrack.children).forEach(function (li) {
      var clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      reelTrack.appendChild(clone);
    });
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!reduceMotion && !saveData && 'IntersectionObserver' in window) {
      var reelIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var v = entry.target;
          if (entry.isIntersecting) {
            var p = v.play();
            if (p && p.catch) p.catch(function () {});
          } else {
            v.pause();
          }
        });
      }, { rootMargin: '0px 160px' });
      reels.querySelectorAll('video').forEach(function (v) { reelIO.observe(v); });
    }
  }

  /* ---------- Footer skyline: run the ambient loops (birds, lake, phone pan) only while it is on screen ---------- */
  var foot = document.querySelector('.mn-footer');
  if (foot && !reduceMotion && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      foot.classList.toggle('is-on', entries[0].isIntersecting);
    }).observe(foot);
  }

  /* ---------- In-page links (#co-curated, #quick-experiences, #private-access…) ----------
     Glide there with Lenis instead of a native jump that fights the smooth scroll and the pins. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    var id = a && a.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (window.mnLenis) window.mnLenis.scrollTo(target, { duration: 1.6 });
    else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    if (history.replaceState) history.replaceState(null, '', '#' + id);
  });

  /* ---------- Quick Experiences: the arcade rail ----------
     The rail scrolls natively on phones, tablets and with reduced motion. On desktop motion.js moves the
     track with the page scroll and sets api.driver, so "go to a card" scrolls the page instead. Either
     way update(x) keeps the gold progress line and the group buttons in step with the rail. */
  var arcade = document.querySelector('[data-arcade]');
  if (arcade) initArcade(arcade);

  function initArcade(root) {
    var rail = root.querySelector('.mn-arcade__rail');
    var track = root.querySelector('.mn-arcade__track');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.mn-arcade__card'));
    var groups = Array.prototype.slice.call(root.querySelectorAll('[data-arcade-go]'));
    var api = window.mnArcade = { driver: null, x: 0 };
    var offsetOf = function (card) { return card.offsetLeft - cards[0].offsetLeft; };
    var max = function () { return Math.max(track.offsetWidth - rail.clientWidth, 0); };

    api.update = function (x) {
      api.x = x;
      root.style.setProperty('--p', Math.min((x + rail.clientWidth) / track.offsetWidth, 1).toFixed(4));
      // The group of the card at the rail's left edge is the one "in view".
      var probe = x + cards[0].offsetWidth * .5;
      var at = cards.filter(function (c) { return offsetOf(c) <= probe; }).pop() || cards[0];
      groups.forEach(function (g) {
        var on = g.getAttribute('data-arcade-go') === at.getAttribute('data-group');
        g.classList.toggle('is-active', on);
        if (on) g.setAttribute('aria-current', 'true'); else g.removeAttribute('aria-current');
      });
    };
    api.goTo = function (card) {
      var to = Math.min(offsetOf(card), max());
      if (api.driver) api.driver(to);
      else rail.scrollTo({ left: to, behavior: reduceMotion ? 'auto' : 'smooth' });
    };

    groups.forEach(function (g) {
      g.addEventListener('click', function () {
        var first = root.querySelector('.mn-arcade__card[data-group="' + g.getAttribute('data-arcade-go') + '"]');
        if (first) api.goTo(first);
      });
    });
    rail.addEventListener('scroll', function () { if (!api.driver) api.update(rail.scrollLeft); }, { passive: true });
    // Desktop: tabbing to a card off to the side scrolls the page until it is in the rail's view.
    root.addEventListener('focusin', function (e) {
      var card = api.driver && e.target.closest && e.target.closest('.mn-arcade__card');
      if (!card) return;
      var o = offsetOf(card);
      if (o < api.x || o + card.offsetWidth > api.x + rail.clientWidth - cards[0].offsetLeft) api.goTo(card);
    });
    window.addEventListener('resize', function () { api.update(api.driver ? api.x : rail.scrollLeft); });
    api.update(0);
  }
})();

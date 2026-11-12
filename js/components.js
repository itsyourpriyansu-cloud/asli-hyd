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
    var tabs = Array.prototype.slice.call(wrap.querySelectorAll('[data-theme-tab]'));
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
      tabs.forEach(function (t) {
        var on = t.dataset.themeTab === theme;
        t.classList.toggle('is-active', on);
        t.setAttribute('aria-pressed', String(on));
      });

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

    // Phones and tablets (section 4): the theme picker drives the panel through its (hidden) card.
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var card = cards.filter(function (c) { return c.dataset.theme === tab.dataset.themeTab; })[0];
        if (card) activate(card);
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

  /* ---------- Conventions rail (section 3b) ----------
     Removes events past their data-end date. The rail scrolls natively; the arrows appear only
     when the cards overflow (is-scrollable) and step one card at a time. Cards are plain links. */
  (function () {
    var wrap = document.querySelector('[data-conventions]');
    if (!wrap) return;
    var items = Array.prototype.slice.call(wrap.querySelectorAll('.mn-conv__item'));

    // Hide conventions that have already ended (compared by date only).
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var live = items.filter(function (item) {
      if (new Date(item.dataset.end + 'T00:00:00') >= today) return true;
      item.remove();
      return false;
    });
    if (!live.length) { wrap.hidden = true; return; }

    var rail = wrap.querySelector('.mn-conv__rail');
    if (!rail) return; // /conventions uses the same past-event filter on a plain grid
    var prev = wrap.querySelector('.mn-conv__nav--prev');
    var next = wrap.querySelector('.mn-conv__nav--next');
    function update() {
      var max = rail.scrollWidth - rail.clientWidth;
      wrap.classList.toggle('is-scrollable', max > 1);
      prev.disabled = rail.scrollLeft <= 1;
      next.disabled = rail.scrollLeft >= max - 1;
    }
    function step(dir) {
      var item = rail.querySelector('.mn-conv__item');
      var by = item.offsetWidth + (parseFloat(getComputedStyle(rail).columnGap) || 0);
      rail.scrollBy({ left: dir * by, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    prev.addEventListener('click', function () { step(-1); });
    next.addEventListener('click', function () { step(1); });
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    window.addEventListener('load', update);
    update();

    // Phones and tablets: the rail advances one card every few seconds while on screen, rewinding
    // after the last; a touch or swipe pauses it for a while. Never on desktop (scroll-driven there)
    // or with reduced motion.
    if (reduceMotion) return;
    var small = window.matchMedia('(max-width: 1024px)');
    var onScreen = false;
    var restAt = 0;
    var pause = function () { restAt = Date.now() + 8000; };
    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(function (t) {
      rail.addEventListener(t, pause, { passive: true });
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; }, { threshold: .5 }).observe(rail);
    }
    setInterval(function () {
      if (!small.matches || !onScreen || document.hidden || Date.now() < restAt) return;
      var max = rail.scrollWidth - rail.clientWidth;
      if (max <= 1) return;
      if (rail.scrollLeft >= max - 2) rail.scrollTo({ left: 0, behavior: 'smooth' });
      else step(1);
    }, 4000);
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

  /* ---------- In-page links (#co-curated, #quick-experiences, #private-access…) ----------
     Glide there with Lenis instead of a native jump that fights the smooth scroll and the pins. */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    var id = a && a.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true }); // the skip link must move keyboard focus too
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

  /* ---------- Inner pages: tour tabs ---------- */
  document.querySelectorAll('[data-filter-root]').forEach(function (root) {
    var buttons = root.querySelectorAll('[data-filter]');
    var cards = root.querySelectorAll('[data-tags]');
    var status = root.querySelector('[data-filter-status]');
    var noun = root.dataset.filterNoun || 'tour';
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.dataset.filter, shown = 0;
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        cards.forEach(function (card) {
          var on = key === 'all' || card.dataset.tags.split(' ').indexOf(key) > -1;
          card.hidden = !on;
          if (!on) return;
          shown++;
          // A card still waiting for its scroll reveal has to show as soon as the filter brings it up.
          card.style.opacity = card.style.visibility = card.style.transform = '';
        });
        status.textContent = shown + ' ' + noun + (shown === 1 ? '' : 's') + ' shown';
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
  });

  /* ---------- Inner pages: gallery lightbox (native <dialog> traps focus and returns it) ---------- */
  var lb = document.querySelector('[data-lb]');
  if (lb) {
    var shots = Array.prototype.slice.call(document.querySelectorAll('[data-full]'));
    var lbImg = lb.querySelector('[data-lb-img]');
    var lbCap = lb.querySelector('[data-lb-cap]');
    var lbAt = 0;
    var lbSet = shots;
    var lbShow = function (i) {
      lbAt = (i + lbSet.length) % lbSet.length;
      lbImg.src = lbSet[lbAt].dataset.full;
      lbImg.alt = lbCap.textContent = lbSet[lbAt].dataset.cap;
    };
    shots.forEach(function (shot) {
      shot.addEventListener('click', function () {
        lbSet = shots.filter(function (s) { return !s.closest('[hidden]'); }); // the arrows stay inside the current filter
        lbShow(lbSet.indexOf(shot));
        lb.showModal();
        if (window.mnLenis) window.mnLenis.stop();
      });
    });
    lb.querySelector('[data-lb-close]').addEventListener('click', function () { lb.close(); });
    lb.querySelector('[data-lb-prev]').addEventListener('click', function () { lbShow(lbAt - 1); });
    lb.querySelector('[data-lb-next]').addEventListener('click', function () { lbShow(lbAt + 1); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') lbShow(lbAt - 1);
      if (e.key === 'ArrowRight') lbShow(lbAt + 1);
    });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { if (window.mnLenis) window.mnLenis.start(); });
  }

  /* ---------- Inner pages: looping hero video, only when the guest can afford it ---------- */
  var pageVideo = document.querySelector('[data-hero-video]');
  if (pageVideo && !reduceMotion && !(navigator.connection && navigator.connection.saveData)) {
    pageVideo.src = pageVideo.dataset.src;
    pageVideo.muted = true;
    pageVideo.addEventListener('playing', function () { pageVideo.classList.add('is-on'); }, { once: true });
    var pagePlay = pageVideo.play();
    if (pagePlay && pagePlay.catch) pagePlay.catch(function () {});
  }

  /* ---------- Convention pages: once the event is over, say so ---------- */
  document.querySelectorAll('[data-ended]').forEach(function (note) {
    if (new Date(note.dataset.ended + 'T00:00:00') >= new Date(new Date().toDateString())) return;
    note.hidden = false;
    note.parentNode.querySelector('[data-tentative]').hidden = true;
    var heroBtn = document.querySelector('[data-ended-label]');
    if (heroBtn) heroBtn.firstChild.nodeValue = heroBtn.dataset.endedLabel + ' ';
  });

  /* ---------- Inner pages: an opened question changes the page height, so triggers below it must re-measure ---------- */
  document.querySelectorAll('.mn-pg-faq details').forEach(function (d) {
    d.addEventListener('toggle', function () { if (window.ScrollTrigger) window.ScrollTrigger.refresh(); });
  });

  /* ---------- Inner pages: enquiry forms send through WhatsApp, with an email fallback ---------- */
  document.querySelectorAll('[data-enquiry]').forEach(function (form) {
    var params = new URLSearchParams(location.search);
    var picker = form.elements.experience;
    var message = form.elements.message;
    var sent = form.parentNode.querySelector('[data-form-sent]');
    if (picker && params.get('experience')) {
      picker.value = params.get('experience');
      if (picker.selectedIndex < 0) picker.selectedIndex = 0; // an old or mistyped link falls back to "Help me choose"
    }
    if (message && params.get('topic')) message.value = params.get('topic');
    if (form.elements.notes && params.get('option')) form.elements.notes.value = 'Option: ' + params.get('option');

    // The card above the form shows what is being requested, from the option's own data.
    var summary = picker && form.parentNode.querySelector('[data-summary]');
    if (summary) {
      var showSummary = function () {
        var chosen = picker.options[picker.selectedIndex];
        summary.hidden = !chosen.value;
        if (chosen.value) {
          summary.querySelector('[data-summary-img]').src = chosen.dataset.img;
          summary.querySelector('[data-summary-name]').textContent = chosen.text;
          summary.querySelector('[data-summary-meta]').textContent = chosen.dataset.meta;
        }
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      };
      picker.addEventListener('change', showSummary);
      showSummary();
    }

    // Errors show under their own field (the form is novalidate), using the browser's localised message.
    var dateMin = form.querySelector('[data-min-today]');
    if (dateMin) {
      var now = new Date();
      dateMin.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10); // local date, not UTC
    }
    var showError = function (field) {
      var err = document.getElementById(field.id + '-err');
      var msg = field.validity.valid ? '' : field.validationMessage;
      if (err) { err.textContent = msg; err.hidden = !msg; }
      field.setAttribute('aria-invalid', String(!!msg));
      return !msg;
    };
    form.querySelectorAll('input, select, textarea').forEach(function (field) {
      field.addEventListener('input', function () { if (field.getAttribute('aria-invalid') === 'true') showError(field); });
      field.addEventListener('blur', function () { if (form.classList.contains('was-checked')) showError(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      form.classList.add('was-checked');
      var bad = [].filter.call(form.querySelectorAll('input, select, textarea'), function (field) { return !showError(field); });
      if (bad.length) { bad[0].focus(); return; }
      var lines = [form.dataset.enquiry];
      form.querySelectorAll('input, select, textarea').forEach(function (field) {
        var value = field.tagName === 'SELECT' ? field.options[field.selectedIndex].text : field.value.trim();
        if (value) lines.push(form.querySelector('label[for="' + field.id + '"]').childNodes[0].textContent.trim() + ': ' + value); // label text without "(required)"
      });
      var text = lines.join('\n');
      var wa = 'https://wa.me/919392149872?text=' + encodeURIComponent(text);
      sent.querySelector('[data-form-wa]').href = wa;
      sent.querySelector('[data-form-mail]').href = 'mailto:sahana@aslihyd.in?subject=' + encodeURIComponent(form.dataset.enquiry) + '&body=' + encodeURIComponent(text);
      window.open(wa, '_blank', 'noopener');
      form.hidden = true;
      sent.hidden = false;
      sent.focus();
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    });
  });

  /* ---------- Inner pages: the phone booking bar gets out of the footer's way ---------- */
  var bookBar = document.querySelector('[data-bookbar]');
  var pageFoot = document.querySelector('.mn-footer');
  if (bookBar && pageFoot && 'IntersectionObserver' in window) {
    var barCovers = new Set(); // the hero and the closing band have their own button, so two never stack
    var barWatch = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { barCovers[e.isIntersecting ? 'add' : 'delete'](e.target); });
      bookBar.classList.toggle('is-away', barCovers.size > 0);
    });
    barWatch.observe(pageFoot);
    document.querySelectorAll('.mn-pg-end, [data-hero], .mn-pg-port').forEach(function (el) { barWatch.observe(el); });
  }

  /* ---------- Floating contact (every page): the toggle opens Call, WhatsApp and the social buttons ----------
     A social button appears only once its address is filled in here, so the page never shows an empty link. */
  var CONTACT = { twitter: '', linkedin: '', youtube: '' };
  var fab = document.querySelector('[data-fab]');
  if (fab) {
    var fabToggle = fab.querySelector('[data-fab-toggle]');
    var fabStack = fab.querySelector('.mn-fab__stack');
    var fabHide = fab.querySelector('[data-fab-hide]');
    fab.querySelectorAll('[data-fab-link]').forEach(function (a) {
      var url = CONTACT[a.dataset.fabLink];
      if (url) { a.href = url; a.parentNode.hidden = false; }
    });
    var setFab = function (open, moveFocus) {
      fab.classList.toggle('is-open', open);
      fabToggle.setAttribute('aria-expanded', String(open));
      fabToggle.setAttribute('aria-label', open ? 'Close contact options' : 'Open contact options');
      fabStack.inert = fabHide.inert = !open; // closed buttons are invisible, so keep them out of tab order and screen readers
      if (!moveFocus) return;
      if (open) fabStack.querySelector('li:not([hidden]) a').focus();
      else fabToggle.focus();
    };
    // detail 0 = keyboard activation: then focus moves into the list.
    fabToggle.addEventListener('click', function (e) { setFab(!fab.classList.contains('is-open'), e.detail === 0); });
    fabHide.addEventListener('click', function () { setFab(false, true); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && fab.classList.contains('is-open')) setFab(false, true);
    });
    document.addEventListener('click', function (e) {
      if (fab.classList.contains('is-open') && !fab.contains(e.target)) setFab(false);
    });
    if (!reduceMotion) {
      ((window.mnPreloader && window.mnPreloader.done) || Promise.resolve()).then(function () {
        setTimeout(function () {
          if (fab.classList.contains('is-open')) return;
          fabToggle.classList.add('is-pulse');
          fabToggle.addEventListener('animationend', function () { fabToggle.classList.remove('is-pulse'); }, { once: true });
        }, 1500);
      });
    }
  }
})();

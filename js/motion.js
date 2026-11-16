/* ==========================================================================
   Scroll reveals: GSAP + ScrollTrigger on the browser's own scroll.

   Version 3 (16 Nov 2026): no smooth-scroll library, no pins, curtains or
   sideways wipes. Every section scrolls like a normal page; things only rise,
   draw or count in once as they arrive. Same at every screen size.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove('is-loading');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // Inner pages (tools/build-pages.mjs) keep the browser's own back-button position.
  var isHome = !document.body.classList.contains('mn-pg');
  if (isHome) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }

  /* ---------- Helpers ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var sec = function (name) { return $('[data-sec="' + name + '"]'); };
  var vh = function () { return window.innerHeight; };
  var clamp01 = function (n) { return Math.max(0, Math.min(1, n)); };

  // 0 -> 1 as an element travels from below the viewport to fully past it.
  function travel(el) {
    var r = el.getBoundingClientRect();
    return clamp01((vh() - r.top) / (vh() + r.height));
  }

  // Run fn once, the first time test() passes on scroll.
  function once(test, fn) {
    var done = false;
    var check = function () {
      if (done || !test()) return;
      done = true;
      window.removeEventListener('scroll', check);
      fn();
    };
    window.addEventListener('scroll', check, { passive: true });
    check();
  }
  var inView = function (el, at) { return function () { return el.getBoundingClientRect().top < vh() * at; }; };

  // Parallax a layer inside its holder: scaled up, then slid ±amp yPercent (inner-page heroes only).
  function parallax(holder, layer, scale, amp) {
    gsap.set(layer, { scale: scale });
    var set = gsap.quickSetter(layer, 'yPercent');
    var update = function () {
      var r = holder.getBoundingClientRect();
      if (r.bottom < -60 || r.top > vh() + 60) return;
      set(-amp + 2 * amp * travel(holder));
    };
    gsap.ticker.add(update);
    update();
  }

  // Wrap each char of el's text nodes in a span (keeps <em> etc.).
  function splitText(el) {
    var parts = [];
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    (function walk(node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (word) {
          if (!word) return;
          if (!word.trim()) { frag.appendChild(document.createTextNode(word)); return; }
          // Chars live inside a no-wrap word so lines only break between words.
          var w = document.createElement('span');
          w.style.display = 'inline-block';
          w.style.whiteSpace = 'nowrap';
          w.setAttribute('aria-hidden', 'true');
          word.split('').forEach(function (ch) {
            var s = document.createElement('span');
            s.textContent = ch;
            s.style.display = 'inline-block';
            parts.push(s);
            w.appendChild(s);
          });
          frag.appendChild(w);
        });
        node.parentNode.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        Array.prototype.slice.call(node.childNodes).forEach(walk);
      }
    })(el);
    el.setAttribute('aria-label', label);
    return parts;
  }

  /* ---------- Hero title: characters un-blur in a left-to-right sweep ---------- */
  (function heroIntro() {
    var content = $('.mn-hero__content');
    if (!content) { root.classList.remove('is-loading'); return; }
    var parts = [];
    $$('.mn-hero__heading', content).forEach(function (el) { parts = parts.concat(splitText(el)); });
    gsap.set(parts, { opacity: 0, filter: 'blur(8px)' });
    root.classList.remove('is-loading');

    var started = false;
    var play = function () {
      if (started) return;
      started = true;
      var xs = parts.map(function (s) { return s.getBoundingClientRect().left; });
      var min = Math.min.apply(null, xs);
      var span = Math.max(Math.max.apply(null, xs) - min, 1);
      var total = 2.5, each = 1.2;
      gsap.to(parts, {
        opacity: 1, filter: 'blur(0px)', duration: each, ease: 'power2.out', delay: .2,
        stagger: function (i) { return (xs[i] - min) / span * (total - each); }
      });
    };
    // Start after the intro loader (if any) has handed over, so the sweep is actually seen.
    var after = (window.mnPreloader && window.mnPreloader.done) || Promise.resolve();
    after.then(function () {
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(play); setTimeout(play, 1200); }
      else play();
    });
  })();

  /* ---------- Rise-in: any [data-rise] block or [data-rise-item] card, homepage and inner pages ----------
     The CSS starts complete, so reduced motion (which returned above) and no-JS show everything.
     ?review (used in the client's content-request links) shows everything at once. */
  (function rise() {
    var review = /[?&]review\b/.test(location.search);
    var rising = review ? [] : $$('[data-rise], [data-rise-item]').filter(function (el) { return !el.closest('.mn-pg-formwrap'); });
    gsap.set(rising, { y: 32, autoAlpha: 0 });
    ScrollTrigger.batch(rising, { start: 'top 92%', once: true, onEnter: function (batch) {
      // clearProps hands transform/opacity back to CSS, so hover lifts and the filter tabs keep working.
      gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: .08, clearProps: 'transform,opacity,visibility' });
    } });
  })();

  /* ---------- Conventions: heading, then the cards rise in one after another ---------- */
  (function conventionsIntro() {
    var conv = sec('conventions');
    if (!conv || conv.hidden) return;
    var head = $$('.mn-conv__head > *, .mn-conv__find', conv);
    // The reveal moves the inner link, so the <li> keeps its snap position in the rail.
    var cards = $$('.mn-conv__card', conv);
    gsap.set(head, { y: 24, autoAlpha: 0 });
    gsap.set(cards, { y: 60, autoAlpha: 0 });
    ScrollTrigger.create({ trigger: conv, start: 'top 75%', once: true, onEnter: function () {
      gsap.to(head, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', stagger: .1, clearProps: 'transform,opacity,visibility' });
    } });
    ScrollTrigger.create({ trigger: $('.mn-conv__rail', conv), start: 'top 92%', once: true, onEnter: function () {
      gsap.to(cards, { y: 0, autoAlpha: 1, duration: 1.2, ease: 'power3.out', stagger: .1, clearProps: 'transform' });
    } });
  })();

  /* ---------- Numbers strip: the figures rise, count up from zero and each "+" lands as its count ends ---------- */
  (function () {
    var row = $('[data-sec="commission"] .mn-nums__row');
    if (!row) return;
    var figs = $$('.mn-fig', row);
    var nums = $$('[data-count]', row);
    var plus = $$('.mn-fig__plus', row);
    gsap.set(figs, { y: 20, autoAlpha: 0 });
    gsap.set(plus, { autoAlpha: 0, scale: .4, transformOrigin: '0% 75%' });
    once(function () { var r = row.getBoundingClientRect(); return r.height && r.bottom <= vh() - 8; }, function () {
      // Hold each number at its final width so the "+" stays put while the digits change.
      nums.forEach(function (n) { n.style.minWidth = n.getBoundingClientRect().width + 'px'; });
      var STAGGER = .12, COUNT = 2;
      var tl = gsap.timeline()
        .to(figs, { y: 0, autoAlpha: 1, duration: .8, ease: 'power2.out', stagger: STAGGER }, 0)
        .from(nums, { textContent: 0, duration: COUNT, ease: 'power3.out', snap: { textContent: 1 }, stagger: STAGGER }, .1);
      plus.forEach(function (p, i) {
        tl.to(p, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2.5)' }, .1 + i * STAGGER + COUNT * .72);
      });
    });
  })();

  /* ---------- Private Access: a line of light at the seam, the doors swing inward onto the durbar hall,
     the hall brightens, then the line settles in. Plays once, well into view. ---------- */
  (function () {
    var wrap = sec('collector');
    var doors = $('.mn-doors', wrap);
    if (!doors) return;
    var leaves = $$('.mn-doors__leaf', doors);
    var light = $('.mn-doors__light', doors);
    var hall = $('.mn-ed__img', wrap);
    var content = $('.mn-ed__content', wrap);

    gsap.set(doors, { autoAlpha: 1 });
    gsap.set(leaves[0], { transformOrigin: '0% 50%' });
    gsap.set(leaves[1], { transformOrigin: '100% 50%' });
    // An explicit start value: tweening a filter up from "none" starts it at black.
    gsap.set(leaves, { filter: 'brightness(1)' });
    gsap.set(content, { autoAlpha: 0, y: 24 });

    var tl = gsap.timeline({ paused: true })
      .fromTo(light, { autoAlpha: 0, scaleY: .3 }, { autoAlpha: 1, scaleY: 1, duration: .6, ease: 'power2.out' }, 0)
      .fromTo(hall, { filter: 'brightness(.5)' }, { filter: 'brightness(1)', duration: 2, ease: 'power2.out' }, .45)
      .to(leaves[0], { rotateY: 80, xPercent: -4, duration: 2.1, ease: 'power3.inOut' }, .4)
      .to(leaves[1], { rotateY: -80, xPercent: 4, duration: 2.1, ease: 'power3.inOut' }, .4)
      .to(leaves, { filter: 'brightness(.7)', duration: 2.1, ease: 'power2.in' }, .4)
      .to(light, { autoAlpha: 0, duration: .8, ease: 'power1.out' }, .9)
      .to(content, { autoAlpha: 1, y: 0, duration: 1.2, ease: 'power2.out' }, 1.5)
      .to(leaves, { autoAlpha: 0, duration: .5 }, 2)
      .set(doors, { autoAlpha: 0 })
      .set(hall, { clearProps: 'filter' });

    ScrollTrigger.create({ trigger: wrap, start: 'top 55%', once: true, onEnter: function () { tl.play(); } });
  })();

  /* ---------- "400 years in one line": the band draws once when it comes into view. The strip glides from
     Golconda to the bridge where it overflows (narrow screens) while the ground draws and each landmark
     opens in turn: outline, details, then tick, year and name. ---------- */
  (function () {
    var sky = $('[data-sec="city"] .mn-skyline');
    if (!sky) return;
    var track = $('.mn-skyline__track', sky);
    var rules = $$('.mn-skyline__ground, .mn-skyline__axis', sky);
    // pathLength="1" dashes need autoRound: false, or GSAP rounds the 1 -> 0 offset into a jump.
    gsap.set(rules, { strokeDashoffset: 1 });
    var D = 3.2;
    var tl = gsap.timeline({ paused: true })
      .to(rules, { strokeDashoffset: 0, autoRound: false, duration: D, ease: 'power1.inOut' }, 0);
    $$('.mn-skyline__mark', sky).forEach(function (g) {
      var x = parseFloat(g.getAttribute('data-x')) || 0;
      var mark = gsap.timeline()
        .fromTo($('.mn-skyline__outline', g), { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, ease: 'power1.inOut', duration: .6 }, 0)
        .fromTo($('.mn-skyline__detail', g), { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, ease: 'power1.inOut', duration: .45 }, .4)
        .fromTo($('.mn-skyline__label', g), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: .35 }, .65);
      tl.add(mark, (D - 1) * x / 1000);
    });
    if (track) {
      var glide = { p: 0 };
      tl.to(glide, { p: 1, duration: D, ease: 'power1.inOut', onUpdate: function () {
        track.scrollLeft = (track.scrollWidth - track.clientWidth) * glide.p;
      } }, 0);
    }
    tl.progress(0);
    once(inView(sky, .7), function () { tl.play(); });
  })();

  /* ---------- Quick Experiences: the card arches draw in, one after another, as the rail comes into view ---------- */
  (function () {
    var rail = $('[data-sec="spinner"] .mn-arcade__rail');
    if (!rail) return;
    var arches = $$('.mn-arcade__arch path', rail);
    gsap.set(arches, { strokeDashoffset: 1 });
    once(inView(rail, .75), function () {
      gsap.to(arches, { strokeDashoffset: 0, autoRound: false, duration: 1.4, ease: 'power2.inOut', stagger: .1 });
    });
  })();

  /* ---------- Featured Brands: the corner Charminar and Chowmahalla draw themselves, the copy rises,
     then the nine tiles rise row by row ---------- */
  (function () {
    var wrap = sec('logos');
    if (!wrap) return;
    var art = $$('.mn-brands__art path', wrap);
    var head = $$('.mn-brands__title, .mn-brands__sub, .mn-brands__body, .mn-brands__link', wrap);
    var tiles = $$('.mn-brand', wrap);
    gsap.set(art, { strokeDashoffset: 1 });
    gsap.set(head, { y: 24, autoAlpha: 0 });
    gsap.set(tiles, { y: 32, autoAlpha: 0 });
    once(inView(wrap, .7), function () {
      gsap.to(art, { strokeDashoffset: 0, autoRound: false, duration: 2.4, ease: 'power1.inOut', stagger: .3 });
      gsap.to(head, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', stagger: .1 });
      // clearProps hands the transform back to CSS so the hover lift works afterwards.
      gsap.to(tiles, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: { each: .07, grid: 'auto', from: 'start' }, delay: .2, clearProps: 'transform' });
    });
  })();

  /* ---------- Testimonials: the gold arch draws round the portrait as the quote card settles,
     then the guest tabs rise ---------- */
  (function () {
    var wrap = sec('materials');
    var stage = wrap && $('.mn-ed', wrap);
    if (!stage) return;
    var box = $('.mn-ed__content', stage);
    var portrait = $('.mn-voices__portrait', stage);
    var steps = $$('.mn-step', stage);
    gsap.set(box, { y: 32, autoAlpha: 0 });
    gsap.set(steps, { y: 18, autoAlpha: 0 });
    var arch = portrait && gsap.timeline({ paused: true })
      .fromTo($('.mn-voices__arch path', portrait), { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, duration: 1.8, ease: 'power2.inOut' }, 0)
      .fromTo($('.mn-voices__media', portrait), { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out' }, .25);
    once(inView(stage, .6), function () {
      gsap.to(box, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', clearProps: 'transform,opacity,visibility' });
      if (arch) arch.play();
    });
    // The tabs carry .mn-step: the reveal sets their opacity, so their dimmed state lives on their contents.
    once(inView(stage, .25), function () {
      gsap.to(steps, { y: 0, autoAlpha: 1, duration: .7, ease: 'power2.out', stagger: .12 });
    });
  })();

  /* ---------- Closing CTA: heading and link rise, then the three steps draw milestone by milestone ---------- */
  (function () {
    var wrap = sec('heritage');
    if (!wrap) return;
    var box = $('.mn-heritage', wrap);
    var intro = $$('.mn-heritage__heading, .mn-heritage__link', wrap);
    gsap.set(intro, { y: 20, autoAlpha: 0 });
    once(inView(box, .75), function () {
      gsap.to(intro, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', stagger: .12 });
    });

    var miles = $$('.mn-timeline__mile', wrap);
    var lines = $$('.mn-timeline__line', wrap);
    var seq = gsap.timeline({ paused: true });
    miles.forEach(function (m, i) {
      var bits = [$('.mn-timeline__dot', m), $('.mn-timeline__cap', m)];
      gsap.set(bits, { y: 14, autoAlpha: 0 });
      seq.to(bits, { y: 0, autoAlpha: 1, duration: .55, ease: 'power2.out' }, i * .7);
      if (lines[i]) {
        gsap.set(lines[i], { scaleX: 0, transformOrigin: 'left center' });
        seq.to(lines[i], { scaleX: 1, duration: .6, ease: 'power1.inOut' }, i * .7 + .22);
      }
    });
    once(function () { return box.getBoundingClientRect().bottom <= vh() + 2; }, function () { seq.play(); });
  })();

  /* ---------- Inner pages: the hero opens out of its arch and the route thread draws with the scroll ---------- */
  (function innerPages() {
    if (isHome) return;
    var hero = $('[data-hero]');
    if (hero) {
      $$('.mn-pg-hero__img, .mn-pg-hero__video', hero).forEach(function (layer) { parallax(hero, layer, 1.1, 4); });
      gsap.from($('[data-hero-body]', hero).children, { y: 28, autoAlpha: 0, duration: 1.1, ease: 'power2.out', stagger: .12, delay: .55 });
      if (root.classList.contains('mn-arch')) {
        clearTimeout(window.__mnArchFailsafe);
        gsap.to($('[data-hero-media]', hero), { '--arch': 5, duration: 1.7, ease: 'power3.inOut', onComplete: function () { root.classList.remove('mn-arch'); } });
      }
    }
    $$('[data-route]').forEach(function (route) {
      var line = $('[data-route-line]', route), stops = $$('[data-stop]', route);
      route.classList.add('is-route-on');
      if (stops[0]) stops[0].classList.add('is-lit');
      gsap.set(line, { scaleY: 0 });
      ScrollTrigger.create({ trigger: $('.mn-pg-route', route), start: 'top 72%', end: 'bottom 58%', scrub: .4, onUpdate: function (st) {
        gsap.set(line, { scaleY: st.progress });
        stops.forEach(function (stop, i) { stop.classList.toggle('is-lit', i === 0 || st.progress >= i / (stops.length - 1) - .02); });
      } });
    });
  })();

  /* Re-measure once media and fonts have settled. */
  window.addEventListener('load', function () { setTimeout(function () { ScrollTrigger.refresh(); }, 300); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();

/* ==========================================================================
   Scroll choreography: Lenis smooth scroll + GSAP ScrollTrigger.

   Desktop (>=1025px) runs the full stacked sequence: sections pin, the next
   one slides over as a "curtain" whose content is counter-moved so it looks
   uncovered rather than pushed, and two transitions wipe in sideways.
   Smaller screens get lighter parallax and reveals.
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

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ---------- Lenis ---------- */
  if (window.Lenis) {
    var lenis = new Lenis({
      duration: 1.4,
      wheelMultiplier: .7,
      // Cap single wheel bursts so trackpad flicks can't skip a whole section.
      virtualScroll: function (data) {
        data.deltaY = Math.max(-140, Math.min(140, data.deltaY));
        return true;
      }
    });
    window.mnLenis = lenis;
    // Hold scrolling while the intro loader plays (js/preloader.js).
    if (window.mnPreloader && window.mnPreloader.active) {
      lenis.stop();
      window.mnPreloader.done.then(function () { lenis.start(); });
    }
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Helpers ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };
  var sec = function (name) { return $('[data-sec="' + name + '"]'); };
  var vh = function () { return window.innerHeight; };
  var vw = function () { return window.innerWidth; };
  var clamp01 = function (n) { return Math.max(0, Math.min(1, n)); };

  function pageTop(el) {
    var y = 0;
    while (el) { y += el.offsetTop; el = el.offsetParent; }
    return y;
  }

  // Scroll position at which a section's bottom meets the viewport bottom.
  function settleAt(el) { return pageTop(el) + Math.max(el.offsetHeight - vh(), 0); }

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
    return function () { window.removeEventListener('scroll', check); };
  }

  // Drive a paused timeline by how far `el` has risen into the viewport
  // (0 when its top is at the bottom edge, 1 when its top reaches the top).
  function riseDriven(el, tl, onProgress) {
    tl.pause();
    var update = function () {
      var p = clamp01(1 - el.getBoundingClientRect().top / vh());
      tl.progress(p);
      if (onProgress) onProgress(p);
    };
    var onRefresh = function () { tl.invalidate(); update(); };
    gsap.ticker.add(update);
    ScrollTrigger.addEventListener('refresh', onRefresh);
    update();
    return function () {
      gsap.ticker.remove(update);
      ScrollTrigger.removeEventListener('refresh', onRefresh);
    };
  }

  // Parallax a layer inside its holder: scaled up, then slid ±amp yPercent.
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
    return function () { gsap.ticker.remove(update); gsap.set(layer, { clearProps: 'transform' }); };
  }

  // Wrap each char/word of el's text nodes in a span (keeps <em> etc.).
  function splitText(el, mode) {
    var parts = [];
    // Collapse the whitespace around <br>s so the label reads "Experience Asli = Real Hyderabad."
    var label = el.textContent.replace(/\s+/g, ' ').trim();
    (function walk(node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (word) {
          if (!word) return;
          if (!word.trim()) { frag.appendChild(document.createTextNode(word)); return; }
          var w = document.createElement('span');
          w.style.display = 'inline-block';
          w.style.whiteSpace = 'nowrap';
          w.setAttribute('aria-hidden', 'true');
          if (mode === 'word') { w.textContent = word; parts.push(w); }
          else {
            // Chars live inside a no-wrap word so lines only break between words.
            word.split('').forEach(function (ch) {
              var s = document.createElement('span');
              s.textContent = ch;
              s.style.display = 'inline-block';
              parts.push(s);
              w.appendChild(s);
            });
          }
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

  // A soft gradient mask that sweeps across `el` while it un-blurs.
  function maskReveal(el, direction, duration, blur) {
    var state = { p: 0 };
    var paint = function () {
      var m = 'linear-gradient(' + direction + ', #000 ' + (state.p - 40) + '%, transparent ' + state.p + '%)';
      el.style.webkitMaskImage = m;
      el.style.maskImage = m;
    };
    paint();
    el.style.filter = 'blur(' + blur + 'px)';
    return gsap.timeline({ paused: true })
      .to(state, { p: 140, duration: duration, ease: 'power2.out', onUpdate: paint }, 0)
      .to(el, { filter: 'blur(0px)', duration: duration, ease: 'power2.out' }, 0)
      .add(function () { el.style.webkitMaskImage = el.style.maskImage = el.style.filter = ''; });
  }

  // Scaled-down, blurred white card that settles in, followed by its copy.
  function boxReveal(content) {
    var box = $('.mn-ed__content', content);
    if (!box) return null;
    var bits = [$('.mn-ed__body', box), $('.mn-ed__btn, .mn-ed__link', box)].filter(Boolean);
    gsap.set(box, { scale: .7, autoAlpha: 0, filter: 'blur(8px)', transformOrigin: '50% 50%' });
    gsap.set(bits, { y: 24, autoAlpha: 0, filter: 'blur(6px)' });
    var tl = gsap.timeline({ paused: true })
      .to(box, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: .9, ease: 'power2.out' }, 0);
    bits.forEach(function (b, i) {
      tl.to(b, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: .8, ease: 'power2.out' }, .45 + i * .15);
    });
    return tl;
  }

  function stepsReveal(scope) {
    var steps = $$('.mn-step', scope);
    if (!steps.length) return null;
    gsap.set(steps, { y: 18, autoAlpha: 0, filter: 'blur(6px)' });
    return gsap.to(steps, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: .7, ease: 'power2.out', stagger: .15, paused: true });
  }

  // Paths drawn with pathLength="1" tween strokeDashoffset 1 -> 0, so these tweens set autoRound: false:
  // GSAP rounds px values by default, which would make a 0..1 dash jump instead of draw.
  // "400 years in one line": one paused timeline per landmark. It opens from the ground: the outline
  // draws, then its details, then the tick, year and name rise. Callers drive its progress.
  function skylineMarks(sky) {
    return $$('.mn-skyline__mark', sky).map(function (g) {
      var outline = $('.mn-skyline__outline', g);
      var bits = [outline, $('.mn-skyline__detail', g), $('.mn-skyline__label', g)];
      var tl = gsap.timeline({ paused: true })
        .fromTo(bits[0], { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, ease: 'power1.inOut', duration: .6 }, 0)
        .fromTo(bits[1], { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, ease: 'power1.inOut', duration: .45 }, .4)
        .fromTo(bits[2], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: .35 }, .65);
      return { outline: outline, bits: bits, tl: tl, x: parseFloat(g.getAttribute('data-x')) || 0 };
    });
  }
  function skylineReset(marks, rules) {
    marks.forEach(function (m) { m.tl.kill(); gsap.set(m.bits, { clearProps: 'all' }); });
    gsap.set(rules, { clearProps: 'strokeDashoffset' });
  }

  /* ---------- Hero title: characters un-blur in a left-to-right sweep ---------- */
  (function heroIntro() {
    var content = $('.mn-hero__content');
    if (!content) { root.classList.remove('is-loading'); return; }
    var parts = [];
    $$('.mn-hero__eyebrow, .mn-hero__heading', content).forEach(function (el) {
      parts = parts.concat(splitText(el, 'char'));
    });
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

  /* ---------- Statement: masked line-by-line reveal (all sizes) ---------- */
  (function statementIntro() {
    var block = $('.mn-statement__inner');
    if (!block) return;
    var tl = maskReveal(block, 'to bottom', 2.5, 8);
    ScrollTrigger.create({ trigger: sec('statement'), start: 'top 75%', once: true, onEnter: function () { tl.play(); } });

    // Letters ink in from faint to full as you scroll. Starts once the section has
    // crossed the middle of the screen and finishes just before the desktop pin
    // (statement 'top top') starts fading the text out again.
    var text = $('.mn-statement__text', block);
    if (!text) return;
    var chars = splitText(text, 'char');
    var STEP = .06;
    var ink = gsap.timeline({
      scrollTrigger: { trigger: sec('statement'), start: 'top 50%', end: 'top 8%', scrub: .6 }
    });
    ink.fromTo(chars, { opacity: .14 }, { opacity: 1, ease: 'none', stagger: STEP }, 0);
    // Each coloured loop is drawn round its word, pen-like (slow start and finish), as the word inks.
    $$('.mn-ring', text).forEach(function (ring) {
      var own = chars.filter(function (c) { return ring.contains(c); });
      if (!own.length) return;
      var first = chars.indexOf(own[0]);
      var last = chars.indexOf(own[own.length - 1]);
      ink.fromTo(ring, { '--draw': 0 }, { '--draw': 1, ease: 'power1.inOut', duration: Math.max((last - first) * STEP, .3) + .5 }, first * STEP + .25);
    });
  })();

  /* ---------- Breakpoint-specific choreography ---------- */
  var mm = gsap.matchMedia();

  mm.add('(min-width: 1025px)', function () {
    var cleanups = [];
    var S = {
      hero: sec('hero'), statement: sec('statement'), cats: sec('cats'),
      colA: sec('collection-a'), commission: sec('commission'), collector: sec('collector'),
      city: sec('city'), spinner: sec('spinner'), colB: sec('collection-b'),
      materials: sec('materials'), worlds: sec('worlds')
    };

    // Stack order for the overlapping sections.
    gsap.set(S.hero, { zIndex: -1 });
    gsap.set(S.statement, { zIndex: -1 });
    gsap.set(S.commission, { zIndex: 2 });
    gsap.set(S.collector, { zIndex: 3 });
    gsap.set(S.city, { zIndex: 4 });
    gsap.set(S.spinner, { zIndex: 5 });
    gsap.set(S.materials, { zIndex: 6 });

    /* Hero: holds while the statement slides over it, drifting up and fading its title. */
    (function () {
      var hero = $('.mn-hero', S.hero);
      gsap.timeline({
        scrollTrigger: { trigger: S.hero, start: 'top top', end: 'bottom top', scrub: true, pin: true, pinSpacing: false }
      })
        .to(hero, { yPercent: -12, ease: 'none', duration: 1 }, 0)
        .to($('.mn-hero__content', hero), { opacity: 0, filter: 'blur(8px)', ease: 'none', duration: .35 }, 0);
    })();

    /* Statement holds; the category tiles grow out of it from 60% scale. */
    (function () {
      var cats = $('.mn-cats', S.cats);
      var tiles = $$('.mn-cats__tile', cats);
      var gap = function () { return Math.max(pageTop(S.cats) - pageTop(S.statement), 1); };
      gsap.set(cats, { backgroundColor: 'transparent' });

      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: S.statement, start: 'top top', end: function () { return '+=' + gap(); },
          scrub: true, pin: true, pinSpacing: false, invalidateOnRefresh: true,
          onUpdate: function (self) { cats.classList.toggle('is-armed', self.progress > .55); },
          onLeave: function () { cats.classList.add('is-armed'); },
          onEnterBack: function () { cats.classList.remove('is-armed'); }
        }
      });
      // The y offset cancels the scroll so the grid grows in place, centred on the statement.
      tl.fromTo(cats,
        { y: function () { return -gap(); }, scale: .6, transformOrigin: function () { return '50% ' + S.statement.offsetHeight / 2 + 'px'; } },
        { y: 0, scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo(cats, { filter: 'blur(6px)' }, { filter: 'blur(0px)', ease: 'none', duration: .45 }, 0)
        .fromTo(cats, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'none', duration: .12 }, 0)
        .fromTo($('.mn-statement__body', S.statement), { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: 'blur(8px)', ease: 'none', duration: .45 }, 0);
      if (tiles.length > 1) {
        tl.fromTo(tiles[0], { autoAlpha: 0, scale: .85, transformOrigin: '100% 50%' }, { autoAlpha: 1, scale: 1, ease: 'none', duration: .55 }, .05)
          .fromTo(tiles[1], { autoAlpha: 0, scale: .85, transformOrigin: '0% 50%' }, { autoAlpha: 1, scale: 1, ease: 'none', duration: .9 }, .1);
      }

      // Brief hold on the finished grid.
      ScrollTrigger.create({
        trigger: S.cats,
        start: function () { return pageTop(S.cats); },
        end: function () { return pageTop(S.cats) + Math.round(vh() * .55); },
        pin: true, pinSpacing: true, invalidateOnRefresh: true
      });
    })();

    /* Conventions (3b): the section pins and scrolling carries the cards from 01 to the last,
       diagonally (top-right -> centre -> bottom-left). Rests settle on the nearest card. */
    (function () {
      var conv = sec('conventions');
      var api = window.mnConv;
      if (!conv || !api || api.count < 2) return;
      var n = api.count;
      var dist = function () { return Math.round(vh() * .7 * (n - 1)); };
      api.enterScrub();
      var st = ScrollTrigger.create({
        trigger: conv,
        start: 'top top',
        end: function () { return '+=' + dist(); },
        pin: true, pinSpacing: true, invalidateOnRefresh: true,
        onUpdate: function (self) { api.scrub(self.progress * (n - 1)); },
        onRefresh: function (self) { api.scrub(self.progress * (n - 1)); }
      });
      api.scrub(0);
      api.scrollToIndex = function (i) {
        var y = st.start + (st.end - st.start) * i / (n - 1);
        if (window.mnLenis) window.mnLenis.scrollTo(y, { duration: 1.1 });
        else window.scrollTo({ top: y, behavior: 'smooth' });
      };
      var settle = function () {
        if (!st.isActive) return;
        var f = st.progress * (n - 1), i = Math.round(f);
        if (Math.abs(f - i) > .02) api.scrollToIndex(i);
      };
      ScrollTrigger.addEventListener('scrollEnd', settle);
      cleanups.push(function () {
        ScrollTrigger.removeEventListener('scrollEnd', settle);
        api.exitScrub();
      });
    })();

    /* Collections: masked rise-in, staggered cards. */
    [S.colA, S.colB].forEach(function (wrap) {
      var inner = $('.mn-collection', wrap);
      var cards = $$('.mn-card', inner);
      var entry = maskReveal(inner, 'to top', 2, 6);
      gsap.set(cards, { y: 56, autoAlpha: 0 });
      var cardsIn = gsap.to(cards, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power3.out', stagger: .14, paused: true });
      cleanups.push(once(function () { return wrap.getBoundingClientRect().top < vh() * .7; }, function () { entry.play(); }));
      cleanups.push(once(function () { return wrap.getBoundingClientRect().top < vh() * .65; }, function () { cardsIn.play(); }));
    });

    /* A collection holds at its end while an editorial curtain rises over it. */
    function curtain(prevWrap, wrap, opts) {
      var ed = $('.mn-ed', wrap);
      var media = $('.mn-ed__media', ed);
      var frame = $('.mn-ed__frame', ed);
      gsap.set(ed, { overflow: 'hidden' });
      if (prevWrap && opts.holdPrev) {
        ScrollTrigger.create({
          trigger: prevWrap,
          start: function () { return settleAt(prevWrap); },
          end: function () { return pageTop(wrap); },
          pin: true, pinSpacing: false, invalidateOnRefresh: true
        });
      }
      var tl = gsap.timeline();
      tl.fromTo(media, { y: function () { return -vh(); }, scale: 1.06 }, { y: 0, scale: 1, ease: 'none', duration: 1 }, 0)
        .fromTo(frame, { y: function () { return -vh(); } }, { y: 0, ease: 'none', duration: 1 }, 0);
      if (opts.pushPrev) tl.fromTo(opts.pushPrev, { yPercent: 0 }, { yPercent: -25, ease: 'none', duration: 1 }, 0);
      cleanups.push(riseDriven(wrap, tl));
    }

    // Hold a section after it settles until `next` arrives.
    function dwell(wrap, next, extra, onEnter, spacing) {
      ScrollTrigger.create({
        trigger: wrap,
        start: function () { return settleAt(wrap); },
        end: function () { return next ? pageTop(next) : settleAt(wrap) + Math.round(vh() * extra); },
        pin: true, pinSpacing: !!spacing, invalidateOnRefresh: true,
        onEnter: onEnter
      });
    }

    /* Commission */
    (function () {
      curtain(S.colA, S.commission, { holdPrev: true, pushPrev: $('.mn-collection', S.colA) });
      var box = boxReveal(S.commission);
      var steps = stepsReveal(S.commission);
      ScrollTrigger.create({ trigger: S.commission, start: 'top 30%', once: true, onEnter: function () { box && box.play(); } });
      dwell(S.commission, S.collector, .35, function () { steps && steps.play(); });
    })();

    /* Private Access (collector slot): curtain rise and hold; the doors are set up for all sizes below. */
    curtain(null, S.collector, {});
    dwell(S.collector, S.city, .35);

    /* City: wipes in from the right behind an ink sweep while the collector slides left.
       The sweep carries "400 years in one line": each landmark opens up as it comes on screen. */
    (function () {
      var ed = $('.mn-ed', S.city);
      var media = $('.mn-ed__media', ed);
      var prevMedia = $('.mn-ed__media', S.collector);
      var prevFrame = $('.mn-ed__frame', S.collector);
      var content = $('.mn-ed__content', ed);
      gsap.set(ed, { position: 'relative', zIndex: 1 });

      var sweep = document.createElement('div');
      sweep.className = 'mn-sweep';
      sweep.style.cssText = 'position:absolute;top:0;bottom:0;left:0;width:50%;z-index:2;pointer-events:none';
      S.city.appendChild(sweep);

      // Move the skyline band into the sweep (put back on cleanup, e.g. resizing to mobile).
      var sky = $('.mn-skyline', S.city);
      var skyHome = sky && sky.nextElementSibling;
      if (sky) sweep.appendChild(sky);

      gsap.set(content, { x: 70, autoAlpha: 0 });
      var contentIn = gsap.to(content, { x: 0, autoAlpha: 1, ease: 'none', duration: 1, paused: true });

      var tl = gsap.timeline()
        .fromTo(ed, { y: function () { return -vh(); } }, { y: 0, ease: 'none', duration: 1 }, 0)
        .fromTo(sweep, { y: function () { return -vh(); }, xPercent: 200 }, { y: 0, xPercent: -100, ease: 'none', duration: 1 }, 0)
        .fromTo(ed, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: .667 }, .333)
        .fromTo(media, { x: function () { return Math.round(vw() * .05); } }, { x: 0, ease: 'none', duration: .667 }, .333)
        .fromTo(prevMedia, { x: 0 }, { x: function () { return -Math.round(vw() * .18); }, ease: 'none', duration: .6 }, 0)
        .fromTo(prevFrame, { x: 0 }, { x: function () { return -Math.round(vw() * .32); }, ease: 'none', duration: .6 }, 0);

      // Each landmark opens as the sweep carries it on screen: from when its centre crosses 96% of the
      // viewport until it reaches 62%, so every one gets the same unhurried reveal. Driven by where the
      // drawing actually is, scrolling back closes them again. Ground and axis draw up to the same front.
      var marks = sky ? skylineMarks(sky) : [];
      var rules = sky ? $$('.mn-skyline__ground, .mn-skyline__axis', sky) : [];
      var svg = sky && $('.mn-skyline__svg', sky);
      if (sky) gsap.set(rules, { strokeDashoffset: 1 });
      var lastP = -1;
      var openSky = function (p) {
        // Before and after the sweep nothing moves; settle once instead of measuring every frame.
        if (!sky || ((p <= 0 || p >= 1) && p === lastP)) return;
        lastP = p;
        var front = vw() * .96, span = vw() * .34;
        var r = svg.getBoundingClientRect();
        gsap.set(rules, { strokeDashoffset: 1 - clamp01((front - r.left) / r.width), autoRound: false });
        marks.forEach(function (m) {
          var b = m.outline.getBoundingClientRect();
          m.tl.progress(clamp01((front - b.left - b.width / 2) / span));
        });
      };

      cleanups.push(riseDriven(S.city, tl, function (p) {
        var cp = clamp01((p - .4) / .5);
        if (cp > contentIn.progress()) contentIn.progress(cp);
        openSky(p);
      }));
      cleanups.push(function () {
        if (sky) {
          skylineReset(marks, rules);
          S.city.insertBefore(sky, skyHome && skyHome.parentNode === S.city ? skyHome : S.city.firstChild);
        }
        sweep.remove();
      });
      dwell(S.city, S.spinner, .25);
    })();

    /* Quick Experiences (spinner slot): wipes in sideways over the city, the card arches
       drawing in as it lands. Then the section holds while the page scroll carries the rail from 01
       to 10, with a short pause before and after. */
    (function () {
      var arc = $('.mn-arcade', S.spinner);
      if (!arc) return;
      var rail = $('.mn-arcade__rail', arc);
      var track = $('.mn-arcade__track', arc);
      var arches = $$('.mn-arcade__arch path', arc);
      var api = window.mnArcade;
      var tl = gsap.timeline()
        .fromTo(arc, { y: function () { return -vh(); } }, { y: 0, ease: 'none', duration: 1 }, 0)
        .fromTo(arc, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0)
        .fromTo($('.mn-ed__media', S.city), { x: 0 }, { x: function () { return -Math.round(vw() * .18); }, ease: 'none', duration: 1 }, 0)
        .fromTo($('.mn-ed__frame', S.city), { x: 0 }, { x: function () { return -Math.round(vw() * .14); }, ease: 'none', duration: 1 }, 0)
        .fromTo(arches, { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, ease: 'none', duration: .3, stagger: .02 }, .5);
      cleanups.push(riseDriven(S.spinner, tl));

      rail.classList.add('is-driven');
      var dist = function () { return Math.max(track.offsetWidth - rail.clientWidth, 0); };
      var lead = function () { return Math.round(vh() * .12); };
      ScrollTrigger.create({
        trigger: S.spinner,
        start: function () { return settleAt(S.spinner); },
        end: function () { return settleAt(S.spinner) + lead() + dist() + Math.round(vh() * .3); },
        pin: true, pinSpacing: true, invalidateOnRefresh: true
      });
      var drive = gsap.fromTo(track, { x: 0 }, {
        x: function () { return -dist(); },
        ease: 'none',
        scrollTrigger: {
          trigger: S.spinner,
          start: function () { return settleAt(S.spinner) + lead(); },
          end: function () { return settleAt(S.spinner) + lead() + dist(); },
          scrub: true, invalidateOnRefresh: true,
          onUpdate: function (self) { if (api) api.update(self.progress * dist()); }
        }
      });
      if (api) {
        api.driver = function (px) {
          var y = drive.scrollTrigger.start + Math.min(px, dist());
          if (window.mnLenis) window.mnLenis.scrollTo(y, { duration: 1.2 });
          else window.scrollTo({ top: y, behavior: 'smooth' });
        };
      }
      cleanups.push(function () {
        rail.classList.remove('is-driven');
        gsap.set(arches, { clearProps: 'strokeDashoffset' });
        if (api) { api.driver = null; api.update(rail.scrollLeft); }
      });
    })();

    /* Testimonials (materials slot): curtain over the Originals; the gold arch draws round the
       portrait as the quote card settles. */
    (function () {
      curtain(S.colB, S.materials, { holdPrev: true, pushPrev: $('.mn-collection', S.colB) });
      var box = boxReveal(S.materials);
      var steps = stepsReveal(S.materials);
      var portrait = $('.mn-voices__portrait', S.materials);
      var arch = portrait && gsap.timeline({ paused: true })
        .fromTo($('.mn-voices__arch path', portrait), { strokeDashoffset: 1 }, { strokeDashoffset: 0, autoRound: false, duration: 1.8, ease: 'power2.inOut' }, 0)
        .fromTo($('.mn-voices__media', portrait), { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 1.3, ease: 'power3.out' }, .25);
      cleanups.push(once(function () { return S.materials.getBoundingClientRect().top < vh() * .3; }, function () {
        box && box.play();
        arch && arch.play();
      }));
      ScrollTrigger.create({
        trigger: S.materials,
        start: function () { return settleAt(S.materials); },
        end: function () { return settleAt(S.materials) + 1; },
        invalidateOnRefresh: true,
        onEnter: function () { steps && steps.play(); }
      });
    })();

    return function () { cleanups.forEach(function (fn) { fn(); }); };
  });

  /* Tablet / phone: lighter parallax on the big media. */
  mm.add('(max-width: 1024px)', function () {
    var cleanups = [];
    $$('.mn-ed__media').forEach(function (m) {
      gsap.set(m, { overflow: 'hidden' });
      cleanups.push(parallax(m.closest('.mn-ed'), m.firstElementChild, 1.18, 8));
    });
    var heroMedia = $('.mn-hero__media');
    if (heroMedia) cleanups.push(parallax(heroMedia, $('video, img', heroMedia), 1.18, 8));
    $$('.mn-cats__tile').forEach(function (tile) {
      cleanups.push(parallax(tile, $('.mn-cats__img', tile), 1.18, 8));
    });
    // Steps appear once their section is fully on screen.
    ['commission', 'materials'].forEach(function (name) {
      var wrap = sec(name);
      var steps = stepsReveal(wrap);
      if (steps) cleanups.push(once(function () { return wrap.getBoundingClientRect().bottom <= vh() + 2; }, function () { steps.play(); }));
    });
    // "400 years in one line" band: draws once when it comes into view. The strip glides from Golconda
    // to the bridge (so the labels stay readable on narrow screens) while the ground draws and each
    // landmark opens in turn, timed to when the glide brings it into view.
    (function () {
      var sky = $('.mn-sec[data-sec="city"] .mn-skyline');
      if (!sky) return;
      var track = $('.mn-skyline__track', sky);
      var marks = skylineMarks(sky);
      var rules = $$('.mn-skyline__ground, .mn-skyline__axis', sky);
      gsap.set(rules, { strokeDashoffset: 1 });
      var D = 3.2;
      var tl = gsap.timeline({ paused: true })
        .to(rules, { strokeDashoffset: 0, autoRound: false, duration: D, ease: 'power1.inOut' }, 0);
      marks.forEach(function (m) { tl.add(m.tl.paused(false), (D - 1) * m.x / 1000); });
      if (track) {
        var glide = { p: 0 };
        tl.to(glide, { p: 1, duration: D, ease: 'power1.inOut', onUpdate: function () {
          track.scrollLeft = (track.scrollWidth - track.clientWidth) * glide.p;
        } }, 0);
      }
      cleanups.push(once(function () { return sky.getBoundingClientRect().top < vh() * .7; }, function () { tl.play(); }));
      cleanups.push(function () { tl.kill(); skylineReset(marks, rules); });
    })();
    // Quick Experiences: the card arches draw in, one after another, as the rail comes into view.
    (function () {
      var rail = $('.mn-sec[data-sec="spinner"] .mn-arcade__rail');
      if (!rail) return;
      var arches = $$('.mn-arcade__arch path', rail);
      gsap.set(arches, { strokeDashoffset: 1 });
      var draw = gsap.to(arches, { strokeDashoffset: 0, autoRound: false, duration: 1.4, ease: 'power2.inOut', stagger: .1, paused: true });
      cleanups.push(once(function () { return rail.getBoundingClientRect().top < vh() * .75; }, function () { draw.play(); }));
      cleanups.push(function () { draw.kill(); gsap.set(arches, { clearProps: 'strokeDashoffset' }); });
    })();
    return function () { cleanups.forEach(function (fn) { fn(); }); };
  });

  /* ---------- All sizes ---------- */

  /* Trusted with Hyderabad: as soon as the figures row is uncovered and fully on screen, the figures rise in,
     count up from zero (GSAP textContent tween, snapped to whole numbers) and each "+" lands as its count ends. */
  (function () {
    var wrap = sec('commission');
    var row = $('.mn-ed__figs', wrap);
    if (!row) return;
    var figs = $$('.mn-fig', row);
    var nums = $$('[data-count]', row);
    var plus = $$('.mn-fig__plus', row);
    gsap.set(figs, { y: 24, autoAlpha: 0, filter: 'blur(6px)' });
    gsap.set(plus, { autoAlpha: 0, scale: .4, transformOrigin: '0% 75%' });

    var play = function () {
      // Hold each number at its final width so the "+" stays put while the digits change.
      nums.forEach(function (n) { n.style.minWidth = n.getBoundingClientRect().width + 'px'; });
      var STAGGER = .15, COUNT = 2.2;
      var tl = gsap.timeline()
        .to(figs, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: .9, ease: 'power2.out', stagger: STAGGER }, 0)
        .from(nums, { textContent: 0, duration: COUNT, ease: 'power3.out', snap: { textContent: 1 }, stagger: STAGGER }, .1);
      plus.forEach(function (p, i) {
        tl.to(p, { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(2.5)' }, .1 + i * STAGGER + COUNT * .72);
      });
    };

    // Checked per frame: on desktop the row is counter-moved by the curtain, so only its live rect says
    // when it is actually uncovered (below the section's rising top edge) and inside the viewport.
    var check = function () {
      var r = row.getBoundingClientRect();
      if (r.height && wrap.getBoundingClientRect().top <= r.top && r.bottom <= vh() - 8) {
        gsap.ticker.remove(check);
        play();
      }
    };
    gsap.ticker.add(check);
  })();

  /* Private Access: a line of light at the seam, the doors swing inward onto the durbar hall,
     the hall brightens, then the line settles in. Plays once, when the section has mostly arrived. */
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
    gsap.set(content, { autoAlpha: 0, y: 24, filter: 'blur(6px)' });

    var tl = gsap.timeline({ paused: true })
      .fromTo(light, { autoAlpha: 0, scaleY: .3 }, { autoAlpha: 1, scaleY: 1, duration: .6, ease: 'power2.out' }, 0)
      .fromTo(hall, { filter: 'brightness(.5)' }, { filter: 'brightness(1)', duration: 2, ease: 'power2.out' }, .45)
      .to(leaves[0], { rotateY: 80, xPercent: -4, duration: 2.1, ease: 'power3.inOut' }, .4)
      .to(leaves[1], { rotateY: -80, xPercent: 4, duration: 2.1, ease: 'power3.inOut' }, .4)
      .to(leaves, { filter: 'brightness(.7)', duration: 2.1, ease: 'power2.in' }, .4)
      .to(light, { autoAlpha: 0, duration: .8, ease: 'power1.out' }, .9)
      .to(content, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power2.out' }, 1.5)
      .to(leaves, { autoAlpha: 0, duration: .5 }, 2)
      .set(doors, { autoAlpha: 0 });

    ScrollTrigger.create({
      trigger: wrap,
      // Desktop: as the curtain is about to settle. Smaller screens: once it's well into view.
      start: function () { return vw() > 1024 ? 'top 25%' : 'top 55%'; },
      once: true,
      onEnter: function () { tl.play(); }
    });
  })();

  // Collection promo media drifts inside its frame.
  $$('.mn-collection').forEach(function (c) {
    var media = $('.mn-promo__media', c);
    if (media) parallax(c, media, 1.32, 15);
  });

  /* Co-curated Experiences (worlds slot): heading lines rise, then the bento cards rise in a stagger. */
  (function () {
    var wrap = sec('worlds');
    if (!wrap) return;
    var head = $$('.mn-cocur__title, .mn-cocur__intro, .mn-cocur__link', wrap);
    var cards = $$('.mn-cc', wrap);
    gsap.set(head, { y: 28, autoAlpha: 0 });
    gsap.set(cards, { y: 48, autoAlpha: 0 });
    once(function () { return wrap.getBoundingClientRect().top < vh() * .75; }, function () {
      gsap.to(head, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power2.out', stagger: .12 });
    });
    once(function () { return $('.mn-cocur__grid', wrap).getBoundingClientRect().top < vh() * .85; }, function () {
      gsap.to(cards, { y: 0, autoAlpha: 1, duration: 1.1, ease: 'power3.out', stagger: .08 });
    });
  })();

  /* Heritage: background parallax, intro stagger, timeline drawn milestone by milestone. */
  (function () {
    var wrap = sec('heritage');
    var box = $('.mn-heritage', wrap);
    parallax(box, $('.mn-heritage__img', wrap), 1.28, 12);

    var intro = $$('.mn-heritage__eyebrow, .mn-heritage__heading, .mn-heritage__link', wrap);
    gsap.set(intro, { y: 20, autoAlpha: 0 });
    once(function () { return box.getBoundingClientRect().top < vh() * .75; }, function () {
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

  /* Footer: the inlay seam unrolls from the centre as the footer arrives. The skyline along its foot rises
     tier by tier over the last stretch of scroll, from the moment it comes into view to the end of the page
     (far moves most, so the city stands up in depth), then lights its lamps; scrolling back lowers it. */
  (function () {
    var foot = $('.mn-footer');
    var scene = foot && $('.mn-footer__scene', foot);
    if (!scene) return;
    var inlay = $('.mn-footer__inlay', foot);
    gsap.set(inlay, { clipPath: 'inset(0 50% 0 50%)' });
    once(function () { return foot.getBoundingClientRect().top < vh() * .85; }, function () {
      gsap.to(inlay, { clipPath: 'inset(0 0% 0 0%)', duration: 1.6, ease: 'power2.inOut' });
    });

    // y is in SVG user units here, so the rise is the same at every screen size.
    var rise = gsap.timeline()
      .fromTo($('.mn-footer__tier--far', foot), { y: 90 }, { y: 0, ease: 'none' }, 0)
      .fromTo($('.mn-footer__tier--mid', foot), { y: 55 }, { y: 0, ease: 'none' }, 0)
      .fromTo($('.mn-footer__tier--near', foot), { y: 25 }, { y: 0, ease: 'none' }, 0)
      .fromTo($('.mn-footer__sun', foot), { y: 70 }, { y: 0, ease: 'none' }, 0);
    ScrollTrigger.create({
      trigger: scene,
      start: 'top bottom',
      endTrigger: foot,
      end: 'bottom bottom',
      scrub: .8,
      animation: rise,
      onUpdate: function (st) { foot.classList.toggle('is-lit', st.progress > .92); }
    });
  })();

  /* Featured Brands (logos slot): the corner Charminar and Chowmahalla draw themselves, the copy rises,
     then the nine tiles rise row by row. */
  (function () {
    var wrap = sec('logos');
    if (!wrap) return;
    var art = $$('.mn-brands__art path', wrap);
    var head = $$('.mn-brands__title, .mn-brands__sub, .mn-brands__body, .mn-brands__link', wrap);
    var tiles = $$('.mn-brand', wrap);
    gsap.set(art, { strokeDashoffset: 1 });
    gsap.set(head, { y: 24, autoAlpha: 0 });
    gsap.set(tiles, { y: 32, autoAlpha: 0 });
    once(function () { return wrap.getBoundingClientRect().top < vh() * .7; }, function () {
      gsap.to(art, { strokeDashoffset: 0, autoRound: false, duration: 2.4, ease: 'power1.inOut', stagger: .3 });
      gsap.to(head, { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out', stagger: .1 });
      // clearProps hands the transform back to CSS so the hover lift works afterwards.
      gsap.to(tiles, { y: 0, autoAlpha: 1, duration: 1, ease: 'power3.out', stagger: { each: .07, grid: 'auto', from: 'start' }, delay: .2, clearProps: 'transform' });
    });
  })();

  /* Re-measure once media and fonts have settled. */
  window.addEventListener('load', function () { setTimeout(function () { ScrollTrigger.refresh(); }, 300); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
})();

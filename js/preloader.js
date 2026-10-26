/* ==========================================================================
   Intro loader (modelled on realevate.agency's site preloader).
   Timings mirror their site-preloader.timing.js. Runs on every load while
   html.is-preloading is set (inline head script); exposes window.mnPreloader
   so motion.js / components.js can wait for it.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var el = document.getElementById('mn-pre');
  var api = { active: false, done: Promise.resolve() };
  window.mnPreloader = api;

  var cleanup = function () {
    clearTimeout(window.__mnPreloadFailsafe);
    root.classList.remove('is-preloading');
    if (el && el.parentNode) el.parentNode.removeChild(el);
  };
  if (!el || !root.classList.contains('is-preloading') || !window.gsap) { cleanup(); return; }

  var resolveDone;
  api.active = true;
  api.done = new Promise(function (r) { resolveDone = r; });

  var T = {
    imageDelay: .5,
    imageReveal: 1.5, imageEase: 'power4.out', scaleFrom: 1.5,
    counterEnter: .85, counterEnterEase: 'power4.out',
    tick: .6, tickEase: 'expo.out',
    counterExit: .95, counterExitEase: 'power3.in',
    border: 1.2, borderEase: 'power4.out', borderTint: .6, borderTintEase: 'expo.out', borderOut: .4,
    exitRevealDelay: .5,
    wipe: 1.2, wipeBezier: [.73, .15, .15, .99],
    morphDelay: .1, morph: .8, morphEase: 'power2.inOut',
    firstImageWaitMs: 600
  };

  // cubic-bezier(x1, y1, x2, y2) as a GSAP ease (no CustomEase plugin needed).
  function bezier(x1, y1, x2, y2) {
    var c = function (s, a, b) { var i = 1 - s; return 3 * a * i * i * s + 3 * b * i * s * s + s * s * s; };
    return function (t) {
      var lo = 0, hi = 1, s = t;
      for (var k = 0; k < 24; k++) {
        var x = c(s, x1, x2);
        if (Math.abs(x - t) < 1e-5) break;
        if (x < t) lo = s; else hi = s;
        s = (lo + hi) / 2;
      }
      return c(s, y1, y2);
    };
  }

  var frames = Array.prototype.slice.call(el.querySelectorAll('.mn-pre__frame'));
  var imgs = frames.map(function (f) { return f.querySelector('img'); });
  var box = el.querySelector('.mn-pre__frames');
  var bg = el.querySelector('.mn-pre__bg');
  var border = el.querySelector('.mn-pre__border');
  var mask = el.querySelector('.mn-pre__mask');
  var line = el.querySelector('.mn-pre__line');
  var col = el.querySelector('.mn-pre__col');
  var words = col ? col.children.length : 0;   // one word per image (Regal ... Welcoming)
  // One Asli logo colour per image, read from the CSS tokens: plum, orange, blue, green, yellow.
  var cs = getComputedStyle(el);
  var colours = ['--logo-plum', '--logo-orange', '--logo-blue', '--logo-green', '--logo-yellow'].map(function (v) { return cs.getPropertyValue(v).trim(); });
  var tint = el.querySelector('.mn-pre__tint');
  var header = document.querySelector('[data-header]');
  var heroVideo = document.querySelector('.mn-hero__video');

  // Hold the hero video on its first frame (= the final loader image) until the hand-off.
  if (heroVideo) {
    try { heroVideo.pause(); heroVideo.currentTime = 0; } catch (e) {}
  }

  // Roll the word column to word i (same tick as realevate's counter digits).
  var setWord = function (i, animate) {
    if (!col || !words) return;
    var y = -Math.max(0, Math.min(words - 1, i)) * (100 / words);
    if (animate) gsap.to(col, { yPercent: y, duration: T.tick, ease: T.tickEase, overwrite: 'auto' });
    else gsap.set(col, { yPercent: y });
  };

  var finished = false;
  var finish = function () {
    if (finished) return;
    finished = true;
    if (header) gsap.set(header, { autoAlpha: 0 });
    gsap.killTweensOf(el.querySelectorAll('*'));
    cleanup();
    if (header) gsap.to(header, { autoAlpha: 1, duration: .6, ease: 'power2.out', clearProps: 'opacity,visibility' });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
    try { window.dispatchEvent(new CustomEvent('mn:preloaded')); } catch (e) {}
    resolveDone();
  };

  // Initial state.
  gsap.set(frames, { clipPath: 'inset(50% 50% 50% 50%)' });
  gsap.set(imgs, { scale: T.scaleFrom, transformOrigin: '50% 50%' });
  if (line) gsap.set(line, { yPercent: 100, y: 0, force3D: true });
  setWord(0, false);
  if (border) gsap.set(border, { clipPath: 'inset(50% 50% 50% 50%)', borderColor: colours[0] });

  var tl = gsap.timeline({ paused: true });
  var last = frames.length - 1;
  var R = last * T.imageDelay;                    // final image opens
  var A = R + T.exitRevealDelay;                  // ink wipe starts
  var K = A + T.morphDelay;                       // final frame grows to full screen
  var end = Math.max(A + T.wipe, K + T.morph, R + T.counterExit, R + T.imageReveal * .8);

  if (line) tl.to(line, { yPercent: 0, duration: T.counterEnter, ease: T.counterEnterEase }, 0);
  if (border) tl.to(border, { clipPath: 'inset(0% 0% 0% 0%)', duration: T.border, ease: T.borderEase }, 0);
  frames.forEach(function (frame, i) {
    var t = i * T.imageDelay;
    if (i > 0) {
      tl.call(setWord, [i, true], t);
      // The border takes this image's logo colour as it opens.
      if (border && colours[i]) tl.to(border, { borderColor: colours[i], duration: T.borderTint, ease: T.borderTintEase }, t);
    }
    tl.fromTo(frame, { clipPath: 'inset(50% 50% 50% 50%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: T.imageReveal, ease: T.imageEase }, t);
    tl.fromTo(imgs[i], { scale: T.scaleFrom }, { scale: 1, duration: T.imageReveal, ease: T.imageEase }, t);
  });
  if (line) tl.to(line, { yPercent: -100, duration: T.counterExit, ease: T.counterExitEase }, R);
  if (mask) tl.to(mask, { clipPath: 'inset(100% 0% 0% 0%)', duration: T.counterExit, ease: T.counterExitEase }, R);
  // The border steps aside as the ink wipes, so the morph into the hero stays clean.
  if (border) tl.to(border, { autoAlpha: 0, duration: T.borderOut, ease: 'power2.out' }, A);
  tl.to(bg, { clipPath: 'inset(0% 0% 100% 0%)', duration: T.wipe, ease: bezier.apply(null, T.wipeBezier) }, A);
  tl.to(box, {
    top: 0, left: 0,
    width: function () { return window.innerWidth; },
    height: function () { return window.innerHeight; },
    duration: T.morph, ease: T.morphEase
  }, K);
  if (tint) tl.to(tint, { opacity: 1, duration: T.morph, ease: T.morphEase }, K);
  tl.call(finish, null, end);

  // Start once the first image is decoded (or after a short cap), so frames never open blank.
  var ready = function (img) {
    if (!img) return Promise.resolve();
    var p = img.complete && img.naturalWidth ? Promise.resolve() : new Promise(function (r) { img.addEventListener('load', r, { once: true }); img.addEventListener('error', r, { once: true }); });
    return p.then(function () { return img.decode ? img.decode().catch(function () {}) : null; });
  };
  var started = false;
  var start = function () {
    if (started) return;
    started = true;
    requestAnimationFrame(function () { tl.play(0); });
  };
  ready(imgs[0]).then(start);
  setTimeout(start, T.firstImageWaitMs);
  imgs.slice(1).forEach(ready);   // warm the rest in the background
})();

  /* ---------- Quick Experiences: list selects, the arch redraws and the photo rises in ---------- */
  var quick = document.querySelector('[data-quick]');
  if (quick) initQuick(quick);

  function initQuick(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll('.mn-quick__item'));
    var imgs = Array.prototype.slice.call(root.querySelectorAll('.mn-quick__img'));
    var inner = root.querySelector('.mn-quick__arch-inner');
    var visual = root.querySelector('.mn-quick__visual');
    var panel = root.querySelector('.mn-quick__cap');
    var q = {};
    Array.prototype.forEach.call(root.querySelectorAll('[data-q]'), function (el) { q[el.getAttribute('data-q')] = el; });
    var capBits = Array.prototype.slice.call(panel.children);
    var animate = !!window.gsap && !reduceMotion;
    var active = 0, front = 0, token = 0, hoverTimer = 0, capTl = null;

    if (reduceMotion) {
      // No shimmer either; the frame just sits there, fully drawn.
      Array.prototype.forEach.call(root.querySelectorAll('animateTransform'), function (a) { a.parentNode.removeChild(a); });
    }

    var decoded = function (img) {
      if (img.complete && img.naturalWidth) return Promise.resolve();
      return new Promise(function (r) {
        img.addEventListener('load', r, { once: true });
        img.addEventListener('error', r, { once: true });
      }).then(function () { return img.decode ? img.decode().catch(function () {}) : null; });
    };
    var warm = function (i) {
      var it = items[i];
      if (!it || it._warm) return;
      it._warm = true;
      var im = new Image();
      im.decoding = 'async';
      im.src = it.getAttribute('data-img');
    };

    // Slow drift after each reveal: the still photo feels like footage without being one.
    var kenBurns = function (img, from) {
      gsap.fromTo(img, { scale: from || 1.1, xPercent: 0 }, { scale: 1, xPercent: active % 2 ? 1.2 : -1.2, duration: 7, ease: 'power1.out', overwrite: 'auto' });
    };
    var drawInner = function (delay) {
      if (!inner) return;
      gsap.fromTo(inner, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.1, delay: delay || 0, ease: 'power2.inOut', overwrite: 'auto' });
    };

    var fillCaption = function (it, i) {
      q.num.textContent = (i < 9 ? '0' : '') + (i + 1);
      q.name.textContent = it.querySelector('.mn-quick__name').textContent;
      q.desc.textContent = it.getAttribute('data-desc');
      q.dur.textContent = it.querySelector('.mn-quick__dur').textContent;
      panel.setAttribute('aria-labelledby', it.id);
    };

    function select(i, instant) {
      if (i === active && !instant) return;
      var it = items[i];
      active = i;
      var my = ++token;
      items.forEach(function (b, k) {
        var on = k === i;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
      });

      var src = it.getAttribute('data-img');
      var alt = it.getAttribute('data-alt');

      if (instant || !animate) {
        fillCaption(it, i);
        var cur = imgs[front];
        if (cur.getAttribute('src') !== src) cur.src = src;
        cur.alt = alt;
        if (animate) {
          gsap.killTweensOf(capBits);
          gsap.set(capBits, { clearProps: 'opacity,visibility,transform' });
          gsap.set(imgs, { clearProps: 'clipPath,zIndex' });
        }
        return;
      }

      // Caption: the old copy lifts away, the new copy rises in.
      if (capTl) capTl.kill();
      capTl = gsap.timeline()
        .to(capBits, { y: -10, autoAlpha: 0, duration: .22, ease: 'power2.in', stagger: .02 })
        .add(function () { fillCaption(it, i); })
        .fromTo(capBits, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .6, ease: 'power3.out', stagger: .05 });

      // Photo: load into the back layer, then reveal it up from the base of the arch over the old one.
      var back = imgs[1 - front];
      back.src = src;
      back.alt = alt;
      decoded(back).then(function () {
        if (my !== token) return;
        var old = imgs[front];
        front = 1 - front;
        gsap.set(old, { zIndex: 1 });
        gsap.set(back, { zIndex: 2, opacity: 1 });
        back.classList.add('is-front');
        gsap.fromTo(back, { clipPath: 'inset(100% 0% 0% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: .9, ease: 'power3.inOut', overwrite: 'auto',
          onComplete: function () {
            if (my !== token) return;
            old.classList.remove('is-front');
            gsap.set(old, { opacity: 0 });
            old.alt = '';
          }
        });
        kenBurns(back, 1.12);
        drawInner(.1);
      });
      warm(i + 1);
      warm(i - 1);
    }

    // Hover (fine pointers) picks with a short settle, so sweeping down the list doesn't strobe.
    items.forEach(function (it, i) {
      it.addEventListener('pointerenter', function () {
        if (!canHover.matches) return;
        clearTimeout(hoverTimer);
        hoverTimer = setTimeout(function () { select(i); }, 90);
        warm(i);
      });
      it.addEventListener('click', function () {
        clearTimeout(hoverTimer);
        if (i === active && canHover.matches) { q.book.click(); return; }
        select(i);
        // Small screens: bring the photo back into view if the list has scrolled it away.
        if (window.innerWidth <= 1024) {
          var r = visual.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight * .5) {
            if (window.mnLenis) window.mnLenis.scrollTo(visual, { offset: -96 });
            else visual.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
      it.addEventListener('focus', function () { if (it.matches(':focus-visible')) select(i); });
      it.addEventListener('keydown', function (e) {
        var to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
        if (to === undefined) return;
        e.preventDefault();
        to = (to + items.length) % items.length;
        items[to].focus();
        select(to);
      });
    });

    // Once the section is close, fetch the rest so later picks reveal instantly.
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        items.forEach(function (_, i) { setTimeout(function () { warm(i); }, i * 120); });
      }, { rootMargin: '100% 0px' });
      io.observe(root);
    }

    // motion.js calls these: reset() while the section is off screen, intro() as it lands.
    window.mnQuick = {
      reset: function () {
        clearTimeout(hoverTimer);
        if (capTl) { capTl.kill(); capTl = null; }
        select(0, true);
        if (!animate) return;
        gsap.killTweensOf(imgs);
        gsap.set(imgs[front], { scale: 1.1, xPercent: 0 });
        if (inner) gsap.set(inner, { strokeDashoffset: 1 });
      },
      intro: function () {
        if (!animate) return;
        kenBurns(imgs[front], 1.1);
        drawInner(0);
        gsap.fromTo(capBits, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: .7, ease: 'power3.out', stagger: .06, overwrite: 'auto' });
      }
    };
  }

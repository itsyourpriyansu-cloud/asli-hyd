    // Desktop block (inside mm.add('(min-width: 1025px)'))
    /* Quick Experiences (spinner slot): same sideways wipe, the arch frame drawing in with it,
       then a held moment to browse. It always arrives on item 01: reset while mostly hidden,
       and the inner arch + photo settle (mnQuick.intro, components.js) as the wipe lands. */
    (function () {
      var quick = $('.mn-quick', S.spinner);
      var outer = $('.mn-quick__arch-outer', quick);
      var tl = gsap.timeline()
        .fromTo(quick, { y: function () { return -vh(); } }, { y: 0, ease: 'none', duration: 1 }, 0)
        .fromTo(quick, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', duration: 1 }, 0)
        .fromTo($('.mn-ed__media', S.city), { x: 0 }, { x: function () { return -Math.round(vw() * .18); }, ease: 'none', duration: 1 }, 0)
        .fromTo($('.mn-ed__frame', S.city), { x: 0 }, { x: function () { return -Math.round(vw() * .14); }, ease: 'none', duration: 1 }, 0);
      if (outer) tl.fromTo(outer, { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', duration: .45 }, .55);

      var armed = true;
      if (window.mnQuick) window.mnQuick.reset();
      cleanups.push(riseDriven(S.spinner, tl, function (p) {
        var q = window.mnQuick;
        if (!q) return;
        if (p < .5) { if (!armed) { armed = true; q.reset(); } }
        else if (armed && p > .985) { armed = false; q.intro(); }
      }));
      cleanups.push(function () { if (outer) gsap.set(outer, { clearProps: 'strokeDashoffset' }); });
      dwell(S.spinner, null, .75, null, true);
    })();

    // Phone/tablet block (inside mm.add('(max-width: 1024px)'))
    // Quick Experiences: starts on item 01; the arch and photo settle once it is well in view.
    (function () {
      var q = window.mnQuick;
      var visual = $('.mn-sec[data-sec="spinner"] .mn-quick__visual');
      if (!q || !visual) return;
      q.reset();
      cleanups.push(once(function () { return visual.getBoundingClientRect().top < vh() * .6; }, function () { q.intro(); }));
    })();

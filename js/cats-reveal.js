/* ==========================================================================
   Two Paths tiles: wavy colour reveal.

   Each tile gets a WebGL canvas that draws a colourised copy of the sepia
   print (data-color on the img) inside a soft, noise-edged blob. Hover shows
   a blob that trails the pointer and stretches with its speed; a click floods
   the whole tile with colour from the click point, then follows the link.
   The sepia <img> stays underneath, so without WebGL or the colour file the
   tile is unchanged and links work as normal.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
  var section = document.querySelector('[data-sec="cats"]');
  if (reduce || !window.gsap || !section) return;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var VERT = [
    'attribute vec2 aPos;',
    'void main() { gl_Position = vec4(aPos, 0.0, 1.0); }'
  ].join('\n');

  // Coordinates are CSS px with a top-left origin, matching getBoundingClientRect.
  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'uniform sampler2D uTex;',
    'uniform vec2 uRes;',      // canvas size, device px
    'uniform float uDpr;',
    'uniform vec4 uBox;',      // the img box inside the canvas: x, y, w, h
    'uniform vec2 uTexSize;',
    'uniform vec2 uPos;',      // object-position as 0..1
    'uniform vec2 uMouse;',
    'uniform vec2 uVel;',      // px per frame
    'uniform float uRadius;',
    'uniform float uAmp;',
    'uniform float uTime;',

    'float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p), f = fract(p);',
    '  vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),',
    '             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
    '}',
    'float fbm(vec2 p) {',
    '  float v = 0.0, a = 0.5;',
    '  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + vec2(17.0, 9.0); a *= 0.5; }',
    '  return v;',
    '}',
    // object-fit: cover inside the img box
    'vec2 coverUv(vec2 p) {',
    '  float s = max(uBox.z / uTexSize.x, uBox.w / uTexSize.y);',
    '  vec2 size = uTexSize * s;',
    '  vec2 off = uBox.xy + (uBox.zw - size) * uPos;',
    '  return (p - off) / size;',
    '}',

    'void main() {',
    '  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uDpr;',
    '  vec2 d = p - uMouse;',
    // Squash distance along the direction of travel so the blob stretches behind the pointer.
    '  float sp = length(uVel);',
    '  if (sp > 0.01) {',
    '    vec2 dir = uVel / sp;',
    '    float a = dot(d, dir);',
    '    d = (d - dir * a) + dir * a / (1.0 + min(sp * 0.035, 0.55));',
    '  }',
    '  float dist = length(d);',
    '  float ang = atan(d.y, d.x);',
    '  float t = uTime;',
    // Wavy edge: drifting fbm plus two slow travelling ripples around the rim.
    '  float n = fbm(p * 0.0045 + vec2(t * 0.18, -t * 0.13)) - 0.5;',
    '  float w = n * 1.6 + sin(ang * 5.0 + t * 1.7) * 0.18 + sin(ang * 9.0 - t * 2.3) * 0.08;',
    '  float scale = min(uRadius, 320.0);',
    '  float r = uRadius + w * uAmp * scale;',
    '  float feather = 18.0 + 0.1 * scale;',
    '  float m = 1.0 - smoothstep(r - feather, r, dist);',
    '  if (m <= 0.0) discard;',
    // Near the rim the colour image refracts a little, like light through a water edge.
    '  float band = 1.0 - smoothstep(0.0, feather * 2.2, abs(dist - r + feather * 0.5));',
    '  vec2 nrm = dist > 0.001 ? d / dist : vec2(0.0);',
    '  vec2 q = p - nrm * band * (10.0 + 8.0 * sin(dist * 0.06 - t * 4.0));',
    '  vec3 col = texture2D(uTex, clamp(coverUv(q), 0.0, 1.0)).rgb + band * 0.05;',
    '  gl_FragColor = vec4(col * m, m);',
    '}'
  ].join('\n');

  function compile(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  }

  function createGL(canvas) {
    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return null;
    var vs = compile(gl, gl.VERTEX_SHADER, VERT);
    var fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var u = {};
    ['uTex', 'uRes', 'uDpr', 'uBox', 'uTexSize', 'uPos', 'uMouse', 'uVel', 'uRadius', 'uAmp', 'uTime'].forEach(function (name) {
      u[name] = gl.getUniformLocation(prog, name);
    });
    gl.uniform1i(u.uTex, 0);
    return { gl: gl, u: u };
  }

  // "15% 50%" -> [.15, .5]
  function parsePos(img) {
    var raw = (getComputedStyle(img).objectPosition || '50% 50%').split(' ');
    return raw.map(function (v) { return /%$/.test(v) ? parseFloat(v) / 100 : .5; }).concat([.5, .5]).slice(0, 2);
  }

  var tiles = [];

  $$('.mn-cats__tile', section).forEach(function (tile) {
    var media = $('.mn-cats__media', tile);
    var img = $('.mn-cats__img', tile);
    var content = $('.mn-cats__content', tile);
    var src = img && img.getAttribute('data-color');
    if (!media || !src) return;

    var canvas = document.createElement('canvas');
    canvas.className = 'mn-cats__gl';
    canvas.setAttribute('aria-hidden', 'true');
    media.insertBefore(canvas, img.nextSibling);
    var ctx = createGL(canvas);
    if (!ctx) { canvas.remove(); return; }
    var gl = ctx.gl, u = ctx.u;

    // tx/ty: pointer target (client px); x/y: trailing blob centre (client px).
    var st = { r: 0, amp: 0, tx: 0, ty: 0, x: 0, y: 0, px: null, py: null, vx: 0, vy: 0 };
    var T = { tile: tile, media: media, content: content, src: src, ready: false, hover: false, busy: false, running: false, tl: null };
    var texSize = [1, 1];
    var pos = parsePos(img);
    var dpr = 1;

    T.load = function () {
      if (T.loading) return;
      T.loading = true;
      var im = new Image();
      im.decoding = 'async';
      im.onload = function () {
        var tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, im);
        texSize = [im.naturalWidth, im.naturalHeight];
        T.ready = true;
        if (T.hover) T.enter();
      };
      im.src = src;
    };

    function fit() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }

    function draw() {
      fit();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (st.r < .5) return;

      // Rects come back scaled by any ancestor transform (the desktop grow-in); k maps them to canvas CSS px.
      var cr = canvas.getBoundingClientRect();
      var k = canvas.clientWidth / (cr.width || 1);
      var ir = img.getBoundingClientRect();

      // Frame-rate independent trailing.
      var f = 1 - Math.pow(1 - .14, gsap.ticker.deltaRatio(60));
      st.x += (st.tx - st.x) * f;
      st.y += (st.ty - st.y) * f;
      var mx = (st.x - cr.left) * k, my = (st.y - cr.top) * k;
      if (st.px !== null) {
        st.vx += ((mx - st.px) - st.vx) * .2;
        st.vy += ((my - st.py) - st.vy) * .2;
      }
      st.px = mx; st.py = my;

      gl.uniform2f(u.uRes, canvas.width, canvas.height);
      gl.uniform1f(u.uDpr, dpr);
      gl.uniform4f(u.uBox, (ir.left - cr.left) * k, (ir.top - cr.top) * k, ir.width * k, ir.height * k);
      gl.uniform2f(u.uTexSize, texSize[0], texSize[1]);
      gl.uniform2f(u.uPos, pos[0], pos[1]);
      gl.uniform2f(u.uMouse, mx, my);
      gl.uniform2f(u.uVel, st.vx, st.vy);
      gl.uniform1f(u.uRadius, st.r);
      gl.uniform1f(u.uAmp, st.amp);
      gl.uniform1f(u.uTime, performance.now() / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // Only tick while something is visible or moving.
    function tick() {
      draw();
      if (!T.hover && !T.busy && st.r < .5) stop();
    }
    function start() { if (!T.running) { T.running = true; gsap.ticker.add(tick); } }
    function stop() { T.running = false; gsap.ticker.remove(tick); st.px = null; st.vx = st.vy = 0; }

    function baseRadius() {
      return gsap.utils.clamp(110, 240, Math.min(canvas.clientWidth, canvas.clientHeight) * .2);
    }

    function aim(e, snap) {
      st.tx = e.clientX; st.ty = e.clientY;
      if (snap) { st.x = st.tx; st.y = st.ty; }
    }

    T.enter = function () {
      if (!T.ready || T.busy) return;
      gsap.killTweensOf(st);
      gsap.to(st, { r: baseRadius(), amp: .2, duration: .9, ease: 'expo.out' });
      start();
    };

    tile.addEventListener('pointerenter', function (e) {
      if (e.pointerType !== 'mouse' || !canHover.matches) return;
      T.hover = true;
      if (T.busy) return;
      // Grow from where the pointer came in, unless the blob is still visible from a moment ago.
      aim(e, st.r < 1);
      T.load();
      T.enter();
    });
    tile.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || T.busy) return;
      aim(e, false);
    });
    tile.addEventListener('pointerleave', function () {
      T.hover = false;
      if (T.busy || !T.ready) return;
      gsap.killTweensOf(st);
      gsap.to(st, { r: 0, amp: 0, duration: .6, ease: 'power3.inOut' });
    });

    // Click: flood the tile with colour from the click point, then navigate.
    tile.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]');
      if (!a || !tile.contains(a)) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target && a.target !== '_self') return;
      if (!T.ready) { T.load(); return; }
      e.preventDefault();
      if (T.busy) return;
      T.busy = true;

      var cr = canvas.getBoundingClientRect();
      // Keyboard activation has no pointer position (detail 0): start from the centre.
      var ox = e.detail ? e.clientX : cr.left + cr.width / 2;
      var oy = e.detail ? e.clientY : cr.top + cr.height / 2;
      st.tx = ox; st.ty = oy;
      if (st.r < 1) { st.x = ox; st.y = oy; }

      var k = canvas.clientWidth / (cr.width || 1);
      var lx = (ox - cr.left) * k, ly = (oy - cr.top) * k;
      var w = canvas.clientWidth, h = canvas.clientHeight;
      var far = Math.max(Math.hypot(lx, ly), Math.hypot(w - lx, ly), Math.hypot(lx, h - ly), Math.hypot(w - lx, h - ly));

      var others = tiles.filter(function (o) { return o !== T; }).map(function (o) { return o.media; });
      var href = a.href;
      tile.classList.add('is-revealing');
      gsap.killTweensOf(st);
      start();

      T.tl = gsap.timeline({ onComplete: function () { window.location.href = href; } })
        .to(st, { r: far + 140, duration: 1.25, ease: 'power3.inOut' }, 0)
        .to(st, { amp: .55, duration: .5, ease: 'sine.out' }, 0)
        .to(st, { amp: .12, duration: .75, ease: 'sine.inOut' }, .5)
        .to(media, { scale: 1.05, duration: 1.4, ease: 'power2.inOut' }, 0)
        .to(content, { autoAlpha: 0, y: -12, filter: 'blur(6px)', duration: .6, ease: 'power2.in' }, 0)
        .to(others, { filter: 'brightness(.55)', duration: .9, ease: 'power2.out' }, 0)
        .to({}, { duration: .15 });
    });

    T.reset = function () {
      if (T.tl) { T.tl.kill(); T.tl = null; }
      gsap.killTweensOf(st);
      st.r = 0; st.amp = 0;
      T.busy = false; T.hover = false;
      tile.classList.remove('is-revealing');
      gsap.set([media, content], { clearProps: 'transform,filter,opacity,visibility' });
      stop();
      draw();
    };

    if (window.ResizeObserver) {
      new ResizeObserver(function () { if (T.running) draw(); }).observe(canvas);
    }

    tiles.push(T);
  });

  if (!tiles.length) return;

  // Fetch the colour prints a screen before the section arrives.
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (en) { return en.isIntersecting; })) return;
      tiles.forEach(function (T) { T.load(); });
      io.disconnect();
    }, { rootMargin: '100% 0px' });
    io.observe(section);
  } else {
    tiles.forEach(function (T) { T.load(); });
  }

  // Coming back via the back button restores the page from cache mid-flood: put the sepia back.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) tiles.forEach(function (T) { T.reset(); });
  });
})();

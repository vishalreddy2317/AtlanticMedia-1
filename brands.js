// Brand partnership wall, grouped by priority.
// To change priority, move a brand between the three lists (order within a list = display order).
// The `file` is the logo name in assets/clients/ (without .webp).
// An optional third value is the logo file's own background colour. The ring layout
// (data-layout="ring" on #brand-tiers) paints the tile with it, so logo and tile read as one.
// A fourth value 'soft' also feathers the logo's edges into the tile, for a file whose background is textured rather than flat.
(function () {
  var TIERS = [
    {
      id: 'high', label: 'Headline partners',
      brands: [
        ['Samsung', 'samsung'], ['Tata CLiQ', 'tata-cliq'], ['Rado', 'rado'], ['Tira Beauty', 'tira-beauty', '#f5d0c6'],
        ['Air Arabia', 'airarabia-com', '#ee1b24'], ['Pond’s', 'ponds'], ['Telangana Tourism', 'telangana-tourism'], ['Royal Challenge', 'royal-challenge', '#000000'],
      ],
    },
    {
      id: 'mid', label: 'Key brands',
      brands: [
        ['McDowell’s No.1', 'mc-dowell-s', '#f6f6f6'], ['Snitch', 'snitch'], ['Kesh King', 'kesh-king', '#004c1c'], ['Jaypore', 'jaypore'],
        ['Style Union', 'style-union'], ['Emma', 'emma-mattress'], ['Agaro', 'agaro'], ['ASBL', 'asbl'],
        ['Wondr Diamonds', 'wondr-diamonds'], ['PMJ Jewels', 'pmj', '#1d3258'], ['Siddhartha Jewellers', 'siddhartha-jewellers'], ['Azorte', 'azorte'],
      ],
    },
    {
      id: 'small', label: 'Growing brands',
      brands: [
        ['Taruni', 'taruni'], ['Neeru’s', 'neerus'], ['Highlander', 'highlander'], ['Mayuka', 'mayuka', '#660116'],
        ['Hetafu Diamonds', 'hetafu', '#0c1f3f'], ['Swadesh', 'swadesh', '#a6845d', 'soft'], ['Cream Stone', 'cream-stone', '#462215'], ['Century Mattresses', 'century-mattress', '#f4b21b'],
        ['Truthin', 'truthin'], ['Mebaz', 'mebaz', '#fef5e4'], ['MSU', 'msu'], ['Ladia', 'ladia', '#252b50'],
        ['Sri Venkatramana Jewellers', 'sri-venkatramana'], ['Brand Mandir', 'brand-mandir', '#ed0779'], ['One Nation One Election', 'one-nation-one-elections'], ['The Hidden Music Originals', 'the-hidden-music-originals'],
      ],
    },
  ];

  var root = document.getElementById('brand-tiers');
  if (!root) return;
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tile(b, i, hidden) {
    return '<li class="bt-tile" style="--i:' + i + '"' + (hidden ? ' aria-hidden="true"' : '') + '>' +
      '<img src="assets/clients/' + b[1] + '.webp" alt="' + (hidden ? '' : b[0]) + '" loading="lazy" /></li>';
  }

  if (root.dataset.layout === 'ring') { buildRing(); return; }

  root.innerHTML = TIERS.map(function (t) {
    var items = t.brands.map(function (b, i) { return tile(b, i, false); }).join('');
    var body;
    if (t.id === 'high') {
      body = '<ul class="bt-grid">' + items + '</ul>';
    } else {
      // marquee: list twice for a seamless loop; the copy is hidden from screen readers
      var copy = t.brands.map(function (b, i) { return tile(b, i, true); }).join('');
      body = '<div class="bt-marquee"><ul class="bt-track">' + items + copy + '</ul></div>';
    }
    return '<div class="bt-tier bt-tier--' + t.id + '">' +
      '<p class="bt-label"><span>' + t.label + '</span><small>' + t.brands.length + '</small></p>' + body + '</div>';
  }).join('');

  // headline partners: a light "shine" travels across the tiles one after another
  if (!reduced) {
    var tiles = root.querySelectorAll('.bt-tier--high .bt-tile'), k = 0;
    setInterval(function () {
      tiles.forEach(function (el) { el.classList.remove('is-shine'); });
      tiles[k++ % tiles.length].classList.add('is-shine');
    }, 1400);
  }

  // ---- RING: every brand on a 3D ring of tiles seen from inside. Drag sideways to turn it; the tiles in view follow
  // the cursor. Twelve tiles are on the ring at a time, and a tile
  // takes its next brand while it is out of sight behind the viewer, so dragging on keeps bringing new brands round.
  function buildRing() {
    var all = TIERS.reduce(function (a, t) { return a.concat(t.brands); }, []);
    var SLOTS = 12, STEP = 360 / SLOTS;   // must match the 30deg tile spacing in brands.css
    var PER_PX = 0.2;                     // degrees of turn per pixel dragged
    var K = 600, C = 100;                 // the ring follows the drag on a spring: stiffness 600, damping 100 (no bounce)
    var angle = 90, target = 90, vel = 0, raf = 0, last = 0;   // 90deg starts with the first seven brands in view
    var dragging = false, startX = 0, startAngle = 0, shown = [];

    root.classList.add('bt--ring');
    root.innerHTML = '<div class="bt-ring" tabindex="0" role="group" aria-label="Brand logos. Drag sideways or use the arrow keys to turn the ring.">' +
      '<ul class="bt-ring__spin" aria-hidden="true">' + new Array(SLOTS + 1).join('<li class="bt-tile"><img alt="" draggable="false" /></li>') + '</ul></div>' +
      '<p class="bt-ring__hint" aria-hidden="true">&larr; Drag to explore &rarr;</p>' +
      '<ul class="bt-sr">' + all.map(function (b) { return '<li>' + b[0] + '</li>'; }).join('') + '</ul>';
    var stage = root.querySelector('.bt-ring'), spin = root.querySelector('.bt-ring__spin'), tiles = [].slice.call(spin.children);
    tiles.forEach(function (el, i) { el.style.setProperty('--i', i); });

    function setBrand(el, i, n) {
      if (shown[i] === n) return;
      shown[i] = n;
      var b = all[n], img = el.firstChild;
      img.src = 'assets/clients/' + b[1] + '.webp';
      el.style.setProperty('--bt-bg', b[2] || '');
      el.classList.toggle('bt-tile--tint', !!b[2]);
      el.classList.toggle('bt-tile--soft', b[3] === 'soft');
    }
    function render() {
      spin.style.setProperty('--bt-a', angle + 'deg');
      tiles.forEach(function (el, i) {
        var k = i + SLOTS * Math.round((angle - STEP * i) / 360);   // which brand along the endless strip this tile holds now
        var phi = Math.abs(angle - STEP * k);                       // 0 = straight ahead, 180 = behind the viewer
        setBrand(el, i, ((k % all.length) + all.length) % all.length);
        var o = phi <= 104 ? 1 : phi >= 118 ? 0 : (118 - phi) / 14;   // fade a tile out as it swings round past the side
        el.style.opacity = o;
        el.style.visibility = o ? '' : 'hidden';
      });
    }
    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.05) / 8;
      last = now;
      for (var n = 0; n < 8; n++) { vel += (K * (target - angle) - C * vel) * dt; angle += vel * dt; }
      if (Math.abs(target - angle) < 0.01 && Math.abs(vel) < 0.01) { angle = target; vel = 0; raf = 0; }
      else raf = requestAnimationFrame(frame);
      render();
    }
    function turnTo(deg) {
      target = deg;
      if (reduced) { angle = target; render(); }
      else if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    }
    function endDrag() { dragging = false; stage.classList.remove('is-dragging'); }

    stage.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      dragging = true; startX = e.clientX; startAngle = target;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('is-dragging');
    });
    stage.addEventListener('pointermove', function (e) { if (dragging) turnTo(startAngle - (e.clientX - startX) * PER_PX); });   // tiles follow the cursor
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') turnTo(target - STEP);
      else if (e.key === 'ArrowLeft') turnTo(target + STEP);
      else return;
      e.preventDefault();
    });

    render();
    // fetch the logos that are not on the ring yet, so a tile never arrives blank
    addEventListener('load', function () { all.forEach(function (b) { new Image().src = 'assets/clients/' + b[1] + '.webp'; }); });
  }
})();

/* 1740QCA Process Journal — Brodie Bruce
   Two jobs:
   1. Drive the landing page's 3D orbit ring from scroll position.
   2. Fallback reveals for browsers without CSS scroll-driven animations. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var narrow  = window.matchMedia('(max-width: 820px)').matches;

  /* ---------------------------------------------------------------
     0. INTRO SEQUENCE
     Counts 001 → 066 (the frame count of the source sequence) while
     the stride strokes build, then the whole panel wipes upward.
  --------------------------------------------------------------- */
  var intro = document.getElementById('intro');

  if (intro) {
    var countEl = document.getElementById('introCount');
    var skipBtn = document.getElementById('introSkip');

    function endIntro() {
      intro.classList.add('done');
      document.body.classList.remove('has-intro');
      window.scrollTo(0, 0);
    }

    if (reduced) {
      endIntro();
    } else {
      // tick the frame counter across the build
      if (countEl) {
        var n = 1, total = 66, started = Date.now(), dur = 1500;
        var tick = setInterval(function () {
          var p = Math.min((Date.now() - started) / dur, 1);
          n = Math.round(1 + p * (total - 1));
          countEl.textContent = 'FRAME ' + String(n).padStart(3, '0');
          if (p >= 1) clearInterval(tick);
        }, 40);
      }

      // remove from the layout once the wipe has finished
      setTimeout(endIntro, 3500);

      if (skipBtn) {
        skipBtn.addEventListener('click', function () {
          intro.style.animation = 'none';
          intro.style.clipPath = 'inset(0 0 100% 0)';
          setTimeout(endIntro, 350);
        });
      }
    }
  }

  /* ---------------------------------------------------------------
     1. ENDLESS ORBIT RING
     The page itself doesn't scroll. Wheel and touch gestures add to an
     unbounded rotation value, so the ring turns forever in either
     direction. Momentum carries it on after the gesture stops, and it
     drifts slowly on its own when left alone.
  --------------------------------------------------------------- */
  var scatter = document.querySelector('.scatter');
  var tiles   = Array.prototype.slice.call(document.querySelectorAll('.tile'));

  if (scatter && tiles.length && !reduced && !narrow) {
    var angle    = 0;      // unbounded — never wraps, never clamps
    var velocity = 0;      // degrees per frame
    var DIR      = -1;     // -1 = clockwise, +1 = anticlockwise
    var DRIFT    = 0.045;  // idle rotation speed
    var FRICTION = 0.94;   // how fast a flick decays
    var MAXV     = 9;      // ceiling so a hard scroll can't spin out
    var lastTouch = null;

    function setRadius() {
      var r = Math.min(scatter.offsetWidth * 0.62, 400);
      scatter.style.setProperty('--r', Math.round(r) + 'px');
    }

    function push(delta) {
      velocity += DIR * delta * 0.05;
      if (velocity >  MAXV) velocity =  MAXV;
      if (velocity < -MAXV) velocity = -MAXV;
    }

    function frame() {
      // idle drift blends in as the flick decays, so it never fully stops
      var idle = DIR * DRIFT * (1 - Math.min(Math.abs(velocity) / 1.2, 1));
      angle += velocity + idle;
      velocity *= FRICTION;
      if (Math.abs(velocity) < 0.0015) velocity = 0;

      scatter.style.setProperty('--spin', angle.toFixed(2) + 'deg');

      // flag whichever tile is closest to facing the viewer
      var best = 0, bestDelta = 999;
      for (var i = 0; i < tiles.length; i++) {
        var slot  = i * 60;                        // matches --a in the CSS
        var faceD = ((slot + angle) % 360 + 360) % 360;
        var delta = Math.min(faceD, 360 - faceD);
        if (delta < bestDelta) { bestDelta = delta; best = i; }
      }
      for (var j = 0; j < tiles.length; j++) {
        tiles[j].classList.toggle('front', j === best);
      }

      requestAnimationFrame(frame);
    }

    setRadius();
    requestAnimationFrame(frame);

    window.addEventListener('wheel', function (e) {
      e.preventDefault();
      push(e.deltaY);
    }, { passive: false });

    window.addEventListener('touchstart', function (e) {
      lastTouch = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
      if (lastTouch === null) return;
      var y = e.touches[0].clientY;
      push((lastTouch - y) * 2.2);
      lastTouch = y;
    }, { passive: true });

    window.addEventListener('touchend', function () { lastTouch = null; }, { passive: true });

    // arrow keys nudge it too, for keyboard users
    window.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') push(60);
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  push(-60);
    });

    window.addEventListener('resize', setRadius);
  }

  /* ---------------------------------------------------------------
     2. FALLBACK REVEALS
     Only needed where CSS scroll-driven animation isn't supported.
  --------------------------------------------------------------- */
  var hasScrollTimeline =
    window.CSS && CSS.supports && CSS.supports('animation-timeline', 'view()');

  if (!hasScrollTimeline && !reduced) {
    var watched = document.querySelectorAll('.reveal, figure img');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

      Array.prototype.forEach.call(watched, function (el) { io.observe(el); });
    } else {
      Array.prototype.forEach.call(watched, function (el) { el.classList.add('in'); });
    }
  }
})();

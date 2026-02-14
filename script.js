(function () {
  'use strict';

  // Copy to clipboard
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = this.getAttribute('data-copy');
      if (!text) return;
      var label = btn.textContent.trim();
      navigator.clipboard.writeText(text).then(function () {
        btn.textContent = 'COPIED!';
        setTimeout(function () {
          btn.textContent = label;
        }, 1500);
      });
    });
  });

  // Spider web: auto-moves around; when cursor enters the web it connects (web follows cursor)
  var canvas = document.getElementById('particles-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var mouse = { x: -9999, y: -9999 };
  var center = { x: 0, y: 0 };
  var target = { x: 0, y: 0 };
  var numRadials = 14;
  var numRings = 6;
  var lerpSpeed = 0.06;
  var maxRadius = 0;
  var connectRadius = 0;   // when cursor is within this distance of center, web connects
  var nextRandomAt = 0;
  var reachThreshold = 40; // pick new target when this close to drift target

  function randomPosition() {
    var margin = maxRadius * 0.25;
    return {
      x: margin + Math.random() * (canvas.width - 2 * margin),
      y: margin + Math.random() * (canvas.height - 2 * margin)
    };
  }

  function dist(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    maxRadius = Math.max(canvas.width, canvas.height) * 0.65;
    connectRadius = maxRadius * 0.4; // connect when cursor is inside inner part of web
    var rnd = randomPosition();
    center.x = rnd.x;
    center.y = rnd.y;
    target.x = rnd.x;
    target.y = rnd.y;
    nextRandomAt = Date.now() + 2000;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  document.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function drawWeb() {
    if (!ctx || !canvas.width || !canvas.height) return;

    var now = Date.now();
    var d = dist(mouse, center);
    var connected = d < connectRadius;

    if (connected) {
      target.x = mouse.x;
      target.y = mouse.y;
    } else {
      if (dist(center, target) < reachThreshold || now >= nextRandomAt) {
        var rnd = randomPosition();
        target.x = rnd.x;
        target.y = rnd.y;
        nextRandomAt = now + 1500 + Math.random() * 1500;
      }
    }

    center.x = lerp(center.x, target.x, lerpSpeed);
    center.y = lerp(center.y, target.y, lerpSpeed);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var cx = center.x;
    var cy = center.y;
    var stepAngle = (Math.PI * 2) / numRadials;

    // Radial lines (spider web spokes) — white
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
    ctx.lineWidth = 0.6;
    for (var r = 0; r < numRadials; r++) {
      var angle = r * stepAngle;
      var ex = cx + maxRadius * Math.cos(angle);
      var ey = cy + maxRadius * Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // Concentric rings (web spirals) — white
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    for (var ring = 1; ring <= numRings; ring++) {
      var radius = (maxRadius / (numRings + 1)) * ring;
      ctx.beginPath();
      for (var r = 0; r <= numRadials; r++) {
        var angle = r * stepAngle;
        var px = cx + radius * Math.cos(angle);
        var py = cy + radius * Math.sin(angle);
        if (r === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }

    // Center dot (spider / anchor) — white
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.stroke();
  }

  function loop() {
    drawWeb();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();

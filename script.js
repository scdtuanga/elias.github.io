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

  // Spider web background (follows cursor)
  var canvas = document.getElementById('particles-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var mouse = { x: 0, y: 0 };
  var center = { x: 0, y: 0 };
  var numRadials = 14;
  var numRings = 6;
  var lerpSpeed = 0.06;
  var maxRadius = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    maxRadius = Math.max(canvas.width, canvas.height) * 0.65;
    center.x = canvas.width * 0.5;
    center.y = canvas.height * 0.5;
    mouse.x = center.x;
    mouse.y = center.y;
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

    center.x = lerp(center.x, mouse.x, lerpSpeed);
    center.y = lerp(center.y, mouse.y, lerpSpeed);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var cx = center.x;
    var cy = center.y;
    var stepAngle = (Math.PI * 2) / numRadials;

    // Radial lines (spider web spokes)
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.14)';
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

    // Concentric rings (web spirals)
    ctx.strokeStyle = 'rgba(103, 232, 249, 0.1)';
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

    // Center dot (spider / anchor)
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(34, 211, 238, 0.35)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
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

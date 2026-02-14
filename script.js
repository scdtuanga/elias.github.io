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

  // Snowflake background
  var canvas = document.getElementById('particles-bg');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var snowflakes = [];
  var snowCount = 80;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initSnowflakes();
  }

  function initSnowflakes() {
    snowflakes = [];
    for (var i = 0; i < snowCount; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vy: Math.random() * 0.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.5 + 0.3
      });
    }
  }

  function drawSnowflakes() {
    if (!ctx || !canvas.width || !canvas.height) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < snowflakes.length; i++) {
      var s = snowflakes[i];
      s.x += s.vx;
      s.y += s.vy;
      if (s.y > canvas.height + 5) {
        s.y = -5;
        s.x = Math.random() * canvas.width;
      }
      if (s.x < -5) s.x = canvas.width + 5;
      if (s.x > canvas.width + 5) s.x = -5;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + s.alpha + ')';
      ctx.fill();
    }
  }

  function loop() {
    drawSnowflakes();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  loop();
})();

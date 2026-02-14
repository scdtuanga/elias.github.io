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

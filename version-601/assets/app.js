(function () {
  var mobileButton = document.querySelector('[data-mobile-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function play() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot')) || 0);
        play();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        play();
      });
    }

    show(0);
    play();
  }

  document.querySelectorAll('[data-filter-scope]').forEach(function (panel) {
    var input = panel.querySelector('[data-search-input]');
    var scope = panel.parentElement;
    var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll('.movie-card')) : [];

    function apply(value) {
      var q = String(value || '').trim().toLowerCase();
      cards.forEach(function (card) {
        var text = String(card.getAttribute('data-search') || '').toLowerCase();
        card.classList.toggle('is-hidden', q && text.indexOf(q) === -1);
      });
    }

    if (input) {
      input.addEventListener('input', function () {
        apply(input.value);
      });
    }

    panel.querySelectorAll('[data-filter-chip]').forEach(function (chip) {
      chip.addEventListener('click', function () {
        var value = chip.getAttribute('data-filter-chip') || '';
        if (input) {
          input.value = value;
        }
        apply(value);
      });
    });
  });
})();

function moviePlayer(src) {
  var video = document.querySelector('[data-player-video]');
  var layer = document.querySelector('[data-player-layer]');
  var button = document.querySelector('[data-player-button]');
  var hls = null;

  if (!video || !src) {
    return;
  }

  function prepare() {
    if (video.getAttribute('data-ready') === '1') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    } else if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({ enableWorker: true });
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    video.setAttribute('data-ready', '1');
  }

  function start() {
    prepare();
    video.controls = true;
    if (layer) {
      layer.classList.add('is-hidden');
    }
    var attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {});
    }
  }

  if (layer) {
    layer.addEventListener('click', start);
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      start();
    });
  }

  video.addEventListener('click', function () {
    if (video.getAttribute('data-ready') !== '1') {
      start();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls && typeof hls.destroy === 'function') {
      hls.destroy();
    }
  });
}

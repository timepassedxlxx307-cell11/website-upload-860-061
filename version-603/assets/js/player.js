(function () {
  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }

    var existing = document.querySelector('script[data-hls-loader]');
    if (existing) {
      existing.addEventListener('load', callback, { once: true });
      return;
    }

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.6.15/dist/hls.min.js';
    script.defer = true;
    script.setAttribute('data-hls-loader', 'true');
    script.addEventListener('load', callback, { once: true });
    document.head.appendChild(script);
  }

  function playVideo(shell) {
    var video = shell.querySelector('video');
    var overlay = shell.querySelector('.player-overlay');
    var source = shell.getAttribute('data-src');

    if (!video || !source) {
      return;
    }

    function startPlayback() {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          video.controls = true;
        });
      }
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (!video.src) {
        video.src = source;
      }
      startPlayback();
      return;
    }

    loadHls(function () {
      if (window.Hls && window.Hls.isSupported()) {
        if (!shell.hlsInstance) {
          shell.hlsInstance = new window.Hls({ enableWorker: true });
          shell.hlsInstance.loadSource(source);
          shell.hlsInstance.attachMedia(video);
          shell.hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, startPlayback);
        } else {
          startPlayback();
        }
      } else {
        video.src = source;
        startPlayback();
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.js-player').forEach(function (shell) {
      var overlay = shell.querySelector('.player-overlay');
      if (overlay) {
        overlay.addEventListener('click', function () {
          playVideo(shell);
        });
      }
    });
  });
})();

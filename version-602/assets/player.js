(function () {
  function initMoviePlayer(videoId, overlayId, source) {
    var video = document.getElementById(videoId);
    var overlay = document.getElementById(overlayId);
    if (!video) {
      return;
    }
    var attached = false;
    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: false
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        video.hlsInstance = hls;
      } else {
        video.src = source;
      }
    }
    function begin() {
      attach();
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {});
      }
    }
    if (overlay) {
      overlay.addEventListener('click', begin);
    }
    video.addEventListener('click', function () {
      if (video.paused) {
        begin();
      }
    });
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });
  }
  window.initMoviePlayer = initMoviePlayer;
}());

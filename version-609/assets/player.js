(function () {
    window.initMoviePlayer = function (streamUrl) {
        var shell = document.querySelector('[data-player]');
        if (!shell) {
            return;
        }
        var video = shell.querySelector('video');
        var button = shell.querySelector('.player-start');
        var ready = false;
        var hlsInstance = null;

        function prepare() {
            if (ready || !video) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new Hls({
                    maxBufferLength: 30,
                    backBufferLength: 60
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function start() {
            prepare();
            shell.classList.add('is-playing');
            var playTask = video.play();
            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {});
            }
        }

        if (button) {
            button.addEventListener('click', start);
        }
        shell.addEventListener('click', function (event) {
            if (event.target === shell || event.target.classList.contains('player-poster') || event.target.classList.contains('player-icon') || event.target.classList.contains('player-title')) {
                start();
            }
        });
        video.addEventListener('play', function () {
            shell.classList.add('is-playing');
        });
        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
}());

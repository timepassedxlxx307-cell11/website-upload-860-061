(function () {
    var instances = {};

    function bindSource(video, source) {
        if (video.dataset.ready === '1') {
            return Promise.resolve();
        }

        video.dataset.ready = '1';

        return new Promise(function (resolve) {
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', function () {
                    resolve();
                }, { once: true });
                video.addEventListener('error', function () {
                    resolve();
                }, { once: true });
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false,
                    backBufferLength: 90
                });

                instances[video.id] = hls;
                hls.loadSource(source);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    resolve();
                });
                hls.on(window.Hls.Events.ERROR, function () {
                    resolve();
                });
                return;
            }

            video.src = source;
            resolve();
        });
    }

    window.initMoviePlayer = function (source, videoId, overlayId) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);

        if (!video) {
            return;
        }

        var start = function () {
            if (overlay) {
                overlay.classList.add('player-cover--hidden');
            }

            video.controls = true;

            bindSource(video, source).then(function () {
                var playTask = video.play();

                if (playTask && typeof playTask.catch === 'function') {
                    playTask.catch(function () {
                        video.controls = true;
                    });
                }
            });
        };

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        video.addEventListener('click', start);
    };

    window.addEventListener('pagehide', function () {
        Object.keys(instances).forEach(function (key) {
            if (instances[key] && typeof instances[key].destroy === 'function') {
                instances[key].destroy();
            }
        });
    });
})();

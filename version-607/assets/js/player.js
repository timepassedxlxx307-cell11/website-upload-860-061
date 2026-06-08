(function () {
    window.initializeMoviePlayer = function (config) {
        var video = document.getElementById(config.videoId);
        var overlay = document.getElementById(config.overlayId);
        var button = document.getElementById(config.buttonId);
        var prepared = false;
        var hlsInstance = null;

        function prepareVideo() {
            if (!video || prepared) {
                return;
            }

            prepared = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = config.source;
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(config.source);
                hlsInstance.attachMedia(video);
                return;
            }

            video.src = config.source;
        }

        function hideOverlay() {
            if (overlay) {
                overlay.classList.add("is-hidden");
            }
        }

        function startPlayback(event) {
            if (event) {
                event.preventDefault();
            }

            prepareVideo();
            hideOverlay();

            if (video) {
                var attempt = video.play();
                if (attempt && typeof attempt.catch === "function") {
                    attempt.catch(function () {});
                }
            }
        }

        if (button) {
            button.addEventListener("click", startPlayback);
        }

        if (overlay) {
            overlay.addEventListener("click", startPlayback);
        }

        if (video) {
            video.addEventListener("click", function () {
                if (!prepared) {
                    startPlayback();
                }
            });
            video.addEventListener("play", hideOverlay);
        }

        prepareVideo();

        window.addEventListener("beforeunload", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    };
})();

(function () {
    function setup(root) {
        var video = root.querySelector("video");
        var cover = root.querySelector(".player-cover");
        var button = root.querySelector(".play-button");
        if (!video || !cover) {
            return;
        }

        function prepare() {
            var url = video.getAttribute("data-url");
            if (!url) {
                return;
            }
            if (video.getAttribute("data-ready") === "1") {
                return;
            }
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(url);
                hls.attachMedia(video);
                video.hlsInstance = hls;
            } else {
                video.src = url;
            }
            video.setAttribute("data-ready", "1");
        }

        function start() {
            prepare();
            root.classList.add("is-playing");
            video.controls = true;
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {});
            }
        }

        cover.addEventListener("click", start);
        if (button) {
            button.addEventListener("click", start);
        }
        video.addEventListener("click", function () {
            if (video.getAttribute("data-ready") !== "1") {
                start();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(setup);
    });
})();

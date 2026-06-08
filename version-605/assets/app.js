(function () {
    function whenReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback);
        } else {
            callback();
        }
    }

    function initMenu() {
        var toggle = document.querySelector('.menu-toggle');
        var menu = document.querySelector('.mobile-menu');
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener('click', function () {
            menu.classList.toggle('hidden');
            toggle.textContent = menu.classList.contains('hidden') ? '☰' : '×';
        });
    }

    function initHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
        if (slides.length === 0) {
            return;
        }
        var active = 0;
        function show(index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                var isActive = slideIndex === active;
                slide.classList.toggle('opacity-100', isActive);
                slide.classList.toggle('opacity-0', !isActive);
                slide.classList.toggle('is-active', isActive);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
            });
        });
        setInterval(function () {
            show(active + 1);
        }, 5000);
    }

    function initFilters() {
        var input = document.querySelector('[data-search-input]');
        var select = document.querySelector('[data-filter-select]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
        var emptyState = document.querySelector('[data-empty-state]');
        if (!input && !select) {
            return;
        }
        function apply() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var group = select ? select.value : '';
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = [
                    card.dataset.title,
                    card.dataset.tags,
                    card.dataset.year,
                    card.dataset.region,
                    card.dataset.genre
                ].join(' ').toLowerCase();
                var queryOk = !query || haystack.indexOf(query) !== -1;
                var groupOk = !group || card.dataset.group === group;
                var show = queryOk && groupOk;
                card.classList.toggle('hidden', !show);
                if (show) {
                    visible += 1;
                }
            });
            if (emptyState) {
                emptyState.classList.toggle('hidden', visible !== 0);
            }
        }
        if (input) {
            input.addEventListener('input', apply);
        }
        if (select) {
            select.addEventListener('change', apply);
        }
        apply();
    }

    whenReady(function () {
        initMenu();
        initHero();
        initFilters();
    });
})();

function initMoviePlayer(source) {
    var video = document.getElementById('moviePlayer');
    var button = document.getElementById('playOverlay');
    var loaded = false;
    var hlsInstance = null;
    if (!video || !button || !source) {
        return;
    }
    function loadSource() {
        if (loaded) {
            return;
        }
        loaded = true;
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new Hls();
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }
    }
    function start() {
        loadSource();
        button.classList.add('is-hidden');
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                button.classList.remove('is-hidden');
            });
        }
    }
    button.addEventListener('click', start);
    video.addEventListener('click', function () {
        if (video.paused) {
            start();
        }
    });
    video.addEventListener('play', function () {
        button.classList.add('is-hidden');
    });
    video.addEventListener('pause', function () {
        if (!video.ended) {
            button.classList.remove('is-hidden');
        }
    });
    video.addEventListener('ended', function () {
        button.classList.remove('is-hidden');
    });
    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}

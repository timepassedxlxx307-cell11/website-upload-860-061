(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var prev = carousel.querySelector('[data-hero-prev]');
        var next = carousel.querySelector('[data-hero-next]');
        var index = 0;
        var timer;

        var show = function (target) {
            if (!slides.length) {
                return;
            }

            index = (target + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        };

        var restart = function () {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        };

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        restart();
    }

    var searchInput = document.getElementById('site-search');
    var typeFilter = document.getElementById('type-filter');
    var yearFilter = document.getElementById('year-filter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-card'));

    var normalize = function (value) {
        return String(value || '').toLowerCase().trim();
    };

    var applyFilters = function () {
        var keyword = normalize(searchInput ? searchInput.value : '');
        var type = normalize(typeFilter ? typeFilter.value : '');
        var year = normalize(yearFilter ? yearFilter.value : '');

        cards.forEach(function (card) {
            var haystack = normalize([
                card.dataset.title,
                card.dataset.region,
                card.dataset.type,
                card.dataset.year,
                card.dataset.genre,
                card.dataset.tags
            ].join(' '));
            var typeText = normalize(card.dataset.type || '');
            var yearText = normalize(card.dataset.year || '');
            var matched = true;

            if (keyword && haystack.indexOf(keyword) === -1) {
                matched = false;
            }

            if (type && typeText.indexOf(type) === -1) {
                matched = false;
            }

            if (year && yearText !== year) {
                matched = false;
            }

            card.classList.toggle('is-hidden', !matched);
        });
    };

    [searchInput, typeFilter, yearFilter].forEach(function (control) {
        if (control) {
            control.addEventListener('input', applyFilters);
            control.addEventListener('change', applyFilters);
        }
    });
})();

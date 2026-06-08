(function () {
    function normalize(value) {
        return (value || '').toString().toLowerCase().trim();
    }

    function setupMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            panel.classList.toggle('open');
        });
    }

    function setupHero() {
        var slider = document.querySelector('[data-hero-slider]');
        if (!slider) {
            return;
        }
        var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }
        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
            });
        });
        setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    function setupFilters() {
        var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
        panels.forEach(function (panel) {
            var root = panel.parentElement || document;
            var input = panel.querySelector('[data-filter-input]');
            var year = panel.querySelector('[data-filter-year]');
            var region = panel.querySelector('[data-filter-region]');
            var type = panel.querySelector('[data-filter-type]');
            var cards = Array.prototype.slice.call(root.querySelectorAll('[data-card]'));
            var empty = root.querySelector('[data-empty-state]');
            var queryInput = panel.querySelector('[data-search-input]');
            if (queryInput) {
                var params = new URLSearchParams(window.location.search);
                var q = params.get('q');
                if (q) {
                    queryInput.value = q;
                }
            }
            function apply() {
                var q = normalize(input && input.value);
                var y = normalize(year && year.value);
                var r = normalize(region && region.value);
                var t = normalize(type && type.value);
                var visible = 0;
                cards.forEach(function (card) {
                    var text = normalize(card.getAttribute('data-search'));
                    var ok = true;
                    if (q && text.indexOf(q) === -1) {
                        ok = false;
                    }
                    if (y && normalize(card.getAttribute('data-year')) !== y) {
                        ok = false;
                    }
                    if (r && normalize(card.getAttribute('data-region')) !== r) {
                        ok = false;
                    }
                    if (t && normalize(card.getAttribute('data-type')) !== t) {
                        ok = false;
                    }
                    card.style.display = ok ? '' : 'none';
                    if (ok) {
                        visible += 1;
                    }
                });
                if (empty) {
                    empty.classList.toggle('show', visible === 0);
                }
            }
            [input, year, region, type].forEach(function (control) {
                if (control) {
                    control.addEventListener('input', apply);
                    control.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    function setupPlayerJump() {
        var jump = document.querySelector('[data-player-jump]');
        var shell = document.querySelector('[data-player]');
        if (!jump || !shell) {
            return;
        }
        jump.addEventListener('click', function (event) {
            event.preventDefault();
            shell.scrollIntoView({ behavior: 'smooth', block: 'center' });
            var button = shell.querySelector('.player-start');
            if (button) {
                button.click();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupPlayerJump();
    });
}());

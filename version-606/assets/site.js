(function () {
    function all(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function setupMenu() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var menu = document.querySelector("[data-mobile-nav]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = all("[data-hero-slide]", hero);
        var dots = all("[data-hero-dot]", hero);
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("active", dotIndex === index);
            });
        }

        function play() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                play();
            });
        });
        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                play();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                play();
            });
        }
        show(0);
        play();
    }

    function setupFilters() {
        all("[data-filter-scope]").forEach(function (scope) {
            var input = scope.querySelector("[data-filter-input]");
            var genreSelect = scope.querySelector("[data-genre-select]");
            var yearSelect = scope.querySelector("[data-year-select]");
            var cards = all(".movie-card", scope);
            var empty = scope.querySelector("[data-empty-state]");
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");

            if (query && input) {
                input.value = query;
            }

            function apply() {
                var q = normalize(input ? input.value : "");
                var genre = genreSelect ? genreSelect.value : "all";
                var year = yearSelect ? yearSelect.value : "all";
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-region"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.textContent
                    ].join(" "));
                    var cardGenre = card.getAttribute("data-genre") || "";
                    var cardYear = card.getAttribute("data-year") || "";
                    var matchQuery = !q || text.indexOf(q) !== -1;
                    var matchGenre = genre === "all" || cardGenre.indexOf(genre) !== -1;
                    var matchYear = year === "all" || cardYear === year;
                    var isVisible = matchQuery && matchGenre && matchYear;
                    card.style.display = isVisible ? "" : "none";
                    if (isVisible) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("show", visible === 0);
                }
            }

            [input, genreSelect, yearSelect].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });
            apply();
        });
    }

    function setupGlobalSearch() {
        all("[data-global-search]").forEach(function (form) {
            form.addEventListener("submit", function (event) {
                var input = form.querySelector('input[name="q"]');
                if (!input || !input.value.trim()) {
                    event.preventDefault();
                    window.location.href = "./search.html";
                }
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupMenu();
        setupHero();
        setupFilters();
        setupGlobalSearch();
    });
})();

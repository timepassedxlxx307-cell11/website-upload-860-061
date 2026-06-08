(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === current);
        });
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var searchInput = document.querySelector("[data-search-input]");
    var categorySelect = document.querySelector("[data-filter-category]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var cards = Array.prototype.slice.call(document.querySelectorAll(".movie-card, .rank-card"));

    function normalize(value) {
        return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
        var keyword = normalize(searchInput && searchInput.value);
        var category = normalize(categorySelect && categorySelect.value);
        var year = normalize(yearSelect && yearSelect.value);
        var type = normalize(typeSelect && typeSelect.value);

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search"));
            var cardCategory = normalize(card.getAttribute("data-category"));
            var cardYear = normalize(card.getAttribute("data-year"));
            var cardType = normalize(card.getAttribute("data-type"));
            var matched = true;

            if (keyword && text.indexOf(keyword) === -1) {
                matched = false;
            }

            if (category && cardCategory !== category) {
                matched = false;
            }

            if (year && cardYear !== year) {
                matched = false;
            }

            if (type && cardType !== type) {
                matched = false;
            }

            card.classList.toggle("is-hidden", !matched);
        });
    }

    [searchInput, categorySelect, yearSelect, typeSelect].forEach(function (control) {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });
})();

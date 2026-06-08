(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  ready(function () {
    var toggle = document.querySelector('[data-menu-toggle]');
    var mobile = document.querySelector('[data-mobile-nav]');
    if (toggle && mobile) {
      toggle.addEventListener('click', function () {
        mobile.classList.toggle('is-open');
      });
    }

    var hero = document.querySelector('[data-hero]');
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
      var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
      var index = 0;
      var timer = null;
      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle('is-active', i === index);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle('is-active', i === index);
        });
      }
      function start() {
        if (timer) {
          window.clearInterval(timer);
        }
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }
      dots.forEach(function (dot) {
        dot.addEventListener('click', function () {
          show(Number(dot.getAttribute('data-hero-dot') || 0));
          start();
        });
      });
      show(0);
      start();
    }

    var searchInputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    searchInputs.forEach(function (input) {
      var section = input.closest('section') || document;
      var scope = section.querySelector('[data-search-scope]') || document.querySelector('[data-search-scope]');
      var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]')) : [];
      var clear = section.querySelector('[data-clear-search]');
      var activeTag = '';
      var filterButtons = Array.prototype.slice.call(section.querySelectorAll('[data-filter-tag]'));
      function apply() {
        var query = input.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = ((card.getAttribute('data-title') || '') + ' ' + (card.getAttribute('data-tags') || '') + ' ' + (card.getAttribute('data-year') || '') + ' ' + (card.getAttribute('data-region') || '')).toLowerCase();
          var bySearch = !query || text.indexOf(query) !== -1;
          var byTag = !activeTag || text.indexOf(activeTag.toLowerCase()) !== -1;
          card.classList.toggle('is-hidden', !(bySearch && byTag));
        });
      }
      input.addEventListener('input', apply);
      if (clear) {
        clear.addEventListener('click', function () {
          input.value = '';
          input.focus();
          apply();
        });
      }
      filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
          activeTag = button.getAttribute('data-filter-tag') || '';
          filterButtons.forEach(function (item) {
            item.classList.toggle('is-active', item === button);
          });
          apply();
        });
      });
    });
  });
}());

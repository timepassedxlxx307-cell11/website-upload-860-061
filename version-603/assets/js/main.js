(function () {
  function selectAll(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function setupMobileMenu() {
    var button = document.querySelector('[data-menu-button]');
    var nav = document.querySelector('[data-mobile-nav]');
    if (!button || !nav) {
      return;
    }
    button.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  function setupHero() {
    var root = document.querySelector('[data-hero-carousel]');
    if (!root) {
      return;
    }
    var slides = selectAll('[data-hero-slide]', root);
    var dots = selectAll('[data-hero-dot]', root);
    var current = 0;

    function activate(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        activate(current + 1);
      }, 5200);
    }
  }

  function setupLocalFilters() {
    selectAll('[data-card-filter]').forEach(function (panel) {
      var section = panel.parentElement;
      var keyword = panel.querySelector('[data-card-search]');
      var year = panel.querySelector('[data-year-filter]');
      var type = panel.querySelector('[data-type-filter]');
      var cards = selectAll('[data-card]', section);
      var empty = section.querySelector('[data-empty-hint]');

      function apply() {
        var keywordValue = keyword ? keyword.value.trim().toLowerCase() : '';
        var yearValue = year ? year.value : '';
        var typeValue = type ? type.value : '';
        var hasVisible = false;

        cards.forEach(function (card) {
          var text = (card.getAttribute('data-title') || '').toLowerCase();
          var cardYear = card.getAttribute('data-year') || '';
          var cardType = card.getAttribute('data-type') || '';
          var ok = true;

          if (keywordValue && text.indexOf(keywordValue) === -1) {
            ok = false;
          }
          if (yearValue && cardYear !== yearValue) {
            ok = false;
          }
          if (typeValue && cardType.indexOf(typeValue) === -1) {
            ok = false;
          }

          card.hidden = !ok;
          hasVisible = hasVisible || ok;
        });

        if (empty) {
          empty.hidden = hasVisible;
        }
      }

      [keyword, year, type].forEach(function (item) {
        if (item) {
          item.addEventListener('input', apply);
          item.addEventListener('change', apply);
        }
      });
    });
  }

  function movieCardHtml(movie) {
    var tags = movie.tags.slice(0, 3).map(function (tag) {
      return '<span class="tag-chip">#' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card">',
      '  <a href="' + escapeHtml(movie.href) + '" aria-label="' + escapeHtml(movie.title) + ' 在线观看">',
      '    <div class="poster-wrap">',
      '      <img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '海报" loading="lazy">',
      '      <span class="duration-badge">120分钟</span>',
      '      <span class="hover-play" aria-hidden="true">▶</span>',
      '    </div>',
      '    <div class="movie-card-body">',
      '      <div class="movie-meta-line"><span>' + escapeHtml(movie.category) + '</span><em>' + escapeHtml(movie.year) + '</em></div>',
      '      <h3>' + escapeHtml(movie.title) + '</h3>',
      '      <p>' + escapeHtml(movie.oneLine) + '</p>',
      '      <div class="tag-row">' + tags + '</div>',
      '    </div>',
      '  </a>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[character];
    });
  }

  function setupGlobalSearch() {
    var panel = document.querySelector('[data-global-search]');
    var target = document.querySelector('[data-global-results]');
    if (!panel || !target || !window.MOVIE_SEARCH_DATA) {
      return;
    }

    var keyword = panel.querySelector('[data-global-keyword]');
    var category = panel.querySelector('[data-global-category]');
    var year = panel.querySelector('[data-global-year]');
    var empty = document.querySelector('[data-global-empty]');

    function render() {
      var keywordValue = keyword.value.trim().toLowerCase();
      var categoryValue = category.value;
      var yearValue = year.value;
      var matches = window.MOVIE_SEARCH_DATA.filter(function (movie) {
        var text = movie.searchText.toLowerCase();
        if (keywordValue && text.indexOf(keywordValue) === -1) {
          return false;
        }
        if (categoryValue && movie.category !== categoryValue) {
          return false;
        }
        if (yearValue && movie.year !== yearValue) {
          return false;
        }
        return true;
      }).slice(0, 80);

      target.innerHTML = matches.map(movieCardHtml).join('');
      if (empty) {
        empty.hidden = matches.length > 0;
      }
    }

    [keyword, category, year].forEach(function (item) {
      item.addEventListener('input', render);
      item.addEventListener('change', render);
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupHero();
    setupLocalFilters();
    setupGlobalSearch();
  });
})();

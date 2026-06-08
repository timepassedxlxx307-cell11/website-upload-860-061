(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
    let current = 0;
    let timer = null;

    const showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    const startTimer = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    if (slides.length > 1) {
      startTimer();
    }
  }

  const filterInput = document.querySelector('[data-filter]');
  const filterList = document.querySelector('[data-filter-list]');

  if (filterInput && filterList) {
    const cards = Array.from(filterList.querySelectorAll('[data-card]'));
    filterInput.addEventListener('input', function () {
      const query = filterInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const terms = (card.getAttribute('data-terms') || '').toLowerCase();
        card.classList.toggle('is-hidden-by-filter', query && !terms.includes(query));
      });
    });
  }

  const searchInput = document.getElementById('site-search-input');
  const searchResults = document.getElementById('search-results');

  if (searchInput && searchResults && Array.isArray(window.MOVIES)) {
    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    const createCard = function (movie) {
      const tags = movie.tags.slice(0, 3).map(function (tag) {
        return '<span class="tag">' + escapeHtml(tag) + '</span>';
      }).join('');

      return '' +
        '<article class="movie-card">' +
          '<a class="poster" href="./' + movie.file + '" aria-label="' + escapeHtml(movie.title) + '">' +
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
            '<span class="poster-badge">' + escapeHtml(movie.year) + '</span>' +
          '</a>' +
          '<div class="movie-card-body">' +
            '<div class="movie-meta"><span>' + escapeHtml(movie.type) + '</span><span>' + escapeHtml(movie.region) + '</span></div>' +
            '<h2><a href="./' + movie.file + '">' + escapeHtml(movie.title) + '</a></h2>' +
            '<p>' + escapeHtml(movie.oneLine) + '</p>' +
            '<div class="tag-row">' + tags + '</div>' +
          '</div>' +
        '</article>';
    };

    const render = function () {
      const query = searchInput.value.trim().toLowerCase();
      const list = window.MOVIES.filter(function (movie) {
        if (!query) {
          return true;
        }
        return movie.searchText.toLowerCase().includes(query);
      }).slice(0, 96);

      if (list.length === 0) {
        searchResults.innerHTML = '<div class="empty-results">未找到匹配影片</div>';
        return;
      }

      searchResults.innerHTML = list.map(createCard).join('');
    };

    searchInput.addEventListener('input', render);
    render();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();

window.initMoviePlayer = function (streamUrl) {
  const video = document.getElementById('movie-video');
  const playButton = document.getElementById('movie-play');
  let loaded = false;
  let hlsPlayer = null;

  if (!video || !playButton || !streamUrl) {
    return;
  }

  const load = function () {
    if (loaded) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsPlayer = new window.Hls();
      hlsPlayer.loadSource(streamUrl);
      hlsPlayer.attachMedia(video);
    } else {
      video.src = streamUrl;
    }

    loaded = true;
  };

  const play = function () {
    load();
    playButton.classList.add('is-hidden');
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  };

  playButton.addEventListener('click', play);
  video.addEventListener('click', function () {
    if (!loaded) {
      play();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hlsPlayer) {
      hlsPlayer.destroy();
      hlsPlayer = null;
    }
  });
};

(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function initMobileMenu() {
    var button = document.querySelector(".mobile-menu-button");
    var nav = document.querySelector(".mobile-nav");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      button.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }
    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        show(dotIndex);
        restart();
      });
    });
    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }
    restart();
  }

  function loadHls(callback) {
    if (window.Hls) {
      callback();
      return;
    }
    var existing = document.querySelector("script[data-hls-loader]");
    if (existing) {
      existing.addEventListener("load", callback, { once: true });
      return;
    }
    var script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js";
    script.async = true;
    script.setAttribute("data-hls-loader", "true");
    script.addEventListener("load", callback, { once: true });
    document.head.appendChild(script);
  }

  function initPlayer() {
    var video = document.getElementById("movie-player");
    if (!video) {
      return;
    }
    var source = video.getAttribute("data-stream");
    var card = video.closest(".player-card");
    var started = false;
    var hlsInstance = null;
    function playNative() {
      video.src = source;
      video.play().catch(function () {});
      if (card) {
        card.classList.add("is-playing");
      }
    }
    function start() {
      if (!source) {
        return;
      }
      if (started) {
        video.play().catch(function () {});
        if (card) {
          card.classList.add("is-playing");
        }
        return;
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        playNative();
        return;
      }
      loadHls(function () {
        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          if (card) {
            card.classList.add("is-playing");
          }
        } else {
          playNative();
        }
      });
    }
    Array.prototype.slice.call(document.querySelectorAll(".player-start")).forEach(function (button) {
      button.addEventListener("click", start);
    });
    video.addEventListener("play", function () {
      if (card) {
        card.classList.add("is-playing");
      }
    });
    window.addEventListener("pagehide", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  function cardTemplate(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + '</span>';
    }).join("");
    return [
      '<article class="movie-card">',
      '  <a class="poster-link" href="' + movie.url + '" aria-label="' + escapeHtml(movie.title) + '">',
      '    <img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="play-chip">播放</span>',
      '  </a>',
      '  <div class="movie-card-body">',
      '    <div class="card-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '    <h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>',
      '    <p>' + escapeHtml(movie.one_line) + '</p>',
      '    <div class="tag-row">' + tags + '</div>',
      '  </div>',
      '</article>'
    ].join("");
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>'"]/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;"
      }[character];
    });
  }

  function initSearch() {
    var input = document.getElementById("search-input");
    var results = document.getElementById("search-results");
    var title = document.getElementById("search-title");
    var note = document.getElementById("search-note");
    if (!input || !results || !window.SEARCH_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    input.value = initialQuery;
    function runSearch() {
      var query = input.value.trim().toLowerCase();
      if (!query) {
        if (title) {
          title.textContent = "推荐内容";
        }
        if (note) {
          note.textContent = "可通过关键词筛选全站影片。";
        }
        results.innerHTML = window.SEARCH_INDEX.slice(0, 36).map(cardTemplate).join("");
        return;
      }
      var words = query.split(/\s+/).filter(Boolean);
      var matched = window.SEARCH_INDEX.filter(function (movie) {
        var haystack = [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.one_line, (movie.tags || []).join(" ")].join(" ").toLowerCase();
        return words.every(function (word) {
          return haystack.indexOf(word) !== -1;
        });
      }).slice(0, 80);
      if (title) {
        title.textContent = "搜索结果";
      }
      if (note) {
        note.textContent = matched.length ? "已为你匹配相关内容。" : "未找到匹配内容，可尝试更换关键词。";
      }
      results.innerHTML = matched.map(cardTemplate).join("") || '<div class="detail-box"><h2>暂无匹配内容</h2><p>请尝试输入其他影片标题、类型、地区或年份。</p></div>';
    }
    input.addEventListener("input", runSearch);
    var form = input.closest("form");
    if (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        runSearch();
      });
    }
    runSearch();
  }

  ready(function () {
    initMobileMenu();
    initHero();
    initPlayer();
    initSearch();
  });
})();

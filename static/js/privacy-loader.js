(function () {
  var policyContainer = document.getElementById('policy');
  if (!policyContainer) return;

  var appMap = {
    spiral: {
      label: 'Spiral Word Puzzle',
      url: '/privacy/spiral-word-puzzle/'
    },
    catchledger: {
      label: 'CatchLedger',
      url: '/privacy/catchledger/'
    }
  };

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.privacy-option'));

  function normalizeApp(value) {
    if (!value) return null;
    var normalized = value.toLowerCase().replace(/[^a-z]/g, '');
    if (normalized === 'spiralwordpuzzle') return 'spiral';
    if (normalized === 'catchledger') return 'catchledger';
    if (normalized === 'spiral') return 'spiral';
    return appMap[normalized] ? normalized : null;
  }

  function getSelectedApp() {
    var params = new URLSearchParams(window.location.search);
    return (
      normalizeApp(params.get('app')) ||
      normalizeApp(window.location.hash.replace(/^#/, '')) ||
      'spiral'
    );
  }

  function setActiveButton(app) {
    buttons.forEach(function (button) {
      var isActive = button.getAttribute('data-app') === app;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function updateUrl(app) {
    var params = new URLSearchParams(window.location.search);
    params.set('app', app);
    var next = window.location.pathname + '?' + params.toString() + '#' + app;
    window.history.replaceState({}, '', next);
  }

  function renderPolicy(app) {
    var item = appMap[app] || appMap.spiral;
    setActiveButton(app);
    policyContainer.innerHTML = '<p>Loading ' + item.label + ' policy…</p>';

    fetch(item.url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Unable to load policy page.');
        }
        return response.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var content = doc.querySelector('article.page-card .content');
        if (!content) {
          throw new Error('Policy content not found.');
        }
        policyContainer.innerHTML = content.innerHTML;
        updateUrl(app);
      })
      .catch(function () {
        policyContainer.innerHTML = '<p class="text-danger">Unable to load this policy right now.</p>';
      });
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var app = button.getAttribute('data-app');
      renderPolicy(app);
    });
  });

  renderPolicy(getSelectedApp());
})();

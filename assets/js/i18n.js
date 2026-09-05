(function () {
  "use strict";

  var STORAGE_KEY = 'site-lang';
  var DEFAULT_LANG = 'es';

  function getLang() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  function setLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  // Plain text content — safe for any element, no HTML allowed in the value
  function applyTextKeys(dict) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });
  }

  // Values that include inline markup (e.g. a <span> for a highlighted word)
  function applyHtmlKeys(dict) {
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });
  }

  function applyPlaceholderKeys(dict) {
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });
  }

  function applyAriaLabelKeys(dict) {
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key]);
      }
    });
  }

  function applyTranslations(dict, lang) {
    applyTextKeys(dict);
    applyHtmlKeys(dict);
    applyPlaceholderKeys(dict);
    applyAriaLabelKeys(dict);
    document.documentElement.setAttribute('lang', lang);
  }

  function loadLang(lang) {
    return fetch('assets/i18n/' + lang + '.json')
      .then(function (res) { return res.json(); })
      .then(function (dict) {
        applyTranslations(dict, lang);
      })
      .catch(function (err) {
        console.error('i18n: failed to load "' + lang + '"', err);
      });
  }

  function updateToggleUI(lang) {
    document.querySelectorAll('.lang-toggle [data-lang]').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.getAttribute('data-lang') === lang);
    });
  }

  function init() {
    var lang = getLang();
    updateToggleUI(lang);
    loadLang(lang);

    document.querySelectorAll('.lang-toggle [data-lang]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var newLang = btn.getAttribute('data-lang');
        if (newLang === getLang()) return;
        setLang(newLang);
        updateToggleUI(newLang);
        loadLang(newLang);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

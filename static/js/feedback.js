(function () {
  var params = new URLSearchParams(window.location.search);
  var rawSource = (params.get('source') || '').trim().toLowerCase();
  var rawType = (params.get('type') || '').trim().toLowerCase();

  var i18n = window.hambungleFeedbackI18n || {};

  var sourceMap = i18n.sourceMap || {
    catchledger: '',
    spiral: '',
    spiralwordpuzzle: '',
    'spiral-word-puzzle': ''
  };

  var typeMap = i18n.typeMap || {
    general: {
      category: '',
      subtitle: '',
      titlePrefix: '',
      messageLabel: '',
      messagePlaceholder: ''
    },
    improvement: {
      category: '',
      subtitle: '',
      titlePrefix: '',
      messageLabel: '',
      messagePlaceholder: ''
    },
    bug: {
      category: '',
      subtitle: '',
      titlePrefix: '',
      messageLabel: '',
      messagePlaceholder: ''
    }
  };

  var source = sourceMap[rawSource] ? rawSource : 'unknown';
  var appName = sourceMap[source] || (i18n.defaults && i18n.defaults.appName) || '';
  var type = typeMap[rawType] ? rawType : 'general';
  var typeConfig = typeMap[type];

  var title = document.getElementById('feedback-title');
  var subtitle = document.getElementById('feedback-subtitle');
  var sourceLabel = document.getElementById('feedback-source');
  var categoryLabel = document.getElementById('feedback-category');
  var messageLabel = document.getElementById('feedback-message-label');
  var messageInput = document.getElementById('feedback-message');

  var sourceInput = document.getElementById('feedback-source-input');
  var typeInput = document.getElementById('feedback-type-input');
  var appNameInput = document.getElementById('feedback-app-name');
  var categoryNameInput = document.getElementById('feedback-category-name');
  var subjectInput = document.getElementById('feedback-subject');

  var emailInput = document.getElementById('feedback-email');
  var replyToInput = document.getElementById('feedback-replyto');
  var form = document.getElementById('feedback-form-shell');

  function syncReplyTo() {
    if (!emailInput || !replyToInput) return;
    replyToInput.value = emailInput.value.trim();
  }

  function applyTemplate(template, data) {
    return template
      .replace('{{ .type }}', data.type)
      .replace('{{ .app }}', data.app)
      .replace('{{ .category }}', data.category);
  }

  var titleTemplate = i18n.titleTemplate || '';
  var subjectTemplate = i18n.subjectTemplate || '';

  if (title) {
    title.textContent = applyTemplate(titleTemplate, {
      type: typeConfig.titlePrefix,
      app: appName,
      category: typeConfig.category
    });
  }
  if (subtitle) subtitle.textContent = typeConfig.subtitle;
  if (sourceLabel) sourceLabel.textContent = appName;
  if (categoryLabel) categoryLabel.textContent = typeConfig.category;
  if (messageLabel) {
    while (messageLabel.firstChild) messageLabel.removeChild(messageLabel.firstChild);
    messageLabel.appendChild(document.createTextNode(typeConfig.messageLabel));
    var requiredMarker = document.createElement('span');
    requiredMarker.setAttribute('aria-hidden', 'true');
    requiredMarker.textContent = ' *';
    messageLabel.appendChild(requiredMarker);
  }
  if (messageInput) messageInput.setAttribute('placeholder', typeConfig.messagePlaceholder);

  if (sourceInput) sourceInput.value = source;
  if (typeInput) typeInput.value = type;
  if (appNameInput) appNameInput.value = appName;
  if (categoryNameInput) categoryNameInput.value = typeConfig.category;
  if (subjectInput) {
    subjectInput.value = applyTemplate(subjectTemplate, {
      type: typeConfig.titlePrefix,
      app: appName,
      category: typeConfig.category
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', syncReplyTo);
    emailInput.addEventListener('change', syncReplyTo);
  }

  if (form) {
    form.addEventListener('submit', syncReplyTo);
  }

  syncReplyTo();
})();

(function () {
  var params = new URLSearchParams(window.location.search);
  var rawSource = (params.get('source') || '').trim().toLowerCase();
  var rawType = (params.get('type') || '').trim().toLowerCase();

  var sourceMap = {
    catchledger: 'CatchLedger',
    spiral: 'Spiral Word Puzzle',
    spiralwordpuzzle: 'Spiral Word Puzzle',
    'spiral-word-puzzle': 'Spiral Word Puzzle'
  };

  var typeMap = {
    general: {
      category: 'General feedback',
      subtitle: 'Share any comments, questions, or overall feedback.',
      titlePrefix: 'General feedback',
      messageLabel: 'Message *',
      messagePlaceholder: 'Share your thoughts, comments, or questions.'
    },
    improvement: {
      category: 'Improvement suggestion',
      subtitle: 'Tell us what could be better and why it would help.',
      titlePrefix: 'Improvement suggestion',
      messageLabel: 'Suggestion details *',
      messagePlaceholder: 'What should we improve? Include the current behavior and your proposed change.'
    },
    bug: {
      category: 'Bug report',
      subtitle: 'Describe what went wrong and how we can reproduce it.',
      titlePrefix: 'Bug report',
      messageLabel: 'Bug details *',
      messagePlaceholder: 'What happened, what did you expect, and how can we reproduce the issue?'
    }
  };

  var source = sourceMap[rawSource] ? rawSource : 'unknown';
  var appName = sourceMap[source] || 'Hambungle App';
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

  if (title) {
    title.textContent = typeConfig.titlePrefix + ' for ' + appName;
  }
  if (subtitle) subtitle.textContent = typeConfig.subtitle;
  if (sourceLabel) sourceLabel.textContent = appName;
  if (categoryLabel) categoryLabel.textContent = typeConfig.category;
  if (messageLabel) {
    while (messageLabel.firstChild) messageLabel.removeChild(messageLabel.firstChild);
    messageLabel.appendChild(document.createTextNode(typeConfig.messageLabel.replace(' *', '')));
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
  if (subjectInput) subjectInput.value = typeConfig.category + ' - ' + appName;
})();

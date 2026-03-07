(function () {
  console.log("feedback.js loaded");
  var params = new URLSearchParams(window.location.search);
  var rawSource = (params.get("source") || "").trim().toLowerCase();
  var rawType = (params.get("type") || "").trim().toLowerCase();

  var i18n = window.hambungleFeedbackI18n || {};

  var sourceMap = i18n.sourceMap || {
    catchledger: "",
    spiral: "",
    spiralwordpuzzle: "",
    "spiral-word-puzzle": "",
  };

  var typeMap = i18n.typeMap || {
    general: {
      category: "",
      subtitle: "",
      titlePrefix: "",
      messageLabel: "",
      messagePlaceholder: "",
    },
    improvement: {
      category: "",
      subtitle: "",
      titlePrefix: "",
      messageLabel: "",
      messagePlaceholder: "",
    },
    bug: {
      category: "",
      subtitle: "",
      titlePrefix: "",
      messageLabel: "",
      messagePlaceholder: "",
    },
  };

  function clean(value) {
    return String(value || "")
      .replace(/^["'“”]+|["'“”]+$/g, "")
      .trim();
  }

  function applyTemplate(template, data) {
    var result = String(template || "")
      .replace("__TYPE__", clean(data.type))
      .replace("__APP__", clean(data.app))
      .replace("__CATEGORY__", clean(data.category));

    return clean(result);
  }

  var source = sourceMap[rawSource] ? rawSource : "unknown";
  var appName = sourceMap[source] || (i18n.defaults && i18n.defaults.appName) || "";
  var type = typeMap[rawType] ? rawType : "general";
  var typeConfig = typeMap[type];

  appName = clean(appName);
  typeConfig.category = clean(typeConfig.category);
  typeConfig.titlePrefix = clean(typeConfig.titlePrefix);
  typeConfig.subtitle = clean(typeConfig.subtitle);
  typeConfig.messageLabel = clean(typeConfig.messageLabel);
  typeConfig.messagePlaceholder = clean(typeConfig.messagePlaceholder);

  var title = document.getElementById("feedback-title");
  var subtitle = document.getElementById("feedback-subtitle");
  var sourceLabel = document.getElementById("feedback-source");
  var categoryLabel = document.getElementById("feedback-category");
  var messageLabel = document.getElementById("feedback-message-label");
  var messageInput = document.getElementById("feedback-message");

  var sourceInput = document.getElementById("feedback-source-input");
  var typeInput = document.getElementById("feedback-type-input");
  var appNameInput = document.getElementById("feedback-app-name");
  var categoryNameInput = document.getElementById("feedback-category-name");
  var subjectInput = document.getElementById("feedback-subject");
  var nextInput = document.getElementById("feedback-next");

  var emailInput = document.getElementById("feedback-email");
  var replyToInput = document.getElementById("feedback-replyto");
  var submitButton = document.getElementById("feedback-submit");
  var form = document.getElementById("feedback-form-shell");

  function syncReplyTo() {
    if (!emailInput || !replyToInput) return;
    replyToInput.value = emailInput.value.trim();
  }

  function setSubmitting(isSubmitting) {
    if (!submitButton) return;
    submitButton.disabled = isSubmitting;
    submitButton.setAttribute("aria-busy", isSubmitting ? "true" : "false");
    if (isSubmitting) {
      submitButton.dataset.originalText = submitButton.textContent || "";
      submitButton.textContent =
        (i18n.messages && i18n.messages.sending) || "Sending...";
    } else if (submitButton.dataset.originalText) {
      submitButton.textContent = submitButton.dataset.originalText;
    }
  }

  function showFormError(message) {
    var existing = document.getElementById("feedback-submit-error");
    if (existing) existing.remove();
  
    var error = document.createElement("p");
    error.id = "feedback-submit-error";
    error.className = "text-danger";
    error.textContent =
      message ||
      (i18n.messages && i18n.messages.submitError) ||
      "Unable to send feedback right now.";
  
    if (form) {
      form.appendChild(error);
    }
  }

  var titleTemplate = i18n.titleTemplate || "";
  var subjectTemplate = i18n.subjectTemplate || "";

  if (title) {
    title.textContent = applyTemplate(titleTemplate, {
      type: typeConfig.titlePrefix,
      app: appName,
      category: typeConfig.category,
    });
  }

  if (subtitle) subtitle.textContent = typeConfig.subtitle;
  if (sourceLabel) sourceLabel.textContent = appName;
  if (categoryLabel) categoryLabel.textContent = typeConfig.category;

  if (messageLabel) {
    while (messageLabel.firstChild) messageLabel.removeChild(messageLabel.firstChild);
    messageLabel.appendChild(document.createTextNode(typeConfig.messageLabel));
    var requiredMarker = document.createElement("span");
    requiredMarker.setAttribute("aria-hidden", "true");
    requiredMarker.textContent = " *";
    messageLabel.appendChild(requiredMarker);
  }

  if (messageInput) {
    messageInput.setAttribute("placeholder", typeConfig.messagePlaceholder);
  }

  if (sourceInput) sourceInput.value = source;
  if (typeInput) typeInput.value = type;
  if (appNameInput) appNameInput.value = appName;
  if (categoryNameInput) categoryNameInput.value = typeConfig.category;

  if (subjectInput) {
    subjectInput.value = applyTemplate(subjectTemplate, {
      type: typeConfig.titlePrefix,
      app: appName,
      category: typeConfig.category,
    });
  }

  if (emailInput) {
    emailInput.addEventListener("input", syncReplyTo);
    emailInput.addEventListener("change", syncReplyTo);
  }

  syncReplyTo();

  if (!form) return;

  form.addEventListener("submit", async function (event) {
    console.log("feedback form submit intercepted");
    event.preventDefault();
    syncReplyTo();

    var existingError = document.getElementById("feedback-submit-error");
    if (existingError) existingError.remove();

    if (!form.reportValidity()) return;

    var action = form.getAttribute("action");
    if (!action) {
      showFormError(
        (i18n.messages && i18n.messages.submitError) ||
        "Unable to send feedback right now."
      );
      return;
    }

    var formData = new FormData(form);

    try {
      setSubmitting(true);

      var response = await fetch(action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        var errorPayload = null;
        try {
          errorPayload = await response.json();
        } catch (_) {}

        var message =
          (errorPayload &&
            errorPayload.errors &&
            errorPayload.errors[0] &&
            errorPayload.errors[0].message) ||
            (i18n.messages && i18n.messages.submitError) ||
            "Unable to send feedback right now.";

        throw new Error(message);
      }

      var nextUrl =
      nextInput && nextInput.value
        ? nextInput.value
        : window.location.pathname.replace(/\/feedback\/?$/, "/feedback/thanks/");
      window.location.assign(nextUrl);
    } catch (error) {
      console.error("Feedback submission failed:", error);
      showFormError(
        error && error.message
          ? error.message
          : (i18n.messages && i18n.messages.submitError) ||
              "Unable to send feedback right now."
      );
    } finally {
      setSubmitting(false);
    }
  });
})();
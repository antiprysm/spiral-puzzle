document.addEventListener("DOMContentLoaded", function () {
  var policyContainer = document.getElementById("policy");
  if (!policyContainer) return;

  var i18nEl = document.getElementById("privacy-i18n");
  var i18n = {};

  try {
    i18n = i18nEl ? JSON.parse(i18nEl.textContent) : {};
  } catch (err) {
    console.error("Failed to parse privacy i18n JSON:", err);
  }

  var buttons = Array.prototype.slice.call(
    document.querySelectorAll(".privacy-option")
  );

  if (!buttons.length) {
    console.error("No privacy buttons found.");
    return;
  }

  function normalizeApp(value) {
    if (!value) return null;
    var normalized = value.toLowerCase().replace(/[^a-z]/g, "");
    if (normalized === "spiral" || normalized === "spiralwordpuzzle") return "spiral";
    if (normalized === "catchledger") return "catchledger";
    return null;
  }

  function getButtonForApp(app) {
    return buttons.find(function (button) {
      return button.getAttribute("data-app") === app;
    });
  }

  function getSelectedApp() {
    var params = new URLSearchParams(window.location.search);
    return (
      normalizeApp(params.get("app")) ||
      normalizeApp(window.location.hash.replace(/^#/, "")) ||
      "spiral"
    );
  }

  function setActiveButton(app) {
    buttons.forEach(function (button) {
      var isActive = button.getAttribute("data-app") === app;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function applyTemplate(template, data) {
    return String(template || "").replace("{{ .app }}", data.app || "");
  }

  function updateUrl(app) {
    var params = new URLSearchParams(window.location.search);
    params.set("app", app);
    var next = window.location.pathname + "?" + params.toString() + "#" + app;
    window.history.replaceState({}, "", next);
  }

  function renderPolicy(app) {
    var button = getButtonForApp(app) || getButtonForApp("spiral");
    if (!button) return;

    var url = button.getAttribute("data-url");
    var label = button.getAttribute("data-label") || "";
    var loadingTemplate = i18n.loadingPolicy || "";

    setActiveButton(button.getAttribute("data-app"));
    updateUrl(button.getAttribute("data-app"));

    policyContainer.innerHTML =
      "<p>" + applyTemplate(loadingTemplate, { app: label }) + "</p>";

    if (!url) {
      console.error("Missing privacy URL for app:", app);
      policyContainer.innerHTML =
        '<p class="text-danger">' + (i18n.errorGeneric || "Unable to load policy right now.") + "</p>";
      return;
    }

    console.log("Fetching privacy policy from:", url);

    fetch(url, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP " + response.status + " for " + url);
        }
        return response.text();
      })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, "text/html");
        var fragment = doc.getElementById("policy-fragment");

        if (!fragment) {
          throw new Error("policy-fragment not found in " + url);
        }

        policyContainer.innerHTML = fragment.innerHTML;
      })
      .catch(function (err) {
        console.error("Privacy loader error:", err);
        policyContainer.innerHTML =
          '<p class="text-danger">' + (i18n.errorGeneric || "Unable to load policy right now.") + "</p>";
      });
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      renderPolicy(button.getAttribute("data-app"));
    });
  });

  renderPolicy(getSelectedApp());
});
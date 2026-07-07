(function () {
  "use strict";

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  function button({ label, action, primary = false, icon = "" }) {
    return `<button class="rk-button${primary ? " rk-button--primary" : ""}"
      type="button" data-action="${escapeHtml(action)}">${icon}${escapeHtml(label)}</button>`;
  }

  function brandHeader({ brand, title, canGoBack }) {
    return `<header class="rk-header">
      <button class="rk-back" type="button" data-action="back" aria-label="前の画面へ戻る"${canGoBack ? "" : " hidden"}>←</button>
      <div>
        <p class="rk-header__brand">✿ ${escapeHtml(brand)}</p>
        <h1 class="rk-header__title">${escapeHtml(title)}</h1>
      </div>
      ${mascot({ compact: true })}
    </header>`;
  }

  function progress(current, total) {
    const percent = Math.round((current / total) * 100);
    return `<div class="rk-progress" aria-label="進捗 ${current}/${total}">
      <div class="rk-progress__meta"><span>質問 ${current} / ${total}</span><span>${percent}%</span></div>
      <div class="rk-progress__track"><div class="rk-progress__bar" style="width:${percent}%"></div></div>
    </div>`;
  }

  function mascot({ message = "", compact = false } = {}) {
    const image = `<img class="${compact ? "rk-header__mascot" : "rk-mascot"}"
      src="assets/keroty.png" alt="小さな黄色い王冠をつけたカエルのケロティ">`;
    if (!message) return image;
    return `<div class="rk-hero"><div class="rk-speech">${escapeHtml(message)}</div>${image}</div>`;
  }

  function options(question, selectedValues) {
    return `<div class="rk-options">${question.options
      .map((option) => {
        const checked = selectedValues.includes(option.value) ? " checked" : "";
        return `<label class="rk-option">
          <input type="${question.multiple ? "checkbox" : "radio"}"
            name="answer" value="${escapeHtml(option.value)}"${checked}>
          <span>${escapeHtml(option.label)}</span>
        </label>`;
      })
      .join("")}</div>`;
  }

  function resultList(items) {
    return `<ul class="rk-result-list">${items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("")}</ul>`;
  }

  function explanation(title, text) {
    return `<div class="rk-card rk-card--mint">
      ${title ? `<h3 class="rk-card__title">${escapeHtml(title)}</h3>` : ""}
      <p>${escapeHtml(text)}</p>
    </div>`;
  }

  function inputField({ id, label, value = "", hint = "" }) {
    return `<div class="rk-input">
      <label for="${escapeHtml(id)}">${escapeHtml(label)}</label>
      <input id="${escapeHtml(id)}" value="${escapeHtml(value)}" aria-describedby="${escapeHtml(id)}-hint">
      ${hint ? `<small id="${escapeHtml(id)}-hint">${escapeHtml(hint)}</small>` : ""}
    </div>`;
  }

  function errorMessage(message, nextAction) {
    return `<div class="rk-alert" role="alert">
      <strong>${escapeHtml(message)}</strong>
      <span>${escapeHtml(nextAction)}</span>
    </div>`;
  }

  function loading(message = "処理しています。少しお待ちください。") {
    return `<div class="rk-loading" role="status" aria-live="polite">
      <span class="rk-loading__dot" aria-hidden="true"></span>
      <span>${escapeHtml(message)}</span>
    </div>`;
  }

  function saveStatus(message, ok = true) {
    return `<p class="rk-save-status${ok ? " rk-save-status--ok" : ""}" aria-live="polite">${escapeHtml(message)}</p>`;
  }

  window.RakukajiUI = {
    button,
    brandHeader,
    progress,
    mascot,
    options,
    resultList,
    explanation,
    inputField,
    errorMessage,
    loading,
    saveStatus,
    escapeHtml
  };
})();

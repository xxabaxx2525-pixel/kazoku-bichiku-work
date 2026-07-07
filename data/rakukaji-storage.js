(function () {
  "use strict";

  const PREFIX = "rakukaji:";
  const VERSION = 1;

  function create({ key, onSaved, onError }) {
    const storageKey = `${PREFIX}${key}`;

    function load() {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed.version !== VERSION || !parsed.data) return null;
        return parsed.data;
      } catch (error) {
        onError?.("前回の内容を読み込めませんでした。新しく始めることはできます。", error);
        return null;
      }
    }

    function save(data) {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ version: VERSION, savedAt: new Date().toISOString(), data })
        );
        onSaved?.("入力内容をこの端末に保存しました");
        return true;
      } catch (error) {
        onError?.("入力内容を保存できませんでした。ブラウザの保存設定を確認してください。", error);
        return false;
      }
    }

    function clear() {
      try {
        window.localStorage.removeItem(storageKey);
        return true;
      } catch (error) {
        onError?.("保存内容を消去できませんでした。もう一度お試しください。", error);
        return false;
      }
    }

    return { load, save, clear };
  }

  window.RakukajiStorage = { create };
})();

// Home-screen shortcut: service worker registration + install prompt.
(() => {
  "use strict";
  const box = document.getElementById("install");
  const btn = document.getElementById("installBtn");
  const text = document.getElementById("installText");
  const dismissed = () => { try { return localStorage.getItem("ac:installDismissed") === "1"; } catch { return false; } };
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;

  if ("serviceWorker" in navigator && location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
  if (standalone || dismissed()) return;

  document.getElementById("installClose").onclick = () => {
    box.hidden = true;
    try { localStorage.setItem("ac:installDismissed", "1"); } catch {}
  };

  // Chrome / Edge / Android: the browser offers a real install prompt.
  let deferred = null;
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred = e;
    btn.hidden = false;
    box.hidden = false;
  });
  btn.onclick = async () => {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    deferred = null;
    box.hidden = true;
  };
  addEventListener("appinstalled", () => (box.hidden = true));

  // iPhone / iPad Safari has no prompt, so explain the manual steps.
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (ios) {
    text.innerHTML = "To add Accent Coach to your home screen: tap <b>Share</b> <span aria-hidden='true'>⎋</span> then <b>Add to Home Screen</b>.";
    btn.hidden = true;
    box.hidden = false;
  }
})();

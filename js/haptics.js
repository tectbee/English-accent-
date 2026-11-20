// Haptic feedback for button taps and results.
// - Android / Chrome: navigator.vibrate()
// - iPhone (Safari, iOS 18+): toggling a hidden <input switch> plays the system haptic tick.
//   This only fires inside a real tap, so iPhone gets one tick per tap; result patterns
//   (success / error) are Android-only.
(() => {
  "use strict";
  const KEY = "ac:haptics";
  const PATTERNS = {
    tap: 8,
    press: 18,              // start recording
    success: [12, 70, 12],
    warn: [20, 60, 20],
    error: [35, 50, 35, 50, 35],
  };

  let enabled = true;
  try { enabled = localStorage.getItem(KEY) !== "0"; } catch {}

  const canVibrate = typeof navigator.vibrate === "function";

  // iOS switch trick: a label wrapping <input type=checkbox switch>, kept off-screen.
  let iosLabel = null;
  if (!canVibrate) {
    iosLabel = document.createElement("label");
    iosLabel.setAttribute("aria-hidden", "true");
    iosLabel.style.cssText = "position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("switch", "");
    input.tabIndex = -1;
    iosLabel.append(input);
    document.body.append(iosLabel);
  }

  function haptic(kind = "tap") {
    if (!enabled) return;
    if (canVibrate) {
      try { navigator.vibrate(PATTERNS[kind] ?? PATTERNS.tap); } catch {}
    } else if (iosLabel) {
      iosLabel.click();
    }
  }

  // Light tick on every button tap, everywhere in the app.
  document.addEventListener("click", (e) => {
    const b = e.target.closest("button, select, .w");
    if (!b || b.disabled || e.target === iosLabel || iosLabel?.contains(e.target)) return;
    haptic(b.id === "record" || b.id === "sayRecord" ? "press" : "tap");
  }, true);
  // Sliders and pickers get a tick when the value changes.
  document.addEventListener("change", (e) => {
    if (e.target.matches("select, input[type=range]")) haptic("tap");
  }, true);

  window.haptic = haptic;
  window.hapticsEnabled = {
    get: () => enabled,
    set(v) {
      enabled = !!v;
      try { localStorage.setItem(KEY, enabled ? "1" : "0"); } catch {}
      if (enabled) haptic("success");
    },
  };
})();

// Role-play conversations: the partner speaks, the learner replies out loud.
(() => {
  "use strict";
  const AC = window.AC, T = window.TALK_DATA;
  if (!AC || !T) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const PASS = 60;

  let sc = null, turn = 0, scores = [], waiting = false;
  const hide = $("talkHide");
  hide.checked = AC.store.get("talkHide", false);
  hide.onchange = () => { AC.store.set("talkHide", hide.checked); renderSuggestions(); };

  // ---------- scenario list ----------
  function renderList() {
    const best = AC.store.get("talkBest", {});
    const box = $("talkList");
    box.innerHTML = "";
    T.forEach((s) => {
      const b = document.createElement("button");
      b.className = "glass scenario";
      const sb = best[s.id];
      b.innerHTML = `<span class="sc-emoji">${s.emoji}</span>
        <span class="sc-text"><b>${esc(s.title)}</b><small>${s.level} · ${s.turns.length} replies · with ${esc(s.partner)}</small></span>
        <span class="sc-best">${sb != null ? (sb >= 85 ? "⭐ " : "") + sb + "%" : "Start ›"}</span>`;
      b.onclick = () => start(s);
      box.append(b);
    });
  }

  // ---------- chat ----------
  function bubble(who, html, extra = "") {
    const d = document.createElement("div");
    d.className = `bubble ${who} ${extra}`;
    d.innerHTML = html;
    $("chatLog").append(d);
    d.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return d;
  }

  function start(s) {
    sc = s; turn = 0; scores = [];
    $("talkHome").hidden = true;
    $("talkChat").hidden = false;
    $("chatTitle").textContent = `${s.emoji} ${s.title}`;
    $("chatLog").innerHTML = "";
    $("talkEnd").hidden = true;
    $("composer").hidden = false;
    window.scrollTo({ top: 0 });
    botSays();
  }

  function renderDots() {
    $("chatDots").innerHTML = sc.turns.map((_, i) =>
      `<i class="${i < scores.length ? (scores[i] >= PASS ? "ok" : "no") : i === turn ? "now" : ""}"></i>`).join("");
  }

  async function botSays() {
    renderDots();
    const t = sc.turns[turn];
    const b = bubble("bot", `<span class="who">${esc(sc.partner)}</span>${esc(t.bot)} <button class="replay" aria-label="Hear again">🔊</button>`);
    b.querySelector(".replay").onclick = () => AC.speak(t.bot);
    renderSuggestions();
    await AC.speak(t.bot);
  }

  function renderSuggestions() {
    const box = $("suggest");
    if (!sc) return;
    const t = sc.turns[turn];
    box.innerHTML = "";
    if (!t) return;
    $("suggestLabel").textContent = hide.checked ? "Challenge mode: answer in your own words, or tap to reveal an idea" : "You could say (tap to hear):";
    t.replies.forEach((r, i) => {
      const b = document.createElement("button");
      b.className = "suggestion" + (hide.checked ? " blur" : "");
      b.textContent = r;
      b.onclick = () => {
        if (b.classList.contains("blur")) { b.classList.remove("blur"); return; }
        AC.speak(r);
      };
      box.append(b);
    });
  }

  function scoreReply(text, t) {
    const heard = AC.words(text);
    let best = 0, model = t.replies[0];
    t.replies.forEach((r) => {
      const a = AC.align(AC.words(r), heard);
      if (a.score > best) { best = a.score; model = r; }
    });
    let own = false;
    if (best < 70 && heard.length >= 2 && (t.keys || []).some((k) => heard.includes(k))) { best = Math.max(best, 75); own = true; }
    return { score: best, model, own };
  }

  $("talkMic").onclick = async () => {
    if (waiting) { AC.capture($("talkMic")); return; }
    if (!AC.hasRecognition) { AC.toast("Speech recognition isn't available in this browser"); return; }
    const t = sc && sc.turns[turn];
    if (!t) return;
    waiting = true;
    let res;
    try { res = await AC.capture($("talkMic"), { long: true, onInterim: (x) => { $("talkLive").hidden = !x; $("talkLive").textContent = x; } }); }
    finally { waiting = false; }
    $("talkLive").hidden = true;
    if (!res) return;
    const text = res.alts.length ? res.alts[0].text : "";
    if (!text) { AC.toast(res.quiet ? "🎤 Too quiet. Speak closer to the phone" : "I didn't hear anything. Try again"); AC.buzz("warn"); return; }

    const r = scoreReply(text, t);
    const pass = r.score >= PASS;
    const chip = `<span class="chip ${pass ? "ok" : "no"}">${r.own ? "✓ Your own answer" : r.score + "%"}</span>`;
    const ub = bubble("me", `${esc(text)}${chip}`);
    AC.buzz(pass ? "success" : "error");

    if (!pass) {
      const hint = bubble("coach", `Try something like: <b>“${esc(r.model)}”</b>
        <span class="coach-actions"><button class="chip-btn listen">🔊 Hear it</button><button class="chip-btn skip">Skip ›</button></span>`);
      hint.querySelector(".listen").onclick = () => AC.speak(r.model);
      hint.querySelector(".skip").onclick = () => { hint.querySelector(".coach-actions").remove(); next(r.score); };
      ub.classList.add("retry");
      return; // learner can tap the mic and try again
    }
    AC.addXP(3);
    next(r.score);
  };

  function next(score) {
    scores.push(score);
    turn++;
    if (turn < sc.turns.length) setTimeout(botSays, 500);
    else finish();
  }

  function finish() {
    renderDots();
    $("composer").hidden = true;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best = AC.store.get("talkBest", {});
    best[sc.id] = Math.max(best[sc.id] || 0, avg);
    AC.store.set("talkBest", best);
    $("endStars").innerHTML = [1, 2, 3].map((i) => `<span class="${i <= (avg >= 85 ? 3 : avg >= 65 ? 2 : 1) ? "on" : ""}">★</span>`).join("");
    $("endScore").textContent = `Conversation complete · ${avg}%`;
    $("endMsg").textContent = avg >= 85 ? "Amazing! You sounded natural and clear." :
      avg >= 65 ? "Well done! Try challenge mode next time." : "Good start. Practise the suggested replies and try again.";
    $("talkEnd").hidden = false;
    $("talkEnd").scrollIntoView({ behavior: "smooth", block: "nearest" });
    AC.addXP(10, "talk");
    AC.buzz("success");
  }

  $("chatBack").onclick = $("endBack").onclick = () => {
    sc = null;
    speechSynthesis && speechSynthesis.cancel();
    $("talkChat").hidden = true;
    $("talkHome").hidden = false;
    renderList();
  };
  $("endAgain").onclick = () => start(sc);

  document.addEventListener("ac:tab", (e) => { if (e.detail === "talk" && !sc) renderList(); });
  document.addEventListener("ac:reset", () => { AC.store.set("talkBest", {}); renderList(); });
  renderList();
})();

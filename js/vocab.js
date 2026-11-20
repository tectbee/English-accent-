// Vocabulary speaking practice: learn a word, say it, then answer a question using it.
(() => {
  "use strict";
  const AC = window.AC, V = window.VOCAB_DATA;
  if (!AC || !V) return;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const MASTER_AT = 2;                       // good answers needed to master a word
  const MIN_WORDS = { Beginner: 8, Intermediate: 15 };
  const FILLERS = ["um", "umm", "uh", "uhh", "er", "erm", "ah", "hmm", "mm"];
  const FILLER_PHRASES = ["you know", "i mean", "sort of", "kind of"];

  let mastery = AC.store.get("vocab", {});    // word -> good answers
  let topic = V.find((t) => t.id === AC.store.get("vocabTopic")) || V[0];
  let idx = 0;
  const word = () => topic.words[idx % topic.words.length];
  const save = () => AC.store.set("vocab", mastery);

  // Accept common forms: grateful, prepares, prepared, preparing, studies, studied, stopped…
  function formsOf(entry) {
    const w = entry.w.toLowerCase();
    const set = new Set([w, w + "s", w + "es", w + "ed", w + "d", w + "ing", w + "ly", w + "er", w + "est"]);
    if (w.endsWith("e")) { set.add(w.slice(0, -1) + "ing"); set.add(w.slice(0, -1) + "y"); }
    if (/[^aeiou]y$/.test(w)) { const r = w.slice(0, -1); ["ies", "ied", "ier", "iest", "ily"].forEach((x) => set.add(r + x)); }
    if (/[^aeiou][aeiou][bdgklmnprt]$/.test(w)) { const d = w + w.slice(-1); set.add(d + "ed"); set.add(d + "ing"); }
    (entry.forms || []).forEach((f) => set.add(f.toLowerCase()));
    return set;
  }

  // ---------- topics ----------
  function renderTopics() {
    const box = $("vocabTopics");
    box.innerHTML = "";
    V.forEach((t) => {
      const b = document.createElement("button");
      b.className = t.id === topic.id ? "on" : "";
      b.textContent = `${t.emoji} ${t.name}`;
      b.onclick = () => { topic = t; idx = 0; AC.store.set("vocabTopic", t.id); render(); };
      box.append(b);
    });
  }

  function renderTopicProgress() {
    const done = topic.words.filter((w) => (mastery[w.w] || 0) >= MASTER_AT).length;
    $("vocabLevel").textContent = topic.level;
    $("vocabCount").textContent = `${done} / ${topic.words.length} words mastered`;
    $("vocabBar").style.width = (done / topic.words.length) * 100 + "%";
  }

  function dots(n) {
    return Array.from({ length: MASTER_AT }, (_, i) => `<i class="${i < n ? "on" : ""}"></i>`).join("");
  }

  // ---------- word card ----------
  function render() {
    renderTopics();
    renderTopicProgress();
    const e = word();
    const n = Math.min(mastery[e.w] || 0, MASTER_AT);
    $("vWord").textContent = e.w;
    $("vPos").textContent = e.pos;
    $("vDef").textContent = e.def;
    $("vEx").textContent = e.ex;
    $("vQ").textContent = e.q;
    $("vDots").innerHTML = dots(n);
    $("vDots").title = n >= MASTER_AT ? "Mastered" : `${n} of ${MASTER_AT} good answers`;
    $("vMastered").hidden = n < MASTER_AT;
    $("vSayMsg").textContent = "";
    $("vLive").textContent = "";
    $("vLive").hidden = true;
    $("vResult").hidden = true;
    $("vMinWords").textContent = MIN_WORDS[topic.level] || 10;
    renderList();
  }

  function renderList() {
    const list = $("vocabList");
    list.innerHTML = "";
    topic.words.forEach((e, i) => {
      const n = Math.min(mastery[e.w] || 0, MASTER_AT);
      const row = document.createElement("button");
      row.className = "row" + (i === idx % topic.words.length ? " current" : "");
      row.innerHTML = `<span><b>${esc(e.w)}</b> <small>${esc(e.def)}</small></span><span class="dots">${dots(n)}</span>`;
      row.onclick = () => { idx = i; render(); window.scrollTo({ top: 0, behavior: "smooth" }); };
      list.append(row);
    });
  }

  $("vWordListen").onclick = () => AC.speak(word().w, 0.75);
  $("vExListen").onclick = () => AC.speak(word().ex);
  $("vQListen").onclick = () => AC.speak(word().q);
  $("vPrev").onclick = () => { idx = (idx - 1 + topic.words.length) % topic.words.length; render(); };
  $("vNext").onclick = $("vNext2").onclick = () => { idx = (idx + 1) % topic.words.length; render(); window.scrollTo({ top: 0, behavior: "smooth" }); };
  $("vRetry").onclick = () => { $("vResult").hidden = true; $("vAnswer").scrollIntoView({ behavior: "smooth", block: "center" }); };

  // ---------- step 1: say the word ----------
  $("vSay").onclick = async () => {
    const msg = $("vSayMsg");
    if (!AC.hasRecognition) { msg.textContent = "Speech recognition isn't available in this browser. Try Chrome or Safari."; return; }
    const res = await AC.capture($("vSay"));
    if (!res) return;
    if (!res.alts.length) { msg.textContent = "I didn't hear anything. Try again."; return; }
    const forms = formsOf(word());
    const top = AC.words(res.alts[0].text);
    if (top.some((t) => forms.has(t))) {
      msg.innerHTML = `<b class="good-t">✓ Clear!</b> Now use it in an answer below.`;
      AC.buzz("success");
    } else if (res.alts.some((a) => AC.words(a.text).some((t) => forms.has(t)))) {
      msg.innerHTML = `<b>Almost.</b> I first heard “${esc(res.alts[0].text)}”. Listen and try once more.`;
      AC.buzz("warn");
    } else {
      msg.innerHTML = `<b class="bad-t">I heard “${esc(res.alts[0].text)}”.</b> Tap 🔊 and copy the sound.`;
      AC.buzz("error");
    }
  };

  // ---------- step 2: answer the question ----------
  let answering = false;
  $("vAnswer").onclick = async () => {
    if (answering) { AC.capture($("vAnswer")); return; } // second tap = stop
    if (!AC.hasRecognition) { $("vSayMsg").textContent = "Speech recognition isn't available in this browser. Try Chrome or Safari."; return; }
    const live = $("vLive");
    $("vResult").hidden = true;
    live.hidden = false;
    live.textContent = "Listening… speak your answer, then tap stop.";
    const started = Date.now();
    answering = true;
    let res;
    try {
      res = await AC.capture($("vAnswer"), { long: true, onInterim: (t) => { if (t) live.textContent = t; } });
    } finally { answering = false; }
    if (!res) { live.hidden = true; return; }
    const seconds = (Date.now() - started) / 1000;
    live.hidden = true;
    showFeedback(res.alts.length ? res.alts[0].text : "", seconds);
  };

  function showFeedback(text, seconds) {
    const e = word();
    const forms = formsOf(e);
    const toks = AC.words(text);
    const minWords = MIN_WORDS[topic.level] || 10;
    const used = toks.some((t) => forms.has(t));
    const count = toks.length;
    const unique = new Set(toks).size;
    const joined = " " + toks.join(" ") + " ";
    const fillers = toks.filter((t) => FILLERS.includes(t)).length +
      FILLER_PHRASES.reduce((n, p) => n + (joined.split(" " + p + " ").length - 1), 0);
    const wpm = seconds >= 4 ? Math.round(count / (seconds / 60)) : null;

    const checks = [];
    checks.push(used
      ? { ok: true, t: `You used <b>“${esc(e.w)}”</b>` }
      : { ok: false, t: `You didn't use <b>“${esc(e.w)}”</b>. Try to include it.` });
    checks.push(count >= minWords
      ? { ok: true, t: `${count} words. Great length!` }
      : { ok: false, t: `${count} words. Try to say at least ${minWords}: add a reason or an example.` });
    if (wpm !== null) {
      checks.push(wpm < 70 ? { ok: false, t: `${wpm} words/min. A bit slow; try to keep talking smoothly.` }
        : wpm > 180 ? { ok: false, t: `${wpm} words/min. Quite fast; slow down a little to be clear.` }
        : { ok: true, t: `${wpm} words/min. Natural speed.` });
    }
    if (count >= 6) {
      checks.push(fillers === 0
        ? { ok: true, t: "No filler words (um, uh…)" }
        : { ok: false, t: `${fillers} filler word${fillers > 1 ? "s" : ""} (um, uh, you know…). Pause silently instead.` });
      const variety = unique / count;
      if (count >= 10) checks.push(variety >= 0.6
        ? { ok: true, t: `${unique} different words. Good variety!` }
        : { ok: false, t: `${unique} different words. You repeated words a lot; try new ones.` });
    }

    const good = checks.filter((c) => c.ok).length;
    const stars = !text ? 0 : !used ? 1 : good >= checks.length - 1 ? 3 : 2;
    const success = used && count >= minWords;

    if (success) {
      mastery[e.w] = (mastery[e.w] || 0) + 1;
      save();
    }
    // vocab practice counts toward the daily streak too
    const prog = AC.store.get("progress", { attempts: 0, total: 0, misses: {}, history: [], days: [] });
    const today = new Date().toISOString().slice(0, 10);
    if (text && !prog.days.includes(today)) { prog.days.push(today); AC.store.set("progress", prog); }
    AC.store.set("vocabLog", [{ w: e.w, stars, at: Date.now() }, ...AC.store.get("vocabLog", [])].slice(0, 100));

    $("vStars").innerHTML = [1, 2, 3].map((i) => `<span class="${i <= stars ? "on" : ""}">★</span>`).join("");
    $("vVerdict").textContent = !text ? "I didn't hear anything." :
      stars === 3 ? "Excellent answer!" : stars === 2 ? "Good answer!" : "Nice try, use the word next time.";
    // transcript with the target word highlighted
    $("vHeard").innerHTML = text
      ? esc(text).replace(/[A-Za-z'’]+/g, (m) => (forms.has(m.toLowerCase().replace(/’/g, "'")) ? `<mark>${m}</mark>` : m))
      : "—";
    $("vChecks").innerHTML = text
      ? checks.map((c) => `<li class="${c.ok ? "ok" : "no"}">${c.t}</li>`).join("")
      : "<li class='no'>Tap the mic, speak, then tap again to stop. Speak close to the phone.</li>";
    const n = Math.min(mastery[e.w] || 0, MASTER_AT);
    $("vProgressMsg").textContent = success
      ? (n >= MASTER_AT ? `🎉 “${e.w}” mastered!` : `+1 for “${e.w}”. One more good answer to master it.`)
      : "";
    $("vResult").hidden = false;
    $("vDots").innerHTML = dots(n);
    $("vMastered").hidden = n < MASTER_AT;
    renderTopicProgress();
    renderList();
    AC.buzz(stars === 3 ? "success" : stars === 2 ? "warn" : "error");
    $("vResult").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  // ---------- progress tab ----------
  function renderStats() {
    const all = V.flatMap((t) => t.words);
    const done = all.filter((w) => (mastery[w.w] || 0) >= MASTER_AT).length;
    const el = $("stVocab");
    if (el) el.textContent = `${done}/${all.length}`;
  }
  document.addEventListener("ac:tab", (e) => {
    if (e.detail === "progress") { mastery = AC.store.get("vocab", {}); renderStats(); }
  });
  document.addEventListener("ac:reset", () => {
    mastery = {}; save(); AC.store.set("vocabLog", []); renderStats(); render();
  });

  render();
  renderStats();
})();

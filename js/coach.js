// Coach layer: XP + daily goal, the Today plan, spaced review, and dictionary (IPA + human audio).
(() => {
  "use strict";
  const AC = (window.AC = window.AC || {});
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const st = {
    get(k, d) { try { const v = localStorage.getItem("ac:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("ac:" + k, JSON.stringify(v)); } catch {} },
  };
  const dayKey = (d = new Date()) => {
    const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return z.toISOString().slice(0, 10);
  };

  // ---------- daily plan ----------
  const PLAN = [
    { kind: "quiz", target: 5, icon: "👂", title: "Ear training", sub: "Answer 5 listening questions", go: "sounds" },
    { kind: "accent", target: 3, icon: "🎯", title: "Accent practice", sub: "Say 3 sentences", go: "practice" },
    { kind: "vocab", target: 2, icon: "📚", title: "Vocabulary", sub: "Answer 2 questions with new words", go: "vocab" },
    { kind: "talk", target: 1, icon: "💬", title: "Conversation", sub: "Finish 1 role-play", go: "talk" },
  ];
  const GOALS = [{ xp: 20, name: "Casual" }, { xp: 40, name: "Regular" }, { xp: 60, name: "Serious" }, { xp: 100, name: "Intense" }];

  function today() {
    let t = st.get("today", null);
    if (!t || t.date !== dayKey()) t = { date: dayKey(), xp: 0, quiz: 0, accent: 0, sounds: 0, vocab: 0, talk: 0, goalHit: false, planDone: false };
    return t;
  }
  const goal = () => st.get("goal", 40);

  // ---------- XP ----------
  function addXP(n, kind) {
    const t = today();
    if (kind) t[kind] = (t[kind] || 0) + 1;
    t.xp += n;
    const total = st.get("xpTotal", 0) + n;
    st.set("xpTotal", total);
    // any activity keeps the streak alive
    const prog = st.get("progress", { attempts: 0, total: 0, misses: {}, history: [], days: [] });
    if (!prog.days.includes(dayKey())) { prog.days.push(dayKey()); st.set("progress", prog); }

    if (n > 0) toast(`+${n} XP`, "xp");
    if (!t.goalHit && t.xp >= goal()) {
      t.goalHit = true;
      setTimeout(() => { toast("🎉 Daily goal reached!", "big"); AC.buzz && AC.buzz("success"); }, 700);
    }
    if (!t.planDone && PLAN.every((p) => (t[p.kind] || 0) >= p.target)) {
      t.planDone = true;
      t.xp += 10;
      st.set("xpTotal", total + 10);
      setTimeout(() => toast("🏆 Today's plan complete! +10 XP", "big"), 1500);
    }
    st.set("today", t);
    renderToday();
  }

  // ---------- toast ----------
  let toastBox = null;
  function toast(text, kind = "") {
    if (!toastBox) { toastBox = document.createElement("div"); toastBox.className = "toasts"; toastBox.setAttribute("aria-live", "polite"); document.body.append(toastBox); }
    const el = document.createElement("div");
    el.className = "toast glass " + kind;
    el.textContent = text;
    toastBox.append(el);
    setTimeout(() => el.classList.add("out"), kind === "big" ? 2600 : 1300);
    setTimeout(() => el.remove(), kind === "big" ? 3100 : 1800);
  }

  // ---------- spaced review (vocab) ----------
  const INTERVALS = [1, 3, 7, 14, 30, 60]; // days
  const srs = {
    all: () => st.get("srs", {}),
    schedule(word, ok) {
      const all = srs.all();
      const e = all[word] || { lvl: -1, due: 0 };
      e.lvl = ok ? Math.min(e.lvl + 1, INTERVALS.length - 1) : Math.max(e.lvl - 1, 0);
      e.due = Date.now() + (ok ? INTERVALS[e.lvl] * 864e5 : 10 * 60e3);
      all[word] = e;
      st.set("srs", all);
    },
    due() { const now = Date.now(); return Object.entries(srs.all()).filter(([, e]) => e.due <= now).map(([w]) => w); },
  };

  // ---------- dictionary: IPA + recorded human audio ----------
  const dictCache = st.get("dict", {});
  async function lookup(word) {
    const w = word.toLowerCase().replace(/[^a-z'-]/g, "");
    if (!w) return null;
    if (dictCache[w] !== undefined) return dictCache[w];
    try {
      const res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(w));
      if (!res.ok) { dictCache[w] = null; return null; }
      const data = await res.json();
      const ph = data.flatMap((e) => e.phonetics || []);
      const ipa = (data[0] && data[0].phonetic) || (ph.find((p) => p.text) || {}).text || "";
      const audio = {};
      ph.forEach((p) => {
        if (!p.audio) return;
        const tag = /-uk\.mp3$/.test(p.audio) ? "uk" : /-us\.mp3$/.test(p.audio) ? "us" : /-au\.mp3$/.test(p.audio) ? "au" : "other";
        audio[tag] = audio[tag] || p.audio;
      });
      const out = { ipa, audio };
      dictCache[w] = out;
      const keys = Object.keys(dictCache);
      if (keys.length > 400) keys.slice(0, 100).forEach((k) => delete dictCache[k]);
      st.set("dict", dictCache);
      return out;
    } catch { return null; } // offline: just skip
  }
  function pickAudio(info) {
    if (!info || !info.audio) return null;
    const lang = (AC.currentVoice && AC.currentVoice() && AC.currentVoice().lang) || "en-US";
    const pref = /GB|IE/i.test(lang) ? ["uk", "us", "au", "other"] : /AU|NZ/i.test(lang) ? ["au", "uk", "us", "other"] : ["us", "uk", "au", "other"];
    for (const k of pref) if (info.audio[k]) return info.audio[k];
    return null;
  }
  function playHuman(url) { const a = new Audio(url); a.play().catch(() => {}); }

  // Renders "word /ipa/ [🎙️ Real voice]" into a container.
  async function showWordInfo(word, el) {
    if (!el) return;
    el.hidden = false;
    el.innerHTML = `<b>${esc(word)}</b> <span class="ipa">…</span>`;
    const info = await lookup(word);
    if (el.firstChild && el.querySelector("b").textContent !== word) return; // a newer tap replaced it
    const url = pickAudio(info);
    el.innerHTML = `<b>${esc(word)}</b> <span class="ipa">${info && info.ipa ? esc(info.ipa) : ""}</span>` +
      (url ? ` <button class="chip-btn" type="button">🎙️ Real voice</button>` : "") +
      (!info ? ` <span class="hint">Tap again to hear it</span>` : "");
    const b = el.querySelector("button");
    if (b) b.onclick = () => playHuman(url);
  }

  // ---------- Today tab ----------
  function streak() {
    const days = new Set(st.get("progress", { days: [] }).days);
    let n = 0;
    const d = new Date();
    if (!days.has(dayKey(d))) d.setDate(d.getDate() - 1);
    while (days.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function wordOfDay() {
    const all = (window.VOCAB_DATA || []).flatMap((t) => t.words.map((w) => ({ ...w, topic: t.id })));
    if (!all.length) return null;
    const n = Math.floor(Date.now() / 864e5);
    return all[(n * 7) % all.length];
  }

  function renderToday() {
    const root = $("tab-today");
    if (!root) return;
    const t = today(), g = goal();
    const h = new Date().getHours();
    $("tGreeting").textContent = h < 12 ? "Good morning 👋" : h < 18 ? "Good afternoon 👋" : "Good evening 👋";
    const pct = Math.min(100, Math.round((t.xp / g) * 100));
    $("tRing").style.setProperty("--p", pct);
    $("tXP").textContent = t.xp;
    $("tGoal").textContent = `of ${g} XP`;
    $("tStreak").textContent = streak();
    $("tTotal").textContent = st.get("xpTotal", 0);
    $("tGoalMsg").textContent = t.goalHit ? "Goal reached, great work! 🎉" : `${g - t.xp} XP to your daily goal`;

    const plan = $("tPlan");
    plan.innerHTML = "";
    PLAN.forEach((p) => {
      const n = Math.min(t[p.kind] || 0, p.target);
      const done = n >= p.target;
      const b = document.createElement("button");
      b.className = "plan-item" + (done ? " done" : "");
      b.innerHTML = `<span class="plan-icon">${done ? "✓" : p.icon}</span>
        <span class="plan-text"><b>${p.title}</b><small>${p.sub}</small>
        <span class="mini-bar"><i style="width:${(n / p.target) * 100}%"></i></span></span>
        <span class="plan-count">${n}/${p.target}</span>`;
      b.onclick = () => AC.showTab(p.go);
      plan.append(b);
    });

    const due = srs.due();
    $("tReview").hidden = !due.length;
    $("tReviewCount").textContent = due.length;
    $("tReviewWord").textContent = due.length === 1 ? "word" : "words";

    const w = wordOfDay();
    if (w) {
      $("tWord").textContent = w.w;
      $("tWordDef").textContent = w.def;
      $("tWordPos").textContent = w.pos;
    }
    document.querySelectorAll("#tGoals button").forEach((b) => b.classList.toggle("on", +b.dataset.xp === g));
  }

  function initToday() {
    if (!$("tab-today")) return;
    const box = $("tGoals");
    GOALS.forEach((x) => {
      const b = document.createElement("button");
      b.dataset.xp = x.xp;
      b.innerHTML = `${x.name}<small>${x.xp} XP</small>`;
      b.onclick = () => { st.set("goal", x.xp); const t = today(); t.goalHit = t.xp >= x.xp; st.set("today", t); renderToday(); };
      box.append(b);
    });
    $("tReviewBtn").onclick = () => AC.openVocabReview && AC.openVocabReview();
    $("tWordListen").onclick = () => { const w = wordOfDay(); if (w) AC.speak(w.w, 0.8); };
    $("tWordGo").onclick = () => { const w = wordOfDay(); if (w && AC.openVocabWord) AC.openVocabWord(w.w); };
    $("tGoalEdit").onclick = () => { box.hidden = !box.hidden; };
    renderToday();
  }
  document.addEventListener("ac:tab", (e) => { if (e.detail === "today") renderToday(); });
  document.addEventListener("ac:reset", () => {
    st.set("today", null); st.set("xpTotal", 0); st.set("srs", {}); renderToday();
  });

  Object.assign(AC, { addXP, toast, srs, lookup, pickAudio, playHuman, showWordInfo, renderToday, dayKey });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initToday);
  else initToday();
})();

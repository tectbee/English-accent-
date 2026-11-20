(() => {
  "use strict";
  const D = window.ACCENT_DATA;
  const $ = (id) => document.getElementById(id);
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;
  const buzz = (k) => window.haptic && window.haptic(k);

  // ---------- storage ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem("ac:" + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem("ac:" + k, JSON.stringify(v)); } catch {} },
  };
  let progress = store.get("progress", { attempts: 0, total: 0, misses: {}, history: [], days: [] });
  const save = () => store.set("progress", progress);

  // ---------- support check ----------
  const problems = [];
  if (!synth) problems.push("text-to-speech");
  if (!SR) problems.push("speech recognition (scoring)");
  if (!navigator.mediaDevices || !window.MediaRecorder) problems.push("voice recording");
  if (problems.length) {
    $("support").hidden = false;
    $("support").textContent = "Your browser doesn't support " + problems.join(", ") +
      ". Open this page in Chrome, Edge or Safari for the full experience.";
  }

  // ---------- voices ----------
  const REGION = { US: "American", GB: "British", AU: "Australian", CA: "Canadian", IE: "Irish", IN: "Indian", NZ: "New Zealand", ZA: "South African" };
  let voices = [];
  function loadVoices() {
    if (!synth) return;
    voices = synth.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
    const order = (v) => (/US$/i.test(v.lang) ? 0 : /GB$/i.test(v.lang) ? 1 : 2);
    voices.sort((a, b) => order(a) - order(b) || a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
    const sel = $("voice");
    const saved = store.get("voice", null);
    sel.innerHTML = "";
    voices.forEach((v, i) => {
      const region = REGION[v.lang.split(/[-_]/)[1]?.toUpperCase()] || v.lang;
      const o = new Option(`${region} — ${v.name.replace(/^(Microsoft|Google)\s*/, "")}`, i);
      if (v.name === saved) o.selected = true;
      sel.add(o);
    });
    if (!voices.length) sel.add(new Option("Browser default voice", -1));
  }
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }
  $("voice").onchange = () => { const v = currentVoice(); if (v) store.set("voice", v.name); };
  const currentVoice = () => voices[+$("voice").value];
  const lang = () => (currentVoice()?.lang || "en-US").replace("_", "-");

  const rateEl = $("rate");
  rateEl.value = store.get("rate", 0.9);
  const showRate = () => ($("rateVal").textContent = (+rateEl.value).toFixed(2).replace(/0$/, "") + "×");
  rateEl.oninput = () => { showRate(); store.set("rate", +rateEl.value); };
  showRate();

  function speak(text, rate) {
    return new Promise((resolve) => {
      if (!synth) return resolve();
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = currentVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      u.rate = rate || +rateEl.value;
      u.onend = u.onerror = () => resolve();
      synth.speak(u);
    });
  }

  // ---------- recording + recognition ----------
  let micStream = null;
  async function getMic() {
    if (micStream) return micStream;
    micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
    return micStream;
  }

  let active = null; // currently running capture, so a second click stops it
  /** Records audio and runs recognition together. Resolves {alts:[{text,conf}], blob}. */
  async function capture(button) {
    if (active) { active.stop(); return null; }
    if (synth) synth.cancel();
    const lbl = button.querySelector(".lbl") || button; // keep icons inside the button
    const label = lbl.textContent;
    let recorder = null, chunks = [];
    try {
      const stream = await getMic();
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      recorder.start();
    } catch (e) {
      if (!SR) { alert("Microphone access is needed to record your voice."); return null; }
    }
    lbl.textContent = button.dataset.stop || "■ Stop";
    button.classList.add("live");

    let stopRecog;
    const manualStop = new Promise((res) => (stopRecog = res));
    active = { stop() { if (this.recognizer) this.recognizer.stop(); else stopRecog([]); } };

    const recog = new Promise((resolve) => {
      if (!SR) return; // recording only: the user stops manually
      const r = new SR();
      r.lang = lang();
      r.interimResults = false;
      r.continuous = false; // ends by itself when you stop talking
      r.maxAlternatives = 5;
      const finals = [];
      r.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finals.push(Array.from(e.results[i]).map((a) => ({ text: a.transcript, conf: a.confidence })));
        }
      };
      r.onerror = (e) => { if (e.error === "not-allowed") alert("Please allow microphone access to check your pronunciation."); };
      r.onend = () => resolve(combine(finals));
      active.recognizer = r;
      r.start();
    });

    const alts = await Promise.race([recog, manualStop]);
    active = null;
    lbl.textContent = label;
    button.classList.remove("live");

    let blob = null;
    if (recorder && recorder.state !== "inactive") {
      await new Promise((res) => { recorder.onstop = res; recorder.stop(); });
      blob = new Blob(chunks, { type: recorder.mimeType });
    }
    return { alts, blob };
  }

  // Merge several final result chunks into full-utterance alternatives.
  function combine(finals) {
    if (!finals.length) return [];
    if (finals.length === 1) return finals[0];
    const best = finals.map((f) => f[0].text.trim()).join(" ");
    const out = [{ text: best, conf: avg(finals.map((f) => f[0].conf)) }];
    // build variants by swapping in each chunk's alternatives
    finals.forEach((f, i) => f.slice(1).forEach((alt) => {
      out.push({ text: finals.map((g, j) => (j === i ? alt.text : g[0].text).trim()).join(" "), conf: alt.conf });
    }));
    return out;
  }
  const avg = (a) => a.reduce((s, x) => s + (x || 0), 0) / (a.length || 1);

  // ---------- text comparison ----------
  const ONES = ["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"];
  const TENS = ["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"];
  function numWords(n) {
    if (n < 20) return ONES[n];
    if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
    if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numWords(n % 100) : "");
    if (n < 1e6) return numWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + numWords(n % 1000) : "");
    return String(n);
  }
  function words(text) {
    return text.toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/(\d+)(st|nd|rd|th)\b/g, "$1")
      .replace(/\d[\d,]*/g, (m) => " " + numWords(parseInt(m.replace(/,/g, ""), 10)) + " ")
      .replace(/[-–—]/g, " ")
      .replace(/[^a-z' ]/g, " ")
      .split(/\s+/)
      .map((w) => w.replace(/^'+|'+$/g, ""))
      .filter(Boolean);
  }

  /** LCS alignment. Returns per-target-word match flags plus substitutions. */
  function align(target, heard) {
    const n = target.length, m = heard.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        dp[i][j] = target[i] === heard[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const ok = new Array(n).fill(false), subs = [];
    let i = 0, j = 0, gapT = [], gapH = [];
    const flush = () => {
      if (gapT.length && gapH.length) subs.push({ said: gapH.join(" "), want: gapT.join(" ") });
      gapT = []; gapH = [];
    };
    while (i < n && j < m) {
      if (target[i] === heard[j]) { flush(); ok[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) gapT.push(target[i++]);
      else gapH.push(heard[j++]);
    }
    while (i < n) gapT.push(target[i++]);
    while (j < m) gapH.push(heard[j++]);
    flush();
    return { ok, subs, score: n ? Math.round((ok.filter(Boolean).length / n) * 100) : 0 };
  }

  // Score against the recogniser's top guess only: lower-ranked alternatives
  // often "fix" mispronounced words, which would hide exactly the errors we want to catch.
  function bestMatch(targetText, alts) {
    const t = words(targetText);
    const r = align(t, words(alts[0].text));
    return { target: t, heard: alts[0].text, conf: alts[0].conf, ...r };
  }

  // Hint at the sound behind a mistake.
  function soundHint(word) {
    const w = word.toLowerCase();
    const pick = (id) => D.sounds.find((s) => s.id === id);
    if (/th/.test(w)) return pick("th");
    if (/[vw]/.test(w)) return pick("v-w");
    if (/[rl]/.test(w) && !/^[^rl]*$/.test(w) && /r.*l|l.*r|^r|^l|[^aeiou][rl]/.test(w)) return pick("r-l");
    if (/(ed|ts|ds|ks|ps|st|sk)$/.test(w)) return pick("final");
    if (/(ee|ea|ie)[^aeiou]|^[^aeiou]+i[^aeiou]+$/.test(w)) return pick("ih-ee");
    if (/f/.test(w)) return pick("p-b");
    if (/^[pbf]/.test(w)) return pick("p-b");
    return null;
  }

  // ---------- progress ----------
  function record(text, score, missed, hit) {
    progress.attempts++;
    progress.total += score;
    missed.forEach((w) => (progress.misses[w] = (progress.misses[w] || 0) + 1));
    hit.forEach((w) => {
      if (progress.misses[w]) { progress.misses[w]--; if (!progress.misses[w]) delete progress.misses[w]; }
    });
    progress.history.unshift({ text, score, at: Date.now() });
    progress.history = progress.history.slice(0, 40);
    const today = new Date().toISOString().slice(0, 10);
    if (!progress.days.includes(today)) progress.days.push(today);
    progress.days = progress.days.slice(-400);
    save();
  }
  function streak() {
    const set = new Set(progress.days);
    let n = 0;
    const d = new Date();
    if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
    while (set.has(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  const troubleWords = () => Object.entries(progress.misses).sort((a, b) => b[1] - a[1]).map(([w]) => w);

  // ---------- SPEAK tab ----------
  let idx = 0, myAudioUrl = null;
  const list = () => {
    const s = $("source").value;
    if (s === "words") return D.words;
    if (s === "review") return troubleWords().length ? troubleWords() : ["No trouble words yet — practise some sentences first!"];
    if (s === "custom") return [$("custom").value.trim() || "Type your own text above."];
    return D.sentences;
  };
  const targetText = () => { const l = list(); return l[((idx % l.length) + l.length) % l.length]; };

  function renderTarget(marks) {
    const el = $("target");
    el.innerHTML = "";
    const tokens = targetText().split(/(\s+)/);
    let wi = 0;
    tokens.forEach((tok) => {
      if (/^\s+$/.test(tok) || !tok) { el.append(tok); return; }
      const span = document.createElement("span");
      span.className = "w";
      span.textContent = tok;
      // a token like "thirty-three" maps to several normalised words
      const n = words(tok).length;
      if (marks && n) {
        const flags = marks.slice(wi, wi + n);
        span.classList.add(flags.every(Boolean) ? "ok" : "miss");
      }
      wi += n;
      span.onclick = () => speak(tok.replace(/[^\w'’-]/g, ""), Math.min(+rateEl.value, 0.8));
      el.append(span);
    });
  }

  function newTarget() {
    $("result").hidden = true;
    $("playMine").disabled = $("compare").disabled = true;
    renderTarget();
  }

  $("source").onchange = () => {
    idx = 0;
    $("custom").hidden = $("source").value !== "custom";
    newTarget();
  };
  $("custom").oninput = () => newTarget();
  $("prev").onclick = () => { idx--; newTarget(); };
  $("next").onclick = () => { idx++; newTarget(); };
  $("listen").onclick = () => speak(targetText());

  $("record").onclick = async () => {
    const res = await capture($("record"));
    if (!res) return;
    if (res.blob && res.blob.size) {
      if (myAudioUrl) URL.revokeObjectURL(myAudioUrl);
      myAudioUrl = URL.createObjectURL(res.blob);
      $("playMine").disabled = $("compare").disabled = false;
    }
    if (!SR) return;
    showResult(res.alts);
  };

  function showResult(alts) {
    $("result").hidden = false;
    const scoreEl = $("score");
    scoreEl.className = "score";
    scoreEl.style.setProperty("--p", 0);
    if (!alts.length) {
      scoreEl.textContent = "?";
      $("verdict").textContent = "I didn't catch anything.";
      $("heard").textContent = "—";
      $("feedback").textContent = "Speak a little louder and closer to the microphone, then try again.";
      buzz("warn");
      return;
    }
    const text = targetText();
    const r = bestMatch(text, alts);
    renderTarget(r.ok);
    scoreEl.textContent = r.score + "%";
    scoreEl.style.setProperty("--p", r.score);
    scoreEl.classList.add(r.score >= 85 ? "good" : r.score >= 60 ? "mid" : "low");
    buzz(r.score >= 85 ? "success" : r.score >= 60 ? "warn" : "error");
    $("verdict").textContent = r.score === 100 ? "Excellent — every word was clear!" :
      r.score >= 85 ? "Very good — nearly perfect." :
      r.score >= 60 ? "Good effort — a few words were unclear." : "Keep practising — listen again and copy the rhythm.";
    $("heard").textContent = r.heard;

    const missed = r.target.filter((_, i) => !r.ok[i]);
    const hit = r.target.filter((_, i) => r.ok[i]);
    record(text, r.score, [...new Set(missed)], [...new Set(hit)]);

    const fb = $("feedback");
    fb.innerHTML = "";
    r.subs.slice(0, 3).forEach((s) => {
      const p = document.createElement("div");
      p.innerHTML = `You said <b class="bad-t"></b> — it should be <b class="good-t"></b>.`;
      p.querySelector(".bad-t").textContent = `“${s.said}”`;
      p.querySelector(".good-t").textContent = `“${s.want}”`;
      fb.append(p);
    });
    const hints = new Map();
    // a substitution that is a known minimal pair points straight at the sound
    r.subs.forEach(({ said, want }) => {
      const g = D.sounds.find((x) => x.pairs.some((pr) => pr.includes(said) && pr.includes(want)));
      if (g && !hints.has(g.id)) hints.set(g.id, { h: g, w: want });
    });
    missed.forEach((w) => { const h = soundHint(w); if (h && !hints.has(h.id)) hints.set(h.id, { h, w }); });
    [...hints.values()].slice(0, 2).forEach(({ h, w }) => {
      const p = document.createElement("p");
      p.className = "hint";
      p.innerHTML = `<b></b> `;
      p.querySelector("b").textContent = `Tip for “${w}” (${h.name}):`;
      p.append(h.tip + " ");
      const a = document.createElement("button");
      a.className = "ghost"; a.textContent = "Drill this sound ›";
      a.onclick = () => { showTab("sounds"); selectSound(h.id); };
      p.append(a);
      fb.append(p);
    });
    if (missed.length && !r.subs.length && !hints.size)
      fb.append("Tap the red words to hear them on their own, then try the sentence again.");
  }

  const playMine = () => new Promise((res) => {
    if (!myAudioUrl) return res();
    const a = new Audio(myAudioUrl);
    a.onended = a.onerror = res;
    a.play().catch(res);
  });
  $("playMine").onclick = () => playMine();
  $("compare").onclick = async () => { await speak(targetText()); await new Promise((r) => setTimeout(r, 400)); await playMine(); };

  // ---------- SOUNDS tab ----------
  let sound = D.sounds[0], quiz = { n: 0, ok: 0, current: null }, sayIdx = 0, sayList = [];

  function selectSound(id) {
    sound = D.sounds.find((s) => s.id === id) || D.sounds[0];
    store.set("sound", sound.id);
    document.querySelectorAll("#soundChips button").forEach((b) => b.classList.toggle("on", b.dataset.id === sound.id));
    $("soundName").textContent = sound.name;
    $("soundTip").textContent = sound.tip;
    const pairs = $("pairs");
    pairs.innerHTML = "";
    sound.pairs.forEach(([a, b]) => {
      const div = document.createElement("div");
      div.className = "pair";
      [a, b].forEach((w) => {
        const btn = document.createElement("button");
        btn.textContent = w;
        btn.onclick = () => speak(w, 0.75);
        div.append(btn);
      });
      pairs.append(div);
    });
    const ss = $("soundSentences");
    ss.innerHTML = "";
    sound.sentences.forEach((s) => {
      const row = document.createElement("button");
      row.className = "row";
      row.textContent = s;
      const go = document.createElement("span");
      go.textContent = "Practise ›";
      go.className = "hint";
      row.append(go);
      row.onclick = () => {
        $("source").value = "custom";
        $("custom").hidden = false;
        $("custom").value = s;
        idx = 0;
        newTarget();
        showTab("practice");
      };
      ss.append(row);
    });
    quiz = { n: 0, ok: 0, current: null };
    $("quizScore").textContent = "0 / 0";
    $("quizChoices").innerHTML = "";
    $("quizMsg").textContent = "";
    sayList = shuffle(sound.pairs.flat());
    sayIdx = 0;
    showSay();
  }

  D.sounds.forEach((s) => {
    const b = document.createElement("button");
    b.textContent = s.label;
    b.title = s.name;
    b.dataset.id = s.id;
    b.onclick = () => selectSound(s.id);
    $("soundChips").append(b);
  });

  const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  $("quizPlay").onclick = () => {
    if (quiz.current && !quiz.current.done) { speak(quiz.current.word, 0.8); return; } // replay
    const pair = sound.pairs[Math.floor(Math.random() * sound.pairs.length)];
    const word = pair[Math.floor(Math.random() * 2)];
    quiz.current = { pair, word, done: false };
    $("quizMsg").textContent = "";
    $("quizPlay").textContent = "↻ Replay";
    const box = $("quizChoices");
    box.innerHTML = "";
    shuffle(pair).forEach((w) => {
      const b = document.createElement("button");
      b.textContent = w;
      b.onclick = () => {
        if (quiz.current.done) { speak(w, 0.75); return; }
        quiz.current.done = true;
        quiz.n++;
        const right = w === word;
        if (right) quiz.ok++;
        buzz(right ? "success" : "error");
        b.classList.add(right ? "right" : "wrong");
        if (!right) [...box.children].find((x) => x.textContent === word).classList.add("right");
        $("quizMsg").textContent = right ? "Correct! " : `Not quite — it was “${word}”. Tap both words to hear the difference.`;
        $("quizScore").textContent = `${quiz.ok} / ${quiz.n}`;
        $("quizPlay").textContent = "▶ Next word";
      };
      box.append(b);
    });
    speak(word, 0.8);
  };

  function showSay() {
    $("sayWord").textContent = sayList[sayIdx % sayList.length];
    $("sayMsg").textContent = "";
  }
  $("sayNext").onclick = () => { sayIdx++; showSay(); };
  $("sayListen").onclick = () => speak($("sayWord").textContent, 0.75);
  $("sayRecord").onclick = async () => {
    if (!SR) { $("sayMsg").textContent = "Speech recognition isn't available in this browser."; return; }
    const word = $("sayWord").textContent;
    const partner = sound.pairs.find((p) => p.includes(word))?.find((w) => w !== word);
    const res = await capture($("sayRecord"));
    if (!res) return;
    const msg = $("sayMsg");
    if (!res.alts.length) { msg.textContent = "I didn't hear anything — try again."; return; }
    const top = words(res.alts[0].text);
    const anyAlt = res.alts.some((a) => words(a.text).includes(word));
    if (top.includes(word)) {
      msg.innerHTML = `<b class="good-t">Clear!</b> I heard “${escapeHtml(res.alts[0].text)}”.`;
      record(word, 100, [], [word]);
      buzz("success");
    } else if (partner && top.includes(partner)) {
      buzz("error");
      msg.innerHTML = `<b class="bad-t">That sounded like “${escapeHtml(partner)}”.</b> ${escapeHtml(sound.tip)}`;
      record(word, 0, [word], []);
    } else if (anyAlt) {
      msg.innerHTML = `<b>Close.</b> I first heard “${escapeHtml(res.alts[0].text)}”, but “${escapeHtml(word)}” was a possibility. Try it once more, clearly.`;
      record(word, 50, [word], []);
    } else {
      msg.innerHTML = `<b class="bad-t">I heard “${escapeHtml(res.alts[0].text)}”.</b> Listen again and copy the mouth position.`;
      record(word, 0, [word], []);
    }
  };
  const escapeHtml = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- PROGRESS tab ----------
  function renderProgress() {
    $("stAttempts").textContent = progress.attempts;
    $("stAvg").textContent = progress.attempts ? Math.round(progress.total / progress.attempts) + "%" : "–";
    $("stStreak").textContent = streak();
    const tr = $("trouble");
    tr.innerHTML = "";
    const tw = Object.entries(progress.misses).sort((a, b) => b[1] - a[1]).slice(0, 30);
    if (!tw.length) tr.innerHTML = '<p class="hint">Nothing yet — missed words will appear here.</p>';
    tw.forEach(([w, c]) => {
      const b = document.createElement("button");
      b.textContent = w;
      const s = document.createElement("span"); s.className = "count"; s.textContent = "×" + c;
      b.append(s);
      b.onclick = () => {
        $("source").value = "review";
        $("custom").hidden = true;
        idx = troubleWords().indexOf(w);
        newTarget();
        showTab("practice");
      };
      tr.append(b);
    });
    const h = $("history");
    h.innerHTML = "";
    if (!progress.history.length) h.innerHTML = '<p class="hint">No attempts yet.</p>';
    progress.history.slice(0, 15).forEach((e) => {
      const row = document.createElement("div");
      row.className = "row";
      const t = document.createElement("span"); t.textContent = e.text;
      const s = document.createElement("b"); s.textContent = e.score + "%";
      s.className = e.score >= 85 ? "good-t" : e.score < 60 ? "bad-t" : "";
      row.append(t, s);
      h.append(row);
    });
  }
  $("reset").onclick = () => {
    if (!confirm("Clear all your progress?")) return;
    progress = { attempts: 0, total: 0, misses: {}, history: [], days: [] };
    save();
    renderProgress();
  };

  // ---------- tabs ----------
  function showTab(name) {
    document.querySelectorAll(".tabs button").forEach((b) => b.setAttribute("aria-selected", b.dataset.tab === name));
    document.querySelectorAll(".panel").forEach((p) => (p.hidden = p.id !== "tab-" + name));
    $("pageTitle").textContent = { practice: "Speak", sounds: "Sounds", progress: "Progress" }[name];
    if (name === "progress") renderProgress();
    window.scrollTo({ top: 0 });
    store.set("tab", name);
  }
  document.querySelectorAll(".tabs button").forEach((b) => (b.onclick = () => showTab(b.dataset.tab)));

  // ---------- settings sheet ----------
  const sheet = $("settingsSheet");
  $("settingsBtn").onclick = () => {
    sheet.hidden = !sheet.hidden;
    $("settingsBtn").setAttribute("aria-expanded", !sheet.hidden);
  };
  const hapt = $("hapticsToggle");
  if (window.hapticsEnabled) {
    hapt.checked = window.hapticsEnabled.get();
    hapt.onchange = () => window.hapticsEnabled.set(hapt.checked);
  } else hapt.closest("label").hidden = true;
  $("settingsDone").onclick = () => { sheet.hidden = true; $("settingsBtn").setAttribute("aria-expanded", "false"); };

  // ---------- init ----------
  selectSound(store.get("sound", D.sounds[0].id));
  newTarget();
  showTab(store.get("tab", "practice"));
})();

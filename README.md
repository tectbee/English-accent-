# Accent Coach

A browser tool for improving your English pronunciation and accent. It needs no installation, account or server.

## What it does

**Today:** your home screen. It shows a daily XP goal ring (Casual 20 / Regular 40 / Serious 60 / Intense 100), your streak, total XP, a 4-step daily plan (ear training, accent, vocabulary, conversation), words due for review, and a word of the day.

**Talk:** role-play conversations (coffee shop, meeting someone new, directions, hotel, doctor, job interview). Your partner speaks, you answer out loud, and you get a score for each reply. You can use your own words, and if you get stuck the coach suggests a reply. **Challenge mode** hides the suggestions.

**Accent → Sentences:** practise full sentences, tricky words, your own trouble words, or any text you type.
- **Listen:** hear a native model voice (American, British, Australian, Indian… depending on your device), at adjustable speed.
- **Record & check:** say the text. Speech recognition checks each word and marks it green or red, then gives you a score.
- **Feedback:** shows what it heard (e.g. *You said "sink", it should be "think"*), with a mouth-position tip for the sound behind the mistake.
- **My voice / Compare:** play your recording back, or play the model and then your voice one after the other.
- Tap any word to hear it, see its IPA, and play a recording of a real person saying it (from the free dictionaryapi.dev, when online).
- **🐢 My voice slow:** replay your recording at 70% speed. **Shadowing mode:** recording starts as soon as the model finishes.
- A live ring around the mic shows that the microphone hears you.

**Accent → Sounds:** drills for the most common accent problems:
/ɪ/–/iː/ (ship/sheep), TH, V/W, R/L, /æ/–/e/ (bad/bed), word endings and -ed, P/B/F.
- **Ear training:** hear a word and pick which of the minimal pair it was.
- **Say it:** say one word of a pair. If you said the wrong one, the app tells you which word it heard.
- Practice sentences for each sound.

**Vocab:** speaking practice built around new words, in 7 topics (Daily life, Feelings, Food, Travel, Work & study, Opinions, People).
1. Learn the word: meaning, an example, and a 🔊 button to hear it.
2. **Say the word** and the app checks your pronunciation.
3. **Answer a question using the word.** Speak freely and watch your words appear live. You get 1–3 stars and feedback: did you use the word, how many words you said, your speaking speed, filler words (um, uh), and word variety.
4. Two good answers master a word ✓. Words come back for **spaced review** after 1, 3, 7, 14… days.
5. Each word shows its IPA and has a 🎙️ real human recording.

**Progress:** attempts, average score, a daily streak, and a list of the words you miss most. Words drop off the list as you get them right.

## Run it

Open `index.html` in **Chrome, Edge or Safari**. Firefox has no speech recognition, so recording and playback work there but scoring does not.

The microphone works best over `http://localhost` or HTTPS:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Add it to your home screen

Accent Coach is an installable web app: it gets its own icon, opens full-screen and loads offline.
A home-screen install needs HTTPS, so host it first. The free option is **GitHub Pages**: Settings → Pages → *Deploy from a branch* → pick the branch and `/ (root)`. It's then at `https://<user>.github.io/<repo>/`.

- **Android (Chrome):** open the link and tap **Add to home screen** in the banner, or use ⋮ menu → *Install app*.
- **iPhone / iPad (Safari):** tap **Share** → **Add to Home Screen**.
- **Desktop (Chrome / Edge):** click the install icon in the address bar.

## How to practise (10 minutes a day)

1. **Sounds tab:** do the ear-training quiz for one sound until you score 8/10. You can't say a difference you can't hear.
2. **Say it:** say the words in that sound's pairs until the recogniser gets them right.
3. **Speak tab:** Listen → Record → Compare. Copy the model's *rhythm and stress* as well as the individual sounds.
4. Finish with **My trouble words**.

## Notes

- The dictionary lookup sends only the word you tapped to dictionaryapi.dev.
- Scoring uses your browser's speech recogniser (in Chrome, audio goes to Google's speech service). Your recordings and progress are stored only on your device.
- A recogniser checks whether you were *understood*, not whether you sound exactly like a native speaker. A high score means you are clear and intelligible, which is the realistic goal.

## Files

- `index.html`, `style.css`: the page
- `js/app.js`: speech, recording, scoring (word alignment) and progress
- `js/data.js`: practice content. Edit it to add your own sentences, words or minimal pairs.

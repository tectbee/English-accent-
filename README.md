# Accent Coach

A browser tool for improving your English pronunciation and accent. It needs no installation, account or server.

## What it does

**Speak:** practise full sentences, tricky words, your own trouble words, or any text you type.
- **Listen:** hear a native model voice (American, British, Australian, Indian… depending on your device), at adjustable speed.
- **Record & check:** say the text. Speech recognition checks each word and marks it green or red, then gives you a score.
- **Feedback:** shows what it heard (e.g. *You said "sink", it should be "think"*), with a mouth-position tip for the sound behind the mistake.
- **My voice / Compare:** play your recording back, or play the model and then your voice one after the other.
- Tap any word to hear it on its own.

**Sounds:** drills for the most common accent problems:
/ɪ/–/iː/ (ship/sheep), TH, V/W, R/L, /æ/–/e/ (bad/bed), word endings and -ed, P/B/F.
- **Ear training:** hear a word and pick which of the minimal pair it was.
- **Say it:** say one word of a pair. If you said the wrong one, the app tells you which word it heard.
- Practice sentences for each sound.

**Progress:** attempts, average score, a daily streak, and a list of the words you miss most. Words drop off the list as you get them right.

## Run it

Open `index.html` in **Chrome, Edge or Safari**. Firefox has no speech recognition, so recording and playback work there but scoring does not.

The microphone works best over `http://localhost` or HTTPS:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

To use it on your phone, enable **GitHub Pages** for this repository (Settings → Pages → deploy from branch). The app is entirely static.

## How to practise (10 minutes a day)

1. **Sounds tab:** do the ear-training quiz for one sound until you score 8/10. You can't say a difference you can't hear.
2. **Say it:** say the words in that sound's pairs until the recogniser gets them right.
3. **Speak tab:** Listen → Record → Compare. Copy the model's *rhythm and stress* as well as the individual sounds.
4. Finish with **My trouble words**.

## Notes

- Scoring uses your browser's speech recogniser (in Chrome, audio goes to Google's speech service). Your recordings and progress are stored only on your device.
- A recogniser checks whether you were *understood*, not whether you sound exactly like a native speaker. A high score means you are clear and intelligible, which is the realistic goal.

## Files

- `index.html`, `style.css`: the page
- `js/app.js`: speech, recording, scoring (word alignment) and progress
- `js/data.js`: practice content. Edit it to add your own sentences, words or minimal pairs.

// Practice content. Each sound group targets a common accent difficulty.
window.ACCENT_DATA = {
  sounds: [
    {
      id: "ih-ee", label: "/ɪ/ vs /iː/", name: "Short i vs long ee",
      tip: "For /iː/ (sheep) spread your lips like a smile and hold the sound longer. For /ɪ/ (ship) relax your lips and keep it short — your tongue sits slightly lower.",
      pairs: [["ship","sheep"],["sit","seat"],["live","leave"],["fill","feel"],["bit","beat"],["hit","heat"],["chip","cheap"],["slip","sleep"]],
      sentences: ["Please sit in the seat by the window.", "The sheep is on the ship.", "I will leave the place where I live."]
    },
    {
      id: "th", label: "/θ/ /ð/", name: "The TH sounds",
      tip: "Put the tip of your tongue lightly between your teeth and blow air out. /θ/ (think) is voiceless — no vibration. /ð/ (this) is voiced — feel your throat buzz. Don't replace them with t, d, s, z or f.",
      pairs: [["think","sink"],["three","tree"],["thank","tank"],["they","day"],["then","den"],["thin","fin"],["bath","bat"],["mouth","mouse"]],
      sentences: ["I think three thousand is the right number.", "They thanked their mother for the birthday gift.", "This is the thing that I thought about."]
    },
    {
      id: "v-w", label: "/v/ vs /w/", name: "V vs W",
      tip: "For /v/ your top teeth touch your bottom lip and the sound buzzes. For /w/ your lips make a small round circle and do NOT touch your teeth.",
      pairs: [["vest","west"],["vine","wine"],["very","wary"],["vet","wet"],["veil","whale"],["verse","worse"]],
      sentences: ["We have very good wine in the village.", "Victor went west to visit his wife.", "The van was waiting near the wall."]
    },
    {
      id: "r-l", label: "/r/ vs /l/", name: "R vs L",
      tip: "For /l/ touch the tip of your tongue to the ridge behind your top teeth. For /r/ the tongue does NOT touch anything — pull it back and slightly round your lips.",
      pairs: [["right","light"],["rice","lice"],["read","lead"],["road","load"],["pray","play"],["grass","glass"],["fry","fly"],["correct","collect"]],
      sentences: ["Turn right at the red light.", "Really, the library is closed on Thursday.", "Please collect the correct glass."]
    },
    {
      id: "ae-e", label: "/æ/ vs /e/", name: "Cat vs bet",
      tip: "For /æ/ (bad) drop your jaw wide open, like a big yawn. For /e/ (bed) the mouth is only half open.",
      pairs: [["bad","bed"],["man","men"],["sat","set"],["pan","pen"],["had","head"],["band","bend"],["mat","met"]],
      sentences: ["The man had a bad headache.", "Pass me the black pen, please.", "Ten men sat on the bench."]
    },
    {
      id: "final", label: "Endings", name: "Final consonants & -ed",
      tip: "Don't drop the last sound of a word. -ed sounds like /t/ after voiceless sounds (walked), /d/ after voiced (played), and /ɪd/ after t or d (wanted).",
      pairs: [["walk","walked"],["play","played"],["want","wanted"],["cap","cab"],["bag","back"],["price","prize"],["rice","rise"]],
      sentences: ["She walked to work and played tennis.", "He wanted to finish the test first.", "I asked for the best price."]
    },
    {
      id: "p-b", label: "/p/ vs /b/  /f/ vs /p/", name: "P, B and F",
      tip: "/p/ at the start of a word has a puff of air — hold paper in front of your mouth and it should move. /b/ has no puff but buzzes. /f/ uses teeth on the lower lip.",
      pairs: [["pat","bat"],["pear","bear"],["pin","bin"],["fan","pan"],["fork","pork"],["coffee","copy"]],
      sentences: ["Put the paper back in the box.", "Bring a big bottle of fresh apple juice.", "Five people fixed the broken fan."]
    }
  ],
  // Sentences focused on rhythm, linking and intonation
  sentences: [
    "How are you doing today?",
    "Could you tell me the way to the station?",
    "I'd like a cup of coffee, please.",
    "What do you want to do this weekend?",
    "It was nice to meet you.",
    "I'm going to the supermarket after work.",
    "Thank you very much for your help.",
    "Would you mind opening the window?",
    "The weather is beautiful this morning.",
    "I think it's a really good idea.",
    "Can you say that again a little more slowly?",
    "She sells seashells by the seashore.",
    "Peter Piper picked a peck of pickled peppers.",
    "The thirty-three thieves thought that they thrilled the throne throughout Thursday.",
    "Red lorry, yellow lorry."
  ],
  words: [
    "comfortable","vegetable","clothes","world","squirrel","particularly","rural","specific",
    "Wednesday","February","temperature","thoroughly","develop","schedule","colleague",
    "entrepreneur","anxiety","sixth","months","library","choir","mischievous","recipe","island"
  ]
};

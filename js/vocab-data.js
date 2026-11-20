// Vocabulary for speaking practice.
// w: word, pos: part of speech, def: simple meaning, ex: example, q: speaking question,
// forms: extra forms the checker should accept (regular -s/-ed/-ing are added automatically).
window.VOCAB_DATA = [
  {
    id: "daily", name: "Daily life", emoji: "☀️", level: "Beginner",
    words: [
      { w: "routine", pos: "noun", def: "the things you do every day, usually in the same order", ex: "My morning routine is coffee, a shower, then the bus.", q: "What is your morning routine?" },
      { w: "usually", pos: "adverb", def: "most of the time", ex: "I usually eat lunch at one o'clock.", q: "What do you usually do on Sunday?" },
      { w: "prepare", pos: "verb", def: "to make something ready", ex: "She prepares dinner for her family every evening.", q: "How do you prepare for a busy day?" },
      { w: "relax", pos: "verb", def: "to rest and feel calm", ex: "I relax by listening to music.", q: "How do you relax after work or school?" },
      { w: "busy", pos: "adjective", def: "having a lot to do", ex: "Monday is always my busiest day.", q: "Which day of the week is the busiest for you, and why?", forms: ["busier", "busiest"] },
      { w: "comfortable", pos: "adjective", def: "pleasant and relaxing for your body", ex: "This sofa is really comfortable.", q: "Describe the most comfortable place in your home." },
      { w: "habit", pos: "noun", def: "something you do often, without thinking", ex: "Drinking water in the morning is a good habit.", q: "Tell me about one good habit and one bad habit you have." },
      { w: "chore", pos: "noun", def: "a small job you do at home, like cleaning", ex: "Washing the dishes is my least favourite chore.", q: "Which household chore do you hate the most?" }
    ]
  },
  {
    id: "feelings", name: "Feelings", emoji: "💛", level: "Beginner",
    words: [
      { w: "grateful", pos: "adjective", def: "feeling thankful for something", ex: "I'm grateful for my friends.", q: "What are you grateful for today?" },
      { w: "nervous", pos: "adjective", def: "a little afraid or worried before something happens", ex: "I feel nervous before a job interview.", q: "When do you feel nervous?" },
      { w: "proud", pos: "adjective", def: "happy about something you or someone close to you did", ex: "My parents were proud when I graduated.", q: "Tell me about a moment you felt proud.", forms: ["prouder", "proudest"] },
      { w: "disappointed", pos: "adjective", def: "sad because something was not as good as you hoped", ex: "I was disappointed when the concert was cancelled.", q: "Talk about a time you were disappointed." },
      { w: "excited", pos: "adjective", def: "very happy and full of energy about something", ex: "The kids are excited about the holiday.", q: "What are you excited about this month?" },
      { w: "confident", pos: "adjective", def: "sure that you can do something well", ex: "She is confident when she speaks in public.", q: "In which situations do you feel confident?" },
      { w: "worried", pos: "adjective", def: "thinking about problems that might happen", ex: "He's worried about his exam.", q: "What is something people often feel worried about?", forms: ["worry", "worries"] },
      { w: "calm", pos: "adjective", def: "quiet and relaxed, not angry or nervous", ex: "Try to stay calm in an emergency.", q: "What helps you stay calm when you are stressed?", forms: ["calmer", "calmest"] }
    ]
  },
  {
    id: "food", name: "Food", emoji: "🍜", level: "Beginner",
    words: [
      { w: "delicious", pos: "adjective", def: "tasting very good", ex: "This soup is delicious!", q: "What is the most delicious meal you have ever eaten?" },
      { w: "ingredient", pos: "noun", def: "one of the foods you use to make a dish", ex: "The main ingredient is rice.", q: "What ingredients do you need for your favourite dish?" },
      { w: "spicy", pos: "adjective", def: "having a hot, strong taste, like chilli", ex: "I love spicy curry.", q: "Do you like spicy food? Why or why not?", forms: ["spicier", "spiciest"] },
      { w: "recipe", pos: "noun", def: "instructions for cooking a dish", ex: "My grandmother gave me her cake recipe.", q: "Describe a recipe you know how to make." },
      { w: "healthy", pos: "adjective", def: "good for your body", ex: "Fruit is a healthy snack.", q: "What do you do to eat healthy food?", forms: ["healthier", "healthiest"] },
      { w: "meal", pos: "noun", def: "breakfast, lunch or dinner", ex: "Dinner is my biggest meal of the day.", q: "Which meal of the day is most important to you?" },
      { w: "order", pos: "verb", def: "to ask for food in a restaurant or online", ex: "Let's order a pizza tonight.", q: "What do you usually order at a café or restaurant?" },
      { w: "taste", pos: "verb / noun", def: "the flavour of food; to try food", ex: "This tastes like lemon.", q: "Describe the taste of your favourite fruit." }
    ]
  },
  {
    id: "travel", name: "Travel", emoji: "✈️", level: "Intermediate",
    words: [
      { w: "journey", pos: "noun", def: "travelling from one place to another", ex: "The train journey took six hours.", q: "Tell me about a long journey you took." },
      { w: "destination", pos: "noun", def: "the place you are travelling to", ex: "Paris is a popular destination.", q: "What is your dream travel destination?" },
      { w: "explore", pos: "verb", def: "to travel around a place to learn about it", ex: "We explored the old town on foot.", q: "Which city would you like to explore, and why?" },
      { w: "luggage", pos: "noun", def: "the bags you take when you travel", ex: "My luggage was too heavy.", q: "What do you always pack in your luggage?" },
      { w: "delay", pos: "noun / verb", def: "when something happens later than planned", ex: "Our flight had a two-hour delay.", q: "What do you do when your bus or flight has a delay?" },
      { w: "abroad", pos: "adverb", def: "in or to another country", ex: "She wants to study abroad.", q: "Would you like to live abroad? Why?" },
      { w: "souvenir", pos: "noun", def: "something you buy to remember a trip", ex: "I bought a magnet as a souvenir.", q: "What is the best souvenir you have bought or received?" },
      { w: "adventure", pos: "noun", def: "an exciting, unusual experience", ex: "Camping in the mountains was a real adventure.", q: "Describe an adventure you would like to have." }
    ]
  },
  {
    id: "work", name: "Work & study", emoji: "💼", level: "Intermediate",
    words: [
      { w: "deadline", pos: "noun", def: "the time by which you must finish something", ex: "The deadline for the report is Friday.", q: "How do you deal with a tight deadline?" },
      { w: "improve", pos: "verb", def: "to make something better", ex: "I want to improve my English.", q: "What skill do you want to improve this year?" },
      { w: "goal", pos: "noun", def: "something you want to achieve", ex: "My goal is to speak English fluently.", q: "What is one big goal in your life?" },
      { w: "skill", pos: "noun", def: "an ability you learn and practise", ex: "Communication is an important skill.", q: "What skills are important for your job or studies?" },
      { w: "colleague", pos: "noun", def: "a person you work with", ex: "My colleagues are very helpful.", q: "Describe a colleague or classmate you like." },
      { w: "achieve", pos: "verb", def: "to succeed in doing something after effort", ex: "She achieved her dream of becoming a doctor.", q: "What have you achieved that you are happy about?" },
      { w: "schedule", pos: "noun / verb", def: "a plan of when things will happen", ex: "My schedule is full this week.", q: "What does your schedule look like this week?" },
      { w: "responsible", pos: "adjective", def: "having the job of taking care of something", ex: "I'm responsible for the team's training.", q: "What are you responsible for at work or at home?" }
    ]
  },
  {
    id: "opinions", name: "Opinions", emoji: "💬", level: "Intermediate",
    words: [
      { w: "prefer", pos: "verb", def: "to like one thing more than another", ex: "I prefer tea to coffee.", q: "Do you prefer the city or the countryside? Why?", forms: ["preferred", "preferring"] },
      { w: "believe", pos: "verb", def: "to think that something is true", ex: "I believe hard work pays off.", q: "What is something you strongly believe?" },
      { w: "suggest", pos: "verb", def: "to give an idea for someone to consider", ex: "I suggest we leave early.", q: "What would you suggest to someone visiting your city?" },
      { w: "agree", pos: "verb", def: "to have the same opinion", ex: "I agree with you completely.", q: "Do you agree that social media makes people less happy? Explain.", forms: ["agreed", "agrees"] },
      { w: "however", pos: "linking word", def: "used to add a different or opposite idea", ex: "It was raining. However, we went for a walk.", q: "Talk about a good thing and a bad thing about your city, using 'however'." },
      { w: "although", pos: "linking word", def: "even though; despite the fact that", ex: "Although I was tired, I finished my work.", q: "Tell me about something you did although it was difficult." },
      { w: "recommend", pos: "verb", def: "to say that something is good and someone should try it", ex: "I recommend this book to everyone.", q: "What film or book would you recommend, and why?" },
      { w: "advantage", pos: "noun", def: "a good thing that helps you", ex: "One advantage of living here is the beach.", q: "What are the advantages of learning English?" }
    ]
  },
  {
    id: "people", name: "People", emoji: "🤝", level: "Beginner",
    words: [
      { w: "friendly", pos: "adjective", def: "kind and pleasant to other people", ex: "Our new neighbours are very friendly.", q: "Describe the friendliest person you know.", forms: ["friendlier", "friendliest"] },
      { w: "honest", pos: "adjective", def: "always telling the truth", ex: "He is honest, even when it's hard.", q: "Why is it important to be honest with friends?" },
      { w: "generous", pos: "adjective", def: "happy to give money, time or help", ex: "She's generous with her time.", q: "Tell me about a generous person in your life." },
      { w: "patient", pos: "adjective", def: "able to wait or stay calm without getting angry", ex: "Teachers need to be patient.", q: "In which situations is it hard for you to be patient?" },
      { w: "support", pos: "verb / noun", def: "to help someone, especially in a hard time", ex: "My family always supports me.", q: "Who supports you when life is difficult?" },
      { w: "trust", pos: "verb / noun", def: "to believe someone is honest and good", ex: "I trust my best friend completely.", q: "How do you know you can trust someone?" },
      { w: "polite", pos: "adjective", def: "showing good manners and respect", ex: "It's polite to say thank you.", q: "What is polite behaviour in your culture?", forms: ["politely"] },
      { w: "introduce", pos: "verb", def: "to tell someone your name or another person's name for the first time", ex: "Let me introduce my sister.", q: "Introduce yourself in a few sentences." }
    ]
  }
];

// Role-play conversations. Each turn: the partner says `bot`, the learner answers.
// `replies` are model answers; any close match passes. `keys` (optional) are words
// that make a free answer acceptable even if it doesn't match a model reply.
window.TALK_DATA = [
  {
    id: "coffee", title: "At the coffee shop", emoji: "☕", level: "Beginner", partner: "Barista",
    turns: [
      { bot: "Hi there! What can I get for you today?", replies: ["Can I have a cappuccino, please?", "I'd like a large latte, please."], keys: ["coffee", "latte", "cappuccino", "tea", "please"] },
      { bot: "Sure. What size would you like? Small, medium or large?", replies: ["Medium, please.", "A large one, please."], keys: ["small", "medium", "large"] },
      { bot: "Is that for here or to go?", replies: ["For here, please.", "To go, please."], keys: ["here", "go"] },
      { bot: "Would you like anything to eat with that?", replies: ["Yes, a chocolate muffin, please.", "No, thank you. That's all."], keys: ["muffin", "croissant", "cake", "no", "thank"] },
      { bot: "Great. That's four fifty. How would you like to pay?", replies: ["By card, please.", "Can I pay in cash?"], keys: ["card", "cash", "pay"] },
    ],
  },
  {
    id: "friend", title: "Meeting someone new", emoji: "👋", level: "Beginner", partner: "Alex",
    turns: [
      { bot: "Hi! I don't think we've met. I'm Alex.", replies: ["Nice to meet you, Alex. I'm Sam.", "Hi Alex, my name is Sam. Nice to meet you."], keys: ["nice", "meet", "name", "i'm"] },
      { bot: "So, where are you from?", replies: ["I'm from India.", "I come from a small town near the sea."], keys: ["from", "live"] },
      { bot: "Oh, cool! What do you do?", replies: ["I'm a software engineer.", "I'm a student. I study business."], keys: ["work", "student", "study", "job", "i'm"] },
      { bot: "What do you like to do in your free time?", replies: ["I like playing football and watching movies.", "I enjoy reading and cooking."], keys: ["like", "enjoy", "love"] },
      { bot: "That sounds fun! We should hang out sometime.", replies: ["Sure, that would be great!", "I'd love to. Let's exchange numbers."], keys: ["sure", "great", "love", "yes"] },
    ],
  },
  {
    id: "directions", title: "Asking for directions", emoji: "🗺️", level: "Beginner", partner: "Local",
    turns: [
      { bot: "Of course! What are you looking for?", replies: ["I'm looking for the train station.", "How do I get to the train station?"], keys: ["station", "looking", "where", "how"] },
      { bot: "Go straight down this road and turn left at the traffic lights.", replies: ["Straight and then left at the lights. Is it far?", "Okay, turn left at the traffic lights. Is it far from here?"], keys: ["left", "far", "straight"] },
      { bot: "No, it's about a five-minute walk.", replies: ["Great. Is there a bus I can take?", "Perfect, I can walk."], keys: ["walk", "bus", "great", "perfect"] },
      { bot: "You can take the number twelve bus, but walking is faster.", replies: ["Thank you so much for your help!", "Thanks a lot. Have a nice day!"], keys: ["thank", "thanks"] },
    ],
  },
  {
    id: "hotel", title: "Hotel check-in", emoji: "🏨", level: "Intermediate", partner: "Receptionist",
    turns: [
      { bot: "Good evening, welcome to the Grand Hotel. How can I help you?", replies: ["Hi, I have a reservation under the name Sam Lee.", "Good evening. I'd like to check in, please."], keys: ["reservation", "booking", "check"] },
      { bot: "Let me check. Yes, a double room for three nights. Is that correct?", replies: ["Yes, that's correct.", "Actually, I booked it for four nights."], keys: ["yes", "correct", "right", "nights"] },
      { bot: "Could I see your passport, please?", replies: ["Sure, here you are.", "Of course, here it is."], keys: ["here", "sure", "course"] },
      { bot: "Thank you. Breakfast is from seven to ten. Do you have any questions?", replies: ["What time is check-out?", "Is there free Wi-Fi in the room?"], keys: ["time", "wifi", "wi", "fi", "what", "is"] },
      { bot: "Check-out is at eleven, and the Wi-Fi is free. Enjoy your stay!", replies: ["Thank you very much.", "Great, thanks for your help."], keys: ["thank", "thanks"] },
    ],
  },
  {
    id: "doctor", title: "At the doctor's", emoji: "🩺", level: "Intermediate", partner: "Doctor",
    turns: [
      { bot: "Hello, please have a seat. What seems to be the problem?", replies: ["I've had a bad headache for three days.", "I have a sore throat and a fever."], keys: ["headache", "throat", "fever", "pain", "cough", "sick", "hurts"] },
      { bot: "I see. Have you taken any medicine for it?", replies: ["Yes, I took some painkillers, but they didn't help.", "No, I haven't taken anything yet."], keys: ["yes", "no", "took", "medicine", "haven't"] },
      { bot: "Are you sleeping well?", replies: ["Not really. I wake up a lot at night.", "Yes, I sleep about seven hours."], keys: ["sleep", "night", "yes", "not"] },
      { bot: "Okay. I'll give you a prescription. Take one tablet twice a day after meals.", replies: ["Twice a day after meals. How long should I take it?", "Okay, thank you. Should I come back next week?"], keys: ["how", "long", "should", "thank", "twice"] },
    ],
  },
  {
    id: "interview", title: "Job interview", emoji: "💼", level: "Intermediate", partner: "Interviewer",
    turns: [
      { bot: "Thanks for coming in today. Could you tell me a little about yourself?", replies: ["Sure. I'm a marketing graduate with two years of experience in social media.", "Of course. I've worked as a customer service manager for three years."], keys: ["experience", "worked", "years", "graduate", "i'm", "i've"] },
      { bot: "Why do you want to work for our company?", replies: ["I really admire your products, and I want to grow my skills here.", "Your company has a great reputation and I share your values."], keys: ["because", "company", "admire", "want", "skills", "grow"] },
      { bot: "What is your biggest strength?", replies: ["My biggest strength is communication. I work well with people.", "I'm very organised and I always meet deadlines."], keys: ["strength", "good", "organised", "organized", "communication", "work"] },
      { bot: "Tell me about a challenge you faced at work and how you solved it.", replies: ["Once we had a very tight deadline, so I made a clear plan and we finished on time.", "A customer was unhappy, so I listened carefully and found a solution."], keys: ["so", "solved", "deadline", "problem", "customer", "plan"] },
      { bot: "Great. Do you have any questions for us?", replies: ["Yes. What does a typical day look like in this role?", "What are the next steps in the process?"], keys: ["what", "how", "when", "yes", "question"] },
    ],
  },
];

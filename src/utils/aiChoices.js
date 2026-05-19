// Predefined funny/smart response sets for common dilemmas
const presets = {
  sleep: ['😴 Sleep NOW', '📚 Study 1 hour', '🎮 Procrastinate', '😤 Pull all-nighter', '🧃 Chai break first', '🚶 Walk & think'],
  text: ['📱 Text them', '🚫 DON\'T. Trust me.', '⏰ Wait 3 days', '😤 Leave on seen', '🎲 Flip a coin', '🧘 Meditate instead'],
  gym: ['💪 GYM. NO EXCUSES.', '🍟 Skip (just today)', '🚶 Walk instead', '😴 Rest day earned', '🏠 Home workout', '🤷 Samosa wins today'],
  food: ['🍕 Pizza, obviously', '🍔 Burger gang', '🍜 Neither – Biryani', '🥗 Healthy option lol', '🛵 Zomato decide', '🍫 Dessert first'],
  ex: ['📵 Stay peaceful 🙏', '☎️ Call (you\'ll regret)', '🎵 Listen to sad songs', '🧹 Delete the number', '😎 Glow up instead', '👻 Ghost yourself'],
}

const moods = {
  funny: {
    suffix: ['...what could go wrong? 😅', '...your future is watching 👀', '...the algorithm agrees 🤖', '...destiny has spoken 🎱'],
    prefix: ['Obviously...', 'Bro just...', 'Stop overthinking —', 'The universe says:'],
  },
  serious: {
    suffix: ['. Make it count.', '. You\'ve got this.', '. Trust the process.', '. One step at a time.'],
    prefix: ['Your best move:', 'Wisely chosen:', 'The path forward:', 'Strategic decision:'],
  },
  roast: {
    suffix: ['...but let\'s be real, you won\'t.', '...lol as if.', '...nice try though.', '...we both know how this ends.'],
    prefix: ['Fine, go ahead and', 'You\'re really gonna', 'Shockingly, the wheel says', 'Boldly (stupidly):'],
  },
}

const aiExplanations = {
  funny: [
    "Because your future self is already disappointed anyway, so why not?",
    "The stars aligned, the algorithm decided, and honestly so did your mom.",
    "97% of confused people who did this reported mild satisfaction and moderate chaos.",
    "Science says this is correct. Which science? All of them. Probably.",
    "Your gut knew. The wheel confirmed. Your brain is still loading.",
    "This was written in the cosmic code when the Big Bang happened. You're welcome.",
  ],
  serious: [
    "Taking this step aligns with your long-term goals and mental clarity.",
    "The discomfort you feel is resistance — pushing through builds character.",
    "This choice honors your future self more than your current comfort zone.",
    "Consistent small decisions compound into remarkable outcomes over time.",
    "You already knew this answer. The wheel just gave you permission.",
  ],
  roast: [
    "But honestly? You'll scroll TikTok for 40 minutes before attempting this.",
    "Your future self is already writing the apology. Incredible.",
    "Wow. Bold choice from someone who's been 'deciding' for 3 hours.",
    "Cool, and your fifth cup of tea agrees. Very productive Tuesday.",
    "This is peak delusion season and we are LIVING for it.",
  ],
}

const genericOptions = [
  ['Do it now 🚀', 'Sleep on it 😴', 'Ask a friend 👥', 'Flip a coin 🪙', 'Just vibe 🌊', 'Regret later 😬'],
  ['YES, obviously', 'NO, trust me', 'Maybe... idk', 'Let the wheel decide', 'Coffee first ☕', 'Tomorrow me problem'],
  ['Go for it 🔥', 'Absolutely not 🚫', 'One more day', 'Consult astrology 🔮', 'Eat first 🍜', 'Pray about it 🙏'],
  ['Do the scary thing', 'Safe choice exists', 'Wild card 🃏', 'Ask the universe', 'What would Oprah do?', 'YOLO 🎢'],
]

function detectCategory(text) {
  const lower = text.toLowerCase()
  if (lower.includes('sleep') || lower.includes('study') || lower.includes('padh')) return 'sleep'
  if (lower.includes('text') || lower.includes('call') || lower.includes('message') || lower.includes('whatsapp')) return 'text'
  if (lower.includes('gym') || lower.includes('exercise') || lower.includes('workout')) return 'gym'
  if (lower.includes('pizza') || lower.includes('burger') || lower.includes('food') || lower.includes('eat') || lower.includes('samosa')) return 'food'
  if (lower.includes('ex') || lower.includes('boyfriend') || lower.includes('girlfriend') || lower.includes('crush')) return 'ex'
  return null
}

function generateChoicesFallback(dilemma, mode = 'funny', count = 6) {
  const category = detectCategory(dilemma)
  let choices

  if (category && presets[category]) {
    choices = [...presets[category]]
  } else {
    choices = [...genericOptions[Math.floor(Math.random() * genericOptions.length)]]
  }

  // Shuffle
  choices = choices.sort(() => Math.random() - 0.5).slice(0, count)
  return choices
}

function sanitizeChoices(rawChoices, count) {
  const cleaned = rawChoices
    .map(item => String(item).replace(/^[-*\d.\s)]+/, '').trim())
    .filter(Boolean)
  return [...new Set(cleaned)].slice(0, count)
}

function parseChoicesFromResponse(text, count) {
  if (!text) return []

  try {
    const maybeJson = JSON.parse(text)
    if (Array.isArray(maybeJson)) return sanitizeChoices(maybeJson, count)
    if (Array.isArray(maybeJson?.choices)) return sanitizeChoices(maybeJson.choices, count)
  } catch (_) {}

  const lines = text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
  return sanitizeChoices(lines, count)
}

export async function generateChoices(dilemma, mode = 'funny', count = 6) {
  const prompt = [
    `User dilemma: ${dilemma}`,
    `Mode: ${mode}`,
    `Generate exactly ${count} short choice options.`,
    'Return ONLY JSON in this format: {"choices":["option1","option2"]}',
    'No markdown. No explanation. No extra text.',
  ].join('\n')

  const modelCandidates = [
    'qwen2.5:3b-instruct-q4_K_M',
    'qwen2.5:3b-instruct-q4_0',
    'qwen2.5:3b',
  ]

  for (const model of modelCandidates) {
    try {
      const response = await fetch('/api/ollama/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            num_predict: 220,
          },
        }),
      })

      if (!response.ok) continue
      const data = await response.json()
      const parsed = parseChoicesFromResponse(data?.response, count)
      if (parsed.length >= 2) return parsed
    } catch (_) {}
  }

  return generateChoicesFallback(dilemma, mode, count)
}

export function getAIExplanation(choice, mode = 'funny') {
  const pool = aiExplanations[mode] || aiExplanations.funny
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getResultPrefix(mode = 'funny') {
  const pool = moods[mode]?.prefix || moods.funny.prefix
  return pool[Math.floor(Math.random() * pool.length)]
}

export const modeOptions = [
  { id: 'funny', label: '😂 Funny Mode', desc: 'Maximum chaos energy' },
  { id: 'serious', label: '🧘 Serious Mode', desc: 'Thoughtful guidance' },
  { id: 'roast', label: '🔥 Roast Mode', desc: 'Brutal honesty' },
  { id: 'relationship', label: '💕 Relationship', desc: 'Heart matters' },
  { id: 'study', label: '📚 Study Mode', desc: 'Academic pressure' },
]

export const exampleDilemmas = [
  "Should I text her? 📱",
  "Study or sleep? 😴",
  "Gym or samosa? 🏋️",
  "Quit my job or stay? 💼",
  "Call ex or stay peaceful? ☮️",
  "Pizza or biryani? 🍕",
  "Start diet tomorrow? 🥗",
  "Should I say yes? 💍",
]

export const funStats = [
  { stat: "95%", label: "became more confused" },
  { stat: "∞", label: "overthinking hours saved" },
  { stat: "4.2B", label: "decisions made" },
  { stat: "0", label: "regrets (allegedly)" },
]

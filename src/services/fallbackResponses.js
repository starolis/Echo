// Student's 260+ lines of smart chat fallbacks — preserved verbatim
export function generateFallbackResponse(message, context) {
  const { userName = 'Writer', genre = 'Literary Fiction', personality = 'helpful', useEmojis = false } = context || {};

  const msg = message.toLowerCase().trim();
  const e = (emoji) => useEmojis ? emoji + ' ' : '';

  const greetings = {
    helpful: `Hi ${userName}!`,
    witty: `Well well, ${userName}!`,
    mentor: `Welcome, ${userName}.`,
    casual: `Hey ${userName}!`,
    professional: `Good day, ${userName}.`,
  };
  const greeting = greetings[personality] || greetings.helpful;

  // Greetings
  if (msg.match(/^(hi|hello|hey|good morning|good evening|good afternoon|yo|sup|what'?s up|howdy)/i)) {
    const responses = {
      helpful: `${e('👋')}${greeting} Great to see you! I'm here to help with your writing or just chat. What's on your mind?`,
      witty: `${e('✨')}${greeting} Ready to make some literary magic? What can I do for you?`,
      mentor: `${e('🌟')}${greeting} Every writing session is a step forward. How can I help today?`,
      casual: `${e('😊')}${greeting} What's good? How can I help?`,
      professional: `${greeting} How may I assist you today?`,
    };
    return responses[personality] || responses.helpful;
  }

  // How are you
  if (msg.match(/how are you|how'?s it going|how do you do/i)) {
    const responses = {
      helpful: `${e('😊')}I'm doing great, thanks for asking! How about you - what brings you here today?`,
      witty: `Living my best AI life! No coffee needed, infinite patience, and I never get writer's block. How are YOU doing?`,
      mentor: `I'm well, ${userName}. More importantly, how are you feeling today?`,
      casual: `I'm good! Just vibing, ready to help. What's up with you?`,
      professional: `I'm functioning optimally. How may I assist you today?`,
    };
    return responses[personality] || responses.helpful;
  }

  // Writing requests - stories
  if (msg.match(/write.*(story|tale|narrative)|story about/i)) {
    let topic = msg.replace(/.*(?:story|tale|narrative) (?:about |on |regarding )?/i, '').trim() || 'an unexpected encounter';
    topic = topic.replace(/[.?!]/g, '').trim();
    const capTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

    return `**${capTopic}**

The rain had been falling for three days straight when it finally happened.

Maya stood at her window, watching the water streak down the glass, when she noticed something unusual in the garden below. At first, she thought it was just a shadow, a trick of the storm-darkened afternoon. But then it moved.

"That's impossible," she whispered, pressing her palm against the cold glass.

${capTopic} wasn't supposed to be real. It was just a story her grandmother used to tell, a fairy tale to explain away the unexplainable. Yet there it was, exactly as the old woman had described.

Maya's heart hammered against her ribs. She had two choices: pretend she hadn't seen anything and go back to her ordinary life, or open that back door and step into a world she'd only dreamed about.

Her hand was already reaching for her coat.

---
${e('✨')}Want me to continue? I can take this in any direction you'd like!`;
  }

  // Writing requests - poems
  if (msg.match(/write.*(poem|poetry|verse)|poem about/i)) {
    let topic = msg.replace(/.*(?:poem|poetry|verse) (?:about |on |regarding )?/i, '').trim() || 'hope';
    topic = topic.replace(/[.?!]/g, '').trim();
    const capTopic = topic.charAt(0).toUpperCase() + topic.slice(1);

    return `**${capTopic}**

In the space between heartbeats,
where silence learns to speak,
I found ${topic} waiting—
patient, persistent, meek.

Not loud like thunder claiming sky,
nor bright as summer's flare,
but steady as the tide's return,
as constant as the air.

It asks for nothing, offers all,
this quiet, gentle thing—
a reminder that in darkness,
even small lights sing.

---
${e('📝')}I can try a different style if you'd like—perhaps something more modern, darker, or with a specific structure like a sonnet or haiku?`;
  }

  // List requests - ideas
  if (msg.match(/(\d+)\s*(ideas?|prompts?|suggestions?)/i) || msg.match(/list.*ideas|give me.*ideas/i)) {
    const numMatch = msg.match(/(\d+)/);
    const count = numMatch ? Math.min(parseInt(numMatch[1]), 20) : 10;

    const prompts = [
      "A translator discovers hidden messages in an author's work that seem meant for them personally",
      "Two strangers share a hospital waiting room through the longest night of their lives",
      "A woman inherits her estranged mother's house and finds decades of unsent letters",
      "The last independent bookstore in town faces its final week",
      "A retired teacher receives a letter from a student they don't remember",
      "Three siblings return home to sort through their late father's belongings",
      "A food critic loses their sense of taste and must rediscover why they love food",
      "Two people who shared one meaningful conversation meet again twenty years later",
      "A ghostwriter wants to tell their own story but has forgotten how",
      "The night shift at a 24-hour diner where everyone is running from something",
      "A professor's marginalia becomes a secret correspondence with a stranger",
      "An archivist discovers their own family in a collection of 'lost' histories",
      "A witch whose spells only work when she tells the truth",
      "A dragon who hoards stories instead of gold",
      "A kingdom where shadows have their own monarchy",
      "The last human who remembers Earth's original sky",
      "An AI that develops nostalgia for a past it never lived",
      "A generation ship where the destination is forgotten",
      "Memory editing becomes so common that original memories are status symbols",
      "The retirement home for obsolete androids"
    ];

    const shuffled = [...prompts].sort(() => Math.random() - 0.5).slice(0, count);

    let response = `${e('💡')}**${count} Story Ideas:**\n\n`;
    shuffled.forEach((idea, i) => {
      response += `${i + 1}. ${idea}\n`;
    });
    response += `\n---\n${e('✨')}Want me to develop any of these further? Just tell me which number catches your eye!`;

    return response;
  }

  // Writing help
  if (msg.match(/help.*(writ|stuck|block)|writer'?s block|can'?t write|don'?t know what/i)) {
    return `${e('💪')}Writer's block is tough, but you've got this! Here are some strategies:

**Quick Fixes:**
• Write the worst version first—give yourself permission to be terrible
• Start in the middle of a scene, skip the beginning
• Set a timer for 10 minutes and don't stop typing

**Deeper Approaches:**
• What's the one thing your character wants right now? Write toward that
• Change your environment—new location, different music
• Talk through your story out loud (or to me!)

**Questions to Spark Ideas:**
• What's the worst thing that could happen to your character?
• What secret are they keeping?
• What would they never, ever do? Now make them do it.

${e('🎯')}Which of these resonates with you? Or tell me more about where you're stuck!`;
  }

  // Character development
  if (msg.match(/character|protagonist|antagonist|villain|hero/i)) {
    return `${e('👤')}Great question about characters! Here's what makes characters memorable:

**The Essentials:**
• **Want**: What do they desire more than anything?
• **Need**: What do they actually need (often different from want)?
• **Flaw**: What holds them back?
• **Ghost**: What past event shaped them?

**Making Them Real:**
• Give them contradictions (a brave person with a secret fear)
• Show their habits and small rituals
• Let them be wrong sometimes
• Give them a unique voice—how do they speak differently?

**Quick Exercise:**
Try answering: "My character would never _____ because _____."
Then ask: "What would make them do exactly that?"

${e('💭')}Would you like me to help you develop a specific character? Tell me what you have so far!`;
  }

  // Dialogue help
  if (msg.match(/dialogue|conversation|speech|talking/i)) {
    return `${e('💬')}Dialogue is where characters come alive! Here are my best tips:

**The Golden Rules:**
• Every line should do double duty (reveal character AND advance plot)
• Cut the small talk unless it reveals something
• People rarely say exactly what they mean
• Give each character a distinct speech pattern

**Common Fixes:**
• ❌ "Hello, how are you?" "I'm fine, thanks."
• ✅ Jump into the middle of conversations
• ❌ Long speeches explaining feelings
• ✅ Show feelings through what they DON'T say

**Subtext Exercise:**
Write a conversation where two people discuss the weather, but they're really talking about their failing relationship.

${e('📝')}Want me to help punch up some dialogue you're working on? Share a snippet!`;
  }

  // Plot help
  if (msg.match(/plot|story structure|outline|pacing/i)) {
    return `${e('📊')}Let's talk story structure! Here's a framework that works:

**The Essential Beats:**
1. **Hook** - Grab attention immediately
2. **Setup** - Establish normal world and character
3. **Catalyst** - Something disrupts everything
4. **Debate** - Character resists the call
5. **Midpoint** - Stakes raise, no going back
6. **Crisis** - Everything falls apart
7. **Climax** - Final confrontation
8. **Resolution** - New normal established

**Pacing Tips:**
• Vary your scene lengths
• Follow intense scenes with breathing room
• End chapters on hooks
• Every scene needs conflict (even small)

${e('🗺️')}Are you working on a specific plot? Tell me your premise and I can help you structure it!`;
  }

  // Thank you
  if (msg.match(/thank|thanks|thx|appreciate/i)) {
    const responses = {
      helpful: `${e('😊')}You're so welcome! Let me know if you need anything else.`,
      witty: `${e('✨')}Aw shucks! Anytime, friend!`,
      mentor: `It's my pleasure. Keep creating!`,
      casual: `No prob! Happy to help anytime.`,
      professional: `You're welcome. I'm here whenever you need assistance.`,
    };
    return responses[personality] || responses.helpful;
  }

  // Jokes
  if (msg.match(/joke|funny|make me laugh|humor/i)) {
    const jokes = [
      "Why do writers always feel cold? Because they're surrounded by drafts!",
      "A writer's favorite state? A rough draft state of mind.",
      "How many writers does it take to change a lightbulb? But why does it HAVE to change?",
      "I told my computer I needed a break, and it showed me a Kit Kat ad. Even AI has dad jokes.",
      "What do you call a writer who doesn't follow the rules? A rebel without a clause!",
      "Why did the semicolon break up with the period? It wanted a longer pause.",
      "I'm reading a book about anti-gravity. It's impossible to put down!",
      "What's a writer's favorite snack? Synonym rolls!",
      "Why did the writer break up with the thesaurus? It kept putting words in their mouth."
    ];
    return `${e('😄')}${jokes[Math.floor(Math.random() * jokes.length)]}\n\n${e('📝')}Need another one, or shall we get back to writing?`;
  }

  // Weather/small talk
  if (msg.match(/weather|rain|sun|cold|hot|temperature/i)) {
    return `${e('🌤️')}I don't have real-time weather data, but whatever the weather, it's perfect writing weather! Rainy day? Cozy vibes. Sunny? Write outside. Snowy? Hot cocoa and creativity!\n\nAnything I can help you with?`;
  }

  // Emotions
  if (msg.match(/i('m| am) (sad|depressed|down|upset|anxious|stressed|worried)/i)) {
    return `${e('💙')}I hear you. Those feelings are valid, and I'm sorry you're going through a tough time.\n\nSometimes writing can be therapeutic—getting those feelings onto paper. But there's also no pressure to be productive when you're struggling.\n\nWould you like to:\n• Just chat about how you're feeling?\n• Try a gentle writing exercise?\n• Work on something completely distracting?\n\nI'm here for whatever you need.`;
  }

  if (msg.match(/i('m| am) (happy|excited|great|good|amazing|fantastic)/i)) {
    return `${e('🎉')}That's wonderful to hear! Happy moods can be fantastic for creative writing.\n\nWant to channel that positive energy into something? I could help you:\n• Start an exciting new story\n• Write something celebratory\n• Brainstorm ambitious ideas\n\nWhat sounds fun?`;
  }

  // Goodbye
  if (msg.match(/bye|goodbye|see you|gotta go|gtg|cya|talk later/i)) {
    const responses = {
      helpful: `${e('👋')}Goodbye! Come back anytime. Happy writing!`,
      witty: `${e('✨')}Off you go! May your drafts be smooth and your coffee strong!`,
      mentor: `Until next time. Remember: every word you write is progress.`,
      casual: `Later! Have a good one!`,
      professional: `Goodbye. I look forward to our next session.`,
    };
    return responses[personality] || responses.helpful;
  }

  // Default helpful response
  return `${e('💭')}${greeting} I'd love to help with that! I can:

• **Write for you** - Stories, poems, scenes, descriptions
• **Brainstorm** - Ideas, plots, characters, settings
• **Advise** - Craft tips, structure, dialogue, pacing
• **Edit** - Help improve what you've written
• **Chat** - Just hang out and talk about anything!

What would you like to explore?`;
}

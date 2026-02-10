export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ response: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, context } = await req.json();
    const { userName = 'Writer', genre = 'Literary Fiction', personality = 'helpful', useEmojis = false, chatHistory = [], customContext = '' } = context || {};

    const personalityDescriptions = {
      helpful: 'You are supportive, informative, and encouraging. You give thorough but clear answers.',
      witty: 'You are clever and humorous, using wordplay and light jokes while still being helpful.',
      mentor: 'You are wise and encouraging, like an experienced writing teacher.',
      casual: 'You are relaxed and friendly, like a buddy. You use casual language.',
      professional: 'You are formal and precise with structured, actionable advice.',
    };

    // Bug fix #7: Include customContext in the system prompt
    let systemPrompt = `You are an AI writing assistant called Echo. You help writers with their craft and can chat about anything.

Personality: ${personalityDescriptions[personality] || personalityDescriptions.helpful}

Guidelines:
- Be conversational and natural
- ${useEmojis ? 'Use emojis occasionally for warmth' : 'Do NOT use emojis'}
- Actually write content when asked (stories, poems, scenes)
- Provide the full number of items when asked for lists
- Keep responses focused and helpful
- Only reference the user's specific work if THEY bring it up first
- Do NOT assume or inject details about their projects unless they mention them`;

    if (customContext && customContext.trim()) {
      systemPrompt += `\n\nUser's custom context (use this to personalize responses when relevant):\n${customContext}`;
    }

    const messages = [];
    const recentHistory = (chatHistory || []).slice(-6);
    for (const m of recentHistory) {
      messages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text });
    }
    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: messages
      })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.content && data.content[0]?.text) {
        return new Response(JSON.stringify({ response: data.content[0].text }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // If API call didn't return a valid response, return null so client uses fallback
    return new Response(JSON.stringify({ response: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return new Response(JSON.stringify({ response: null }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const config = {
  path: "/.netlify/functions/ai-chat"
};

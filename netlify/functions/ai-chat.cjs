exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers, body: JSON.stringify({ response: null }) };
  }

  try {
    if (!event.body) {
      return { statusCode: 200, headers, body: JSON.stringify({ response: null }) };
    }

    const { message, context } = JSON.parse(event.body);

    if (!message || !message.trim()) {
      return { statusCode: 200, headers, body: JSON.stringify({ response: null }) };
    }

    const { userName = 'Writer', genre = 'Literary Fiction', personality = 'helpful', useEmojis = false, chatHistory = [], customContext = '', quizProfile = null } = context || {};

    const personalityDescriptions = {
      helpful: 'You are supportive, informative, and encouraging. You give thorough but clear answers.',
      witty: 'You are clever and humorous, using wordplay and light jokes while still being helpful.',
      mentor: 'You are wise and encouraging, like an experienced writing teacher.',
      casual: 'You are relaxed and friendly, like a buddy. You use casual language.',
      professional: 'You are formal and precise with structured, actionable advice.',
    };

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

    if (quizProfile) {
      systemPrompt += `\n\nWriter's profile (from their quiz):
- Writer type: ${quizProfile.writerType || 'creative writer'}
- Experience: ${quizProfile.experience || 'intermediate'}
- Preferred genres: ${(quizProfile.preferredGenres || []).join(', ') || 'various'}
- Strengths: ${(quizProfile.strengths || []).join(', ') || 'not specified'}
- Areas to improve: ${(quizProfile.weaknesses || []).join(', ') || 'not specified'}
- Goals: ${(quizProfile.goals || []).join(', ') || 'general improvement'}
Use this profile to personalize your advice, but don't mention the quiz unless asked.`;
    }

    if (customContext && customContext.trim()) {
      systemPrompt += `\n\nUser's custom context (use this to personalize responses when relevant):\n${customContext}`;
    }

    const messages = [];
    const recentHistory = (chatHistory || []).slice(-6);
    for (const m of recentHistory) {
      messages.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text });
    }
    messages.push({ role: 'user', content: message });

    const callAnthropic = async (model) => {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({ model, max_tokens: 1500, system: systemPrompt, messages })
      });
      return res;
    };

    let response = await callAnthropic('claude-sonnet-4-6');
    if (!response.ok) {
      console.log('claude-sonnet-4-6 failed, falling back to claude-sonnet-4-5-20250929');
      response = await callAnthropic('claude-sonnet-4-5-20250929');
    }

    if (response.ok) {
      const data = await response.json();
      if (data.content && data.content[0]?.text) {
        return {
          statusCode: 200, headers,
          body: JSON.stringify({ response: data.content[0].text })
        };
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ response: null }) };

  } catch (error) {
    console.error('AI Chat Error:', error);
    return { statusCode: 200, headers, body: JSON.stringify({ response: null }) };
  }
};

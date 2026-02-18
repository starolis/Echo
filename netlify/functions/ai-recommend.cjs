exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers, body: JSON.stringify({ recommendations: null }) };
  }

  try {
    if (!event.body) {
      return { statusCode: 200, headers, body: JSON.stringify({ recommendations: null }) };
    }

    const { profile } = JSON.parse(event.body);

    if (!profile) {
      return { statusCode: 200, headers, body: JSON.stringify({ recommendations: null }) };
    }

    const systemPrompt = `You are a writing mentor recommending resources to a young writer. Based on their profile, give 5 personalized recommendations. Each recommendation should include:
1. What it is (contest, book, tool, or exercise)
2. Why it's perfect for them specifically
3. A concrete next step they can take

Be encouraging, specific, and reference their actual strengths and goals. Keep each recommendation to 2-3 sentences.`;

    const userMessage = `Here's the writer's profile:
- Writer type: ${profile.writerType || 'creative writer'}
- Experience: ${profile.experience || 'intermediate'}
- Goals: ${(profile.goals || []).join(', ') || 'general improvement'}
- Strengths: ${(profile.strengths || []).join(', ') || 'not specified'}
- Weaknesses: ${(profile.weaknesses || []).join(', ') || 'not specified'}
- Preferred genres: ${(profile.preferredGenres || []).join(', ') || 'various'}
- Writing habits: writes ${profile.writingHabits?.frequency || 'regularly'}, best time: ${profile.writingHabits?.bestTime || 'anytime'}
- Process: ${profile.processStyle || 'flexible'}
- Growth areas: ${(profile.growthAreas || []).join(', ') || 'general'}

Please recommend 5 personalized resources or activities.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.content && data.content[0]?.text) {
        return {
          statusCode: 200, headers,
          body: JSON.stringify({ recommendations: data.content[0].text }),
        };
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ recommendations: null }) };
  } catch (error) {
    console.error('AI Recommend Error:', error);
    return { statusCode: 200, headers, body: JSON.stringify({ recommendations: null }) };
  }
};

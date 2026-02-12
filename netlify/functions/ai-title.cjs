exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 200, headers, body: JSON.stringify({ title: null }) };
  }

  try {
    const { message } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 30,
        system: 'Generate a short, descriptive title (3-6 words) for a chat conversation that starts with this message. Return ONLY the title text, nothing else. No quotes, no punctuation at the end.',
        messages: [{ role: 'user', content: message }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      const title = data.content?.[0]?.text?.trim();
      if (title) {
        return { statusCode: 200, headers, body: JSON.stringify({ title }) };
      }
    }

    return { statusCode: 200, headers, body: JSON.stringify({ title: null }) };

  } catch (error) {
    console.error('AI Title Error:', error);
    return { statusCode: 200, headers, body: JSON.stringify({ title: null }) };
  }
};

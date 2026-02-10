import { generateFallbackResponse } from './fallbackResponses';

/**
 * AI Edit — calls the Netlify Function proxy
 */
export async function performAIEdit(text, toolId, selectedOptions, context = {}) {
  if (!text.trim()) {
    return {
      result: text,
      changes: [],
      feedback: 'Enter some text to edit.',
      error: true
    };
  }

  try {
    const response = await fetch('/.netlify/functions/ai-edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, toolId, selectedOptions, context })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI Edit Error:', error);
    return {
      result: text,
      changes: [],
      feedback: `Error: ${error.message}. The AI editing service may not be configured yet. Please set up your ANTHROPIC_API_KEY in environment variables.`,
      error: true
    };
  }
}

/**
 * AI Chat — calls the Netlify Function proxy, falls back to smart responses
 */
export async function sendChatMessage(message, context) {
  try {
    const response = await fetch('/.netlify/functions/ai-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.response) {
        return data.response;
      }
    }
  } catch (err) {
    console.log('API not available, using smart responses');
  }

  // Smart fallback responses — student's original creative work
  return generateFallbackResponse(message, context);
}

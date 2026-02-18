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
      if (data.apiError) {
        console.warn('AI Chat API error:', data.apiError);
      }
    }
  } catch (err) {
    console.warn('API not available, using smart responses:', err.message);
  }

  // Smart fallback responses — student's original creative work
  return generateFallbackResponse(message, context);
}

/**
 * Generate a descriptive chat title from the first message
 */
export async function generateChatTitle(message) {
  try {
    const response = await fetch('/.netlify/functions/ai-title', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    if (response.ok) {
      const data = await response.json();
      if (data.title) return data.title;
    }
  } catch (err) {
    console.log('Title generation unavailable');
  }

  // Fallback: use first few words of the message
  const words = message.split(/\s+/).slice(0, 6).join(' ');
  return words + (message.split(/\s+/).length > 6 ? '...' : '');
}

/**
 * AI Grade — calls the Netlify Function proxy
 */
export async function performAIGrade(text, rubric, feedbackFormat, context = {}) {
  if (!text.trim()) {
    return {
      overallGrade: null,
      overallScore: null,
      categories: [],
      strengths: [],
      improvements: [],
      summary: 'Enter some text to grade.',
      error: true,
    };
  }

  try {
    const response = await fetch('/.netlify/functions/ai-grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, rubric, feedbackFormat, context }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('AI Grade Error:', error);
    return {
      overallGrade: null,
      overallScore: null,
      categories: [],
      strengths: [],
      improvements: [],
      summary: `Error: ${error.message}. The AI grading service may not be configured yet.`,
      error: true,
    };
  }
}

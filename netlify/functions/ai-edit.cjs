const EDIT_TOOLS = [
  { id: 'enhance', name: 'Enhance' },
  { id: 'shorten', name: 'Shorten' },
  { id: 'expand', name: 'Expand' },
  { id: 'vocabulary', name: 'Vocabulary' },
  { id: 'simplify', name: 'Simplify' },
  { id: 'tone', name: 'Tone' },
  { id: 'grammar', name: 'Grammar' },
  { id: 'flow', name: 'Flow' },
  { id: 'dialogue', name: 'Dialogue' },
];

exports.handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        result: '',
        changes: [],
        feedback: 'API key not configured. Set ANTHROPIC_API_KEY in environment variables.',
        error: true,
      })
    };
  }

  try {
    const { text, toolId, selectedOptions, context = {} } = JSON.parse(event.body);

    if (!text || !text.trim()) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          result: text,
          changes: [],
          feedback: 'Enter some text to edit.',
          error: true,
        })
      };
    }

    const { genre = 'Literary Fiction' } = context;
    const tool = EDIT_TOOLS.find(t => t.id === toolId);
    const wordCount = text.split(/\s+/).filter(w => w).length;

    const optionLabels = (selectedOptions || []).join('\n- ') || 'General improvements';

    let lengthInstruction = '';
    if (selectedOptions?.includes('shorten-25')) lengthInstruction = `Target: ~${Math.round(wordCount * 0.75)} words (reduce by 25%)`;
    else if (selectedOptions?.includes('shorten-50')) lengthInstruction = `Target: ~${Math.round(wordCount * 0.5)} words (reduce by 50%)`;
    else if (selectedOptions?.includes('shorten-75')) lengthInstruction = `Target: ~${Math.round(wordCount * 0.25)} words (reduce by 75%)`;
    else if (selectedOptions?.includes('expand-25')) lengthInstruction = `Target: ~${Math.round(wordCount * 1.25)} words (expand by 25%)`;
    else if (selectedOptions?.includes('expand-50')) lengthInstruction = `Target: ~${Math.round(wordCount * 1.5)} words (expand by 50%)`;
    else if (selectedOptions?.includes('expand-100')) lengthInstruction = `Target: ~${Math.round(wordCount * 2)} words (double length)`;

    let vocabInstruction = '';
    if (selectedOptions?.includes('vocab-simple')) vocabInstruction = 'Use simple, everyday vocabulary suitable for a 5th grade reading level. Avoid complex words.';
    else if (selectedOptions?.includes('vocab-standard')) vocabInstruction = 'Use clear, accessible vocabulary suitable for an 8th grade reading level.';
    else if (selectedOptions?.includes('vocab-advanced')) vocabInstruction = 'Use sophisticated, varied vocabulary suitable for a 12th grade reading level.';
    else if (selectedOptions?.includes('vocab-academic')) vocabInstruction = 'Use scholarly, academic vocabulary with precise terminology.';

    const systemPrompt = `You are a professional editor. Edit the text according to these instructions.

**Tool:** ${tool?.name || toolId}
**Options:**
- ${optionLabels}
${lengthInstruction ? `\n**Length Target:** ${lengthInstruction}` : ''}
${vocabInstruction ? `\n**Vocabulary:** ${vocabInstruction}` : ''}

**Current word count:** ${wordCount} words

**Rules:**
1. Apply ONLY the selected options
2. Preserve the author's voice
3. ${lengthInstruction ? 'Hit the target word count as closely as possible' : 'Make meaningful improvements'}
4. Return JSON format:

{
  "editedText": "The full edited text",
  "changes": [
    { "original": "original phrase", "revised": "new phrase", "reason": "why changed" }
  ],
  "summary": "2-3 sentence summary",
  "stats": { "wordsBefore": ${wordCount}, "wordsAfter": number, "changesCount": number }
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 3000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Edit this text:\n\n${text}` }]
      })
    });

    const data = await response.json();
    const responseText = data.content?.[0]?.text || '';

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          statusCode: 200, headers,
          body: JSON.stringify({
            result: parsed.editedText || text,
            changes: parsed.changes || [],
            feedback: parsed.summary || 'Edits applied.',
            stats: parsed.stats || { wordsBefore: wordCount, wordsAfter: parsed.editedText?.split(/\s+/).filter(w => w).length || 0, changesCount: parsed.changes?.length || 0 },
            error: false
          })
        };
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        result: responseText,
        changes: [],
        feedback: 'Edits applied (detailed changes unavailable).',
        stats: { wordsBefore: wordCount, wordsAfter: responseText.split(/\s+/).filter(w => w).length, changesCount: 0 },
        error: false
      })
    };

  } catch (error) {
    console.error('AI Edit Error:', error);
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        result: '',
        changes: [],
        feedback: `Error: ${error.message}`,
        error: true,
      })
    };
  }
};

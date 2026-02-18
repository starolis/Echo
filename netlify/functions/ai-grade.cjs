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
        overallGrade: null, overallScore: null, categories: [], strengths: [], improvements: [],
        summary: 'API key not configured. Set ANTHROPIC_API_KEY in environment variables.',
        error: true,
      }),
    };
  }

  try {
    const { text, rubric, feedbackFormat = 'report-card', context = {} } = JSON.parse(event.body);

    if (!text || !text.trim()) {
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          overallGrade: null, overallScore: null, categories: [], strengths: [], improvements: [],
          summary: 'Enter some text to grade.', error: true,
        }),
      };
    }

    const { genre = 'Literary Fiction', quizProfile = null } = context;
    const wordCount = text.split(/\s+/).filter(w => w).length;

    // Build rubric criteria section
    let rubricSection;
    if (rubric.type === 'custom') {
      rubricSection = `**Custom Rubric Criteria (provided by the user):**\n${rubric.criteria}`;
    } else {
      const categoryList = rubric.categories.map(c => `- **${c.name}**: ${c.description}`).join('\n');
      rubricSection = `**Rubric: ${rubric.name}**\n${rubric.description}\n\n**Categories:**\n${categoryList}`;
    }

    // Build format instructions
    let formatInstruction;
    if (feedbackFormat === 'written') {
      formatInstruction = `Return feedback as narrative paragraphs organized by category. Do NOT include letter grades or numeric scores. End with an encouraging closing remark.

Return JSON:
{
  "categories": [
    { "name": "Category Name", "feedback": "Detailed paragraph of feedback..." }
  ],
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Suggestion 1", "Suggestion 2"],
  "summary": "Overall encouraging narrative summary paragraph"
}`;
    } else if (feedbackFormat === 'rubric-table') {
      formatInstruction = `Score each criterion on a 1-4 scale:
1 = Beginning (significant issues)
2 = Developing (some issues, making progress)
3 = Proficient (meets expectations)
4 = Advanced (exceeds expectations)

Return JSON:
{
  "overallScore": number (average of all scores, 1-4 scale),
  "categories": [
    { "name": "Category Name", "rubricScore": 1-4, "label": "Beginning|Developing|Proficient|Advanced", "feedback": "Brief note about this criterion" }
  ],
  "strengths": ["Strength 1", "Strength 2"],
  "improvements": ["Suggestion 1", "Suggestion 2"],
  "summary": "Brief overall summary"
}`;
    } else {
      formatInstruction = `Assign an overall letter grade (A+ through F) with a percentage score (0-100), and a letter grade per category.

Return JSON:
{
  "overallGrade": "B+",
  "overallScore": 87,
  "categories": [
    { "name": "Category Name", "grade": "A", "score": 95, "feedback": "Brief feedback for this category" }
  ],
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "improvements": ["Suggestion 1", "Suggestion 2"],
  "summary": "2-3 sentence summary of the writing's quality"
}`;
    }

    // Quiz profile context
    let profileContext = '';
    if (quizProfile) {
      const strengths = quizProfile.strengths?.join(', ') || '';
      const weaknesses = quizProfile.weaknesses?.join(', ') || '';
      if (strengths) profileContext += `\nThe student's known strengths are: ${strengths}.`;
      if (weaknesses) profileContext += `\nAreas they are working on: ${weaknesses}.`;
      profileContext += '\nUse this to personalize your feedback — acknowledge growth in their strengths and provide constructive guidance for their weaker areas.';
    }

    const systemPrompt = `You are a supportive, encouraging writing teacher grading student work. Your audience is young writers (3rd-5th grade workshop level). Be constructive and specific — point out what works well AND what could improve. Never be harsh or discouraging.

**Genre:** ${genre}
**Word count:** ${wordCount} words
${profileContext}

${rubricSection}

**Feedback format:** ${feedbackFormat}

${formatInstruction}

**Rules:**
1. Be encouraging but honest — students learn from specific, actionable feedback
2. Always mention at least 2 things the writer did well
3. Frame improvements as opportunities, not failures
4. Give specific examples from the text when possible
5. Return ONLY valid JSON — no markdown, no text before or after the JSON`;

    const callAnthropic = async (model) => {
      return await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model, max_tokens: 3000, system: systemPrompt,
          messages: [{ role: 'user', content: `Please grade this writing:\n\n${text}` }],
        }),
      });
    };

    let response = await callAnthropic('claude-sonnet-4-6');
    if (!response.ok) {
      console.log('claude-sonnet-4-6 failed for grade, falling back to claude-sonnet-4-5-20250929');
      response = await callAnthropic('claude-sonnet-4-5-20250929');
    }
    if (!response.ok) {
      console.log('claude-sonnet-4-5-20250929 failed for grade, falling back to claude-haiku-4-5-20251001');
      response = await callAnthropic('claude-haiku-4-5-20251001');
    }

    if (!response.ok) {
      const errorBody = await response.text().catch(() => 'Unknown error');
      console.error('Anthropic API error:', response.status, errorBody);
      return {
        statusCode: 200, headers,
        body: JSON.stringify({
          overallGrade: null, overallScore: null, categories: [], strengths: [], improvements: [],
          summary: response.status === 429
            ? 'The AI service is busy. Please wait a moment and try again.'
            : 'The AI grading service encountered an error. Please try again.',
          error: true,
        }),
      };
    }

    const data = await response.json();
    const responseText = data.content?.[0]?.text || '';

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          statusCode: 200, headers,
          body: JSON.stringify({ ...parsed, error: false }),
        };
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
    }

    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        overallGrade: null, overallScore: null, categories: [],
        strengths: [], improvements: [],
        summary: 'Grading completed but results could not be parsed. Please try again.',
        error: true,
      }),
    };
  } catch (error) {
    console.error('AI Grade Error:', error);
    return {
      statusCode: 200, headers,
      body: JSON.stringify({
        overallGrade: null, overallScore: null, categories: [],
        strengths: [], improvements: [],
        summary: `Error: ${error.message}`, error: true,
      }),
    };
  }
};

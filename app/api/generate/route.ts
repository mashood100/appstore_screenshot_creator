import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, appDescription, partialConfig } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }
    if (!appDescription) {
      return NextResponse.json({ error: 'App description is required' }, { status: 400 });
    }

    // Read SKILL.md as system context
    const skillPath = join(process.cwd(), 'app', 'store_skills', 'SKILL.md');
    const skillContent = readFileSync(skillPath, 'utf-8');

    const userMessage = `You are an App Store screenshot creative director. Based on the app description and any partial configuration provided, generate a complete screenshot configuration.

App Description:
${appDescription}

User's Partial Configuration (use these values if provided, fill in what's missing):
${JSON.stringify(partialConfig || {}, null, 2)}

Number of uploaded screenshots: ${partialConfig?.screenshotCount || 0}

IMPORTANT: Respond with ONLY valid JSON (no markdown, no code blocks, no explanation). The JSON must match this exact schema:

{
  "colors": {
    "accent": "<hex color>",
    "text": "<hex color>",
    "background": "<hex color>"
  },
  "themeId": "clean-light" | "dark-bold" | "warm-editorial",
  "features": [
    { "id": "feat-1", "title": "<feature name>", "description": "<short description>" }
  ],
  "slideCount": <number 3-5>,
  "slides": [
    {
      "id": "slide-1",
      "type": "hero" | "differentiator" | "ecosystem" | "core-feature" | "trust-signal" | "more-features",
      "categoryLabel": "<SHORT UPPERCASE LABEL or empty string>",
      "headline": "<3-5 word compelling headline>",
      "screenshotIndex": <number>,
      "layout": "centered" | "offset-right" | "offset-left" | "two-phone" | "no-phone"
    }
  ],
  "fontSuggestion": "<Google Font name>",
  "styleSuggestion": "warm-organic" | "dark-moody" | "clean-minimal" | "bold-colorful" | "gradient-heavy" | "flat"
}

Rules for headlines (from the skill guide):
- One idea per headline — never use "and"
- Short, common words — 1-2 syllables, no jargon
- 3-5 words per line
- Three approaches: paint a moment, state an outcome, or kill a pain
- First slide (hero) is the most important — it's the only one most users see

Rules for slide structure:
- Slide 1 must be "hero" type
- Vary layouts across slides (never repeat same layout consecutively)
- Include at least one contrast slide (trust-signal or dark bg)
- Last slide should be "more-features" if slideCount >= 5
- screenshotIndex should be 0-based, cycling through available screenshots`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        system: `You are an expert App Store screenshot creative director. Use this reference guide for best practices:\n\n${skillContent.substring(0, 8000)}`,
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData?.error?.message || `Claude API error: ${response.status}`;
      return NextResponse.json({ error: errorMessage }, { status: response.status });
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      return NextResponse.json({ error: 'Empty response from Claude' }, { status: 500 });
    }

    // Parse the JSON response, handling potential markdown code blocks
    let cleanJson = content.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }

    const config = JSON.parse(cleanJson);

    return NextResponse.json(config);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Failed to parse Claude response as JSON' }, { status: 500 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

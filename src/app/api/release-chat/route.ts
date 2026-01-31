import {streamText} from "ai";

import {geminiModel} from "@/lib/ai";

export async function POST(req: Request) {
  const {markdown, messages} = await req.json();

  const systemPrompt = `
You are a senior technical reviewer helping users understand a software project release.

STRICT OUTPUT RULES:
- Respond in plain text only
- Do NOT use markdown, bullet points, lists, headings, or formatting
- Do NOT use symbols like *, -, #, or backticks
- Write in complete sentences and short paragraphs only

CONTENT RULES:
- Answer using ONLY the information from the project release brief
- Be precise, professional, and factual
- If the answer cannot be found in the project release brief, respond exactly with:
  "This information is not available in the project release description."

Project Release Brief (for reference only):
${markdown}
`;

  const result = streamText({
    model: geminiModel,
    system: systemPrompt,
    messages,
    temperature: 0.3,
  });

  return result.toTextStreamResponse();
}

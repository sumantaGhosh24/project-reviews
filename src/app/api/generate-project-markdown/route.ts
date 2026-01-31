import {NextResponse} from "next/server";
import {generateText} from "ai";

import {geminiModel} from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const {title, description, category, tags} = await req.json();

    const prompt = `
You are a senior software engineer and technical writer.

Generate a **professional, content-rich project brief in Markdown**.

IMPORTANT OUTPUT RULES:
- DO NOT wrap the output in \`\`\` or specify "markdown"
- DO NOT include the project title as a heading
- Output clean Markdown only

Project Information:
Title: ${title}
Description: ${description}
Category: ${category}
Tags: ${tags.join(", ")}

Required Markdown Structure (follow exactly):

## Overview
Explain what the project does, the problem it solves, and its target users.
Do NOT include links or metadata here.

## Key Features
List meaningful, non-generic features with short explanations.

## Technical Architecture
Clearly describe:
- Frontend
- Backend / Services
- APIs, databases, or integrations
Use confident, professional language.

## Use Cases
Describe realistic, practical scenarios where this project is useful.

## Category
${category}

## Tags
Render each tag as inline code using backticks.
`;

    const result = await generateText({
      model: geminiModel,
      prompt,
      temperature: 0.6,
    });

    let markdown = result.text;

    markdown = markdown.replace(/```markdown|```/g, "").trim();

    return NextResponse.json({markdown});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: "Failed to generate project content"},
      {status: 500}
    );
  }
}

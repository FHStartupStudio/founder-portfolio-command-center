import { openai } from "@workspace/integrations-openai-ai-server";
import type { PortfolioAssistantAnswer, PortfolioSnapshot } from "@workspace/api-zod";
import {
  buildAssistantMessages,
  fallbackAnswer,
  retrievePortfolioContext,
  toAssistantProject,
} from "./portfolio-assistant-retrieval";

export async function answerPortfolioQuestion(
  question: string,
  snapshot: PortfolioSnapshot,
): Promise<PortfolioAssistantAnswer> {
  const context = retrievePortfolioContext(question, snapshot);
  const base = {
    basis: context.basis,
    projects: context.projects.map(toAssistantProject),
    evidence: context.evidence,
  };

  if (context.kind === "unknown" || context.kind === "read-only") {
    return { ...base, answer: fallbackAnswer(context), usedAiInterpretation: false };
  }

  const requiresInterpretation = context.reason.startsWith("Current project fields matched:");
  if (!requiresInterpretation) {
    return { ...base, answer: fallbackAnswer(context), usedAiInterpretation: false };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5.4-mini",
      max_completion_tokens: 8192,
      messages: buildAssistantMessages(question, context),
    });
    const answer = response.choices[0]?.message?.content?.trim();
    if (answer) return { ...base, answer, usedAiInterpretation: true };
  } catch {
    // The deterministic answer keeps the Sheet-backed assistant useful when the model is unavailable.
  }

  return { ...base, answer: fallbackAnswer(context), usedAiInterpretation: false };
}
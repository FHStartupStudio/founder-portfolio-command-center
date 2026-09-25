import { Router, type IRouter } from "express";
import {
  AskPortfolioAssistantBody,
  AskPortfolioAssistantResponse,
  GetPortfolioProjectParams,
  GetPortfolioResponse,
  GetPortfolioProjectResponse,
} from "@workspace/api-zod";
import { getPortfolioSnapshot, getProject } from "../lib/portfolio";
import { answerPortfolioQuestion } from "../lib/portfolio-assistant";

const router: IRouter = Router();

router.get("/portfolio", async (_req, res, next) => {
  try {
    const snapshot = GetPortfolioResponse.parse(await getPortfolioSnapshot());
    res.json(snapshot);
  } catch (error) {
    next(error);
  }
});

router.get("/portfolio/projects/:projectId", async (req, res, next) => {
  try {
    const { projectId } = GetPortfolioProjectParams.parse(req.params);
    const project = await getProject(projectId);
    if (!project) {
      res.status(404).json({ error: "Project not found" });
      return;
    }
    res.json(GetPortfolioProjectResponse.parse(project));
  } catch (error) {
    next(error);
  }
});

router.post("/portfolio/assistant", async (req, res, next): Promise<void> => {
  try {
    const parsed = AskPortfolioAssistantBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const snapshot = await getPortfolioSnapshot();
    const answer = await answerPortfolioQuestion(parsed.data.question, snapshot);
    res.json(AskPortfolioAssistantResponse.parse(answer));
  } catch (error) {
    next(error);
  }
});

export default router;
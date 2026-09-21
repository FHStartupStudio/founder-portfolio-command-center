import { Router, type IRouter } from "express";
import {
  GetPortfolioProjectParams,
  GetPortfolioResponse,
  GetPortfolioProjectResponse,
} from "@workspace/api-zod";
import { getPortfolioSnapshot, getProject } from "../lib/portfolio";

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

export default router;
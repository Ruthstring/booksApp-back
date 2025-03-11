import express from "express";
import { getAIRecommendations } from "../controllers/aiController.js";

const router = express.Router();

router.post("/recommend", getAIRecommendations);

export default router;
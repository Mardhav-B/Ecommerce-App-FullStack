import { Router } from "express";
import { getHeroBanners } from "../controllers/banner.controller";

const router = Router();

router.get("/", getHeroBanners);

export default router;

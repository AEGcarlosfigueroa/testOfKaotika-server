import * as express from "express";
import { getCurrentScrollState } from "../controllers/stateController.ts";
const stateRouter = express.Router();

stateRouter.get("/scrollstate", getCurrentScrollState);

export {stateRouter}
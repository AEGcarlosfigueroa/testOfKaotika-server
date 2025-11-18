import * as express from "express";
import { getCurrentScrollState } from "../controllers/stateController";
const stateRouter = express.Router();

stateRouter.get("/scrollState", getCurrentScrollState);

export {stateRouter}
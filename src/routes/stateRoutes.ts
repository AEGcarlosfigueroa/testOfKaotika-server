import * as express from "express";
import { getCurrentScrollState, getAllStates } from "../controllers/stateController.ts";

const stateRouter = express.Router();

stateRouter.get("/scrollstate", getCurrentScrollState);

stateRouter.get("/all", getAllStates);

export {stateRouter}
import * as express from "express";
const usersRouter = express.Router();

import * as userController from "../controllers/userController.ts";
import { verifyFirebaseToken } from "../middlewares/verifyData.ts";

// Public route — anyone can access
// router.get("/", verifyFirebaseToken, userController.getAllUsers);

usersRouter.get("/email/:playerEmail", verifyFirebaseToken, userController.getPlayerFromDatabaseByEmail);


export {usersRouter}

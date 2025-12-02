import * as express from "express";
import * as userController from "../controllers/userController.ts";
import { verifyFirebaseToken } from "../middlewares/verifyData.ts";

const usersRouter = express.Router();

usersRouter.get("/email/:playerEmail", verifyFirebaseToken, userController.getPlayerFromDatabaseByEmail);

usersRouter.post('/register-token', userController.registerToken)

export {usersRouter}

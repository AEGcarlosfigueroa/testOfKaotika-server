import * as express from "express";
const usersRouter = express.Router();
import * as userController from "../controllers/userController.ts";
// Public route — anyone can access
// router.get("/", verifyFirebaseToken, userController.getAllUsers);
usersRouter.get("/email/:playerEmail", userController.getPlayerFromDatabaseByEmail);
// Protected route — only users with valid ID token and verified email
// router.post("/", verifyFirebaseToken, userController.getAllUsers);
export { usersRouter };

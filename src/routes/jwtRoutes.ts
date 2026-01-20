import * as express from "express";
import * as jwtController from "./../controllers/jwtController.ts";
import * as firebase from "./../middlewares/verifyData.ts";

const jwtRouter = express.Router();

jwtRouter.get("/generateToken/:playerEmail", firebase.verifyFirebaseToken, jwtController.createNewToken);

jwtRouter.get("/refreshToken", jwtController.refreshToken);

export { jwtRouter }
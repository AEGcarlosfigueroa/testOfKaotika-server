import * as express from "express";
import * as artifactController from "./../controllers/artifactController"
const artifactRouter = express.Router();

artifactRouter.get("/all", artifactController.getAllArtifacts);

export {artifactRouter}

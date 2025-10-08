var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as dotenv from 'dotenv';
dotenv.config();
import express from "express";
import pkg from "express";
import * as mongoose from "mongoose";
const mongodbRoute = process.env.MONGODB_URI;
import logger from "morgan";
import { verifyFirebaseToken } from "./middlewares/verifyData.ts";
import { initIoServer } from './ioServer/ioServer.ts';
import { usersRouter } from './routes/userRoutes.ts';
const { Application } = pkg;
const app = express();
app.use(logger("dev"));
const PORT = process.env.PORT || 3000;
initIoServer(app, PORT);
app.use(express.json());
app.use("/api/players", verifyFirebaseToken, usersRouter); // For your MongoDB players
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose.connect(mongodbRoute);
            app.listen(PORT, () => {
                console.log(`API is listening on port ${PORT}`);
            });
            console.log('you are now connected to Mongo');
        }
        catch (error) {
            console.error(`Error to connect to the database: ${error.message}`);
        }
    });
}
start();

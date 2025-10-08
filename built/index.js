var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
require('dotenv').config();
import * as express from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
const mongodbRoute = process.env.MONGODB_URI;
import * as morgan from "morgan";
import { verifyFirebaseToken } from "./middlewares/verifyData";
import { initIoServer } from './ioServer/ioServer';
import { usersRouter } from './routes/userRoutes';
const app = express();
app.use(morgan("dev"));
const PORT = process.env.PORT || 3000;
initIoServer(app, PORT);
app.use(bodyParser.json());
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

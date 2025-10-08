import * as dotenv from 'dotenv'

dotenv.config();
import express from "express";
import pkg from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose"
const mongodbRoute = process.env.MONGODB_URI;
import logger from "morgan";
import { verifyFirebaseToken } from "./middlewares/verifyData.ts";
import { initIoServer } from './ioServer/ioServer.ts';
import { usersRouter } from './routes/userRoutes.ts';

const {Application} = pkg;

const app: Application = express();

app.use(logger("dev"));

const PORT = process.env.PORT || 3000;

initIoServer(app, PORT);

app.use(express.json());

app.use("/api/players", verifyFirebaseToken, usersRouter);     // For your MongoDB players

async function start(){
    try
    {
        await mongoose.connect(mongodbRoute);
        app.listen(PORT, () => {
            console.log(`API is listening on port ${PORT}`);
        });
        console.log('you are now connected to Mongo')
    } 
    catch(error: any)
    {
        console.error(`Error to connect to the database: ${error.message}`);
    }
}
start ();


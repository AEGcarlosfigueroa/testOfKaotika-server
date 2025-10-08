require('dotenv').config();
import * as express from "express"
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose"
const mongodbRoute = process.env.MONGODB_URI;
import * as morgan from "morgan";
import { verifyFirebaseToken } from "./middlewares/verifyData"
import { initIoServer } from './ioServer/ioServer';

import { usersRouter } from './routes/userRoutes';

const app = express();

app.use(morgan("dev"));

const PORT = process.env.PORT || 3000;

initIoServer(app, PORT);

app.use(bodyParser.json());

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


import * as dotenv from 'dotenv';
import fs from 'fs';
import express from "express";
import pkg from "express";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose"
import logger from "morgan";
import { verifyFirebaseToken } from "./middlewares/verifyData.ts";
import { initIoServer } from './ioServer/ioServer.ts';
import { usersRouter } from './routes/userRoutes.ts';
import startMQTT from './mqtt/mqttManager.ts';
import path from 'path';
import { fileURLToPath } from 'url';
import { stateRouter } from './routes/stateRoutes.ts';
import { artifactRouter } from './routes/artifactRoutes.ts';
import cron from "node-cron";
import executeCron from './cron/executeCron.ts';
import { jwtRouter } from './routes/jwtRoutes.ts';
import authenticateToken from './middlewares/verifyJsonWebToken.ts';
dotenv.config();

const mongodbRoute = process.env.MONGODB_URI;

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const mqttOptions = mqttOptionsConfiguration();

const { Application } = pkg;

const app: Application = express();

app.use(logger("dev"));

const PORT = process.env.PORT || 3000;

const cronEnabled = process.env.CRON_ENABLED || "false";

initIoServer(app, PORT);

app.use(express.json());

app.use("/api/players", authenticateToken, usersRouter);     // For your MongoDB players

app.use("/api/states", authenticateToken, stateRouter);

app.use("/api/artifacts", artifactRouter);

app.use("/api/jwt", jwtRouter);

startMQTT(mqttOptions);

function mqttOptionsConfiguration() {
    try {
        return ({
            clientId: clientId,
            rejectUnauthorized: true,
            clean: true,
            ca: fs.readFileSync(path.resolve(__dirname, "../ca.crt")),
            key: fs.readFileSync(path.resolve(__dirname, "../prodserver.key")),
            cert: fs.readFileSync(path.resolve(__dirname, "../tok-server.crt")),
            url: process.env.HIVEMQ_URL
        });
    }
    catch (error) {
        console.log("No certificates found, trying fallback");
        return ({
            url: process.env.HIVEMQ_URL,
            password: process.env.HIVEMQ_PASSWORD,
            user: process.env.HIVEMQ_USER
        });
    }

}

async function start() {
    try {
        await mongoose.connect(mongodbRoute);
        app.listen(PORT, () => {
            console.log(`API is listening on port ${PORT}`);
        });
        console.log('you are now connected to Mongo');

        cron.schedule('15,45 * * * *', () => {
            if (cronEnabled == "true") {
                console.log("cron enabled, running task...");
                executeCron();
            }
            else {
                console.log("cron disabled");
            }
        });
    }
    catch (error: any) {
        console.error(`Error to connect to the database: ${error.message}`);
    }
}
start();


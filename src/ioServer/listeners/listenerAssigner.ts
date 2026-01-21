import { Server, Socket } from "socket.io";
import { getRoleByEmail } from "./../../database/playerRoles.ts";
import { istvanListener } from "./istvanListener.ts";
import { isInTowerListener } from "./isInTowerListener.ts";
import { registerToken } from "./fcmTokenListener.ts";
import scrollCollectedListener from "./scrollCollectedListener.ts";
import scrollDestroyedListener from "./scrollDestroyedListener.ts";
import { coordinateListener } from "./coordinateListener.ts";
import { hallOfSagesListener } from "./hallOfSagesListener.ts";
import { artifactCollectedListener } from "./artifactCollectedListener.ts";
import * as userService from "./../../services/userService.ts"
import { showArtifactsListener } from "./showArtifactsListener.ts";
import { artifactEvaluationListener } from "./artifactEvaluationListener.ts";
import { turnIntoBetrayerListener } from "./turnIntoBetrayerListener.ts";
import { acolyteRestListener } from "./acolyteRestListener.ts";
import { VillanoListener } from "./villanoListener.ts";
import { MortimerListener } from "./mortimerMaladiesListener.ts"
import { MortimerAndAngeloListener } from "./mortimerAndAngeloListener.ts"
import { MortimerStartTrialListener } from "./mortimerStartTrialListener.ts";
import { MortimerRestartTrialListener } from "./MortimerRestartTrialListener";

export async function listenerAssigner(socket: Socket, io: Server) {
    try {
        const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

        const role = getRoleByEmail(player.email);

        console.log("role: " + role);

        registerToken(socket, io);

        hallOfSagesListener(io, socket);

        socket.join("stateTracker");

        switch (role) {
            case "ISTVAN":
                istvanListener(socket, io);
                socket.join("acolyteLocationTracker");
                break;
            case "ACOLITO":
                isInTowerListener(socket, io);
                scrollCollectedListener(socket, io);
                coordinateListener(socket, io);
                artifactCollectedListener(io, socket);
                showArtifactsListener(io, socket);
                turnIntoBetrayerListener(io, socket);
                acolyteRestListener(socket, io);
                socket.join("artifactTracker");
                break;
            case 'MORTIMER':
                scrollDestroyedListener(socket, io);
                artifactEvaluationListener(io, socket);
                MortimerListener(socket, io)
                MortimerAndAngeloListener(socket, io)
                MortimerStartTrialListener(socket, io);
                MortimerRestartTrialListener(socket, io);
                socket.join("acolyteLocationTracker");
                socket.join("artifactTracker");
                break;
            case 'VILLANO':
                VillanoListener(socket, io)
                socket.join("acolyteLocationTracker");
                break;
            default:
                console.error("Invalid role");
                break;
        }
    }
    catch (error) {
        console.log(error);
    }

}
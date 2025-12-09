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
import * as userService from"./../../services/userService.ts"
import { showArtifactsListener } from "./showArtifactsListener.ts";

export async function listenerAssigner(socket: Socket, io: Server)
{
    try
    {
        const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

        const role = getRoleByEmail(player.email);

        console.log("role: " + role);

        registerToken(socket, io);

        hallOfSagesListener(io, socket);

        socket.join("stateTracker");

        switch(role)
        {
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
                socket.join("artifactTracker");
                break;
            case 'MORTIMER':
                scrollDestroyedListener(socket, io);
                artifactCollectedListener(io, socket);
                socket.join("acolyteLocationTracker");
                socket.join("artifactTracker");
                break;
            case 'VILLANO':
                socket.join("acolyteLocationTracker");
                break;
            default:
                console.error("Invalid role");
                break;
        }
    }
    catch(error)
    {
        console.log(error);
    }
    
}
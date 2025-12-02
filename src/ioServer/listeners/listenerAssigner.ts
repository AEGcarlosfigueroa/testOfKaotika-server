import { Server, Socket } from "socket.io";
import { getRoleByEmail } from "./../../database/playerRoles.ts";
import { istvanListener } from "./istvanListener.ts";
import { isInTowerListener } from "./isInTowerListener.ts";
import { registerToken } from "./fcmTokenListener.ts";
import scrollCollectedListener from "./scrollCollectedListener.ts";
import scrollDestroyedListener from "./scrollDestroyedListener.ts";
import { coordinateListener } from "./coordinateListener.ts";
import { hallOfSagesListener } from "./hallOfSagesListener.ts";

import * as userService from"./../../services/userService.ts"

export async function listenerAssigner(socket: Socket, io: Server)
{
    try
    {
        const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

        const role = getRoleByEmail(player.email);

        console.log("role: " + role);

        registerToken(socket, io);
        hallOfSagesListener(io, socket);

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
            break;
            case 'MORTIMER':
            scrollDestroyedListener(socket, io);
            socket.join("acolyteLocationTracker");
            break;
            case 'VILLANO':
            socket.join("acolyteLocationTracker");
            break;
            default:
            break;
        }
    }
    catch(error)
    {
        console.log(error);
    }
    
}
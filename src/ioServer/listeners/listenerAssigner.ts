import { Server, Socket } from "socket.io";
import { getRoleByEmail } from "./../../database/playerRoles.ts";
import { istvanListener } from "./istvanListener.ts";
import { isInTowerListener } from "./isInTowerListener.ts";
import { registerToken } from "./fcmTokenListener.ts"

import * as userService from"./../../services/userService.ts"

export async function listenerAssigner(socket: Socket, io: Server)
{
    try
    {
        const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

        const role = getRoleByEmail(player.email);

        console.log("role: " + role);

        registerToken(socket, io)

        switch(role)
        {
            case "ISTVAN": 
            istvanListener(socket, io);
            break;
            case "ACOLITO":
            isInTowerListener(socket, io);
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
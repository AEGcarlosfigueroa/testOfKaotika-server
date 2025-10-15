import { Server, Socket } from "socket.io";
import { getRoleByEmail } from "./../../database/playerRoles.ts";
import { istvanListener } from "./istvanListener.ts";

import * as userService from"./../../services/userService.ts"

export async function listenerAssigner(socket: Socket, io: Server)
{
    try
    {
        const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

        console.log(player);

        const role = getRoleByEmail(player.email);

        console.log("role: " + role);

        switch(role)
        {
            case "ISTVAN": 
            istvanListener(socket, io);
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
import { Server, Socket } from "socket.io";
import { getRoleByEmail } from "./../../database/playerRoles.ts";
import { istvanListener } from "./istvanListener.ts";

import * as userService from"./../../services/userService.ts"

export async function listenerAssigner(socket: Socket, io: Server)
{
    const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

    const role = getRoleByEmail(player.email);

    switch(role)
    {
        case "ISTVAN": 
        istvanListener(socket, io);
        break;
        default:
        break;
    }
}
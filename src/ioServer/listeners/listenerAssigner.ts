import { Server, Socket } from "socket.io";
import { getRoleByEmail } from "./../../database/playerRoles";
import { istvanListener } from "./istvanListener";

import * as userService from"./../../services/userService"

export async function listenerAssigner(socket: Socket, io: Server)
{
    const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

    console.log(player.email);

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
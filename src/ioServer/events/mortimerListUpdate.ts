import { Server, Socket } from 'socket.io';

import { roles } from '../../database/playerRoles.ts';

import * as userService from"./../../services/userService.ts";

export default async function mortimerListUpdate(io: Server)
{
    console.log("mortimer list updating... ")
    try
    {
        const players = await userService.getAllConnectedPlayers();

        const mortimer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer);

        if(mortimer)
        {
            const mortimerSocketId = mortimer.socketId;

            if(mortimerSocketId)
            {
                io.in(mortimerSocketId).emit("update", players);
            }
        }
    }
    catch(error)
    {
        throw error;
    }
}
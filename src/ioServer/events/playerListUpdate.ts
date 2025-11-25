import { Server, Socket } from 'socket.io';

import { server } from '../ioServer.ts';

import { roles } from '../../database/playerRoles.ts';

import * as userService from"../../services/userService.ts";

export default async function playerListUpdate()
{
    console.log("player list updating... ")
    try
    {
        const players = await userService.getAllConnectedPlayers();
        
        server.in("playerList").emit("update", players);

    }
    catch(error)
    {
        throw error;
    }
}
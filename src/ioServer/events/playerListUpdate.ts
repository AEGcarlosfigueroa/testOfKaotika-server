import { Server, Socket } from 'socket.io';
import { server } from '../ioServer.ts';
import * as userService from"../../services/userService.ts";

export default async function playerListUpdate()
{
    console.log("player list updating... ")
    try
    {
        const connectedPlayers = await userService.getAllConnectedNonTraitorAcolytePlayers();

        const allConnectedPlayers = await userService.getAllConnectedPlayers();

        console.log(allConnectedPlayers);

        server.in("playerList").emit("connectedPlayerUpdate", allConnectedPlayers);
        
        server.in("playerList").emit("update", connectedPlayers);

        const nonBetrayerAcolytes = await userService.getAllNonTraitorAcolytes();

        server.in("acolyteLocationTracker").emit("updateAcolyte", nonBetrayerAcolytes);
    }
    catch(error)
    {
        console.error(error);
    }
}
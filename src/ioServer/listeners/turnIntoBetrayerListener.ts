import {Server, Socket} from 'socket.io';
import playerListUpdate from '../events/playerListUpdate.ts';
import * as userService from "./../../services/userService.ts";
import * as kaotikaService from "./../../services/kaotikaService.ts"

export function turnIntoBetrayerListener(io: Server, socket: Socket)
{
    socket.on("turnIntoBetrayer", async () => {
        try
        {
            console.log("turn into betrayer triggered");
            const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);
            
            if(player.profile.role === 'ACOLITO' && !player.isBetrayer)
            {
                const kaotikaPlayer = await kaotikaService.turnIntoBetrayer(player.email);

                const newPlayer = await userService.updateInsertPlayer(kaotikaPlayer);
            
                socket.emit("authorization", newPlayer);
            
                playerListUpdate();
            }
            else
            {
                socket.emit("authorization", player);
            }
        }
        catch(error)
        {
            console.log(error);
        }
        
    })
}
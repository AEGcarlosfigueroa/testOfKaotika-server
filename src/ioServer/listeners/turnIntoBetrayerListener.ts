import {Server, Socket} from 'socket.io';
import playerListUpdate from '../events/playerListUpdate.ts';

export function turnIntoBetrayerListener(io: Server, socket: Socket)
{
    socket.on("turnIntoBetrayer", async () => {
        
        const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

        if(player.profile.role === 'ACOLITO' && !player.isBetrayer)
        {
            player.isBetrayer = true; //A Kaotika API request will be made here when we have access to it

            await player.save();

            socket.emit("authorization", player);

            playerListUpdate();
        }
    })
}
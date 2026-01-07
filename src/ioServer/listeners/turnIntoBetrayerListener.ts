import {Server, Socket} from 'socket.io';
import playerListUpdate from '../events/playerListUpdate.ts';

export function turnIntoBetrayerListener(io: Server, socket: Socket)
{
    socket.on("turnIntoBetrayer", () => {
        
        const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

        if(player.profile.role === 'ACOLITO' && !player.isBetrayer)
        {
            player.gold += 50000;
            player.isBetrayer = true;

            await player.save();

            socket.emit("authorization", player);

            playerListUpdate();
        }
    })
}
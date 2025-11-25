import { Server, Socket } from "socket.io";
import * as userService from './../../services/userService.ts'

export function hallOfSagesListener(io: Server, socket: Socket)
{
    socket.on("hallOfSages", async(state: string) => {

        console.log("executing hall of sages listener");
        
        const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

        if(!player)
        {
            console.log("no player found");ç
            return;
        }
        
        if(state === 'enter')
        {
            player.isInHallOfSages = true;
            await player.save();
            socket.emit("authorization", player);
        }
        else if(state === "exit")
        {
            player.isInHallOfSages = false;
            await player.save();
            socket.emit("authorization", player);
        }
        else
        {
            console.log("Invalid argument in hall of sages listener");
        }
    })
}
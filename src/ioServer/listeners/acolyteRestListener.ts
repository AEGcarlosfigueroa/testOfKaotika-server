import * as userService from"./../../services/userService.ts"
import { Server, Socket } from "socket.io";
import { register } from "module";
import resistanceRestore from "../../statusTools/resistanceRestore.ts";

export function acolyteRestListener(socket: Socket, io: Server)
{
    socket.on("acolyteRest", async () => {

        try
        {
            console.log("executing acolyte rest...");

            const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

            if(!player)
            {
                console.log("no player found, aborting...");
                return;
            }

            if(player.isBetrayer || player.attributes.resistance <= 30)
            {
                console.log("player is betrayer or has resistance less than 30, aborting...");
                socket.emit("authorization", player);
            }

            await resistanceRestore(player);
            socket.emit("authorization", player);

            console.log("acolyte resistance restored");

        }
        catch(error)
        {
            console.error(error);
        }

    })
}
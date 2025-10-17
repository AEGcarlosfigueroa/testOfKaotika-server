import { Server, Socket } from "socket.io";

import * as userService from"./../../services/userService.ts";

import mortimerListUpdate from "../events/mortimerListUpdate.ts";

function istvanListener(socket: Socket, io: Server)
{
    socket.on("scan", async (email) => {
        try
        {
            console.log("istvanlistener triggered");
            console.log(email)
            
            const player = await userService.getPlayerFromDatabaseByEmail(email);

            let inside = player.isInside;

            inside = !inside;

            player.isInside = inside;

            await player.save();

            const acolyteSocket = await io.in(player.socketId).fetchSockets();

            console.log(acolyteSocket[0].id);

            acolyteSocket[0].emit("authorization", player);


            console.log("enter");

            mortimerListUpdate(io);
        }
        catch(error)
        {
            console.log(error);
        }
    })
}

export { istvanListener }
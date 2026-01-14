import { Server, Socket } from "socket.io";

import * as userService from "./../../services/userService.ts";

import playerListUpdate from "../events/playerListUpdate.ts";

import { deadlyEffects } from "../../../src/globalVariables.ts";
import { ApplyStatusEffect } from "../../statusTools/applyStatusEffect";

function istvanListener(socket: Socket, io: Server) {
    socket.on("scan", async (email) => {
        try {
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

            playerListUpdate();
        }

        catch (error) {
            console.log(error);
        }
    })
    socket.on("curse", async (email) => {

        try
        {
            console.log("curse, from the depts of hell, incoming")

            console.log(email)

            const player = await userService.getPlayerFromDatabaseByEmail(email);

            const cursedApplied = deadlyEffects.ethaziumCurse;

            if (!player.statusEffects.includes(cursedApplied)) {

                player.statusEffects.push(cursedApplied);

                ApplyStatusEffect(player, cursedApplied);
            }
            await player.save();

            if(player.socketId !== null)
            {
                io.in(player.socketId).emit("authorization", player);
            }

            socket.emit("confirmation", "ok");

            playerListUpdate();
        }
        catch(error)
        {
            console.error(error);
        }

        

    })
}

export { istvanListener }
import { Server, Socket } from "socket.io";

import * as userService from "./../../services/userService.ts";

import playerListUpdate from "../events/playerListUpdate.ts";

import { deadlyEffects } from "../../../src/globalVariables.ts";

import { ApplyStatusEffect } from "../../statusTools/applyStatusEffect.ts"

function VillanoListener(socket: Socket, io: Server) {

    socket.on("disease", async (email: string, disease: string) => {
        try
        {
            console.log("player about to get infected")

            const player = await userService.getPlayerFromDatabaseByEmail(email)

            // const diseaseApplied = deadlyEffects.disease

            await ApplyStatusEffect(player, disease)

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


export { VillanoListener }

// (SERVER) add a function that applies Ethazium Curse and apply its effect to statusEffects array and changes attributes to the Player object given
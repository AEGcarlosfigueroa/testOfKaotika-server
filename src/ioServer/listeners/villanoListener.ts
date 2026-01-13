import { Server, Socket } from "socket.io";

import * as userService from "./../../services/userService.ts";

import playerListUpdate from "../events/playerListUpdate.ts";

import { deadlyEffects } from "../../../src/globalVariables.ts";

import { ApplyStatusEffect } from "../../statusTools/applyStatusEffect.ts"

function villanoListener(socket: Socket, io: Server) {

    socket.on("disease", async (email: string, disease: string) => {
        console.log("player about to get infected")

        const player = await userService.getPlayerFromDatabaseByEmail(email)

        // const diseaseApplied = deadlyEffects.disease

        await ApplyStatusEffect(player, disease)

        const acolyteSO = await io.in(player.socketId).fetchSockets();

        console.log(acolyteSO[0].id);

        acolyteSO[0].emit("updated player", player);

        socket.emit("confirmation", "ok")


    })
}


export { villanoListener }

// (SERVER) add a function that applies Ethazium Curse and apply its effect to statusEffects array and changes attributes to the Player object given
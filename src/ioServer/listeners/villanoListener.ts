import { Server, Socket } from "socket.io";

import * as userService from "./../../services/userService.ts";

import playerListUpdate from "../events/playerListUpdate.ts";

import { deadlyEffects } from "../../../src/globalVariables.ts";

import { ApplyStatusEffect } from "../../statusTools/applyStatusEffect.ts"

function villanoListener(socket: Socket, io: Server) {

    socket.on("disease", async (email: String, disease: String) => {
        console.log("player about to get infected")

        const player = userService.getPlayerFromDatabaseByEmail(email)

        const diseaseApplied = deadlyEffects.disease

       ApplyStatusEffect(player, diseaseApplied)

    })
}


export { villanoListener }

// (SERVER) add a function that applies Ethazium Curse and apply its effect to statusEffects array and changes attributes to the Player object given
import { Server, Socket } from "socket.io";

import * as userService from "./../../services/userService.ts";

import playerListUpdate from "../events/playerListUpdate.ts";

import { deadlyEffects } from "../../../src/globalVariables.ts";

function villanoListener(socket: Socket, io: Server) {

    socket.on("disease", async (email: String, disease: String) => {
        console.log("player about to get infected")

        const player = userService.getPlayerFromDatabaseByEmail(email)

        const diseaseApplied = deadlyEffects.disease

       ApplyStatusEffect(player)

    })
}

function ApplyStatusEffect(player) {

    if (!player.statusEffects.includes(diseaseApplied)) {

        player.statusEffects.push(diseaseApplied);
    }

    await player.save();

    socket.emit("confirmation", "ok")

    const acolyteSO = await io.in(player.socketId).fetchSockets();

    console.log(acolyteSO[0].id);

    acolyteSO[0].emit("updated player", player);
}

export { villanoListener }
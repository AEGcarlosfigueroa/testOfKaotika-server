import { Server, Socket } from "socket.io";
import * as userService from "./../../services/userService.ts";
import playerListUpdate from "../events/playerListUpdate.ts";
import { deadlyEffects } from "../../../src/globalVariables.ts";
import { ApplyStatusEffect } from "../../statusTools/applyStatusEffect.ts"
import { RevertStatusEffects } from "../../statusTools/revertStatusEffect.ts"

function MortimerListener(socket: Socket, io: Server) {

    socket.on("disease", async (email: string, disease: string) => {

        console.log("healing player")

        const player = await userService.getPlayerFromDatabaseByEmail(email)

        await RevertStatusEffects(player, disease)

        await emitPlayerUpdate(socket, io, player, "player healed");

    })
    socket.on("restore", async (email: string, restore: string) => {

        console.log("restoring player's resistance")

        const player = await userService.getPlayerFromDatabaseByEmail(email)

        if (!player) return;

        if (restore === "resistance") {
            player.attributes.resistance = 100;
            await player.save();
        }

        await emitPlayerUpdate(socket, io, player, "player restored");


    })
}

async function emitPlayerUpdate(socket: Socket, io: Server, player: any, event: string) {

    const sockets = await io.in(player.socketId).fetchSockets();

    if (sockets.length > 0) sockets[0].emit(event, player);
    socket.emit("confirmation", "ok");
}

export { MortimerListener }
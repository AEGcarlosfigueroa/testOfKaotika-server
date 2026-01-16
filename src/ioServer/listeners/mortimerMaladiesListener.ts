import { Server, Socket } from "socket.io";
import * as userService from "./../../services/userService.ts";
import playerListUpdate from "../events/playerListUpdate.ts";
import { deadlyEffects } from "./../../globalVariables.ts";
import { ApplyStatusEffect } from ".././../statusTools/applyStatusEffect.ts"
import { RevertCurse, RevertDiseaseEffects } from "./../../statusTools/revertStatusEffect.ts"
import resistanceRestore from "./../../statusTools/resistanceRestore.ts";

function MortimerListener(socket: Socket, io: Server) {

    socket.on("disease", async (email: string) => {

        console.log(`healing player ${email}`)

        const player = await userService.getPlayerFromDatabaseByEmail(email);

        if(!player) return;

        await RevertDiseaseEffects(player, deadlyEffects.epicWeakness);

        await RevertDiseaseEffects(player, deadlyEffects.medulaApocalypse);

        await RevertDiseaseEffects(player, deadlyEffects.putridPlague);

        await emitPlayerUpdate(socket, io, player, "player healed");

        playerListUpdate();

    });

    socket.on("release", async (email: string, curse: string) => {

        console.log(`cursed is being lifted ${email}`)

        const player = await userService.getPlayerFromDatabaseByEmail(email)

        await RevertCurse(player, curse)

        await emitPlayerUpdate(socket, io, player, "player has been blessed");

        playerListUpdate();

    })
    socket.on("restore", async (email: string, restore: string) => {

        console.log("restoring player's resistance")

        const player = await userService.getPlayerFromDatabaseByEmail(email)

        if (!player) return;

        console.log("player exists");
        console.log(restore);

        if (restore === "resistance") {
            await resistanceRestore(player);
            await player.save();
        }

        await emitPlayerUpdate(socket, io, player, "player restored");

        playerListUpdate();
    })
}

async function emitPlayerUpdate(socket: Socket, io: Server, player: any, event: string) {

    if(player.socketId !== null)
    {
        const sockets = await io.in(player.socketId).emit("authorization", player);
    }

    socket.emit("confirmation", "ok");
}

export { MortimerListener }
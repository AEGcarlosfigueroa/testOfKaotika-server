import { Server, Socket } from "socket.io";
import * as userService from "./../../services/userService.ts";
import playerListUpdate from "./../events/playerListUpdate.ts";
import { angeloStateList, angeloCapturer } from "./../../globalVariables.ts";
import { states } from "./../../globalVariables.ts";

export function AcolytesAndAngeloCapture(socket: Socket, io: Server) {

    socket.on("capture_Angelo", async (email: string, angeloConstant: number) => {

        console.log(`Angelo has being captured by ${email}`);

        const constantNum = Number(angeloConstant);

        const player = userService.getPlayerFromDatabaseByEmail(email)

        if (player.isBetrayer === true) return;

        if (states.angeloState === angeloStateList.angeloFree &&
            constantNum === angeloStateList.angeloCaptured

        ) {
            states.angeloState = angeloStateList.angeloCaptured
            angeloCapturer = player.email

            socket.emit("confirmation", "ok");
            console.log("Angelo state updated to Captured");

        }
        else {
            socket.emit("confirmation", "failed");
            console.warn(
                `Failed to update Angelo: current state ${states.angeloState}, received ${constantNum}`
            );
        }
    });

}
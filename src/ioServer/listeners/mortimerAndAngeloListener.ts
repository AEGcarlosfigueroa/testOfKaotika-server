import { Server, Socket } from "socket.io";
import * as userService from "./../../services/userService.ts";
import playerListUpdate from "./../events/playerListUpdate.ts";
import { angeloStateList } from "./../../globalVariables.ts";
import { states } from "./../../globalVariables.ts";


export function MortimerAndAngeloListener(socket: Socket, io: Server) {
    
    socket.on("accept_Angelo", async (angeloConstant: number) => {
        console.log("Angelo being Delivered to be Imprisoned");

        const constantNum = Number(angeloConstant);

        if (
            states.angeloState === angeloStateList.angeloProcessing &&
            constantNum === angeloStateList.angeloDelivered
        ) {
            states.angeloState = angeloStateList.angeloDelivered;
            socket.emit("confirmation", "ok");
            console.log("Angelo state updated to Delivered");
        } else {
            socket.emit("confirmation", "failed");
            console.warn(
                `Failed to update Angelo: current state ${states.angeloState}, received ${constantNum}`
            );
        }
    });

}
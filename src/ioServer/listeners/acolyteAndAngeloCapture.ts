import { Server, Socket } from "socket.io";
import * as userService from "./../../services/userService.ts";
import playerListUpdate from "./../events/playerListUpdate.ts";
import { angeloStateList } from "./../../globalVariables.ts";
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
            states.angeloCapturer = player.email

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

    socket.on("deliverAngeloToMortimer", async (email: string) => {
        console.log(`Attempt to deliver Angelo by ${email}`);

        const player = await userService.getPlayerFromDatabaseByEmail(email);

        if (!player || player.isBetrayer) {
            socket.emit("confirmation", "failed");
            return;
        }

        // Must be the capturer
        if (states.angeloCapturer !== email) {
            console.warn("Player is not Angelo capturer");
            socket.emit("confirmation", "failed");
            return;
        }

        // Angelo must be captured
        if (states.angeloState !== angeloStateList.angeloCaptured) {
            console.warn("Angelo not in captured state");
            socket.emit("confirmation", "failed");
            return;
        }

        const players = await userService.getAllUsers();

        const mortimer = players.find(p => p.profile.role === "MORTIMER");

        if (!mortimer) {
            socket.emit("confirmation", "failed");
            return;
        }

        // Both must be in Hall of Sages
        if (!player.isInHallOfSages || !mortimer.isInHallOfSages) {
            console.warn("Both players are not in Hall of Sages");
            socket.emit("confirmation", "failed");
            return;
        }

        // SUCCESS
        states.angeloState = angeloStateList.angeloDelivered;

        console.log("Angelo delivered successfully → processing");
        socket.emit("confirmation", "ok");

        io.emit("angeloStateUpdate", states.angeloState);
    });

}
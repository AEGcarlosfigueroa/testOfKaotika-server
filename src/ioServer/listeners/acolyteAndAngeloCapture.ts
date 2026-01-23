import { Server, Socket } from "socket.io";
import * as userService from "./../../services/userService.ts";
import playerListUpdate from "./../events/playerListUpdate.ts";
import { angeloStateList } from "./../../globalVariables.ts";
import { states } from "./../../globalVariables.ts";
import { roles } from "../../database/playerRoles.ts";

export function AcolytesAndAngeloCapture(socket: Socket, io: Server) {

    socket.on("capture_Angelo", async (email: string) => {

        console.log(`Angelo has being captured by ${email}`);

        const player = await userService.getPlayerFromDatabaseByEmail(email);

        if (player.isBetrayer === true) return;

        if (states.angeloState === angeloStateList.angeloFree) 
        {
            states.angeloState = angeloStateList.angeloCaptured;
            states.angeloCapturer = player.email;
            console.log("Angelo state updated to Captured");

            io.in("stateTracker").emit("stateUpdate", states);
            socket.emit("confirmation", "ok");
        }
        else {
            socket.emit("confirmation", "failed");
            console.log("capture failed");
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
        states.angeloCapturer = null;
        

        console.log("Angelo delivered successfully → processing");
        socket.emit("confirmation", "ok");

        io.in(mortimer.socketId).emit("confirmation", "ok");

        io.in("stateTracker").emit("angeloStateUpdate", {
            angeloState: states.angeloState,
            angeloCapturer: states.angeloCapturer
        });
    });

}
import { Server, Socket } from "socket.io";
import * as userService from "./../../services/userService.ts";
import playerListUpdate from "./../events/playerListUpdate.ts";
import { angeloStateList } from "./../../globalVariables.ts";
import { states } from "./../../globalVariables.ts";
import { messaging } from "../../firebase.ts";
import { roles } from "../../database/playerRoles.ts";

export function MortimerAndAngeloListener(socket: Socket, io: Server) {

    socket.on("accept_Angelo", async (angeloConstant: number) => {
        console.log("Angelo being Delivered to be Imprisoned");

        const player = await userService.getPlayerFromDatabaseByEmail(email);

        const mortimer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer);

        if(player.isBetrayer || !mortimer) return;

        if (states.angeloState === angeloStateList.angeloCaptured ) {
            states.angeloState = angeloStateList.angeloDelivered;
            io.in("stateTracker").emit("stateUpdate", states);

            console.log("Angelo state updated to Delivered");

            socket.emit("confirmation", "ok");
        } else {
            socket.emit("confirmation", "failed");
            console.warn(
                `Failed to update Angelo: current state ${states.angeloState}, received ${constantNum}`
            );
        }
    });

    socket.on("angelo_IsWaiting", async () => {
        console.log("angelo is waiting at hall of sages")

        const connectedPlayer = await userService.getAllUsers()

        const mortimerPlayer = connectedPlayer.find(
            p => p.profile.role === "MORTIMER"
        );

        console.log(mortimerPlayer.fcmToken);

        if (states.angeloState === angeloStateList.angeloCaptured) {
            if (mortimerPlayer && mortimerPlayer.fcmToken) {
                console.log("sending message to Mortimes")
                const message = {
                    notification: {
                        title: "PRISONER WAITING",
                        body: "Angelo is ready to be delivered in Hall of Sages!"
                    },
                    token: mortimerPlayer.fcmToken
                }
                messaging.send(message);
                console.log("sent using messanging");
            }
            else
            {
                console.log("no fcm token found");
            }

        }
    })
}

// const player = players[i];

//         if(player.socketId)
//         {
//             io.in(player.socketId).emit("scrollDestroyedEvent", "ALL ARE CALLED TO THE HALL OF SAGES");
//             console.log("sent using socket io");
//         }
//         else if(player.fcmToken)
//         {
//             const message = {
//             notification: {
//                 title: "KAOTIKA ALERT",
//                 body: "ALL ARE CALLED TO THE HALL OF SAGES",
//             },
//             token: player.fcmToken
//             }
//             messaging.send(message);
//             console.log("sent using messanging");
//         }
//         else
//         {
//             console.log("no method found to notify player");
//         }
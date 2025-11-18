import { Server, Socket } from "socket.io";

import { messaging } from "../../firebase.ts";

import { roles } from "../../database/playerRoles.ts";

import { states, scrollStateList } from "../../globalVariables.ts";

import * as userService from"./../../services/userService.ts";

export default function scrollCollectedListener(socket: Socket, io: Server)
{
    socket.on("scrollCollected", async(playerEmail: String) => {
        try
        {
            console.log("scroll has been collected");
            const player = await userService.getPlayerFromDatabaseByEmail(playerEmail);
            if(player.isInTower && states.scrollState === scrollStateList.uncollected)
            {
                states.scrollState = scrollStateList.collected;
                notifyMortimerScrollCollected(socket, io);
            }
        }
        catch(error)
        {
            console.error(error);
        }
    })
}

async function notifyMortimerScrollCollected(socket: Socket, io: Server)
{
    try
    {
        console.log("contacting mortimer...");
        const mortimerPlayer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer);

        if(mortimerPlayer)
        {
            if(mortimerPlayer.socketId)
            {
                io.in(mortimerPlayer.socketId).emit("scrollCollectedEvent", "");
                console.log("message sent by socket io");
            }
            else if(mortimerPlayer.fcmToken)
            {
                const message = {
                notification: {
                    title: "SCROLL ALERT",
                    body: "AN ACOLYTE HAS COLLECTED THE SCROLL",
                }, 
                token: mortimerPlayer.fcmToken
                }
                await messaging.send(message);
                console.log("message sent by messaging");
            }
        }
    }
    catch(error)
    {
        console.error(error);
    }
    }
   
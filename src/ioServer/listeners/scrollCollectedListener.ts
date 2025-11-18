import { Server, Socket } from "socket.io";

import { messaging } from "../../firebase";

import { roles } from "../../database/playerRoles";

import { scrollState, scrollStateList } from "../../globalVariables";

import * as userService from"./../../services/userService.ts";

export default function scrollCollectedListener(socket: Socket, io: Server)
{
    socket.on("scrollCollected", async(playerEmail: String) => {
        try
        {
            const player = await userService.getPlayerFromDatabaseByEmail(playerEmail);
            if(player.isInTower)
            {
                scrollState = scrollStateList.collected;
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
        const mortimerPlayer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer);

        if(mortimerPlayer)
        {
            if(mortimerPlayer.socketId)
            {
                io.in(mortimerPlayer.socketId).emit("scrollCollectNotification", "");
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
            }
        }
    }
    catch(error)
    {
        console.error(error);
    }
    }
   
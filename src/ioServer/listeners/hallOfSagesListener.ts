import { Server, Socket } from "socket.io";
import * as userService from './../../services/userService.ts';
import * as artifactService from "./../../services/artifactService.ts"
import { messaging } from "../../firebase.ts";
import { roles } from "../../database/playerRoles.ts";
import playerListUpdate from "../events/playerListUpdate.ts";

export function hallOfSagesListener(io: Server, socket: Socket)
{
    socket.on("hallOfSages", async(state: string) => {
        try
        {
            console.log("executing hall of sages listener");
        
            const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

            if(!player)
            {
                console.log("no player found");
                return;
            }

            if(state === 'enter')
            {
                player.isInHallOfSages = true;
                await player.save();
                socket.emit("authorization", player);
                sendHallOfSagesNotificationToMortimer();
                console.log("entered hallOfSages");
            }
            else if(state === "exit")
            {
                player.isInHallOfSages = false;
                await player.save();
                socket.emit("authorization", player);
                console.log("exit hallOfSages");
            }
            else
            {
                console.log("Invalid argument in hall of sages listener");
            }
            playerListUpdate();
        }
        catch(error)
        {
            console.error(error);
        }
    })
}

async function sendHallOfSagesNotificationToMortimer()
{
    try
    {
        const acolytes = await userService.getAllAcolytes();

        let allAcolytesConnectedAndInHallOfFame = true;

        for(let i=0; i<acolytes.length; i++)
        {
            const entry = acolytes[i];
            if(entry.socketId === null || entry.isInHallOfSages === false)
            {
                console.log("Not all acolytes are in hall of fame");
                return;
            }
        }

        const artifacts = await artifactService.getAllArtifacts();

        for(let i=0; i< artifacts.length; i++)
        {
            const entry = artifacts[i];
            if(entry.isCollected === false)
            {
                console.log("not all artifacts are collected");
                return;
            }
        }

        console.log("All acolytes are in hall of fame and all artifacts are collected, sending message...");

        const mortimer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer);

        if(mortimer && mortimer.fcmToken !== null)
        {
            const message = {
                notification: {
                    title: "HALL OF SAGES ALERT",
                    body: "THE ACOLYTES ARE CALLING YOU TO THE HALL OF SAGES",
                }, 
                token: mortimer.fcmToken
            }
            messaging.send(message);
            console.log("message sent");
        }
    }
    catch(error)
    {
        throw error;
    }
}
import { Server, Socket } from "socket.io";
import * as userService from './../../services/userService.ts';
import { messaging } from "../../firebase.ts";
import { roles } from "../../database/playerRoles.ts";

export function hallOfSagesListener(io: Server, socket: Socket)
{
    socket.on("hallOfSages", async(state: string) => {
        try
        {
            console.log("executing hall of sages listener");
        
            const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

            if(!player)
            {
                console.log("no player found");ç
                return;
            }

            if(state === 'enter')
            {
                player.isInHallOfSages = true;
                await player.save();
                socket.emit("authorization", player);
            }
            else if(state === "exit")
            {
                player.isInHallOfSages = false;
                await player.save();
                socket.emit("authorization", player);
            }
            else
            {
                console.log("Invalid argument in hall of sages listener");
            }
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

        console.log("All acolytes are in hall of fame, sending message...");

        const mortimer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer);

        if(mortimer && mortimer.fcmToken !== null)
        {
            const message = {
                notification: {
                    title: "SCROLL ALERT",
                    body: "AN ACOLYTE HAS COLLECTED THE SCROLL",
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
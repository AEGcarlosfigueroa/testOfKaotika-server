import { Server, Socket } from "socket.io";
import { states, scrollStateList } from "../../globalVariables.ts";
import * as userService from"./../../services/userService.ts";
import { messaging } from "../../firebase.ts";

export default function scrollDestroyedListener(socket: Socket, io: Server)
{
    socket.on("scrollDestroyed", async() => {
        if(states.scrollState === scrollStateList.collected)
        {
            states.scrollState = scrollStateList.eliminated;
            notifyEveryoneToHallOfSages(io);
        }
    })
}

async function notifyEveryoneToHallOfSages(io: Server)
{
    try
    {
        const players = await userService.getAllUsers();

        for(let i=0; i<players.length; i++)
        {
            console.log("Attempting to send notification to: " + players[i].email);
            
            const player = players[i];

            if(player.socketId)
            {
                io.in(player.socketId).emit("scrollDestroyedEvent", "ALL ARE CALLED TO THE HALL OF SAGES");
                console.log("sent using socket io");
            }
            else if(player.fcmToken)
            {
                const message = {
                notification: {
                    title: "KAOTIKA ALERT",
                    body: "ALL ARE CALLED TO THE HALL OF SAGES",
                }, 
                token: player.fcmToken
                }
                messaging.send(message);
                console.log("sent using messanging");
            }
            else
            {
                console.log("no method found to notify player");
            }
        }
    }
    catch(error)
    {
        console.error(error);
    }
}
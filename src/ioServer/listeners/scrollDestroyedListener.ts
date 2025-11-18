import { Server, Socket } from "socket.io";
import { scrollState, scrollStateList } from "../../globalVariables";
import * as userService from"./../../services/userService.ts";

export default function scrollDestroyedListener(socket: Socket, io: Server)
{
    socket.on("scrollDestroyed", async() => {
        if(scrollState === scrollStateList.collected)
        {
            scrollState = scrollStateList.eliminated;
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
            const player = players[i];

            if(player.socketId)
            {
                io.in(player.socketId).emit("scrollDestroyedEvent", "ALL ARE CALLED TO THE HALL OF SAGES");
            }
            else if(player.fcmToken)
            {
                const message = {
                notification: {
                    title: "KAOTIKA ALERT",
                    body: "ALL ARE CALLED TO THE HALL OF SAGES",
                }, 
                token: mortimerPlayer.fcmToken
                }
            }
        }
    }
    catch(error)
    {
        console.error(error);
    }
}
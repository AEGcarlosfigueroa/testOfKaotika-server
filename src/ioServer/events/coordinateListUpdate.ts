import { coordinateList } from "../../globalVariables.ts";
import { server } from "../ioServer.ts";
import * as userService from "./../../services/userService.ts";

export async function coordinateListUpdate()
{
    const players = await userService.getAllUsers();

    for(let i=0; i<players.length; i++)
    {
        const player = players[i];
        if(player.socketId === null)
        {
            for(let j=0; j<coordinateList.length; j++)
            {
                const entry = coordinateList[j];
                if(entry.email === player.email)
                {
                    coordinateList.splice(j, 1);
                    break;
                }
            }
        }
    }
    
    server.in("acolyteLocationTracker").emit("locationUpdated", coordinateList);

    console.log("coordinate list updated");
}
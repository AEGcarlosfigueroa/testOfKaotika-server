import reduceResistanceBy10 from "../statusTools/resistanceReduceBy10.ts";
import * as userService from "./../services/userService.ts";
import { server } from "../ioServer/ioServer.ts";
import playerListUpdate from "../ioServer/events/playerListUpdate.ts";

export default async function executeCron()
{
    try
    {
        console.log("executing cron function...");

        const acolytes = await userService.getAllConnectedNonTraitorAcolytePlayers();

        for(let i=0; i<acolytes.length; i++)
        {
            const currentAcolyte = acolytes[i];

            await reduceResistanceBy10(currentAcolyte);

            if(currentAcolyte.socketId !== null && server !== null)
            {
                server.in(currentAcolyte.socketId).emit("authorization", currentAcolyte);

                playerListUpdate();
            }
        }
    }
    catch(error)
    {
        console.error(error);
    }
}
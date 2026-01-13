import reduceResistanceBy10 from "../statusTools/resistanceReduceBy10.ts";
import * as userService from "./../services/userService.ts";
import { server } from "../ioServer/ioServer.ts";
import playerListUpdate from "../ioServer/events/playerListUpdate.ts";

export default async function executeCron()
{
    try
    {
        console.log("executing cron function...");

        const acolytes = await userService.getAllNonTraitorAcolytes();

        for(let i=0; i<acolytes.length; i++)
        {
            const currentAcolyte = acolytes[i];

            console.log("processing acolyte...");
            console.log(currentAcolyte.attributes[0].resistance);

            if(currentAcolyte.attributes[0].resistance) // check if current acolyte has resistance
            {
                console.log("acolyte has resistance, executing resistance reduction...")
                await reduceResistanceBy10(currentAcolyte);

                if(currentAcolyte.socketId !== null && server !== null)
                {
                    server.in(currentAcolyte.socketId).emit("authorization", currentAcolyte);
                }
            }

            console.log("acolyte result...");
            console.log(currentAcolyte.attributes);
        }

        playerListUpdate(); // Update player lists after all operations are done
    }
    catch(error)
    {
        console.error(error);
    }
}
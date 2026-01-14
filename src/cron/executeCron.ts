import reduceResistanceBy10 from "../statusTools/resistanceReduceBy10.ts";
import * as userService from "./../services/userService.ts";
import { server } from "../ioServer/ioServer.ts";
import playerListUpdate from "../ioServer/events/playerListUpdate.ts";
import { ApplyStatusEffect } from "../statusTools/applyStatusEffect.ts";
import { deadlyEffects } from "../globalVariables.ts";

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

                await applyRandomSickness(currentAcolyte);

                if(currentAcolyte.socketId !== null && server !== null)
                {
                    server.in(currentAcolyte.socketId).emit("authorization", currentAcolyte);
                }
            }

            console.log("acolyte result...");
            console.log(currentAcolyte.attributes);
            console.log(currentAcolyte.statusEffects);
        }

        playerListUpdate(); // Update player lists after all operations are done
    }
    catch(error)
    {
        console.error(error);
    }
}

async function applyRandomSickness(player: any)
{
    const result = Math.floor(Math.random()*4);

    switch(result)
    {
        case 0:
            await ApplyStatusEffect(player, deadlyEffects.medulaApocalypse); //Apply medular apocalypse
            break;
        case 1:
            await ApplyStatusEffect(player, deadlyEffects.epicWeakness); //Apply epic weakness
            break;
        case 2:
            await ApplyStatusEffect(player, deadlyEffects.putridPlague); //Apply putrid plague
            break;
        default:
            break;    
    }
}
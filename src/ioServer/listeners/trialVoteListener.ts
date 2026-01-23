import { states } from "./../../globalVariables.ts";
import {Server, Socket} from "socket.io";
import * as userService from "./../../services/userService.ts"

export function trialVoteListener(socket: Socket, io: Server)
{
    socket.on("trialVote", async(vote: string) => {
        try
        {
            const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

            if(!player || (player.profile.role === 'ACOLITO' && player.isBetrayer) || player.profile.role === 'MORTIMER' || states.playersWhoHaveVoted.includes(player.email))
            {
                console.log("this player cannot vote in the trial, aborting...");
                socket.emit("confirmation", "ok");
                return;
            }
            else
            {
                if(vote === "guilty")
                {
                    states.trialResult.guilty++;

                    states.playersWhoHaveVoted.push(player.email);
                }
                else if(vote === "innocent")
                {
                    states.trialResult.innocent++;

                    states.playersWhoHaveVoted.push(player.email);
                }
                else
                {
                    console.log("invalid vote, not counting");
                }

                io.in("stateTracker").emit("stateUpdate", states);
                socket.emit("confirmation", "ok");

            }
        }
        catch(error)
        {
            console.error(error);
        }

    })
    
}
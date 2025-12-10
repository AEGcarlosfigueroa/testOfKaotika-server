import {Server, Socket} from 'socket.io';
import * as userService from './../../services/userService.ts';
import * as artifactService from './../../services/artifactService.ts';
import { roles } from '../../database/playerRoles.ts';
import { server } from '../ioServer.ts';
import { obituaryStateList, states } from '../../globalVariables.ts';

export function showArtifactsListener(io: Server, socket: Socket)
{
    socket.on("showArtifacts", async() => {
        try
        {
            console.log("show artifacts triggered");

            const players = await userService.getAllUsers();

            const artifacts = await artifactService.getAllArtifacts();

            //Check if all acolytes and mortimer are connected
            for(let i=0; i<players.length; i++)
            {
                const entry = players[i];

                if(entry.profile.role === 'MORTIMER' || entry.profile.role === 'ACOLITO')
                {
                    if(entry.socketId === null || !entry.isInHallOfSages)
                    {
                        console.log("Mortimer or an acolyte are not in hall of sages, aboting");
                        return;
                    }
                }
            }

            for(let i=0; i<artifacts.length; i++)
            {
                const entry = artifacts[i];

                if(!entry.isCollected)
                {
                    console.log("At least one artifacts has not been collected, aborting...");
                    return;
                }
            }

            console.log("all conditions are met, sending emit to mortimer and acolytes...");

            states.obituaryState = obituaryStateList.evaluating;

            io.in("stateTracker").emit("stateUpdate", states);
        }
        catch(error)
        {
            console.error(error);
        }
    })
}


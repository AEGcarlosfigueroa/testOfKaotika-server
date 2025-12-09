import {Server, Socket} from 'socket.io';
import * as userService from './../../services/userService.ts';
import * as artifactService from './../../services/artifactService.ts';
import { obituaryStateList, states } from '../../globalVariables.ts';
import artifactListUpdate from '../events/artifactListUpdate.ts';
import { server } from '../ioServer.ts';

export function artifactEvaluationListener(io: Server, socket: Socket)
{
    socket.on("artifactEvaluation", async(message: string) => {
        try
        {
            console.log("artifactEvaluation triggered")

            if(states.obituaryState === obituaryStateList.evaluating)
            {
                if(message === 'verify')
                {
                    states.obituaryState = obituaryStateList.unlocked;

                    io.in("stateTracker").emit("stateUpdate", states);
                }
                else if(message === 'reset')
                {
                    states.obituaryState = obituaryStateList.locked;

                    const artifacts = await artifactService.getAllArtifacts();

                    for(let i=0; i<artifacts.length; i++)
                    {
                        const artifact = artifacts[i];

                        artifact.isCollected = false;

                        await artifact.save();
                    }

                    const players = await userService.getAllUsers();

                    for(let i=0; i<players.length; i++)
                    {
                        const player = players[i];

                        player.artifactInventory = [];

                        await player.save();

                        if(player.socketId !== null)
                        {
                            server.in(player.socketId).emit("authorization", player);
                        }
                    }

                    io.in("stateTracker").emit("stateUpdate", states);

                    artifactListUpdate();
                }
            }
            else
            {
                console.log("obituaryState not in evaluation, aborted");
            }
        }
        catch(error)
        {
            console.error(error);
        }
    })
    
}
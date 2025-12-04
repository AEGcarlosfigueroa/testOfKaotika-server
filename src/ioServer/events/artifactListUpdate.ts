import { Server, Socket } from 'socket.io';
import { server } from '../ioServer.ts';
import * as artifactService from"../../services/artifactService.ts";

export default async function artifactListUpdate()
{
    console.log("player list updating... ")
    try
    {
        const artifacts = await artifactService.getAllArtifacts();
        
        server.in("artifactTracker").emit("updateArtifacts", artifacts);
    }
    catch(error)
    {
        throw error;
    }
}
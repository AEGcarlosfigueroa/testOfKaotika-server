import {Server, Socket} from 'socket.io';
import * as userService from './../../services/userService.ts';
import * as artifactService from './../../services/artifactService.ts'
import { coordinateList } from '../../globalVariables.ts';
import playerListUpdate from '../events/playerListUpdate.ts';
import artifactListUpdate from '../events/artifactListUpdate.ts';
import { sendHallOfSagesNotificationToMortimer } from './hallOfSagesListener.ts';

export function artifactCollectedListener(io: Server, socket: Socket)
{
    socket.on("artifactCollected", async(artifactId: string) => {
        try
        {
            console.log("artifactCollected triggered");

            const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

            const coordinate = findCoordinateByEmail(player.email);

            const artifact = await artifactService.getArtifactById(artifactId);

            if(player && artifact && coordinate)
            {
                const distance = getDistanceInMeters(coordinate.latitude, coordinate.longitude, artifact.latitude, artifact.longitude);

                console.log("Distance: " + distance);

                if(distance <= 10)
                {
                    player.artifactInventory.push(artifactId);
                    artifact.isCollected = true;
                    await player.save();
                    await artifact.save();
                }
            }

            socket.emit("authorization", player);

            playerListUpdate();

            artifactListUpdate();

            sendHallOfSagesNotificationToMortimer();
        }
        catch(error)
        {
           console.error(error); 
        }
    })
}

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number 
{
    const R = 6371000; // Earth's radius in meters
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

function findCoordinateByEmail(email: string)
{
    for(let i=0; i<coordinateList.length; i++)
    {
        const entry = coordinateList[i];
        if(entry.email === email)
        {
            return entry;
        }
    }

    return null;
}
import { Server, Socket } from "socket.io";
import { coordinateList } from "../../globalVariables.ts";
import { coordinateListUpdate } from "../events/coordinateListUpdate.ts";
import * as userService from "./../../services/userService.ts";

export function coordinateListener(socket: Socket, io: Server)
{
    socket.on("sendCoordinates", async(data: {playerEmail: string, latitude: number, longitude: number}) => {
        try
        {
            console.log("Inserting data...");

            const player = userService.getPlayerFromDatabaseBySocketId(socket.id);

            if(player.isBetrayer || player.profile.role !== 'ACOLITO')
            {
                console.log("player is betrayer or not acolyte, aborting...")
                return;
            }

            for(let i=0; i<coordinateList.length; i++)
            {
                const currentEntry = coordinateList[i];
                if(currentEntry.email === data.playerEmail)
                {
                    coordinateList.splice(i, 1);
                    break;
                }
            }

            const newEntry = { email: data.playerEmail, latitude: data.latitude, longitude: data.longitude };

            coordinateList.push(newEntry);

            console.log("New data: ");
            console.log(coordinateList);

            coordinateListUpdate();
        }
        catch(error)
        {
            console.error(error);
        }
    })

    socket.on("removeCoordinates", async(email: string) => {
        try
        {
            console.log("Removing coordinates from: " + email);
            for(let i=0; i<coordinateList.length; i++)
            {
                if(coordinateList[i].email === email)
                {
                    coordinateList.splice(i, 1);
                    console.log("Coordinates removed");
                    break;
                }
            }
            coordinateListUpdate();
        }
        catch(error)
        {
            console.error(error);
        }
    })
}
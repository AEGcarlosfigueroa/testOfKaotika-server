import { Server, Socket } from "socket.io";
import { coordinateList } from "../../globalVariables.ts";
import { coordinateListUpdate } from "../events/coordinateListUpdate";

export function coordinateListener(socket: Socket, io: Server)
{
    socket.on("sendCoordinates", async(data: {playerEmail: string, xPos: number, yPos: number}) => {
        try
        {
            for(let i=0; i<coordinateList.length; i++)
            {
                const currentEntry = coordinateList[i];
                if(currentEntry.email === playerEmail)
                {
                    coordinateList.splice(i, 1);
                    break;
                }
            }

            const newEntry = { email: data.playerEmail, xPos: data.xPos, yPos: data.yPos };
            coordinateList.push(newEntry);
            coordinateListUpdate();
        }
        catch(error)
        {
            console.error(error);
        }
    })
}
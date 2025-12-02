import { server } from '../ioServer.ts';
import { pendingSockets } from '../listeners/isInTowerListener.ts';
import * as userService from '../../services/userService.ts';
import { mqttClient } from '../../mqtt/mqttManager.ts';

export default async function isInTowerEntranceRequest(socketID: string)
{
    console.log("Send isInTowerRequest to: " + socketID)
    try
    {
        const socket = await server.in(socketID).emit("isInTowerEntranceRequest", " ");
    }
    catch(error)
    {
        throw error;
    }
}
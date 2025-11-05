import { server } from '../ioServer.ts';
import { pendingSockets } from '../listeners/isInTowerListener.ts';
import * as userService from './../../services/userService.ts';
import { mqttClient } from '../../mqtt/mqttManager.ts';

export default function isInTowerEntranceRequest(socketID: string)
{
    console.log("Send isInTowerRequest to: " + socketID)
    try
    {
        const socket = server.in(socketID);

        console.log(socket);

        socket.emit("isInTowerEntranceRequest", " ");

        socket.on("is the player at the gates?", async(isAtTheGates) => {
            try
            {
                if(isAtTheGates)
                {
                    for(let i=0; i<pendingSockets.length; i++)
                    {
                        if(pendingSockets[i] === socket.id)
                        {
                            pendingSockets.splice(i, 1);
                            break;
                        }
                    }

                    const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

                    let isInTower = player.isInTower;

                    isInTower = !isInTower;

                    player.isInTower = isInTower;

                    await player.save();

                    socket.emit("authorization", player);

                    mqttClient.publish('authorization', true, { qos: 0, retain: false }, (error) => {
                      if (error) {
                        console.error(error)
                      }
                    });
                    console.log("Received response: true");
                }
                else
                {
                    const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

                    socket.emit("authorization", player);

                    mqttClient.publish('authorization', false, { qos: 0, retain: false }, (error) => {
                      if (error) {
                        console.error(error)
                      }
                    });
                    console.log("Received response: false");
                }
            }
            catch(error)
            {
                console.error(error);
            }
        })
    }
    catch(error)
    {
        throw error;
    }
}
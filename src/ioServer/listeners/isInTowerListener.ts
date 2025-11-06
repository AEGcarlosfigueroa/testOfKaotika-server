import * as userService from './../../services/userService.ts'

import { mqttClient } from '../../mqtt/mqttManager.ts';

import mortimerListUpdate from '../events/mortimerListUpdate.ts';

export const pendingSockets = [];

export function isInTowerListener(socket: Socket, io: Server)
{
    socket.on("inTower", async(isInTower) => {
        try
        {
            console.log("isInTower triggered");
            let isInPendingList = false;

            let authorizationToPublish = false;

            for(let i=0; i<pendingSockets.length; i++)
            {
                if(socket.id === pendingSockets[i])
                {
                    isInPendingList = true;
                    pendingSockets.splice(i, 1);
                    break;
                }
            }

            const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

            if(isInPendingList && player && isInTower)
            {
                let isInTower = player.isInTower;

                isInTower = !isInTower;

                player.isInTower = isInTower

                await player.save();

                socket.emit("authorization", player);

                authorizationToPublish = true;
            }
            
            mqttClient.publish('authorization', `${authorizationToPublish}`, { qos: 0, retain: false }, (error) => {
              if (error) {
                console.error(error)
              }
            });

            console.log("Player authorized: " + isInTower);
            console.log("Current player status: " + player.isInTower);

            mortimerListUpdate(io);

        }
        catch(error)
        {
            console.error(error);
        }
    }
)
}
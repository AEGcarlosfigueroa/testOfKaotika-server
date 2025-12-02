import * as userService from './../../services/userService.ts'

import { mqttClient } from '../../mqtt/mqttManager.ts';

import playerListUpdate from '../events/playerListUpdate.ts';

import { messaging } from "../../firebase.ts";

import { roles } from "../../database/playerRoles.ts";



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

            let action = "entered"

            if(isInPendingList && player && isInTower)
            {
                let isInTower = player.isInTower;

                if(isInTower)
                {
                    action = "exit";
                }

                isInTower = !isInTower;

                player.isInTower = isInTower

                await player.save();

                socket.emit("authorization", player);

                authorizationToPublish = true;
            }

            const accepted =  `An ACOLYTE ${player.nickname} Has ${action} the Tower`

            const denied =  `An ACOLYTE ${player.nickname} Has being denied`

            if(authorizationToPublish)
            {
                mqttClient.publish('authorization', '0', { qos: 0, retain: false }, (error) => {
                  if(error) 
                  {
                    console.error(error)
                  }
                });
                notifyMortimer(player.email, accepted)
            }
            else
            {
                mqttClient.publish('authorization', '1', { qos: 0, retain: false }, (error) => {
                  if(error) 
                  {
                    console.error(error)
                  }
                });
                notifyMortimer(player.email, denied)
            }

            console.log("Player authorized: " + isInTower);
            console.log("Current player status: " + player.isInTower);

            playerListUpdate();
        }
        catch(error)
        {
            console.error(error);
        }
    }
)
}

export const notifyMortimer = async (playerEmail: string | null, body: string) => {
    try
    {
        if(!playerEmail)
        {
            console.error(`email: ${playerEmail} not found`);
        }
        //Find Mortimer in DB
        const mortimer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer)
        if(!mortimer)
        {
            console.error(`email ${roles.mortimer} invalid, or ${mortimer} not found`)
        }
        //build the FCM message
        const message = {
            token: mortimer.fcmToken,
            android: {
                priority: "high",
            },
            apns: {
                headers: {
                    "apns-priority": "10"
                }
            },
            notification: {
                title: "TOWER ALERT",
                body: body,
            },
            data: {
                title: "TOWER ALERT",
                body: body,
                type: "tower_alert"
            }
        };

        //send push notification
        await messaging.send(message);

        console.log("Notification sent to Mortimer");
    }
    catch(error)
    {
        console.error("Error notifying Mortimer: ", error);
    }
}
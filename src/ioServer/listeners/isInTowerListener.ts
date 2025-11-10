import * as userService from './../../services/userService.ts'

import { mqttClient } from '../../mqtt/mqttManager.ts';

import mortimerListUpdate from '../events/mortimerListUpdate.ts';

import { messaging } from "../../firebase";

import { roles } from "../../database/playerRoles";



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

            const accepted =  `An ACOLYTE ${player.email} Has entered the Tower`

            const denied =  `An ACOLYTE ${player.email} Has being denied`
            


            if(isInPendingList && player && isInTower)
            {
                let isInTower = player.isInTower;

                isInTower = !isInTower;

                player.isInTower = isInTower

                await player.save();

                socket.emit("authorization", player);

                authorizationToPublish = true;
            }

            if(authorizationToPublish)
            {
                mqttClient.publish('authorization', '0', { qos: 0, retain: false }, (error) => {
                  if (error) {
                    console.error(error)
                  }
                });
                notifyMortimer(player.email, accepted)
            }
            else
            {
                mqttClient.publish('authorization', '1', { qos: 0, retain: false }, (error) => {
                  if (error) {
                    console.error(error)
                  }
                });
                notifyMortimer(player.email, denied)
            }
            
            

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

const notifyMortimer = async (playerEmail: string, body: string) => {
    try{

        if(!email)
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
            notification: {
                title: "ACOLITE ALERT",
                body: body,
            }, 
            token: mortimer.fcmToken
        }
        //send push notificationç
        await messaging.send(message);


        console.log("Notification sent to Mortimer")

    }catch(error){
        console.error("Error notifying Mortimer: ", error);
    }
}
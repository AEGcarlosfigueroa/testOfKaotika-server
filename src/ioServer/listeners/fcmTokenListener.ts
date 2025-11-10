
import * as userService from"./../../services/userService.ts"
import { Server, Socket } from "socket.io";
import { messaging } from "../../firebase";
import { register } from "module";
import { roles } from "../../database/playerRoles";

export function registerToken (socket: Socket, io: Server)
{
    socket.on("register_fcm_token", async (data: { playerEmail: string; token: string}) => 
    {
        try{
            console.log("fcm token associated with player email")
            const { playerEmail, token } = data || {};
            const player = await userService.getPlayerFromDatabaseByEmail(playerEmail)
            player.fcmToken = token;
            await player.save();

            console.log(`saved FCM token for ${playerEmail}`)

            await notifyMortimer(playerEmail)

        }
        catch(error)
        {
            console.error("Error saving FCM token:", error)
        }
    })
}


const notifyMortimer = async (playerEmail: string) => {
    try{

        const notification = `An ACOLYTE ${playerEmail} Has entered the Tower`
        const email = playerEmail;

        if(!email)
        {
            return res.status(400).json({ error: 'senderEmail'});

        }
        //Find Mortimer in DB
        const mortimer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer)
        if(!mortimer)
        {
            return res.status(400).json({ error: 'MORTIMER NOT FOUND'})
        }
        //build the FCM message
        const message = {
            notification: {
                title: "ACOLITE ALERT",
                body: `An ACOLYTE ${playerEmail} Has entered the Tower`,
            }, 
            token: mortimer.fcmToken
        }
        //send push notificationç
        await messaging.send(message);

        res.status(200).json({ message: 'NOtification sent to Mortimer'});
    }catch(error){
        console.error("Error notifying Mortimer: ", error);
    }
}
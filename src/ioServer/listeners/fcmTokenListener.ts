
import * as userService from"./../../services/userService.ts"
import { Server, Socket } from "socket.io";
import { register } from "module";

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

        }
        catch(error)
        {
            console.error("Error saving FCM token:", error)
        }
    })
}

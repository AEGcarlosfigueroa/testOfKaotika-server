import * as userService from './../../services/userService.ts'

export const pendingSockets = [];

export function isInTowerListener(socket: Socket, io: Server)
{
    socket.on("inTower", async(isInTower) => {
        try
        {
            console.log("isInTower triggered");
            let isInPendingList = false;

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

            if(isInPendingList && player)
            {
                let inside = player.isInside;

                inside = !inside;

                player.isInside = inside;

                await player.save();

                socket.emit("authorization", player);

            }

        }
        catch(error)
        {
            console.error(error);
        }
    }
)
}
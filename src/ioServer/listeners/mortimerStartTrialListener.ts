import { angeloStateList, states } from "../../globalVariables.ts"

export function MortimerStartTrialListener(socket: Socket, io: Server) {
    socket.on("startTrial", async() => {
        if(states.angeloState === angeloStateList.angeloDelivered)
        {
            states.angeloState = angeloStateList.angeloAwaitingTrial;

            io.in("stateTracker").emit("stateUpdate", states);

            await notifyEveryoneToHallOfSages(io);
        }
    })
}

async function notifyEveryoneToHallOfSages(io: Server)
{
    try
    {
        const players = await userService.getAllUsers();

        for(let i=0; i<players.length; i++)
        {
            console.log("Attempting to send notification to: " + players[i].email);
            
            const player = players[i];

            if((player.profile.role === 'ACOLITO' && player.isBetrayer) || player.profile.role === 'MORTIMER')
            {
                console.log("Do not notify, acolyte betrayer ot Mortimer");
            }
            else
            {
                if(player.socketId)
                {
                    io.in(player.socketId).emit("trialEvent", "ALL ARE CALLED TO THE HALL OF SAGES");
                    console.log("sent using socket io");
                }
                else if(player.fcmToken)
                {
                    const message = {
                    notification: {
                        title: "KAOTIKA ALERT",
                        body: "ALL ARE CALLED TO THE HALL OF SAGES",
                    }, 
                    token: player.fcmToken
                    }
                    messaging.send(message);
                    console.log("sent using messanging");
                }
                else
                {
                    console.log("no method found to notify player");
                }
            }
        }
    }
    catch(error)
    {
        console.error(error);
    }
}


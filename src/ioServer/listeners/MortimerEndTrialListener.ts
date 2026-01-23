import { angeloStateList, states } from "../../globalVariables.ts"

export function MortimerEndTrialListener(socket: Socket, io: Server) {
    socket.on("endTrial", async() => {
        if(states.angeloState === angeloStateList.angeloInTrial && states.playersWhoHaveVoted.length === states.playersAuthorized)
        {
            if(states.trialResult.guilty === states.trialResult.innocent)
            {
                console.log("trial cannot be ended, no clear winner");
                socket.emit("confirmation", "ok");
                return;
            }
            else if(states.trialResult.guilty < states.trialResult.innocent)
            {
                states.angeloCapturer = null;
                states.angeloState = angeloStateList.angeloFree;
            }
            else
            {
                states.angeloState = angeloStateList.angeloDelivered;
            }
            states.trialResult.guilty = 0;
            states.trialResult.innocent = 0;

            states.playersWhoHaveVoted = [];

            socket.emit("confirmation", "ok");
            io.in("stateTracker").emit("stateUpdate", states);
        }
        else
        {
            console.log("trial cannot be ended, no clear winner");
            socket.emit("confirmation", "ok");
        }
    })
}
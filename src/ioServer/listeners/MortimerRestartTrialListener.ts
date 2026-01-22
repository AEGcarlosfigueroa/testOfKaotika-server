import { angeloStateList, states } from "../../globalVariables.ts"

export function MortimerRestartTrialListener(socket: Socket, io: Server) {
    socket.on("restartTrial", async() => {
        if(states.angeloState === angeloStateList.angeloInTrial && states.playersWboHaveVoted.length === states.playersAuthorized)
        {
            states.trialResult.guilty = 0;
            states.trialResult.innocent = 0;

            states.playersWboHaveVoted = [];

            io.in("stateTracker").emit("stateUpdate", states);
        }
    })
}
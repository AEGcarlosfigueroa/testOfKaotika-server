import { Server, Socket } from "socket.io";
import * as userService from './../../services/userService.ts';
import * as artifactService from "./../../services/artifactService.ts"
import { messaging } from "../../firebase.ts";
import { roles } from "../../database/playerRoles.ts";
import playerListUpdate from "../events/playerListUpdate.ts";
import { angeloStateList, states } from "../../globalVariables.ts";
import { server } from "../ioServer.ts";

export function hallOfSagesListener(io: Server, socket: Socket)
{
    socket.on("hallOfSages", async(state: string) => {
        try
        {
            console.log("executing hall of sages listener");
        
            const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);

            if(!player || player.isBetrayer)
            {
                console.log("no player found or player is a betrayer");
                return;
            }

            if(state === 'enter')
            {
                player.isInHallOfSages = true;
                await player.save();
                socket.emit("authorization", player);
                console.log("entered hallOfSages");
            }
            else if(state === "exit")
            {
                player.isInHallOfSages = false;
                await player.save();
                socket.emit("authorization", player);
                console.log("exit hallOfSages");
            }
            else
            {
                console.log("Invalid argument in hall of sages listener");
            }

            if(states.angeloState === angeloStateList.angeloAwaitingTrial)
            {
                checkIfAllAuthorizedPlayersAreInHallOfSages();
            }
            else
            {
                sendHallOfSagesNotificationToMortimer();
            }
            playerListUpdate();
        }
        catch(error)
        {
            console.error(error);
        }
    })
}

async function checkIfAllAuthorizedPlayersAreInHallOfSages()
{
    try
    {
        const players = await userService.getAllUsers();

        let authorizedPlayerCount = 0;

        for(let i=0; i<players.length; i++)
        {
            const entry = players[i];

            if(entry.isBetrayer && playerListUpdate.profile.role === 'ACOLITO')
            {
                console.log("player not authorized, skipping check for this player");
            }
            else if(!entry.isInHallOfSages)
            {
                console.log("An authorized player i not in hall of sages, trial may not start yet...");
                return;
            }
            else
            {
                authorizedPlayerCount++;
            }
        }

        authorizedPlayerCount-- // To exclude mortimer from having to vote

        states.playersAuthorized = authorizedPlayerCount;

        states.angeloState = angeloStateList.angeloInTrial;

        states.trialResult.guilty = 0;

        states.trialResult.innocent = 0;
        
        states.playersWboHaveVoted = [];

        server.in("stateTracker").emit("stateUpdate", states);
    }
    catch(error)
    {
        console.error(error);
    }
}

export async function sendHallOfSagesNotificationToMortimer()
{
    try
    {
        const acolytes = await userService.getAllAcolytes();

        for(let i=0; i<acolytes.length; i++)
        {
            const entry = acolytes[i];
            if((entry.socketId === null || entry.isInHallOfSages === false) && !entry.isBetrayer)
            {
                console.log("Not all non betrayer acolytes are in hall of fame");
                states.canShowArtifacts = false;
                server.in("stateTracker").emit("stateUpdate", states);
                return;
            }
        }

        const artifacts = await artifactService.getAllArtifacts();

        for(let i=0; i< artifacts.length; i++)
        {
            const entry = artifacts[i];
            if(entry.isCollected === false)
            {
                console.log("not all artifacts are collected");
                states.canShowArtifacts = false;
                server.in("stateTracker").emit("stateUpdate", states);
                return;
            }
        }

        console.log("All acolytes are in hall of fame and all artifacts are collected, sending message...");

        const mortimer = await userService.getPlayerFromDatabaseByEmail(roles.mortimer);

        if(!mortimer)
        {
            console.log("mortimer not found, aborting");
            return;
        }

        if(mortimer.socketId !== null && mortimer.isInHallOfSages)
        {
            states.canShowArtifacts = true
            console.log("Message should not be sent, mortimer is already in hall of sages");
            server.in("stateTracker").emit("stateUpdate", states);
            return;
        }

        if(mortimer && mortimer.fcmToken !== null)
        {
            const message = {
                notification: {
                    title: "HALL OF SAGES ALERT",
                    body: "THE ACOLYTES ARE CALLING YOU TO THE HALL OF SAGES",
                }, 
                token: mortimer.fcmToken
            }
            messaging.send(message);
            console.log("message sent");
        }

        states.canShowArtifacts = false;

        server.in("stateTracker").emit("stateUpdate", states);
    }
    catch(error)
    {
        throw error;
    }
}
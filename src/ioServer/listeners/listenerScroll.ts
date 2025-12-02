import * as userService from"../../services/userService.ts"
import { Server, Socket } from "socket.io";
import { register } from "module";
import { scrollList, scroll } from "../../scrollVariable.ts";
import { messaging } from "../../firebase.ts";
import { notifyMortimer } from "./isInTowerListener.ts";

export function getScroll(socket: Socket, io: Server) {

    socket.on("scrollCollected", async (playerEmail: string) => {

        console.log("scroll collected", playerEmail);

        scroll.state = scrollList.collected

        const body = `The Scroll has been collected by ${playerEmail}`

        notifyMortimer(playerEmail, body);
    });
}
export function mortimerScrollListener(socket: Socket, io: Server)
{
    socket.on("scrollDestroyed", async (data: string) =>{
        scroll.state = scrollList.destroyed
    })
}

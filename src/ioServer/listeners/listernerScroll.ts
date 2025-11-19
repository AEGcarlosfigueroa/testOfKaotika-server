import * as userService from"./../../services/userService.ts"
import { Server, Socket } from "socket.io";
import { register } from "module";
import { scrollList, scroll } from "../../scrollVariable";
import { messaging } from "../../firebase";

function getScroll(socket: Socket, io: Server) {
    socket.on("scrollCollected", async (arg) => {
        console.log("scroll collected", arg);
        scroll.state = scrollList.collected
    });
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { createServer } from 'http';
import { Server } from 'socket.io';
import { authentication } from '../firebase';
import * as userService from "../services/userService";
import { listenerAssigner } from "./listeners/listenerAssigner";
function initIoServer(app, port) {
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: ["https://amritb.github.io"], // FOR TESTING PURPOSES ONLY
        },
        connectionStateRecovery: {
            skipMiddlewares: false
        }
    });
    io.on("connection", (socket) => {
        console.log("Connected with socket token " + socket.id);
        listenerAssigner(socket, io);
        socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
            console.log(socket.id + " disconnected");
            try {
                const player = yield userService.getPlayerFromDatabaseBySocketId(socket.id);
                console.log(player);
                player.socketId = null;
                yield player.save();
                console.log(player.socketId);
            }
            catch (error) {
                console.error(error);
            }
        }));
    });
    io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
        console.log("enter middleware " + socket);
        try {
            const idToken = socket.handshake.auth.token;
            const decodedToken = yield authentication.verifyIdToken(idToken);
            console.log(decodedToken.email);
            if (!decodedToken.email_verified) {
                const err = new Error("not authorized: token invalid");
                next(err);
            }
            let player = yield userService.getPlayerFromDatabaseByEmail(decodedToken.email);
            if (!player) {
                const err = new Error("not authorized: no player found with associated email");
                next(err);
            }
            player.socketId = socket.id;
            yield player.save();
            console.log("PLAYER INSERTED:");
            console.log(player);
            next();
        }
        catch (error) {
            const err = new Error("not authorized: internal server error");
            next(err);
        }
    }));
    io.engine.on("connection_error", (err) => {
        console.log(err.req); // the request object
        console.log(err.code); // the error code, for example 1
        console.log(err.message); // the error message, for example "Session ID unknown"
        console.log(err.context); // some additional error context
    });
    httpServer.listen(port);
}
export { initIoServer };

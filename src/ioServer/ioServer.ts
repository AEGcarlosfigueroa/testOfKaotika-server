import { Socket } from "socket.io";
import { createServer } from 'http';
import { Server } from 'socket.io';
import {authentication} from '../firebase';
import * as userService from "../services/userService";
import { istvanListener } from "./listeners/istvanListener"

function initIoServer(app: any, port: any)
{
    const httpServer = createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: ["https://amritb.github.io"], // FOR TESTING PURPOSES ONLY
      },
      connectionStateRecovery: {
        skipMiddlewares: false
      }
    });

    io.on("connection", (socket: Socket) => {
      console.log("Connected with socket token " + socket.id);

      istvanListener(socket, io);

      socket.on("disconnect", async () => {
        console.log(socket.id + " disconnected");
        try
        {  
          const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);
          console.log(player);
          player.socketId = null;
          await player.save();
          console.log(player.socketId);
        }
        catch(error)
        {
          console.error(error);
        }
      })
    });

    io.use(async (socket: Socket, next: Function) => {
      console.log("enter middleware " + socket);
      try
      {
        const idToken = socket.handshake.auth.token;

        const decodedToken = await authentication.verifyIdToken(idToken);

        console.log(decodedToken.email);

        if (!decodedToken.email_verified) {
          const err = new Error("not authorized: token invalid");
          next(err);
        }

        let player = await userService.getPlayerFromDatabaseByEmail(decodedToken.email);

        if(!player)
        {
          const err = new Error("not authorized: no player found with associated email");
          next(err);
        }

        player.socketId = socket.id;

        await player.save();

        console.log("PLAYER INSERTED:");
        console.log(player);
        next();
      }
      catch(error: any)
      {
        const err = new Error("not authorized: internal server error");
        next(err);
      }
    })

    io.engine.on("connection_error", (err: any) => {
      console.log(err.req);      // the request object
      console.log(err.code);     // the error code, for example 1
      console.log(err.message);  // the error message, for example "Session ID unknown"
      console.log(err.context);  // some additional error context
    });

    httpServer.listen(port);
}

export { initIoServer }
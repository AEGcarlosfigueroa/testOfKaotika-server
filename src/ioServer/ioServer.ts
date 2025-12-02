import { Socket } from "socket.io";
import { createServer } from 'http';
import { Server } from 'socket.io';
import {authentication} from '../firebase.ts';
import * as userService from "../services/userService.ts";
import { listenerAssigner } from "./listeners/listenerAssigner.ts";
import playerListUpdate from "./events/playerListUpdate.ts";
import { pendingSockets } from "./listeners/isInTowerListener.ts";
import { coordinateListUpdate } from "./events/coordinateListUpdate.ts";

let server = null;

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

    server = io;

    io.on("connection", (socket: Socket) => {
      console.log("Connected with socket token " + socket.id);

      playerListUpdate();

      socket.join("playerList");

      listenerAssigner(socket, io);

      coordinateListUpdate();

      socket.on("disconnect", async () => {
        console.log(socket.id + " disconnected");
        try
        {  
          const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);
          player.socketId = null;
          await player.save();
          for(let i=0; i<pendingSockets.length; i++)
          {
            if(socket.id === pendingSockets[i])
            {
              pendingSockets.splice(i, 1);
              break;
            }
          }
          coordinateListUpdate();
          playerListUpdate();
        }
        catch(error)
        {
          console.error(error);
        }
      })
    });

    //PRODUCTION MODE VERIFICATION WITH IDTOKEN
    io.use(async (socket: Socket, next: Function) => {

      console.log("enter middleware " + socket);

      try
      {
        const idToken = socket.handshake.auth.token;

        const decodedToken = await authentication.verifyIdToken(idToken);

        console.log(decodedToken.email);

        if (!decodedToken.email_verified) 
        {
          const err = new Error("not authorized: token invalid");
          next(err);
        }
        io.use(async (socket: Socket, next: Function) => {

          console.log("enter middleware " + socket.id);

          try
          {
            const idToken = socket.handshake.auth.token;

            const decodedToken = await authentication.verifyIdToken(idToken);

            console.log(decodedToken.email);

            if (!decodedToken.email_verified) 
            {
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

            next();
          }
          catch(error: any)
          {
            const err = new Error("not authorized: internal server error");
            next(err);
          }
        })

        let player = await userService.getPlayerFromDatabaseByEmail(decodedToken.email);

        if(!player)
        {
          const err = new Error("not authorized: no player found with associated email");
          next(err);
        }

        player.socketId = socket.id;

        await player.save();

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

export { initIoServer, server }
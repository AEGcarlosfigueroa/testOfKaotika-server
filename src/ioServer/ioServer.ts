import { Socket } from "socket.io";
import { createServer } from 'http';
import { Server } from 'socket.io';
import {authentication} from '../firebase.ts';
import * as userService from "../services/userService.ts";
import { listenerAssigner } from "./listeners/listenerAssigner.ts"
import mortimerListUpdate from "./events/mortimerListUpdate.ts";

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
      mortimerListUpdate(io);
      listenerAssigner(socket, io);

      socket.on("disconnect", async () => {
        console.log(socket.id + " disconnected");
        try
        {  
          const player = await userService.getPlayerFromDatabaseBySocketId(socket.id);
          console.log(player);
          player.socketId = null;
          await player.save();
          console.log(player.socketId);
          mortimerListUpdate(io);
        }
        catch(error)
        {
          console.error(error);
        }
      })
    });

    //TEST MODE VERIFICATION MIDDLEWARE TO MAKE THINGS EASIER
    // io.use(async (socket: Socket, next: Function) => {
    //   console.log("enter middleware " + socket);
    //   try
    //   {
    //     const email = socket.handshake.auth.email;

    //     let player = await userService.getPlayerFromDatabaseByEmail(email);

    //     if(!player)
    //     {
    //       const err = new Error("not authorized: no player found with associated email");
    //       next(err);
    //     }

    //     player.socketId = socket.id;

    //     await player.save();

    //     console.log("PLAYER INSERTED:");
    //     console.log(player);
    //     next();
    //   }
    //   catch(error: any)
    //   {
    //     const err = new Error("not authorized: internal server error");
    //     next(err);
    //   }
    // })

    //PRODUCTION MODE VERIFICATION WITH IDTOKEN
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
        }io.use(async (socket: Socket, next: Function) => {
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
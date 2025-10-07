const { createServer } = require('http');
const { Server } = require('socket.io');
const {authentication} = require('../firebase.js');
const userService = require("../services/userService");
const { istvanListener } = require("./listeners/istvanListener")

function initIoServer(app, port)
{
    const httpServer = createServer(app);

    const io = new Server(httpServer, {
      cors: {
        origin: ["https://amritb.github.io"], // FOR TESTING PURPOSES ONLY
        connectionStateRecovery: {
          skipMiddlewares: false
        }
      }
    });
    io.on("connection", (socket) => {
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

    io.use(async (socket, next) => {
    console.log("enter middleware for socket:", socket.id);
      try
      {
        const idToken = socket.handshake.auth.token;

        const decodedToken = await authentication.verifyIdToken(idToken);

        console.log(decodedToken.email);

        if (!decodedToken.email_verified) {
          const err = new Error("not authorized");
          err.data = { content: "token invalid" }; // additional details
          next(err);
        }

        let player = await userService.getPlayerFromDatabaseByEmail(decodedToken.email);

        if(!player)
        {
          const err = new Error("not authorized");
          err.data = { content: "no player found with associated email" }; // additional details
          next(err);
        }

        player.socketId = socket.id;

        await player.save();

        console.log("PLAYER INSERTED:");
        console.log(player);
        next();
      }
      catch(error)
      {
        const err = new Error("not authorized");
        err.data = { content: "internal server error" }; // additional details
        next(err);
      }
    })

    io.engine.on("connection_error", (err) => {
      console.log(err.req);      // the request object
      console.log(err.code);     // the error code, for example 1
      console.log(err.message);  // the error message, for example "Session ID unknown"
      console.log(err.context);  // some additional error context
    });

    httpServer.listen(port);
}

module.exports = { initIoServer }
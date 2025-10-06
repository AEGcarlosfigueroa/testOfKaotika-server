require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const mongodbRoute = process.env.MONGODB_URI;
const morgan = require('morgan');
const { verifyFirebaseToken } = require('./middlewares/verifyData');
const { createServer } = require('http');
const { Server } = require('socket.io');

const usersRouter = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'))

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["https://amritb.github.io"] // FOR TESTING PURPOSES ONLY
  }
});

io.on("connection", (socket) => {
  console.log("Connected with socket " + socket.id);
  socket.on("info", (email) => {
    console.log("email: " + email);
  })
});

io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});

httpServer.listen(PORT);

app.use(bodyParser.json());

app.use("/api/players", verifyFirebaseToken, usersRouter);     // For your MongoDB players

async function start(){
    try
    {
        await mongoose.connect(mongodbRoute);
        app.listen(PORT, () => {
            console.log(`API is listening on port ${PORT}`);
        });
        console.log('you are now connected to Mongo')
    } 
    catch(error)
    {
        console.error(`Error to connect to the database: ${error.message}`);
    }
}
start ();


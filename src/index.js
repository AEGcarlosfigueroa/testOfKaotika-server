require('dotenv').config();
const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const mongodbRoute = process.env.MONGODB_URI;
const morgan = require('morgan');
const { verifyFirebaseToken } = require('./middlewares/verifyData')


const usersRouter = require('./routes/userRoutes');

const kaotikaRouter = require('./routes/kaotikaRoutes')

const app = express();

app.use(morgan('dev'))

const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());

app.use("/api/players", verifyFirebaseToken, usersRouter);     // For your MongoDB players

app.use("/api/kaotika", verifyFirebaseToken, kaotikaRouter);   // For external Kaotika players


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
        console.log(`Error to connect to the database: ${error.message}`);
    }
}
start ();


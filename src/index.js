const express = require("express")
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const mongodbRoute = 'mongodb+srv://carlospalacio_db_user:Parlante12@kaoticalegends.t09ezfi.mongodb.net/'
const morgan = require('morgan');

const usersRouter = require('./routes/userRoutes');

const app = express();

app.use(morgan('dev'))

const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());

app.use("/api/players", usersRouter)

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


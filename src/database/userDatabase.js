const userDatabase = require('../models/userModel');

const getAllUsers = async () => {
    try
    {
        const users = await userDatabase.find()
        return users;
    }
    catch (error)
    {
        throw error;
    }
};
const getPlayerFromDatabaseByEmail = async (playerEmail) => {
    try
    {
        const player = await userDatabase.findOne({email: playerEmail})
        console.log("player: " + player)
        return player;
    }
    catch (error){
        throw error;
    }
}
const updateInsertPlayer = async(playerData) => {
    console.log("updateInsertPlayer data received");
    console.log(playerData);

    const object = playerData.data;

    const foundObj = await getPlayerFromDatabaseByEmail(object.email);

    if(!foundObj)
    {
        object.is_active = false;
    }
    else
    {
        object.is_active = true;
    }

    object._id = undefined;

    const updatedPlayer = await userDatabase.findOneAndUpdate({
        email: object.email}, 
        {$set: object },
        {upsert : true, new: true});

        

        console.log("updateInsertPlayer data outgoing");
        console.log(updatedPlayer);


        return updatedPlayer;
}



module.exports = {
    getAllUsers,
    getPlayerFromDatabaseByEmail,
    updateInsertPlayer
}
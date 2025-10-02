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
    const updatedPlayer = await userDatabase.findOneAndUpdate({
        email: playerData.email}, 
        playerData,
        {upsert : true, new: true});

        console.log("updatedAcount: " + updatedPlayer)


        return updatedPlayer;
}



module.exports = {
    getAllUsers,
    getPlayerFromDatabaseByEmail,
    updateInsertPlayer
}
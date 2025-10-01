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

        return updatedPlayer;
}

// const upsertPlayer = async (playerData) => {
//   return await Player.findOneAndUpdate(
//     { email: playerData.email },
//     playerData,   // direct replacement since schemas match
//     { upsert: true, new: true }
//   );
// };


module.exports = {
    getAllUsers,
    getPlayerFromDatabaseByEmail,
    updateInsertPlayer
}
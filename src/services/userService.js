const userDatabase = require('../database/userDatabase')

const getAllUsers = async () => {
    try
    {
        const allUsers = await userDatabase.getAllUsers();

        return allUsers;
    }
    catch (error)
    {
        throw error;
    }
};
const getPlayerFromDatabaseByEmail = async (playerEmail) => {
    try
    {
        const player = await userDatabase.getPlayerFromDatabaseByEmail(playerEmail)
        return player;
    }
    catch (error){
        throw error;
    }
};
const updateInsertPlayer = async (playerData) => {
    const updatedPlayer = await userDatabase.updateInsertPlayer(playerData)
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
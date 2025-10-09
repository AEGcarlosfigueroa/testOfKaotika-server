import * as userDatabase from "./../database/userDatabase.ts"

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
const getPlayerFromDatabaseByEmail = async (playerEmail: String) => {
    try
    {
        const player = await userDatabase.getPlayerFromDatabaseByEmail(playerEmail)
        return player;
    }
    catch (error){
        throw error;
    }
};

const getPlayerFromDatabaseBySocketId = async (playerSocketId: String) => {
    try
    {
        const player = await userDatabase.getPlayerFromDatabaseBySocketId(playerSocketId);
        return player;
    }
    catch (error){
        throw error;
    }
};
const updateInsertPlayer = async (playerData: String) => {
    const updatedPlayer = await userDatabase.updateInsertPlayer(playerData)
    return updatedPlayer;
};

const getAllConnectedPlayers = async () => {

    const players = await userDatabase.getAllConnectedPlayers();
    return players;
}

// const upsertPlayer = async (playerData) => {
//   return await Player.findOneAndUpdate(
//     { email: playerData.email },
//     playerData,   // direct replacement since schemas match
//     { upsert: true, new: true }
//   );
// };

export {
    updateInsertPlayer,
    getPlayerFromDatabaseByEmail,
    getAllUsers,
    getPlayerFromDatabaseBySocketId,
    getAllConnectedPlayers
}
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
}


module.exports = {
    getAllUsers,
    getPlayerFromDatabaseByEmail
}
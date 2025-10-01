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
const getPlayerFromDatabaseById = async (playerEmail) => {
    try
    {
        const player = await userDatabase.getPlayerFromDatabaseById(playerEmail)
        return player;
    }
    catch (error){
        throw error;
    }
}

module.exports = {
    getAllUsers,
    getPlayerFromDatabaseById
}
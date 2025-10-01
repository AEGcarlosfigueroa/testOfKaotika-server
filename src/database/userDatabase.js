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
const getPlayerFromDatabaseById = async (playerEmail) => {
    try
    {
        const player = await userDatabase.findById(playerEmail)
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
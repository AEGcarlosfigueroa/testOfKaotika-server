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

module.exports = {
    getAllUsers,
    getPlayerFromDatabaseByEmail
}
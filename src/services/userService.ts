import * as userDatabase from "./../database/userDatabase.ts";
import UserModel from '../models/userModel.ts';

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
const getPlayerFromCardID = async(cardID: String) => {
    try
    {
        const player = userDatabase.getPlayerFromCardID(cardID);
        return player;
    }
    catch(error)
    {
        throw error;
    }
}
const getPlayerFromDatabaseBySocketId = async (playerSocketId: String) => {
    try
    {
        console.log("socket: " + playerSocketId);
        const player = await userDatabase.getPlayerFromDatabaseBySocketId(playerSocketId);
        return player;
    }
    catch (error){
        throw error;
    }
};
const updateInsertPlayer = async (playerData: String) => {
    try
    {
        const updatedPlayer = await userDatabase.updateInsertPlayer(playerData)
        return updatedPlayer;
    }
    catch(error)
    {
        throw error;
    }
};
const getAllAcolytes = async () => {
    try
    {
        const acolytes = await userDatabase.getAllAcolytes();
        return acolytes;
    }
    catch(error)
    {
        throw error;
    }
}
const getAllNonTraitorAcolytes = async () => {
    try
    {
        const players = await userDatabase.getAllNonTraitorAcolytes();
        return players;
    }
    catch(error)
    {
        throw error;
    }
}
const getAllConnectedNonTraitorAcolytePlayers = async () => {
    try
    {
        const players = await userDatabase.getAllConnectedNonTraitorAcolytePlayers();
        return players;
    }
    catch(error)
    {
        throw error;
    }
}

export {
    updateInsertPlayer,
    getPlayerFromDatabaseByEmail,
    getAllUsers,
    getPlayerFromDatabaseBySocketId,
    getAllConnectedNonTraitorAcolytePlayers,
    getPlayerFromCardID,
    getAllAcolytes,
    getAllNonTraitorAcolytes
}
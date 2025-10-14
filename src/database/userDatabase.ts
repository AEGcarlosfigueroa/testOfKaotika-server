import userDatabase from '../models/userModel.ts';
import * as mongoose from 'mongoose'

export async function getAllUsers()
{
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
export async function getPlayerFromDatabaseBySocketId(playerSocketId: String)
{
    try
    {
        const player = await userDatabase.findOne({socketId: playerSocketId})
        console.log("player: " + player);
        return player;
    }
    catch (error){
        throw error;
    }
}
export async function getPlayerFromDatabaseByEmail(playerEmail: String)
{
    try
    {
        const player = await userDatabase.findOne({email: playerEmail})
        console.log("player: " + player);
        console.log(playerEmail);
        return player;
    }
    catch (error){
        throw error;
    }
}
export async function getAllConnectedPlayers()
{
    try
    {
        const players = await userDatabase.find({ $and: [{socketId: { $ne : null }}, {'profile.role': "ACOLITO"}]});
        return players;
    }
    catch(error)
    {
        throw error;
    }
}
export async function updateInsertPlayer(playerData: any)
{
    const object = playerData.data;

    const foundObj = await getPlayerFromDatabaseByEmail(object.email);

    if(!foundObj)
    {
        object.is_active = false;
        object.isInside = false;
    }
    else
    {
        object.is_active = true;
    }

    object._id = undefined;

    console.log("updatePlayer:")
    console.log(object);

    const updatedPlayer = await userDatabase.findOneAndUpdate({
        email: object.email}, 
        {$set: object },
        {upsert : true, new: true});

        

        console.log("updateInsertPlayer data outgoing");
        console.log(updatedPlayer);


        return updatedPlayer;
}

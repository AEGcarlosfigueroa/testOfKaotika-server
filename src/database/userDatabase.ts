import userDatabase from '../models/userModel.ts';
import * as mongoose from 'mongoose'
import { getRoleByEmail  } from './playerRoles.ts';

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
        const player = await userDatabase.findOne({socketId: playerSocketId});
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
export async function getPlayerFromCardID(card: String)
{
    try
    {
        const player = await userDatabase.findOne({cardID: card});
        return player;
    }
    catch(error)
    {
        throw error
    }
}
export async function updateInsertPlayer(playerData: any)
{
    const object = playerData.data;

    const foundObj = await getPlayerFromDatabaseByEmail(object.email);

    object.profile.role = getRoleByEmail(object.email);

    if(!foundObj)
    {
        object.is_active = false;
        object.isInside = false;
        object.isInTower = false;
        object.cardID = null;
    }
    else
    {
        object.is_active = true;
    }

    object._id = undefined;

    const updatedPlayer = await userDatabase.findOneAndUpdate({
        email: object.email}, 
        {$set: object },
        {upsert : true, new: true});

        console.log(updatedPlayer);

    return updatedPlayer;
}


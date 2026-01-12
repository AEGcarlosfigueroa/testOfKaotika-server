import userDatabase from '../models/userModel.ts';
import * as mongoose from 'mongoose'
import { getRoleByEmail  } from './playerRoles.ts';
import getAmountToIncreaseInsanity from '../statusTools/getAmountToIncreaseInsanity.ts';

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
export async function getAllNonTraitorAcolytes()
{
    try
    {
        const players = await userDatabase.find({ $and: [{'profile.role': "ACOLITO"}, {isBetrayer: false}]});
        return players;
    }
    catch(error)
    {
        throw error;
    }
}
export async function getAllConnectedNonTraitorAcolytePlayers()
{
    try
    {
        const players = await userDatabase.find({ $and: [{socketId: { $ne : null }}, {'profile.role': "ACOLITO"}, {isBetrayer: false}]});
        return players;
    }
    catch(error)
    {
        throw error;
    }
}
export async function getAllAcolytes()
{
    try
    {
        const players = await userDatabase.find({'profile.role': "ACOLITO"});
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
        object.isInHallOfSages = false;
        object.artifactInventory = [];
        object.statusEffects = [];
        object.resistance = 100;
    }
    else
    {
        object.is_active = true;
        if(!foundObj.artifactInventory)
        {
            object.artifactInventory = [];
        }

        if(!object.isInHallOfSages)
        {
            object.isInHallOfSages = false;
        }

        if(!foundObj.statusEffects)
        {
            object.statusEffects = [];
        }

        if(!foundObj.resistance)
        {
            object.resistance = 100;
        }
        else
        {
            object.insanity += getAmountToIncreaseInsanity(foundObj.resistance); //Apply current insanity effect
            object.resistance = foundObj.resistance
        }

        if(!foundObj.isBetrayer)
        {
            object.isBetrayer = false;
        }
        else
        {
            object.isBetrayer = true; //Preserving isBetrayer value on each login while post to Katika API cannot be made
        }
    }

    object._id = undefined;

    const updatedPlayer = await userDatabase.findOneAndUpdate({
        email: object.email}, 
        {$set: object },
        {upsert : true, new: true});

        console.log(updatedPlayer);

    return updatedPlayer;
}

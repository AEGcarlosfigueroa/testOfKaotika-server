import userDatabase from '../models/userModel.ts';
import * as mongoose from 'mongoose'
import { getRoleByEmail  } from './playerRoles.ts';
import getAmountToIncreaseInsanity, { getAmountToMultiplyOtherAttributes } from '../statusTools/getAmountToIncreaseInsanity.ts';
import { reapplyStatusEffects } from '../statusTools/applyStatusEffect.ts';

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

    const originalAttributes = {
        resistance: 0,
        dexterity: object.attributes.dexterity,
        strength: object.attributes.insanity,
        intelligence: object.attributes.intelligence,
        insanity: object.attributes.insanity,
        constitution: object.attributes.constitution,
        charisma: object.attributes.charisma
    }

    if(!foundObj)
    {
        object.is_active = false;
        object.isInside = false;
        object.isInTower = false;
        object.cardID = null;
        object.isInHallOfSages = false;
        object.artifactInventory = [];
        object.statusEffects = [];
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

        console.log("foundObj");
        console.log(object.attributes.resistance);

        if(foundObj.attributes[0].resistance === undefined)
        {
            object.attributes.resistance = 100;
        }
        else
        {
            console.log(foundObj.attributes);
            object.attributes.resistance = foundObj.attributes[0].resistance;
            object.attributes.insanity += getAmountToIncreaseInsanity(object.attributes.resistance); //Apply current insanity effect
            if(object.attributes.insanity !== 0)
            {
                object.attributes.strength *= (object.attributes.resistance/100);
                object.attributes.dexterity *= (object.attributes.resistance/100);
                object.attributes.intelligence *= (object.attributes.resistance/100);
            }
            else
            {
                object.attributes.strength = 0;
                object.attributes.dexterity = 0;
                object.attributes.intelligence = 0;
            }
            
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

    if(foundObj) reapplyStatusEffects(object, foundObj);

    const updatedPlayer = await userDatabase.findOneAndUpdate({
        email: object.email}, 
        {$set: object , attributes: [object.attributes, originalAttributes]},
        {upsert : true, new: true});

        console.log(updatedPlayer);

    return updatedPlayer;
}

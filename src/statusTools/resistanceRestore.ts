import { reapplySicknesses } from "./applyStatusEffect";

export default async function resistanceRestore(playerObj: any)
{
    try
    {
        const currentResistance = playerObj.attributes[0].resistance;

        const amountToReduceInsanity = 50 - currentResistance;

        if(currentResistance !== 0)
        {
            const amountToDivideOtherAttributes = (currentResistance/100);

            playerObj.attributes[0].strength *= amountToMultiplyOtherAttributes;
            playerObj.attributes[0].dexterity *= amountToMultiplyOtherAttributes;
            playerObj.attributes[0].intelligence *= amountToMultiplyOtherAttributes;
        }
        else if(playerObj.attributes[1] !== undefined)
        {
            playerObj.attributes[0].strength = playerObj.attributes[1].strength;
            playerObj.attributes[0].dexterity = playerObj.attributes[1].dexterity;
            playerObj.attributes[0].intelligence = playerObj.attributes[1].intelligence;
            playerObj.attributes[0].charisma = playerObj.attributes[1].charisma;
            playerObj.attributes[0].insanity = playerObj.attributes[1].insanity;
            playerObj.attributes[0].constitution = playerObj.attributes[1].constitution;

            reapplySicknesses(playerObj);
        }

        if(amountToReduceInsanity > 0)
        {
            playerObj.attributes[0].insanity -= amountToReduceInsanity;
        }

        playerObj.attributes[0].resistance = 100;

        await playerObj.save();
    }
    catch(error)
    {
        throw error;
    }
}
export default async function resistanceRestore(playerObj: any)
{
    try
    {
        const currentResistance = playerObj.attributes[0].resistance;

        const amountToReduceInsanity = 50 - currentResistance;

        const amountToDivideOtherAttributes = (currentResistance/100);

        playerObj.attributes[0].strength *= amountToMultiplyOtherAttributes;
        playerObj.attributes[0].dexterity *= amountToMultiplyOtherAttributes;
        playerObj.attributes[0].intelligence *= amountToMultiplyOtherAttributes;

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
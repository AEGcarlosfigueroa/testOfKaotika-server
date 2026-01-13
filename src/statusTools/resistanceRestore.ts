export default async function resistanceRestore(playerObj: any)
{
    try
    {
        const currentResistance = playerObj.attributes.resistance;

        const amountToReduceInsanity = 50 - currentResistance;

        if(amountToReduceInsanity > 0)
        {
            playerObj.attributes.insanity -= amountToReduceInsanity;
        }

        playerObj.attributes.resistance = 100;

        await playerObj.save();
    }
    catch(error)
    {
        throw error;
    }
}
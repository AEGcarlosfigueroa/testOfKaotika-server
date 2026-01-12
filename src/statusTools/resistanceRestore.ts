export default async function resistanceRestore(playerObj: any)
{
    try
    {
        const currentResistance = playerObj.resistance;

        const amountToReduceInsanity = 50 - currentResistance;

        if(amountToReduceInsanity > 0)
        {
            playerObj.insanity -= amountToReduceInsanity;
        }

        playerObj.resistance = 100;

        await playerObj.save();
    }
    catch(error)
    {
        console.error(error)
    }
}
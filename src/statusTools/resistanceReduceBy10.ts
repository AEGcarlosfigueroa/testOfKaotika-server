export default async function reduceResistanceBy10(playerObj: any)
{
    try
    {
        const currentResistance = playerObj.attributes.resistance;

        playerObj.attributes.resistance -= 10

        const amountToReduceInsanity = currentResistance - 50; //Revert changes occured by previous resistance number

        if(amountToReduceInsanity > 0)
        {
            playerObj.attributes.insanity -= amountToReduceInsanity;
        }

        const amountToIncreaseInsanity = playerObj.attributes.resistance - 50; //Reapply changes with new resistance number

        if(amountToIncreaseInsanity > 0)
        {
            playerObj.attributes.insanity -= amountToIncreaseInsanity;
        }

        await playerObj.save();
    }
    catch(error)
    {
        throw error;
    }
}
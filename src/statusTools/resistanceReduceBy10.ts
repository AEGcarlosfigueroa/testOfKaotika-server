export default async function reduceResistanceBy10(playerObj: any)
{
    try
    {
        console.log("reduce resistance by 10");

        const currentResistance = playerObj.attributes[0].resistance;

        playerObj.attributes[0].resistance -= 10;

        if(playerObj.attributes[0].resistance < 0)
        {
            playerObj.attributes[0].resistance = 0;
        }

        const amountToReduceInsanity = 50 - currentResistance; //Revert changes occured by previous resistance number

        const amountToDivideOtherAttributes = (currentResistance/100);

        playerObj.attributes[0].strength /= amountToDivideOtherAttributes;

        playerObj.attributes[0].dexterity /= amountToDivideOtherAttributes;

        playerObj.attributes[0].intelligence /= amountToDivideOtherAttributes;

        console.log("Reduce resistance by: " + amountToReduceInsanity);

        const amountToMultiplyOtherAttributes = (playerObj.attributes[0].resistance/100);

        playerObj.attributes[0].strength *= amountToMultiplyOtherAttributes;
        playerObj.attributes[0].dexterity *= amountToMultiplyOtherAttributes;
        playerObj.attributes[0].intelligence *= amountToMultiplyOtherAttributes;

        if(amountToReduceInsanity > 0)
        {
            playerObj.attributes[0].insanity -= amountToReduceInsanity;
        }

        const amountToIncreaseInsanity = 50 - playerObj.attributes[0].resistance; //Reapply changes with new resistance number

        console.log("Increase resistance by: " + amountToIncreaseInsanity);

        if(amountToIncreaseInsanity > 0)
        {
            playerObj.attributes[0].insanity += amountToIncreaseInsanity;
        }

        console.log(currentResistance);

        console.log(playerObj.attributes);

        await playerObj.save();
    }
    catch(error)
    {
        throw error;
    }
}
export default function getAmountToIncreaseInsanity(resistance: number)
{
    const amountToIncreaseInsanity = 50 - resistance;

    if(amountToIncreaseInsanity < 0)
    {
        return 0;
    }
    else
    {
        return amountToIncreaseInsanity;
    }
}
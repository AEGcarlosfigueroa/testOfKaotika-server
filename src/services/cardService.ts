import * as cardDatabase from "./../database/cardDatabase.ts"

export async function getEntryFromCardID(card: string)
{
    try
    {
        const entry = await cardDatabase.getEntryByCardID(card);
        return entry;
    }
    catch(error)
    {
        throw error;
    }
}
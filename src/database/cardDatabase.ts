import cardModel from "../models/cardModel.ts"

export async function getEntryByCardID(card: string)
{
    try
    {
        const entry = await cardModel.findOne({ cardID: card });
        return entry;
    }
    catch(error)
    {
        throw error;
    }
}
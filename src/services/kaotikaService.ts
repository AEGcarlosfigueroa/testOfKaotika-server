import * as kaotikaDB from "../database/kaotikaDB.ts";

export async function getLegendByEmail(playerEmail: String)
{
    try
    {
        const player = await kaotikaDB.getLegendByEmail(playerEmail);
        return player;
    }
    catch (error)
    {
        throw error;
    }
}

export async function turnIntoBetrayer(playerEmail: String)
{
    try
    {
        const player = await kaotikaDB.turnIntoBetrayer(playerEmail);
        return player;
    }
    catch (error)
    {
        throw error;
    }
}


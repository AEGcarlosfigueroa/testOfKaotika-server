async function getLegendByEmail(playerEmail: String)
{
    try{
        const response = await fetch(`https://kaotika-server.fly.dev/players/email/${playerEmail}`); 
        if (!response.ok)
        {
            throw new Error(`Error fetching player: ${response.statusText}`);
        }
        const player = await response.json();
        return player;
    } catch (error)
    {
        throw error;
    }
}

export { getLegendByEmail }

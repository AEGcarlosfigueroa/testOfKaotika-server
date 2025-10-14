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

// // database/kaotikaDatabase.js
// const fetch = require('node-fetch'); // if using Node.js < 18

// const getLegendByEmail = async (playerEmail) => {
//   try {
//     const response = await fetch(`https://kaotika-server.fly.dev/players/email/${playerEmail}`);
//     if (!response.ok) {
//       throw new Error(`Error fetching player: ${response.statusText}`);
//     }
//     const player = await response.json();
//     return player;
//   } catch (error) {
//     throw error;
//   }
// };

// module.exports = { getLegendByEmail };

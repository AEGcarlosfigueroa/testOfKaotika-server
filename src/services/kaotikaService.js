const kaotikaService = require('../database/kaotikaDB')

const getLegendByEmail = async (playerEmail) => {
    try{
        const player = await kaotikaService.getLegendByEmail(playerEmail);
        
        return player;
    }
    catch (error)
    {
        throw error;
    }
}

module.exports = { getLegendByEmail };

//for external sources 

// services/playerService.js
// const userDatabase = require('../database/userDatabase');

// const getPlayerFromDatabaseByEmail = async (playerEmail) => {
//   try {
//     // Call the database layer function
//     const player = await userDatabase.getPlayerFromDatabaseByEmail(playerEmail);
//     return player; // will be null if not found
//   } catch (error) {
//     throw error; // propagate error to controller
//   }
// };

// module.exports = { getPlayerFromDatabaseByEmail };

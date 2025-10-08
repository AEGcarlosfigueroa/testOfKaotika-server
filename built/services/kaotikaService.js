var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as kaotikaDB from "../database/kaotikaDB";
export function getLegendByEmail(playerEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const player = yield kaotikaDB.getLegendByEmail(playerEmail);
            return player;
        }
        catch (error) {
            throw error;
        }
    });
}
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

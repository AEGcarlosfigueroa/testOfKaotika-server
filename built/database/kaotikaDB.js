var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getLegendByEmail(playerEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://kaotika-server.fly.dev/players/email/${playerEmail}`);
            console.log("response:" + response);
            if (!response.ok) {
                throw new Error(`Error fetching player: ${response.statusText}`);
            }
            const player = yield response.json();
            console.log("legendAcount: " + player);
            return player;
        }
        catch (error) {
            throw error;
        }
    });
}
export { getLegendByEmail };
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

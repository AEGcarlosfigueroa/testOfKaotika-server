var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as userDatabase from "./../database/userDatabase";
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userDatabase.getAllUsers();
        return allUsers;
    }
    catch (error) {
        throw error;
    }
});
const getPlayerFromDatabaseByEmail = (playerEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const player = yield userDatabase.getPlayerFromDatabaseByEmail(playerEmail);
        return player;
    }
    catch (error) {
        throw error;
    }
});
const getPlayerFromDatabaseBySocketId = (playerSocketId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const player = yield userDatabase.getPlayerFromDatabaseBySocketId(playerSocketId);
        return player;
    }
    catch (error) {
        throw error;
    }
});
const updateInsertPlayer = (playerData) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedPlayer = yield userDatabase.updateInsertPlayer(playerData);
    return updatedPlayer;
});
// const upsertPlayer = async (playerData) => {
//   return await Player.findOneAndUpdate(
//     { email: playerData.email },
//     playerData,   // direct replacement since schemas match
//     { upsert: true, new: true }
//   );
// };
export { updateInsertPlayer, getPlayerFromDatabaseByEmail, getAllUsers, getPlayerFromDatabaseBySocketId };

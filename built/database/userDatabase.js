var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import userDatabase from '../models/userModel';
export function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield userDatabase.find();
            return users;
        }
        catch (error) {
            throw error;
        }
    });
}
;
export function getPlayerFromDatabaseBySocketId(playerSocketId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const player = yield userDatabase.findOne({ socketId: playerSocketId });
            console.log("player: " + player);
            return player;
        }
        catch (error) {
            throw error;
        }
    });
}
export function getPlayerFromDatabaseByEmail(playerEmail) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const player = yield userDatabase.findOne({ email: playerEmail });
            console.log("player: " + player);
            return player;
        }
        catch (error) {
            throw error;
        }
    });
}
export function updateInsertPlayer(playerData) {
    return __awaiter(this, void 0, void 0, function* () {
        const object = playerData.data;
        const foundObj = yield getPlayerFromDatabaseByEmail(object.email);
        if (!foundObj) {
            object.is_active = false;
            object.isInside = false;
        }
        else {
            object.is_active = true;
        }
        object._id = undefined;
        console.log("updatePlayer:");
        console.log(object);
        const updatedPlayer = yield userDatabase.findOneAndUpdate({
            email: object.email
        }, { $set: object }, { upsert: true, new: true });
        console.log("updateInsertPlayer data outgoing");
        console.log(updatedPlayer);
        return updatedPlayer;
    });
}

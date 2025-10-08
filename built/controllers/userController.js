var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as userService from "./../services/userService.ts";
import * as kaotikaService from "./../services/kaotikaService.ts";
import * as playerRoles from "./../database/playerRoles.ts";
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allUsers = yield userService.getAllUsers();
        if (allUsers.length === 0) {
            return res.status(404).send({ message: 'No users found!' });
        }
        return res.send({ status: "SUCCESS", userData: allUsers });
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send({
            status: "FAILED",
            message: "Request failed",
            data: { error: (error === null || error === void 0 ? void 0 : error.message) || error }
        });
    }
});
const getPlayerBySocketId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { playerSocketId } } = req;
    if (!playerSocketId) {
        return res.status(400).send({
            status: "FAILED",
            data: { error: "Parameter 'playerSocketId' cannot be empty" }
        });
    }
});
const getPlayerFromDatabaseByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { params: { playerEmail } } = req;
    if (!playerEmail) {
        return res.status(400).send({
            status: "FAILED",
            data: { error: "Parameter ':playerEmail' cannot be empty" }
        });
    }
    try {
        let player = yield userService.getPlayerFromDatabaseByEmail(playerEmail);
        const legend = yield kaotikaService.getLegendByEmail(playerEmail);
        if (!player) {
            if (!legend) {
                return res.status(404).send({
                    status: "FAILED",
                    data: { error: `Cannot find legend by email '${playerEmail}'` }
                });
            }
            player = yield userService.updateInsertPlayer(legend);
            player.profile.role = playerRoles.getRoleByEmail(playerEmail);
            yield player.save();
            console.log("Created new player from Kaotika server:", player);
            return res.send({ status: "SUCCESS", data: player });
        }
        else if (legend) {
            // update existing player
            const currentRole = player.profile.role;
            player = yield userService.updateInsertPlayer(legend);
            player.profile.role = currentRole;
            yield player.save();
            console.log("Updated existing player with Kaotika data:", player);
            return res.send({ status: "SUCCESS", data: player });
        }
        // fallback: player exists but no legend
        return res.send({ status: "SUCCESS", data: player });
    }
    catch (error) {
        return res.status((error === null || error === void 0 ? void 0 : error.status) || 500).send({
            status: "FAILED",
            message: "Error fetching player",
            data: { error: (error === null || error === void 0 ? void 0 : error.message) || error }
        });
    }
});
export { getAllUsers, getPlayerFromDatabaseByEmail, getPlayerBySocketId };

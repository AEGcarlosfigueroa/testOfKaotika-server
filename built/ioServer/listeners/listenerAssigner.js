var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getRoleByEmail } from "./../../database/playerRoles.ts";
import { istvanListener } from "./istvanListener.ts";
import * as userService from "./../../services/userService.ts";
export function listenerAssigner(socket, io) {
    return __awaiter(this, void 0, void 0, function* () {
        const player = yield userService.getPlayerFromDatabaseBySocketId(socket.id);
        console.log(player.email);
        const role = getRoleByEmail(player.email);
        switch (role) {
            case "ISTVAN":
                istvanListener(socket, io);
                break;
            default:
                break;
        }
    });
}

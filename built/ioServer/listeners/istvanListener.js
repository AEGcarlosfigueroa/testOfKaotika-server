var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as userService from "./../../services/userService.ts";
function istvanListener(socket, io) {
    socket.on("scan", (email) => __awaiter(this, void 0, void 0, function* () {
        try {
            const player = yield userService.getPlayerFromDatabaseByEmail(email);
            let inside = player.isInside;
            inside = !inside;
            player.isInside = inside;
            player.save();
            const acolyteSocket = yield io.in(player.socketId).fetchSockets();
            console.log(acolyteSocket[0]);
            acolyteSocket[0].emit("authorization", "positive");
            console.log("enter");
        }
        catch (error) {
            console.log(error);
        }
    }));
}
export { istvanListener };

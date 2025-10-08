var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as authentication from '../firebase.ts';
export function verifyFirebaseToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        const idToken = authHeader.split("Bearer ")[1];
        console.log(idToken);
        try {
            const decodedToken = yield authentication.authentication.verifyIdToken(idToken);
            req.user = decodedToken;
            if (!decodedToken.email_verified) {
                return res.status(403).json({ error: "Email not verified" });
            }
            next();
        }
        catch (error) {
            console.log(error);
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
    });
}

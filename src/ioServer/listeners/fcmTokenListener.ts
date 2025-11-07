
import * as userService from"./../../services/userService.ts"
import { Server, Socket } from "socket.io";
import { messaging } from "../../firebase";



export default registerToken = async (req: Request, res: Response) => {
  try {
    const { playerEmail } = req.params;
    const { token } = req.body;

    if (!playerEmail || !token) {
      return res.status(400).json({ error: "Email and token are required" });
    }

    console.log("Received FCM token:", token, "for", playerEmail);

    const player = await userService.getPlayerFromDatabaseByEmail(playerEmail);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    // Store the token in the player's record

    player.fcmToken = token;
    await player.save();

    console.log("Received FCM token:", token, "for", playerEmail);


    console.log(`Saved FCM token for ${playerEmail}`);
    return res.status(200).json({ message: "Token registered successfully" });

  } catch (error) {
    console.error("ERROR REGISTERING TOKEN:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
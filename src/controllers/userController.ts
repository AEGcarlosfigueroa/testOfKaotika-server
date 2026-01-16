import * as userService from "./../services/userService.ts"
import * as kaotikaService from "./../services/kaotikaService.ts"
import * as playerRoles from "./../database/playerRoles.ts"
import { roles } from "./../database/playerRoles.ts"
import { messaging } from "../firebase.ts"; // import the same instance

const getAllUsers = async (req: any, res: any) => {
    try 
    {
        const allUsers = await userService.getAllUsers();
        if (allUsers.length === 0) 
        {
            return res.status(404).send({ message: 'No users found!' });
        }
        return res.send({ status: "SUCCESS", userData: allUsers });
    } 
    catch(error: any) 
    {
        console.error(error);
        return res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Request failed",
            data: { error: error?.message || error }
        });
    }
};

const getPlayerBySocketId = async (req: any, res: any) => {
    const { params: {playerSocketId} } = req;

    if(!playerSocketId)
    {
        return res.status(400).send({ 
            status: "FAILED", 
            data: { error: "Parameter 'playerSocketId' cannot be empty" } 
        });
    }
}

const getPlayerFromDatabaseByEmail = async (req: any, res: any) => {
    const { params: { playerEmail } } = req;

    if (!playerEmail) 
    {
        return res.status(400).send({ 
            status: "FAILED", 
            data: { error: "Parameter ':playerEmail' cannot be empty" } 
        });
    }

    try 
    {
        let player = await userService.getPlayerFromDatabaseByEmail(playerEmail);
        const legend = await kaotikaService.getLegendByEmail(playerEmail);

        if (!player) {
            if (!legend) {
                return res.status(404).send({ 
                    status: "FAILED",
                    data: { error: `Cannot find legend by email '${playerEmail}'` }
                });
            }


            player = await userService.updateInsertPlayer(legend);

            return res.send({ status: "SUCCESS", data: player });
        } else if (legend) {

            player = await userService.updateInsertPlayer(legend);

            return res.send({ status: "SUCCESS", data: player });
        }

        return res.send({ status: "SUCCESS", data: player });
    } 
    catch(error: any) 
    {
        console.error(error);
        return res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Error fetching player",
            data: { error: error?.message || error }
        });
    }
};
export const registerToken = async (req: Request, res: Response) => {
  try 
  {
    const obj = req.body;
    const playerEmail = obj.email;
    const token = obj.token;

    if (!playerEmail || token === undefined) {
      return res.status(400).json({ error: "Email and token are required" });
    }

    console.log("Received FCM token:", token, "for", playerEmail);

    const player = await userService.getPlayerFromDatabaseByEmail(playerEmail);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    player.fcmToken = token;

    await player.save();

    console.log("Received FCM token:", token, "for", playerEmail);

    console.log(`Saved FCM token for ${playerEmail}`);

    return res.status(200).json({ message: "Token registered successfully" });
  } 
  catch (error) 
  {
    console.error("ERROR REGISTERING TOKEN:", error);

    return res.status(500).json({ error: "Internal server error" });
  }
}

export {
    getAllUsers,
    getPlayerFromDatabaseByEmail,
    getPlayerBySocketId,
};
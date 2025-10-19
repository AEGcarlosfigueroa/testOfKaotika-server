import * as userService from "./../services/userService.ts"
import * as kaotikaService from "./../services/kaotikaService.ts"
import * as playerRoles from "./../database/playerRoles.ts"

const getAllUsers = async (req: any, res: any) => {
    try {
        const allUsers = await userService.getAllUsers();
        if (allUsers.length === 0) {
            return res.status(404).send({ message: 'No users found!' });
        }
        return res.send({ status: "SUCCESS", userData: allUsers });
    } catch (error: any) {
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

    if (!playerEmail) {
        return res.status(400).send({ 
            status: "FAILED", 
            data: { error: "Parameter ':playerEmail' cannot be empty" } 
        });
    }

    try {
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
            player.profile.role = playerRoles.getRoleByEmail(playerEmail);
            console.log(player.profile.role )
            // player.markModified('profile'); // mark the parent object
            // await player.save();

            return res.send({ status: "SUCCESS", data: player });
        } else if (legend) {

            player = await userService.updateInsertPlayer(legend);
            player.profile.role = playerRoles.getRoleByEmail(playerEmail);
            // player.markModified('profile');
            // await player.save();

            return res.send({ status: "SUCCESS", data: player });
        }

        // fallback: player exists but no legend
        console.log(player.profile.role )

        return res.send({ status: "SUCCESS", data: player });

    } catch (error: any) {
        return res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Error fetching player",
            data: { error: error?.message || error }
        });
    }
};


export {
    getAllUsers,
    getPlayerFromDatabaseByEmail,
    getPlayerBySocketId
};
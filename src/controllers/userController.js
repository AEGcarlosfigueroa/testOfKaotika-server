const userService = require("../services/userService");
const kaotikaService = require("../services/kaotikaService");

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await userService.getAllUsers();
        if (allUsers.length === 0) {
            return res.status(404).send({ message: 'No users found!' });
        }
        res.send({ status: "SUCCESS", userData: allUsers });
    } catch (error) {
        res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Request failed",
            data: { error: error?.message || error }
        });
    }
};

const getPlayerFromDatabaseByEmail = async (req, res) => {
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
            console.log("if there is no player we check kaoticaserver: " + player)
        } else if (legend) {
            // Optional: update existing player with latest external data
            player = await userService.updateInsertPlayer(legend);
                    console.log("dataPlayer: " + player)

        }

        res.send({ status: "SUCCESS", data: player });
        console.log("dataPlayer: " + data)

    } catch (error) {
        res.status(error?.status || 500).send({ 
            status: "FAILED",
            message: "Error fetching player",
            data: { error: error?.message || error }
        });
    }
};

module.exports = {
    getAllUsers,
    getPlayerFromDatabaseByEmail
};

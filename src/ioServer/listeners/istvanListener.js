const userService = require("../../services/userService");

function istvanListener(socket, io)
{
    socket.on("scan", async (email) => {
        try
        {
            const player = await userService.getPlayerFromDatabaseByEmail(email);

            let inside = player.isInside;

            inside = !inside;

            player.isInside = inside;

            const acolyteSocket = await io.in(player.socketId).fetchSockets();

            console.log(acolyteSocket);

            io.to(acolyteSocket).emit("authorization", "positive");
        }
        catch(error)
        {
            console.log(error);
        }
    })
}

module.exports = { istvanListener }
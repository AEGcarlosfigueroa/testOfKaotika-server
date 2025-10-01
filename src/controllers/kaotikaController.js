const kaotikaService = require('../services/kaotikaService')

const getLegendByEmail = async (req, res) => {
    const {params: {playerEmail}} = req;

    if(!playerEmail)
    {
        return res
            .status(400)
            .send({ status: "FAILED", data: {error: "Parameter ': playerEmail' can not be empty"},
            })
    }
    try {
        const player = await kaotikaService.getLegendByEmail(playerEmail);
        if(!player)
            {
                return res
                    .status(404)
                    .send({ status: "FAILED",
                            data: {error: `cant find player by email '${playerEmail}'`}
                    });
            }
            res.send({status: "SUCCESS!", data: player});     
    } catch (error)
    {
        res
            .status(error?.status || 500)
            .send ({status: "FAILED",
                    message: "Error al realizar la peticion:",
                    data: {error: error?.message || error}
            });
    }
}

module.exports = {
    getLegendByEmail
}
// const getPlayerFromDatabaseByEmail = async (req, res) => {
//     const {params: {playerEmail}} = req;

//     if(!playerEmail)
//     {
//         return res
//             .status(400)
//             .send({ status: "FAILED", data: {error: "Parameter ': playerEmail' can not be empty" },
//             })
//     }
//     try
//     {
//         const player = await userService.getPlayerFromDatabaseByEmail(playerEmail);
//         if (!player)
//         {
//             return res
//                 .status(404)
//                 .send({ status: "FAILED",
//                         data: { error:  `Cant find player by email'${playerEmail}'`}
//                 });
//         }
//         res.send({status: "SUCCESS!", data: player});
//     } catch (error){
//         res
//             .status(error?.status || 500)
//             .send ({status: "FAILED",
//                     message: "Error al realizar la peticion:",
//                     data: { error: error?.message || error}
//             });
//     }


// }

// const getPlayer = async (req, res) => {
//   const email = req.params.email;
//   try {
//     let player;

//     if (useKaotika) {
//       player = await getPlayerFromKaotika(email);
//     } else {
//       player = await getPlayerFromDatabaseById(email);
//     }

//     if (!player) {
//       return res.status(404).json({ message: 'Player not found' });
//     }

//     res.json(player);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

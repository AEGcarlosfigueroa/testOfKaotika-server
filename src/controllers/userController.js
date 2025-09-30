const userService = require("../services/userService");

const getAllUsers = async (req, res) => {
    try{
        const allUsers = await userService.getAllUsers();
        if(allUsers.length === 0)
        {
            return res.status(404).send({message: 'This user does not exist!'});
        }
        res.send ({ status: "Success", userData: allUsers});
    } catch (error)
    {
        res
            .status(error?.status || 500)
            .send({ status: "FAILED",
                    message: "request failed",
                    data: { error: error?.message || error}
            });
    }
};
module.exports = {
    getAllUsers
}
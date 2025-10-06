const playerRole = {

    "classcraft.daw2@aeg.eus" : "ISTVAN",
    "ozarate@aeg.eus" : "VILLANO",
    "oskar.calvo@aeg.eus" : "MORTIMER"

}
const DEFAULT = "ACOLITO" //this is for students 
const getRoleBYEmail = (playerEmail) => {
    return playerRole[playerEmail] || DEFAULT
}

module.exports = {getRoleBYEmail};

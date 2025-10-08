export const playerRole = {

    "classcraft.daw2@aeg.eus" : "ISTVAN",
    "ozarate@aeg.eus" : "VILLANO",
    "oskar.calvo@aeg.eus" : "MORTIMER"

}
const DEFAULT = "ACOLITO" //this is for students 
export function getRoleByEmail(playerEmail: string)
{
    const role = playerRole[playerEmail] || DEFAULT;
    return role;
}
